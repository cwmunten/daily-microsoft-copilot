'use client';

import { useMemo, useState } from 'react';
import { updates, type Update } from './data';

type View = 'today' | 'archive' | 'search' | 'about';

function Logo(){return <div className="logo" aria-label="Advantive"><svg viewBox="0 0 58 58" role="img"><path d="M5 49h8V35H5v14Zm13 0h8V25h-8v24Zm13 0h8V15h-8v34Zm13 0h8V5h-8v44Z"/></svg><div><strong>ADVANTIVE</strong><span>Microsoft Solutions Partner</span></div></div>}

function Card({item,open,onToggle}:{item:Update;open:boolean;onToggle:()=>void}){return <article className={'card '+(open?'open':'')}>
  <button className="cardHead" onClick={onToggle} aria-expanded={open}>
    <div><span className="product">{item.product.toUpperCase()}</span><h3>{item.title}</h3><p>{item.summary}</p><span className="pill">{item.status}</span></div>
    <span className="toggle" aria-label={open?'Sluiten':'Openen'}>{open?'×':'›'}</span>
  </button>
  {open&&<div className="details"><div><h4>Wat is er nieuw?</h4><p>{item.newText}</p></div><div className="use"><h4>Wat kun je ermee?</h4><p>{item.useText}</p></div><div className="meta"><b>Voor wie relevant?</b><span>{item.audience}</span><b>Bron</b><span>{item.source}</span></div></div>}
</article>}

export default function Home(){
 const [view,setView]=useState<View>('today'); const [query,setQuery]=useState(''); const [openId,setOpenId]=useState(updates[0].id);
 const today='2026-10-03';
 const filtered=useMemo(()=>{const q=query.trim().toLowerCase(); return updates.filter(u=>!q||[u.title,u.summary,u.product,u.newText,u.useText].join(' ').toLowerCase().includes(q));},[query]);
 const visible=view==='today'?updates.filter(u=>u.date===today):view==='archive'?updates:filtered;
 const dates=[...new Set(updates.map(u=>u.date))];
 return <main>
  <header><div className="wrap nav"><Logo/><nav><button className={view==='today'?'active':''} onClick={()=>setView('today')}>Vandaag</button><button className={view==='archive'?'active':''} onClick={()=>setView('archive')}>Archief</button><button className={view==='about'?'active':''} onClick={()=>setView('about')}>Over</button></nav></div></header>
  <section className="hero"><div className="wrap"><span className="eyebrow">✦ DAGELIJKS OM 05:00 VERNIEUWD</span><h1>Daily Microsoft <em>Copilot</em></h1><p>De nieuwste ontwikkelingen. Helder uitgelegd.<br/>Direct toepasbaar in jouw organisatie.</p><small>door <b>Chris Munten</b> · Programma-manager AI Advantive</small></div></section>
  <section className="wrap content">
   {view==='about'?<div className="about"><span className="sectionLabel">OVER</span><h2>Daily Microsoft Copilot</h2><p>Een Nederlandstalige dagelijkse update voor relaties die op de hoogte willen blijven van relevante ontwikkelingen binnen Microsoft Copilot. De nadruk ligt op wat er verandert én wat je daar in de praktijk mee kunt.</p><p>Nieuwe updates worden dagelijks verzameld en verschijnen na de geplande verversing. Het archief houdt eerdere ontwikkelingen vindbaar.</p></div>:<>
    <div className="titleRow"><div><span className="sectionLabel">{view==='archive'?'ARCHIEF':view==='search'?'ZOEKEN':'VANDAAG'}</span><h2>{view==='archive'?'Eerdere Copilot-updates':view==='search'?'Zoeken in Copilot-updates':'Zaterdag 3 oktober 2026'}</h2></div><span className="updated">◷ Laatste update 05:00</span></div>
    <div className="search"><span>⌕</span><input value={query} onChange={e=>{setQuery(e.target.value);setView('search')}} placeholder="Zoek in Copilot-updates..."/><button onClick={()=>setView('search')}>Zoeken</button></div>
    {view==='archive'&&<div className="dateChips">{dates.map(d=><span key={d}>{new Date(d+'T12:00:00').toLocaleDateString('nl-NL',{day:'numeric',month:'long',year:'numeric'})}</span>)}</div>}
    <p className="count"><b>{visible.length} ontwikkelingen</b> {view==='today'&&'voor jou geselecteerd en samengevat'}</p>
    <div className="cards">{visible.map(item=><Card key={item.id} item={item} open={openId===item.id} onToggle={()=>setOpenId(openId===item.id?'':item.id)}/>)}</div>
    {visible.length===0&&<div className="empty">Geen updates gevonden. Probeer een andere zoekterm.</div>}
   </>}
  </section>
  <footer><div className="wrap"><Logo/><span>Daily Microsoft Copilot · Advantive</span></div></footer>
  <div className="mobileNav"><button onClick={()=>setView('today')}>⌂<span>Vandaag</span></button><button onClick={()=>setView('archive')}>▣<span>Archief</span></button><button onClick={()=>setView('search')}>⌕<span>Zoeken</span></button><button onClick={()=>setView('about')}>ⓘ<span>Over</span></button></div>
 </main>
}
