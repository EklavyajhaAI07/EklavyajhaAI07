export async function listEntries(db, type) {
    const query = type
        ? db.prepare('SELECT id, type, title, description, tags, link, image_url, created_at, updated_at FROM entries WHERE type = ? AND status = ? ORDER BY created_at DESC').bind(type, 'active')
        : db.prepare('SELECT id, type, title, description, tags, link, image_url, created_at, updated_at FROM entries WHERE status = ? ORDER BY created_at DESC').bind('active');
    const result = await query.all();
    return result.results || [];
}

export async function addEntry(db, entry) {
    const result = await db.prepare('INSERT INTO entries (type, title, description, tags, link, image_url) VALUES (?, ?, ?, ?, ?, ?)').bind(entry.type, entry.title, entry.description, entry.tags, entry.link, entry.image_url || null).run();
    return result.meta.last_row_id;
}

export async function editEntry(db, id, field, value) {
    const editableFields = new Set(['type', 'title', 'description', 'tags', 'link', 'image_url']);
    if (!editableFields.has(field)) throw new Error(`Field cannot be edited: ${field}`);
    const result = await db.prepare(`UPDATE entries SET ${field} = ?, updated_at = datetime('now') WHERE id = ? AND status = 'active'`).bind(value, id).run();
    if (!result.meta.changes) throw new Error(`Active entry not found: ${id}`);
}

export async function archiveEntry(db, id) {
    const result = await db.prepare("UPDATE entries SET status = 'archived', updated_at = datetime('now') WHERE id = ? AND status = 'active'").bind(id).run();
    if (!result.meta.changes) throw new Error(`Active entry not found: ${id}`);
}

export async function undoEntry(db) {
    const result = await db.prepare("UPDATE entries SET status = 'active', updated_at = datetime('now') WHERE id = (SELECT id FROM entries WHERE status = 'archived' ORDER BY updated_at DESC LIMIT 1)").run();
    if (!result.meta.changes) throw new Error('No archived entry to undo');
}
