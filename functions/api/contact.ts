// Cloudflare Pages Function: /api/contact
// Handles contact form submissions with spam protection (honeypot, time-trap, Turnstile)

interface Env {
  TURNSTILE_SECRET?: string;
  CONTACT_TO_EMAIL?: string;
  WEB3FORMS_ACCESS_KEY?: string;
}

interface ContactPayload {
  name: string;
  email: string;
  audience: string;
  organisation?: string;
  message: string;
  honeypot?: string;
  renderTime?: number;
  turnstileToken?: string;
  sourcePage?: string;
}

interface PagesFunctionContext<Env> {
  request: Request;
  env: Env;
  params: Record<string, string | string[]>;
  waitUntil: (promise: Promise<unknown>) => void;
  next: (input?: Request | string, init?: RequestInit) => Promise<Response>;
  data: Record<string, unknown>;
}

export type PagesFunction<Env = unknown> = (
  context: PagesFunctionContext<Env>
) => Response | Promise<Response>;

export const onRequestPost: PagesFunction<Env> = async (context) => {
  try {
    const contentType = context.request.headers.get('content-type') || '';
    let data: Partial<ContactPayload> = {};

    if (contentType.includes('application/json')) {
      data = await context.request.json();
    } else if (contentType.includes('application/x-www-form-urlencoded') || contentType.includes('multipart/form-data')) {
      const formData = await context.request.formData();
      data = {
        name: formData.get('name')?.toString(),
        email: formData.get('email')?.toString(),
        audience: formData.get('audience')?.toString(),
        organisation: formData.get('organisation')?.toString(),
        message: formData.get('message')?.toString(),
        honeypot: formData.get('honeypot')?.toString(),
        renderTime: formData.get('renderTime') ? Number(formData.get('renderTime')) : undefined,
        turnstileToken: formData.get('cf-turnstile-response')?.toString(),
        sourcePage: formData.get('sourcePage')?.toString(),
      };
    }

    const { name, email, audience, organisation, message, honeypot, renderTime, turnstileToken } = data;

    // 1. Honeypot check: silent drop if bot filled it
    if (honeypot && honeypot.trim().length > 0) {
      return new Response(JSON.stringify({ ok: true, dropped: true }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // 2. Time-trap check: if submitted under 3 seconds from render, silent drop
    const now = Date.now();
    if (renderTime && now - renderTime < 3000) {
      return new Response(JSON.stringify({ ok: true, dropped: true }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // 3. Validation checks
    if (!name || name.trim().length < 2 || name.trim().length > 80) {
      return new Response(JSON.stringify({ ok: false, error: 'Name must be between 2 and 80 characters.' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email) || email.length > 120) {
      return new Response(JSON.stringify({ ok: false, error: 'Please provide a valid email address.' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    if (!message || message.trim().length < 20 || message.trim().length > 2000) {
      return new Response(JSON.stringify({ ok: false, error: 'Message must be between 20 and 2000 characters.' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Reject message if it contains more than 2 links (link spam)
    const linkMatches = message.match(/https?:\/\//gi);
    if (linkMatches && linkMatches.length > 2) {
      return new Response(JSON.stringify({ ok: false, error: 'Message cannot contain more than 2 links.' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // 4. Cloudflare Turnstile verification (if secret configured)
    if (context.env.TURNSTILE_SECRET && turnstileToken) {
      const turnstileRes = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          secret: context.env.TURNSTILE_SECRET,
          response: turnstileToken,
          remoteip: context.request.headers.get('CF-Connecting-IP') || '',
        }),
      });

      const turnstileResult: any = await turnstileRes.json();
      if (!turnstileResult.success) {
        return new Response(JSON.stringify({ ok: false, error: 'Turnstile check failed. Please retry.' }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        });
      }
    }

    // 5. Forward via Web3Forms if access key configured
    if (context.env.WEB3FORMS_ACCESS_KEY) {
      await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          access_key: context.env.WEB3FORMS_ACCESS_KEY,
          subject: `[Portfolio] ${audience || 'General'} - ${name}`,
          from_name: name,
          email: email,
          message: `Audience: ${audience}\nOrganisation: ${organisation || 'N/A'}\n\nMessage:\n${message}`,
        }),
      });
    }

    return new Response(JSON.stringify({ ok: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch {
    return new Response(JSON.stringify({ ok: false, error: 'Internal server error processing request.' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
