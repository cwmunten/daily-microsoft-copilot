import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const auth=request.headers.get('authorization');
  const secret=process.env.CRON_SECRET;
  if(secret&&auth!==`Bearer ${secret}`)return NextResponse.json({ok:false,error:'Unauthorized'},{status:401});
  const localHour=Number(new Intl.DateTimeFormat('nl-NL',{timeZone:'Europe/Amsterdam',hour:'2-digit',hour12:false}).format(new Date()));
  const refreshHours=[5,12,19];
  const isVercelCron=request.headers.has('x-vercel-cron-schedule');
  if(isVercelCron&&!refreshHours.includes(localHour))return NextResponse.json({ok:true,skipped:true,reason:'Sync draait om 05:00, 12:00 en 19:00 Europe/Amsterdam'});
  try{
    const origin=new URL(request.url).origin;
    const r=await fetch(`${origin}/api/news`,{cache:'no-store'});
    const j=await r.json();
    if(!r.ok)throw new Error(j?.error||'news collector failed');
    return NextResponse.json({ok:true,ranAt:new Date().toISOString(),localHour,collected:j.count||0,sources:j.sources||[],message:'Copilot-nieuws is opnieuw opgehaald en gededupliceerd.'});
  }catch(error){console.error(error);return NextResponse.json({ok:false,error:'Nieuwsverversing mislukt'},{status:502})}
}
