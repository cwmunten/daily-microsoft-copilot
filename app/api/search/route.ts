import { NextRequest, NextResponse } from 'next/server';

type LearnResult={title?:string;url?:string;description?:string;lastUpdatedDate?:string};

export const dynamic = 'force-dynamic';

export async function GET(req:NextRequest){
  const q=(req.nextUrl.searchParams.get('q')||'').trim();
  if(q.length<2) return NextResponse.json({results:[]});

  // Microsoft Learn heeft een publieke zoek-API. Hierdoor zijn we niet afhankelijk
  // van het scrapen van Bing-resultaten, dat op serverless hosts regelmatig wordt geblokkeerd.
  const search=`${q} Microsoft Copilot`;
  const endpoints=[
    `https://learn.microsoft.com/api/search?search=${encodeURIComponent(search)}&locale=nl-nl&$top=25`,
    `https://learn.microsoft.com/api/search?search=${encodeURIComponent(search)}&locale=en-us&$top=25`,
  ];

  try{
    let payload:any=null;
    for(const url of endpoints){
      const r=await fetch(url,{headers:{Accept:'application/json','User-Agent':'Daily-Microsoft-Copilot/1.0'},cache:'no-store'});
      if(r.ok){payload=await r.json();if(Array.isArray(payload?.results)&&payload.results.length)break;}
    }
    if(!payload) throw new Error('Microsoft Learn Search API niet bereikbaar');

    const raw:LearnResult[]=Array.isArray(payload.results)?payload.results:[];
    const seen=new Set<string>();
    const results=raw.map((item)=>{
      const rawUrl=item.url||'';
      const url=rawUrl.startsWith('http')?rawUrl:`https://learn.microsoft.com${rawUrl.startsWith('/')?'':'/'}${rawUrl}`;
      let date:string|null=null;
      if(item.lastUpdatedDate){const d=new Date(item.lastUpdatedDate);if(!Number.isNaN(d.getTime()))date=d.toISOString();}
      return {title:item.title||'Microsoft Learn',url,description:item.description||'',date,source:'Microsoft Learn'};
    }).filter(item=>{
      try{const host=new URL(item.url).hostname; if(host!=='learn.microsoft.com'&&!host.endsWith('.learn.microsoft.com'))return false;}catch{return false}
      if(seen.has(item.url))return false;seen.add(item.url);return true;
    });

    return NextResponse.json({results,provider:'Microsoft Learn',query:q},{headers:{'Cache-Control':'no-store'}});
  }catch(error){
    console.error('Internet search failed',error);
    return NextResponse.json({results:[],error:'Live zoeken is tijdelijk niet beschikbaar. Probeer het later opnieuw.'},{status:502});
  }
}
