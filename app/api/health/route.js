import { query } from '@/lib/db';
export async function GET() { try { await query('SELECT 1'); return Response.json({ status: 'healthy', service: 'APMS API' }); } catch { return Response.json({ status: 'unhealthy' }, { status: 503 }); } }
