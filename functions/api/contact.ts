// Cloudflare Pages Function: /api/contact
// Validates same-origin form submissions, verifies Turnstile, then forwards to Web3Forms.

interface Env {
  TURNSTILE_SECRET?: string;
  WEB3FORMS_ACCESS_KEY?: string;
}

interface ContactPayload {
  name?: string;
  email?: string;
  audience?: string;
  organisation?: string;
  message?: string;
  honeypot?: string;
  renderTime?: number;
  turnstileToken?: string;
  sourcePage?: string;
}

interface TurnstileResult {
  success?: boolean;
  hostname?: string;
  action?: string;
}

interface Web3FormsResult {
  success?: boolean;
  message?: string;
}

interface PagesFunctionContext<Bindings> {
  request: Request;
  env: Bindings;
  params: Record<string, string | string[]>;
  waitUntil: (promise: Promise<unknown>) => void;
  next: (input?: Request | string, init?: RequestInit) => Promise<Response>;
  data: Record<string, unknown>;
}

export type PagesFunction<Bindings = unknown> = (
  context: PagesFunctionContext<Bindings>
) => Response | Promise<Response>;

const json = (body: Record<string, unknown>, status = 200): Response =>
  new Response(JSON.stringify(body), {
    status,
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'no-store',
    },
  });

const cleanText = (value: string): string => value.replace(/<[^>]*>/g, '').trim();

const readPayload = async (request: Request): Promise<ContactPayload> => {
  const contentType = request.headers.get('content-type') || '';

  if (contentType.includes('application/json')) {
    const body = await request.json() as Record<string, unknown>;
    return {
      name: typeof body.name === 'string' ? body.name : undefined,
      email: typeof body.email === 'string' ? body.email : undefined,
      audience: typeof body.audience === 'string' ? body.audience : undefined,
      organisation: typeof body.organisation === 'string' ? body.organisation : undefined,
      message: typeof body.message === 'string' ? body.message : undefined,
      honeypot: typeof body.honeypot === 'string' ? body.honeypot : undefined,
      renderTime: typeof body.renderTime === 'number' ? body.renderTime : Number(body.renderTime),
      turnstileToken: typeof body.turnstileToken === 'string' ? body.turnstileToken : undefined,
      sourcePage: typeof body.sourcePage === 'string' ? body.sourcePage : undefined,
    };
  }

  if (!contentType.includes('application/x-www-form-urlencoded') && !contentType.includes('multipart/form-data')) {
    throw new TypeError('Unsupported content type');
  }

  const formData = await request.formData();
  const renderTimeValue = formData.get('renderTime')?.toString();
  return {
    name: formData.get('name')?.toString(),
    email: formData.get('email')?.toString(),
    audience: formData.get('audience')?.toString(),
    organisation: formData.get('organisation')?.toString(),
    message: formData.get('message')?.toString(),
    honeypot: formData.get('honeypot')?.toString(),
    renderTime: renderTimeValue ? Number(renderTimeValue) : undefined,
    turnstileToken: formData.get('cf-turnstile-response')?.toString(),
    sourcePage: formData.get('sourcePage')?.toString(),
  };
};

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  const requestUrl = new URL(request.url);
  const origin = request.headers.get('Origin');

  if (!origin || origin !== requestUrl.origin) {
    return json({ ok: false, error: 'Invalid request origin.' }, 403);
  }

  if (!env.TURNSTILE_SECRET || !env.WEB3FORMS_ACCESS_KEY) {
    return json({ ok: false, error: 'Contact form is temporarily unavailable.' }, 503);
  }

  try {
    const data = await readPayload(request);

    if (data.honeypot?.trim()) {
      return json({ ok: true });
    }

    const now = Date.now();
    if (!Number.isFinite(data.renderTime) || !data.renderTime || data.renderTime > now) {
      return json({ ok: false, error: 'Invalid form session. Please refresh and retry.' }, 400);
    }
    if (now - data.renderTime < 3000) {
      return json({ ok: true });
    }

    const name = cleanText(data.name || '');
    const email = (data.email || '').trim();
    const audience = cleanText(data.audience || '');
    const organisation = cleanText(data.organisation || '');
    const message = cleanText(data.message || '');
    const sourcePage = cleanText(data.sourcePage || '');

    if (name.length < 2 || name.length > 80) {
      return json({ ok: false, error: 'Name must be between 2 and 80 characters.' }, 400);
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email) || email.length > 120) {
      return json({ ok: false, error: 'Please provide a valid email address.' }, 400);
    }

    const allowedAudiences = new Set(['Recruiter', 'Teams & Communities', 'Client', 'Not sure']);
    if (!allowedAudiences.has(audience)) {
      return json({ ok: false, error: 'Please select a valid audience.' }, 400);
    }

    if (organisation.length > 100) {
      return json({ ok: false, error: 'Organisation must be 100 characters or fewer.' }, 400);
    }

    if (message.length < 20 || message.length > 2000) {
      return json({ ok: false, error: 'Message must be between 20 and 2000 characters.' }, 400);
    }

    if ((message.match(/https?:\/\//gi) || []).length > 2) {
      return json({ ok: false, error: 'Message cannot contain more than 2 links.' }, 400);
    }

    if (!['home', 'recruiter', 'teams', 'clients'].includes(sourcePage)) {
      return json({ ok: false, error: 'Invalid source page.' }, 400);
    }

    const turnstileToken = data.turnstileToken?.trim();
    if (!turnstileToken || turnstileToken.length > 2048) {
      return json({ ok: false, error: 'Please complete the spam protection check.' }, 400);
    }

    const turnstileController = new AbortController();
    const turnstileTimeout = setTimeout(() => turnstileController.abort(), 8000);
    let turnstileResponse: Response;
    try {
      turnstileResponse = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          secret: env.TURNSTILE_SECRET,
          response: turnstileToken,
          remoteip: request.headers.get('CF-Connecting-IP') || '',
        }),
        signal: turnstileController.signal,
      });
    } finally {
      clearTimeout(turnstileTimeout);
    }

    if (!turnstileResponse.ok) {
      return json({ ok: false, error: 'Spam protection is unavailable. Please retry.' }, 502);
    }

    const turnstileResult = await turnstileResponse.json() as TurnstileResult;
    if (
      turnstileResult.success !== true ||
      turnstileResult.action !== 'contact' ||
      turnstileResult.hostname !== requestUrl.hostname
    ) {
      return json({ ok: false, error: 'Spam protection check failed. Please retry.' }, 403);
    }

    const deliveryResponse = await fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        access_key: env.WEB3FORMS_ACCESS_KEY,
        subject: `[Portfolio] ${audience} inquiry`,
        from_name: name,
        email,
        message: `Source page: ${sourcePage}\nAudience: ${audience}\nOrganisation: ${organisation || 'N/A'}\n\nMessage:\n${message}`,
      }),
    });
    const deliveryResult = await deliveryResponse.json() as Web3FormsResult;

    if (!deliveryResponse.ok || deliveryResult.success !== true) {
      return json({ ok: false, error: 'Message delivery failed. Please retry later.' }, 502);
    }

    return json({ ok: true });
  } catch (error) {
    if (error instanceof TypeError && error.message === 'Unsupported content type') {
      return json({ ok: false, error: 'Unsupported request format.' }, 415);
    }
    return json({ ok: false, error: 'Unable to process the message right now.' }, 500);
  }
};
