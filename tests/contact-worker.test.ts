import assert from 'node:assert/strict';
import test from 'node:test';

import { handleRequest, type WorkerEnv } from '../src/worker.ts';

const siteOrigin = 'https://eklavya-jha-portfolio.eklavya.dpdns.org';

const createEnv = (): WorkerEnv => ({
  ASSETS: {
    fetch: async () => new Response('asset response', { status: 200 }),
  },
  TURNSTILE_SECRET: 'test-turnstile-secret',
  TURNSTILE_SITE_KEY: 'test-public-site-key',
  TURNSTILE_HOSTNAMES: 'eklavya-jha-portfolio.eklavya.dpdns.org',
  WEB3FORMS_ACCESS_KEY: 'test-web3forms-key',
});

const createContactRequest = (overrides: Record<string, string> = {}): Request => {
  const form = new FormData();
  const values = {
    name: 'Alex Morgan',
    email: 'alex@example.com',
    audience: 'Recruiter',
    organisation: 'Example Organisation',
    message: 'I would like to discuss a full-stack product opportunity.',
    honeypot: '',
    renderTime: String(Date.now() - 5_000),
    sourcePage: 'recruiter',
    'cf-turnstile-response': 'valid-turnstile-token',
    ...overrides,
  };

  for (const [key, value] of Object.entries(values)) form.set(key, value);

  return new Request(`${siteOrigin}/api/contact`, {
    method: 'POST',
    headers: { Origin: siteOrigin },
    body: form,
  });
};

test('serves static assets outside the contact API route', async () => {
  const response = await handleRequest(new Request(`${siteOrigin}/clients/`), createEnv());

  assert.equal(response.status, 200);
  assert.equal(await response.text(), 'asset response');
});

test('serves public contact configuration from runtime bindings without exposing secrets', async () => {
  const response = await handleRequest(new Request(`${siteOrigin}/api/contact/config`), createEnv());

  assert.equal(response.status, 200);
  assert.equal(response.headers.get('Cache-Control'), 'no-store');
  assert.deepEqual(await response.json(), { available: true, sitekey: 'test-public-site-key' });
});

test('supports the existing PUBLIC_TURNSTILE_SITE_KEY runtime binding', async () => {
  const env = createEnv();
  delete env.TURNSTILE_SITE_KEY;
  env.PUBLIC_TURNSTILE_SITE_KEY = 'existing-public-site-key';
  const response = await handleRequest(new Request(`${siteOrigin}/api/contact/config`), env);

  assert.deepEqual(await response.json(), { available: true, sitekey: 'existing-public-site-key' });
});

test('keeps configuration unavailable when no public key exists', async () => {
  const env = createEnv();
  delete env.TURNSTILE_SITE_KEY;
  const response = await handleRequest(new Request(`${siteOrigin}/api/contact/config`), env);

  assert.equal(response.status, 503);
  assert.deepEqual(await response.json(), { available: false, sitekey: null });
});

test('does not advertise a ready form when production delivery bindings are missing', async () => {
  const env = createEnv();
  delete env.WEB3FORMS_ACCESS_KEY;
  const response = await handleRequest(new Request(`${siteOrigin}/api/contact/config`), env);

  assert.equal(response.status, 503);
  assert.deepEqual(await response.json(), { available: false, sitekey: null });
});

test('fails closed when the production hostname is not allowed', async () => {
  const env = createEnv();
  env.TURNSTILE_HOSTNAMES = 'localhost';
  let externalCalls = 0;
  const response = await handleRequest(createContactRequest(), env, async () => {
    externalCalls++;
    return Response.json({ success: true });
  });

  assert.equal(response.status, 503);
  assert.equal(externalCalls, 0);
});

test('rejects contact requests when server secrets are unavailable', async () => {
  const env = createEnv();
  delete env.TURNSTILE_SECRET;

  const response = await handleRequest(createContactRequest(), env);
  const body = await response.json() as { ok: boolean; error: string };

  assert.equal(response.status, 503);
  assert.equal(body.ok, false);
  assert.match(body.error, /temporarily unavailable/i);
});

test('rejects cross-origin contact submissions', async () => {
  const request = createContactRequest();
  const crossOriginRequest = new Request(request, { headers: { Origin: 'https://attacker.example' } });

  const response = await handleRequest(crossOriginRequest, createEnv());

  assert.equal(response.status, 403);
});

test('validates Turnstile and forwards a valid contact submission', async () => {
  const requests: string[] = [];
  const fetcher = async (input: RequestInfo | URL, init?: RequestInit): Promise<Response> => {
    const url = input.toString();
    requests.push(url);

    if (url.includes('/siteverify')) {
      return Response.json({
        success: true,
        action: 'contact',
        hostname: 'eklavya-jha-portfolio.eklavya.dpdns.org',
      });
    }

    if (url.includes('api.web3forms.com')) {
      const body = JSON.parse(init?.body as string);
      assert.equal(body.replyto, 'alex@example.com');
      assert.equal(body.audience, 'Recruiter');
      assert.equal(body.source_page, 'recruiter');
      assert.equal(body.organisation, 'Example Organisation');
      assert.equal(body.access_key, 'test-web3forms-key');
      return Response.json({ success: true });
    }

    return new Response('unexpected request', { status: 500 });
  };

  const response = await handleRequest(createContactRequest(), createEnv(), fetcher);
  const body = await response.json() as { ok: boolean };

  assert.equal(response.status, 200);
  assert.equal(body.ok, true);
  assert.equal(requests.length, 2);
});

test('fails closed when Turnstile returns the wrong action', async () => {
  const fetcher = async (): Promise<Response> => Response.json({
    success: true,
    action: 'signup',
    hostname: 'eklavya-jha-portfolio.eklavya.dpdns.org',
  });

  const response = await handleRequest(createContactRequest(), createEnv(), fetcher);

  assert.equal(response.status, 403);
});

test('rejects invalid or previously redeemed tokens without sending an email', async () => {
  let externalCalls = 0;
  const response = await handleRequest(createContactRequest(), createEnv(), async () => {
    externalCalls++;
    return Response.json({ success: false, 'error-codes': ['timeout-or-duplicate'] });
  });

  assert.equal(response.status, 403);
  assert.equal(externalCalls, 1);
});

for (const [audience, sourcePage] of [['Teams & Communities', 'teams'], ['Client', 'clients']]) {
  test(`preserves ${sourcePage} audience and reply-to through delivery`, async () => {
    let delivery: Record<string, string> | undefined;
    const response = await handleRequest(createContactRequest({ audience, sourcePage }), createEnv(), async (input, init) => {
      if (input.toString().includes('/siteverify')) {
        return Response.json({ success: true, action: 'contact', hostname: new URL(siteOrigin).hostname });
      }
      delivery = JSON.parse(init?.body as string);
      return Response.json({ success: true });
    });

    assert.equal(response.status, 200);
    assert.equal(delivery?.audience, audience);
    assert.equal(delivery?.source_page, sourcePage);
    assert.equal(delivery?.replyto, 'alex@example.com');
  });
}

test('honeypot submissions do not call external services', async () => {
  let externalCalls = 0;
  const fetcher = async (): Promise<Response> => {
    externalCalls += 1;
    return new Response(null, { status: 500 });
  };

  const response = await handleRequest(createContactRequest({ honeypot: 'spam' }), createEnv(), fetcher);

  assert.equal(response.status, 200);
  assert.equal(externalCalls, 0);
});
