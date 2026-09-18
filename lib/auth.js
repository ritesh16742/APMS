import bcrypt from 'bcryptjs';
import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';
import { query } from './db';

const secret = new TextEncoder().encode(process.env.AUTH_SECRET || 'development-only-secret-change-me');
const COOKIE = 'apms_session';

export async function hashPassword(password) { return bcrypt.hash(password, 12); }
export async function verifyPassword(password, hash) { return bcrypt.compare(password, hash); }

export async function createSession(user) {
  const token = await new SignJWT({ sub: String(user.id), role: user.role, personnelId: user.personnel_id || null, username: user.username })
    .setProtectedHeader({ alg: 'HS256' }).setIssuedAt().setExpirationTime('8h').sign(secret);
  const jar = await cookies();
  jar.set(COOKIE, token, { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'lax', path: '/', maxAge: 60 * 60 * 8 });
}

export async function destroySession() { (await cookies()).delete(COOKIE); }

export async function getSession() {
  const token = (await cookies()).get(COOKIE)?.value;
  if (!token) return null;
  try { return (await jwtVerify(token, secret)).payload; } catch { return null; }
}

export async function requireUser(roles = []) {
  const session = await getSession();
  if (!session?.sub) return { error: 'UNAUTHORIZED', session: null, user: null };
  if (roles.length && !roles.includes(session.role)) return { error: 'FORBIDDEN', session, user: null };
  const result = await query('SELECT id, username, email, role, personnel_id FROM users WHERE id=$1', [session.sub]);
  if (!result.rows[0]) return { error: 'UNAUTHORIZED', session: null, user: null };
  return { error: null, session, user: result.rows[0] };
}

export function authResponse(error) {
  return Response.json({ success: false, error }, { status: error === 'FORBIDDEN' ? 403 : 401 });
}
