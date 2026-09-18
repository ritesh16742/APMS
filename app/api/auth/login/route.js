import { query } from '@/lib/db';
import { createSession, verifyPassword } from '@/lib/auth';
export async function POST(req) {
  try {
    const { identifier, password } = await req.json();
    if (!identifier || !password) return Response.json({ success:false, error:'Username/email and password are required.' }, {status:400});
    const r = await query('SELECT id, username, email, role, personnel_id, password_hash FROM users WHERE LOWER(username)=LOWER($1) OR LOWER(email)=LOWER($1)', [identifier.trim()]);
    const user = r.rows[0];
    if (!user || !(await verifyPassword(password, user.password_hash))) return Response.json({ success:false, error:'Invalid credentials.' }, {status:401});
    await createSession(user);
    return Response.json({ success:true, user:{ id:user.id, username:user.username, email:user.email, role:user.role, personnelId:user.personnel_id } });
  } catch (e) { return Response.json({success:false,error:'Login failed.',details:e.message},{status:500}); }
}
