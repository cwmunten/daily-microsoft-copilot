import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const auth = request.headers.get('authorization');
  const secret = process.env.CRON_SECRET;
  if (secret && auth !== `Bearer ${secret}`) return NextResponse.json({ ok:false, error:'Unauthorized' }, { status:401 });

  const localHour = Number(new Intl.DateTimeFormat('nl-NL', { timeZone:'Europe/Amsterdam', hour:'2-digit', hour12:false }).format(new Date()));
  const isVercelCron = request.headers.has('x-vercel-cron-schedule');
  if (isVercelCron && localHour !== 5) return NextResponse.json({ ok:true, skipped:true, reason:'Wacht op 05:00 Europe/Amsterdam' });

  // Fase 2: officiële Microsoft-bronnen ophalen, dedupliceren,
  // Nederlandstalig samenvatten en persistent opslaan.
  return NextResponse.json({ ok:true, ranAt:new Date().toISOString(), localHour, message:'Dagelijkse Copilot-sync endpoint is actief.' });
}
