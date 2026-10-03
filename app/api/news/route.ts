import { NextResponse } from 'next/server';

export const dynamic='force-dynamic';

type Item={title:string;url:string;description:string;date:string|null;source:string;product:string;status:string};
type LearnResult={title?:string;url?:string;description?:string;lastUpdatedDate?:string};

const queries=['Microsoft 365 Copilot','Copilot Studio','Copilot Teams','Copilot Outlook','Copilot Word','Copilot Excel','Copilot PowerPoint','Copilot SharePoint','Copilot OneDrive','Copilot agents','Work IQ'];
const clean=(s='')=>s.replace(/<[^>]*>/g,' ').replace(/\s+/g,' ').trim();
const product=(s:string)=>{const x=s.toLowerCase();if(x.includes('powerpoint'))return'PowerPoint';if(x.includes('excel'))return'Excel';if(x.includes('word'))return'Word';if(x.includes('outlook'))return'Outlook';if(x.includes('teams'))return'Teams';if(x.includes('sharepoint'))return'SharePoint';if(x.includes('onedrive'))return'OneDrive';if(x.includes('studio'))return'Copilot Studio';if(x.includes('agent'))return'Agents';return'Microsoft 365 Copilot'};

async function learn(q:string){const u=`https://learn.microsoft.com/api/search?search=${encodeURIComponent(q)}&locale=en-us&$top=15`;const r=await fetch(u,{headers:{Accept:'application/json','User-Agent':'Daily-Microsoft-Copilot/2.0'},cache:'no-store'});if(!r.ok)return[];const j=await r.json();return (Array.isArray(j.results)?j.results:[]).map((x:LearnResult)=>{let url=x.url||'';if(!url.startsWith('http'))url='https://learn.microsoft.com'+(url.startsWith('/')?'':'/')+url;let date:string|null=null;if(x.lastUpdatedDate){const d=new Date(x.lastUpdatedDate);if(!Number.isNaN(d.getTime()))date=d.toISOString()}return{title:clean(x.title),url,description:clean(x.description),date,source:'Microsoft Learn',product:product(`${x.title} ${x.description}`),status:'Microsoft update'} as Item})}

export async function GET(){try{const groups=await Promise.all(queries.map(learn));const seen=new Set<string>();const items=groups.flat().filter(x=>{if(!x.title||!x.url)return false;try{if(new URL(x.url).hostname!=='learn.microsoft.com')return false}catch{return false}const key=(x.url.split('?')[0]+'|'+x.title).toLowerCase();if(seen.has(key))return false;seen.add(key);return true}).sort((a,b)=>(b.date||'').localeCompare(a.date||'')).slice(0,100);return NextResponse.json({items,updatedAt:new Date().toISOString(),sources:['Microsoft Learn'],count:items.length},{headers:{'Cache-Control':'public, s-maxage=900, stale-while-revalidate=3600'}})}catch(e){console.error(e);return NextResponse.json({items:[],error:'Nieuws kon niet worden opgehaald'},{status:502})}}
