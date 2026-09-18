import { requireUser, authResponse } from './auth';
import { query } from './db';

export async function listModule(table, req) {
  const a=await requireUser(); if(a.error)return authResponse(a.error);
  const url=new URL(req.url); const pid=url.searchParams.get('personnelId');
  let where='', params=[];
  if(a.user.role!=='ADMIN'){ if(!a.user.personnel_id)return Response.json({success:true,data:[]}); params=[a.user.personnel_id]; where='WHERE personnel_id=$1'; }
  else if(pid){ params=[Number(pid)]; where='WHERE personnel_id=$1'; }
  const r=await query(`SELECT * FROM ${table} ${where} ORDER BY created_at DESC`,params); return Response.json({success:true,data:r.rows});
}
export async function deleteModule(table,id,roles=['ADMIN']){ const a=await requireUser(roles);if(a.error)return authResponse(a.error); await query(`DELETE FROM ${table} WHERE id=$1`,[id]);return Response.json({success:true}); }
