import { addEntry, archiveEntry, editEntry, listEntries, undoEntry } from './db.js';

function parsePipeFields(text, count) {
    const fields = text.split('|').map(field => field.trim());
    if (fields.length < count || fields.slice(0, count).some(field => !field)) throw new Error('Missing field');
    return fields;
}

export function parseCommand(text) {
    const [command, ...rest] = text.trim().split(/\s+/);
    return { command: command.toLowerCase(), body: rest.join(' ').trim() };
}

export async function handleCommand(env, text) {
    const { command, body } = parseCommand(text);
    if (command === '/add') {
        const [type, title, description, tags = '', link = ''] = parsePipeFields(body, 3);
        const id = await addEntry(env.DB, { type, title, description, tags, link });
        return `Added [${type}] ${title} (id: ${id})`;
    }
    if (command === '/list') {
        const entries = await listEntries(env.DB, body || null);
        return entries.length ? entries.map(entry => `${entry.id}: [${entry.type}] ${entry.title}`).join('\n') : 'No active entries found.';
    }
    if (command === '/edit') {
        const [id, field, value] = parsePipeFields(body, 3);
        await editEntry(env.DB, Number(id), field, value);
        return `Updated entry ${id}: ${field}`;
    }
    if (command === '/delete') {
        if (!/^\d+$/.test(body)) throw new Error('Delete requires an entry id');
        await archiveEntry(env.DB, Number(body));
        return `Archived entry ${body}`;
    }
    if (command === '/undo') {
        await undoEntry(env.DB);
        return 'Re-activated the most recently archived entry';
    }
    throw new Error('Unknown command. Use /add, /list, /edit, /delete, or /undo.');
}

export async function sendTelegramMessage(env, chatId, text) {
    const response = await fetch(`https://api.telegram.org/bot${env.TELEGRAM_BOT_TOKEN}/sendMessage`, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ chat_id: chatId, text })
    });
    if (!response.ok) console.error('Telegram reply failed:', response.status);
}
