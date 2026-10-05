import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const auth=request.headers.get('authorization');
  const secret=process.env.CRON_SECRET;
  if(secret&&auth!==`Bearer ${secret}`)return NextResponse.json({ok:false,error:'Unauthorized'},{status:401});
  try{
    const origin=new URL(request.url).origin;
    const r=await fetch(`${origin}/api/news`,{cache:'no-store'});
    const j=await r.json();
    if(!r.ok)throw new Error(j?.error||'news collector failed');
    let push=null;
    try{const pr=await fetch(`${origin}/api/push/send`,{method:'POST',headers:secret?{authorization:`Bearer ${secret}`}:{}});push=await pr.json()}catch(e){console.error('push failed',e)}
    return NextResponse.json({ok:true,ranAt:new Date().toISOString(),collected:j.count||0,sources:j.sources||[],push,message:'Dagelijkse Copilot-nieuwsverversing uitgevoerd.'});
  }catch(error){console.error(error);return NextResponse.json({ok:false,error:'Nieuwsverversing mislukt'},{status:502})}
}
