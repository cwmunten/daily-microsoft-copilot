import { neon } from '@neondatabase/serverless';

export type StoredNews={title:string;url:string;description:string;date:string|null;source:string;product:string;status:string};

const connection=process.env.DATABASE_URL;
const sql=connection?neon(connection):null;
let initialized=false;

async function init(){
  if(!sql||initialized)return;
  await sql`CREATE TABLE IF NOT EXISTS copilot_news (
    id BIGSERIAL PRIMARY KEY,
    url TEXT NOT NULL UNIQUE,
    title TEXT NOT NULL,
    description TEXT NOT NULL DEFAULT '',
    published_at TIMESTAMPTZ NOT NULL,
    source TEXT NOT NULL,
    product TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'Microsoft update',
    first_seen_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    last_seen_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
  )`;
  await sql`CREATE INDEX IF NOT EXISTS copilot_news_published_at_idx ON copilot_news (published_at DESC)`;
  initialized=true;
}

export function databaseEnabled(){return Boolean(sql)}

export async function saveNews(items:StoredNews[]){
  if(!sql)return 0;
  await init();
  let saved=0;
  for(const item of items){
    if(!item.url||!item.title||!item.date)continue;
    const published=new Date(item.date);
    if(Number.isNaN(published.getTime()))continue;
    await sql`INSERT INTO copilot_news (url,title,description,published_at,source,product,status)
      VALUES (${item.url},${item.title},${item.description||''},${published.toISOString()},${item.source},${item.product},${item.status})
      ON CONFLICT (url) DO UPDATE SET
        title=EXCLUDED.title, description=EXCLUDED.description, published_at=EXCLUDED.published_at,
        source=EXCLUDED.source, product=EXCLUDED.product, status=EXCLUDED.status, last_seen_at=NOW()`;
    saved++;
  }
  return saved;
}

export async function readArchive(limit=1000):Promise<StoredNews[]>{
  if(!sql)return[];
  await init();
  const rows=await sql`SELECT title,url,description,published_at,source,product,status FROM copilot_news ORDER BY published_at DESC LIMIT ${limit}`;
  return rows.map((r:any)=>({title:r.title,url:r.url,description:r.description,date:new Date(r.published_at).toISOString(),source:r.source,product:r.product,status:r.status}));
}
