export function cleanDate(value) { return value || null; }
export function json(data, status = 200) { return Response.json(data, { status }); }
export function error(message, status = 400, details = undefined) { return Response.json({ success: false, error: message, ...(details ? { details } : {}) }, { status }); }
export function parseId(value) { const id = Number(value); return Number.isInteger(id) && id > 0 ? id : null; }
