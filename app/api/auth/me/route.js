import { requireUser, authResponse } from '@/lib/auth';
export async function GET() { const a=await requireUser(); if(a.error) return authResponse(a.error); return Response.json({success:true,user:{id:a.user.id,username:a.user.username,email:a.user.email,role:a.user.role,personnelId:a.user.personnel_id}}); }
