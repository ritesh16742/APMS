import { redirect } from 'next/navigation';
import { getSession } from '@/lib/auth';
export default async function Home(){const s=await getSession();if(s?.role==='ADMIN')redirect('/dashboard/admin');if(s)redirect('/dashboard/personnel');redirect('/login');}
