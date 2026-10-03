export type StoredNews={title:string;url:string;description:string;date:string|null;source:string;product:string;status:string};

const supabaseUrl=(process.env.NEXT_PUBLIC_SUPABASE_URL||'https://iolqfnrspjtwjptijriy.supabase.co').replace(/\/$/,'');
const publishableKey=process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY||'sb_publishable_W3YgGgMCGrsPSZLmyNZlQw_hYySt2lI';

function headers(){return{apikey:publishableKey,Authorization:`Bearer ${publishableKey}`,'Content-Type':'application/json'}}
export function databaseEnabled(){return Boolean(supabaseUrl&&publishableKey)}

// Microsoft Learn can return English content even for an nl-NL URL. Never publish
// that raw English text in Daily Copilot. Product names and common IT terms are
// deliberately ignored by this check.
function isDutchEnough(text:string){
  const x=` ${text.toLowerCase().replace(/[^a-zà-ÿ0-9-]+/g,' ')} `;
  const nl=[' de ',' het ',' een ',' van ',' voor ',' met ',' wordt ',' worden ',' gebruikers ',' organisaties ',' gebruiken ',' beheren ',' beschikbaar ',' kunnen ',' nieuwe ',' binnen ',' naar ',' deze ',' zijn ',' hoe ',' waarbij ',' onder ',' informatie ',' instellingen ',' beveiliging ',' licentie ',' gegevens ',' mogelijkheden '];
  const en=[' the ',' and ',' with ',' this ',' article ',' provides ',' users ',' organizations ',' available ',' learn how ',' you can ',' your ',' overview ',' capabilities ',' manage ',' security ',' requirements ',' summarizes ',' powered by ',' get started ',' choose between ',' what is ',' in this article '];
  const n=nl.reduce((s,w)=>s+(x.includes(w)?1:0),0);
  const e=en.reduce((s,w)=>s+(x.includes(w)?1:0),0);
  return n>=2 && n>=e;
}

export async function saveNews(items:StoredNews[]){
  const rows=items.filter(x=>x.url&&x.title&&x.date&&isDutchEnough(`${x.title} ${x.description}`)).map(item=>({
    title:item.title,url:item.url,description:item.description||'',published_at:new Date(item.date as string).toISOString(),source:item.source,product:item.product,status:item.status||'Microsoft update',updated_at:new Date().toISOString()
  })).filter(x=>!Number.isNaN(new Date(x.published_at).getTime()));
  if(!rows.length)return 0;
  const r=await fetch(`${supabaseUrl}/rest/v1/copilot_news?on_conflict=url`,{method:'POST',headers:{...headers(),Prefer:'resolution=merge-duplicates,return=minimal'},body:JSON.stringify(rows),cache:'no-store'});
  if(!r.ok)throw new Error(`Supabase save failed: ${r.status} ${await r.text()}`);
  return rows.length;
}

export async function readArchive(limit=1000):Promise<StoredNews[]>{
  const r=await fetch(`${supabaseUrl}/rest/v1/copilot_news?select=title,url,description,published_at,source,product,status&order=published_at.desc&limit=${limit}`,{headers:headers(),cache:'no-store'});
  if(!r.ok)throw new Error(`Supabase read failed: ${r.status} ${await r.text()}`);
  const rows=await r.json();
  return rows.map((x:any)=>({title:x.title,url:x.url,description:x.description||'',date:x.published_at,source:x.source,product:x.product,status:x.status}));
}
