import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const auth = request.headers.get('authorization');
  const secret = process.env.CRON_SECRET;
  if (secret && auth !== `Bearer ${secret}`) return NextResponse.json({ ok:false, error:'Unauthorized' }, { status:401 });

  // Fase 2: hier worden officiële Microsoft-bronnen opgehaald,
  // gededupliceerd, Nederlandstalig samengevat en persistent opgeslagen.
  return NextResponse.json({ ok:true, ranAt:new Date().toISOString(), message:'Dagelijkse Copilot-sync endpoint is actief.' });
}
