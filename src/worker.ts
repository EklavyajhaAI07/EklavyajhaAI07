type FetchLike = (input: RequestInfo | URL, init?: RequestInit) => Promise<Response>;

export interface WorkerEnv {
  ASSETS: {
    fetch: FetchLike;
  };
  TURNSTILE_SECRET?: string;
  TURNSTILE_SITE_KEY?: string;
  PUBLIC_TURNSTILE_SITE_KEY?: string;
  TURNSTILE_HOSTNAMES?: string;
  WEB3FORMS_ACCESS_KEY?: string;
}

interface ContactPayload {
  name: string;
  email: string;
  audience: string;
  organisation: string;
  message: string;
  honeypot: string;
  renderTime: number;
  turnstileToken: string;
  sourcePage: string;
}

interface TurnstileResult {
  success?: boolean;
  hostname?: string;
  action?: string;
  'error-codes'?: string[];
}

interface Web3FormsResult {
  success?: boolean;
}

const allowedAudiences = new Set(['Recruiter', 'Teams & Communities', 'Client', 'Not sure']);
const allowedSourcePages = new Set(['home', 'recruiter', 'teams', 'clients']);

const json = (body: Record<string, unknown>, status = 200, headers?: HeadersInit): Response =>
  Response.json(body, {
    status,
    headers: {
      'Cache-Control': 'no-store',
      ...headers,
    },
  });

const cleanText = (value: string): string => value.replace(/<[^>]*>/g, '').trim();

const contactConfiguration = (env: WorkerEnv, hostname: string) => {
  const expectedHostnames = new Set(
    (env.TURNSTILE_HOSTNAMES ?? '').split(',').map((value) => value.trim()).filter(Boolean),
  );
  const requiredBindings = ['TURNSTILE_SECRET', 'WEB3FORMS_ACCESS_KEY', 'TURNSTILE_HOSTNAMES'] as const;
  const missing = requiredBindings.filter((name) => !env[name]?.trim());
  const hostnameAllowed = expectedHostnames.has(hostname);
  const ready = missing.length === 0 && hostnameAllowed;
  if (!ready) console.error(JSON.stringify({ event: 'contact_configuration_error', missing, hostnameAllowed }));
  return { ready, expectedHostnames };
};

const readPayload = async (request: Request): Promise<ContactPayload> => {
  const contentType = request.headers.get('content-type') ?? '';
  if (!contentType.includes('application/x-www-form-urlencoded') && !contentType.includes('multipart/form-data')) {
    throw new TypeError('Unsupported content type');
  }

  const form = await request.formData();
  return {
    name: form.get('name')?.toString() ?? '',
    email: form.get('email')?.toString() ?? '',
    audience: form.get('audience')?.toString() ?? '',
    organisation: form.get('organisation')?.toString() ?? '',
    message: form.get('message')?.toString() ?? '',
    honeypot: form.get('honeypot')?.toString() ?? '',
    renderTime: Number(form.get('renderTime')?.toString()),
    turnstileToken: form.get('cf-turnstile-response')?.toString() ?? '',
    sourcePage: form.get('sourcePage')?.toString() ?? '',
  };
};

const validatePayload = (payload: ContactPayload): string | null => {
  if (payload.name.length < 2 || payload.name.length > 80) return 'Name must be between 2 and 80 characters.';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(payload.email) || payload.email.length > 120) {
    return 'Please provide a valid email address.';
  }
  if (!allowedAudiences.has(payload.audience)) return 'Please select a valid audience.';
  if (payload.organisation.length > 100) return 'Organisation must be 100 characters or fewer.';
  if (payload.message.length < 20 || payload.message.length > 2000) {
    return 'Message must be between 20 and 2000 characters.';
  }
  if ((payload.message.match(/https?:\/\//gi) ?? []).length > 2) return 'Message cannot contain more than 2 links.';
  if (!allowedSourcePages.has(payload.sourcePage)) return 'Invalid source page.';
  if (!payload.turnstileToken || payload.turnstileToken.length > 2048) {
    return 'Please complete the spam protection check.';
  }
  return null;
};

const handleContact = async (request: Request, env: WorkerEnv, fetcher: FetchLike): Promise<Response> => {
  const requestUrl = new URL(request.url);
  const origin = request.headers.get('Origin');
  if (!origin || origin !== requestUrl.origin) {
    return json({ ok: false, error: 'Invalid request origin.' }, 403);
  }

  const { ready, expectedHostnames } = contactConfiguration(env, requestUrl.hostname);
  if (!ready) {
    return json({ ok: false, error: 'Contact form is temporarily unavailable.' }, 503);
  }

  const contentLength = Number(request.headers.get('content-length') ?? 0);
  if (Number.isFinite(contentLength) && contentLength > 32_000) {
    return json({ ok: false, error: 'Message payload is too large.' }, 413);
  }

  try {
    const rawPayload = await readPayload(request);
    if (rawPayload.honeypot.trim()) return json({ ok: true });

    const now = Date.now();
    if (!Number.isFinite(rawPayload.renderTime) || rawPayload.renderTime <= 0 || rawPayload.renderTime > now) {
      return json({ ok: false, error: 'Invalid form session. Please refresh and retry.' }, 400);
    }
    if (now - rawPayload.renderTime < 3_000) return json({ ok: true });

    const payload: ContactPayload = {
      ...rawPayload,
      name: cleanText(rawPayload.name),
      email: rawPayload.email.trim(),
      audience: cleanText(rawPayload.audience),
      organisation: cleanText(rawPayload.organisation),
      message: cleanText(rawPayload.message),
      sourcePage: cleanText(rawPayload.sourcePage),
      turnstileToken: rawPayload.turnstileToken.trim(),
    };
    const validationError = validatePayload(payload);
    if (validationError) return json({ ok: false, error: validationError }, 400);

    const turnstileResponse = await fetcher('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        secret: env.TURNSTILE_SECRET!,
        response: payload.turnstileToken,
        remoteip: request.headers.get('CF-Connecting-IP') ?? '',
      }),
      signal: AbortSignal.timeout(10_000),
    });
    if (!turnstileResponse.ok) {
      console.error(JSON.stringify({ event: 'contact_verification_error', status: turnstileResponse.status }));
      return json({ ok: false, error: 'Spam protection is unavailable. Please retry.' }, 502);
    }

    const turnstileResult = await turnstileResponse.json() as TurnstileResult;
    if (
      turnstileResult.success !== true ||
      turnstileResult.action !== 'contact' ||
      !turnstileResult.hostname ||
      !expectedHostnames.has(turnstileResult.hostname)
    ) {
      const errorCodes = (turnstileResult['error-codes'] ?? []).filter((code) =>
        ['invalid-input-secret', 'invalid-input-response', 'timeout-or-duplicate', 'internal-error', 'missing-input-secret', 'missing-input-response', 'bad-request'].includes(code),
      );
      console.warn(JSON.stringify({ event: 'contact_verification_rejected', errorCodes, actionMatched: turnstileResult.action === 'contact', hostnameMatched: expectedHostnames.has(turnstileResult.hostname ?? '') }));
      return json({ ok: false, error: 'Spam protection check failed. Please retry.' }, 403);
    }

    const deliveryResponse = await fetcher('https://api.web3forms.com/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        access_key: env.WEB3FORMS_ACCESS_KEY,
        subject: `[Portfolio] ${payload.audience} inquiry`,
        from_name: payload.name,
        email: payload.email,
        replyto: payload.email,
        audience: payload.audience,
        source_page: payload.sourcePage,
        organisation: payload.organisation,
        message: `Source page: ${payload.sourcePage}\nAudience: ${payload.audience}\nOrganisation: ${payload.organisation || 'N/A'}\n\nMessage:\n${payload.message}`,
      }),
      signal: AbortSignal.timeout(10_000),
    });
    const deliveryResult = await deliveryResponse.json() as Web3FormsResult;
    if (!deliveryResponse.ok || deliveryResult.success !== true) {
      console.error(JSON.stringify({ event: 'contact_delivery_error', status: deliveryResponse.status }));
      return json({ ok: false, error: 'Message delivery failed. Please retry later.' }, 502);
    }

    console.info(JSON.stringify({ event: 'contact_delivery_accepted', sourcePage: payload.sourcePage, audience: payload.audience }));
    return json({ ok: true });
  } catch (error) {
    if (error instanceof TypeError && error.message === 'Unsupported content type') {
      return json({ ok: false, error: 'Unsupported request format.' }, 415);
    }
    console.error(JSON.stringify({ event: 'contact_request_error', timeout: error instanceof Error && (error.name === 'TimeoutError' || error.name === 'AbortError') }));
    return json({ ok: false, error: 'Unable to process the message right now.' }, 500);
  }
};

export const handleRequest = async (
  request: Request,
  env: WorkerEnv,
  fetcher: FetchLike = fetch,
): Promise<Response> => {
  const url = new URL(request.url);
  if (url.pathname === '/api/contact/config') {
    if (request.method !== 'GET') return json({ ok: false, error: 'Method not allowed.' }, 405, { Allow: 'GET' });
    const { ready } = contactConfiguration(env, url.hostname);
    const sitekey = env.TURNSTILE_SITE_KEY?.trim() || env.PUBLIC_TURNSTILE_SITE_KEY?.trim();
    if (!sitekey) console.error(JSON.stringify({ event: 'contact_sitekey_missing' }));
    const available = ready && Boolean(sitekey);
    return json({ available, sitekey: available ? sitekey : null }, available ? 200 : 503);
  }
  if (url.pathname !== '/api/contact') return env.ASSETS.fetch(request);

  if (request.method !== 'POST') {
    return json({ ok: false, error: 'Method not allowed.' }, 405, { Allow: 'POST' });
  }
  return handleContact(request, env, fetcher);
};

export default {
  fetch(request: Request, env: WorkerEnv): Promise<Response> {
    return handleRequest(request, env);
  },
};
