import { NextRequest, NextResponse } from 'next/server';

const trusted = ['microsoft.com','learn.microsoft.com','techcommunity.microsoft.com','support.microsoft.com','microsoft365.com'];
const strip=(s:string)=>s.replace(/<!\[CDATA\[|\]\]>/g,'').replace(/<[^>]+>/g,'').replace(/&amp;/g,'&').replace(/&quot;/g,'"').replace(/&#39;/g,"'").trim();
const tag=(xml:string,name:string)=>{const m=xml.match(new RegExp(`<${name}[^>]*>([\\s\\S]*?)<\\/${name}>`,'i'));return m?strip(m[1]):''};

export async function GET(req:NextRequest){
  const q=(req.nextUrl.searchParams.get('q')||'').trim();
  if(q.length<2) return NextResponse.json({results:[]});
  const siteQuery='('+trusted.map(d=>`site:${d}`).join(' OR ')+')';
  const url='https://www.bing.com/search?format=rss&count=30&q='+encodeURIComponent(`${q} Microsoft Copilot ${siteQuery}`);
  try{
    const r=await fetch(url,{headers:{'User-Agent':'Mozilla/5.0'},next:{revalidate:900}});
    if(!r.ok) throw new Error('search failed');
    const xml=await r.text();
    const items=[...xml.matchAll(/<item>([\s\S]*?)<\/item>/gi)].map(m=>m[1]);
    const results=items.map(item=>({title:tag(item,'title'),url:tag(item,'link'),description:tag(item,'description'),date:tag(item,'pubDate')})).filter(x=>{try{return trusted.some(d=>new URL(x.url).hostname.endsWith(d))}catch{return false}}).map(x=>({...x,date:x.date?new Date(x.date).toISOString():null,source:new URL(x.url).hostname.replace(/^www\./,'')}));
    return NextResponse.json({results});
  }catch{return NextResponse.json({results:[],error:'Internetzoekopdracht kon niet worden uitgevoerd.'},{status:502})}
}
