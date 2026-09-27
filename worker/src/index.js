import { listEntries } from './db.js';
import { handleCommand, sendTelegramMessage } from './telegram.js';

function corsHeaders(origin, env) {
    const allowedOrigin = origin === env.SITE_ORIGIN ? origin : env.SITE_ORIGIN;
    return {
        'access-control-allow-origin': allowedOrigin,
        'access-control-allow-methods': 'GET, POST, OPTIONS',
        'access-control-allow-headers': 'content-type',
        'content-type': 'application/json; charset=utf-8',
        'vary': 'Origin'
    };
}

function json(data, status, request, env) {
    return new Response(JSON.stringify(data), { status, headers: corsHeaders(request.headers.get('origin'), env) });
}

export default {
    async fetch(request, env) {
        const url = new URL(request.url);
        if (request.method === 'OPTIONS') return new Response(null, { headers: corsHeaders(request.headers.get('origin'), env) });

        if (request.method === 'GET' && url.pathname === '/api/entries') {
            const entries = await listEntries(env.DB, url.searchParams.get('type'));
            return json(entries, 200, request, env);
        }

        if (request.method === 'POST' && url.pathname === '/telegram-webhook') {
            const webhookSecretMatches = !env.TELEGRAM_WEBHOOK_SECRET || request.headers.get('x-telegram-bot-api-secret-token') === env.TELEGRAM_WEBHOOK_SECRET;
            console.log(JSON.stringify({ event: 'telegram_webhook_request', secretMatches: webhookSecretMatches }));
            if (!webhookSecretMatches) return new Response('Not found', { status: 404 });
            const update = await request.json();
            const message = update.message;
            const chatId = String(message?.chat?.id || '');
            const chatMatches = Boolean(message?.text) && chatId === String(env.TELEGRAM_CHAT_ID);
            console.log(JSON.stringify({ event: 'telegram_update', hasText: Boolean(message?.text), chatMatches }));
            if (!chatMatches) return new Response('');
            try {
                const result = await handleCommand(env, message.text);
                console.log(JSON.stringify({ event: 'telegram_command_succeeded' }));
                await sendTelegramMessage(env, chatId, `OK: ${result}`);
            } catch (error) {
                console.log(JSON.stringify({ event: 'telegram_command_failed', reason: error.message }));
                await sendTelegramMessage(env, chatId, `Error: ${error.message}`);
            }
            return new Response('');
        }

        return json({ error: 'Not found' }, 404, request, env);
    }
};
