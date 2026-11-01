'use client';
import {useEffect,useState} from 'react';
import {Dialog} from 'radix-ui';
import {ArrowUpRight,Box,Check,Cpu,Download,Layers3,Search,SlidersHorizontal,Wrench,X} from 'lucide-react';
import type {MakerCatalog,MakerProject} from './types';
import s from './workshop.module.css';
const prettyDate=(value?:string)=>value?new Date(value).toLocaleDateString('en-US',{month:'short',day:'numeric',year:'numeric',timeZone:'UTC'}):'Not recorded';
function Source({href,children}:{href?:string|null;children:React.ReactNode}){return href?<a href={href} target="_blank" rel="noopener noreferrer">{children}<ArrowUpRight size={15}/><span className={s.sr}> (opens a new tab)</span></a>:null;}
function Photo({project}:{project:MakerProject}){
  const [failed,setFailed]=useState(false);
  // Project photos are exported and verified from the canonical catalog.
  // eslint-disable-next-line @next/next/no-img-element
  return <img src={failed?project.images[0]?.url:project.imagePath} alt={project.title} loading="lazy" decoding="async" onError={()=>setFailed(true)}/>;
}
export default function WorkshopExplorer(){
  const [catalog,setCatalog]=useState<MakerCatalog|null>(null),[error,setError]=useState('');
  const [q,setQ]=useState(''),[board,setBoard]=useState('all'),[category,setCategory]=useState('all'),[difficulty,setDifficulty]=useState('all');
  const [selected,setSelected]=useState<MakerProject|null>(null),[tab,setTab]=useState('idea'),[offset,setOffset]=useState(0),[sort,setSort]=useState('newest');
  const [fetching,setFetching]=useState(true);
  const [checked,setChecked]=useState<string[]>([]);
  useEffect(()=>{
    const controller=new AbortController();
    const timer=setTimeout(()=>{
      setFetching(true);setError('');
      const params=new URLSearchParams({q,board,category,difficulty,sort,offset:String(offset),limit:'24'});
      fetch('/api/workshop?'+params,{signal:controller.signal,cache:'no-store'}).then(async r=>{if(!r.ok)throw Error('The collection could not be loaded.');return r.json() as Promise<MakerCatalog>;}).then(data=>{
        if(!controller.signal.aborted)setCatalog(previous=>({...data,projects:offset&&previous?[...previous.projects,...data.projects]:data.projects}));
      }).catch(e=>{if(!controller.signal.aborted)setError(e.message);}).finally(()=>{if(!controller.signal.aborted)setFetching(false);});
    },150);
    return()=>{clearTimeout(timer);controller.abort();};
  },[q,board,category,difficulty,sort,offset]);
  useEffect(()=>{
    const id=new URLSearchParams(window.location.search).get('project');if(!id)return;
    const controller=new AbortController();
    fetch('/api/workshop?project='+encodeURIComponent(id),{signal:controller.signal}).then(r=>r.json() as Promise<MakerCatalog>).then(data=>setSelected(data.projects[0]??null)).catch(()=>{});
    return()=>controller.abort();
  },[]);
  const filtered=catalog?.projects??[];
  const total=catalog?.meta.matched??0;
  const categories=catalog?.meta.categories??[];
  function open(project:MakerProject){setSelected(project);setTab('idea');setChecked([]);const url=new URL(window.location.href);url.searchParams.set('project',project.id);window.history.replaceState(null,'',url);}
  function close(){setSelected(null);const url=new URL(window.location.href);url.searchParams.delete('project');window.history.replaceState(null,'',url);}
  function changeFilter(set:(v:string)=>void,value:string){setFetching(true);setError('');set(value);setOffset(0);}
  return <main id="main-content" tabIndex={-1} className={s.workshop}>
    <section className={s.hero}><div><p className={s.eyebrow}>RECURSIVEINTELL / CIRCUIT WORKSHOP</p><h1>Small boards.<br/><em>Real possibilities.</em></h1><p className={s.intro}>Good ideas deserve a place on your print bed. Explore useful tools, clever mechanisms, and connected objects—with the people, files, and instructions behind them.</p><div className={s.heroLinks}><a href="#builds" className={s.primary}>Find a build <ArrowUpRight size={18}/></a><a href="/bridge" className={s.textLink}>Open your private Bridge <ArrowUpRight size={16}/></a></div></div><div className={s.heroNote}><Cpu size={34} strokeWidth={1.2}/><span>PRINT. WIRE. MAKE IT WORK.</span><strong>ESP32 first.</strong><p>ESP32 and ESP32-S3 builds lead the collection. A few Arduino UNO Q projects add something different.</p><div><Layers3 size={16}/> PLA · PETG · TPU</div></div></section>
    <div className={s.stats}><span><strong>{catalog?catalog.meta.total.toLocaleString():'…'}</strong> researched projects</span><span><Check size={16}/> Maker photos & original sources</span><span><Box size={16}/> Models, firmware & build notes</span></div>
    <section id="builds" className={s.catalog} aria-label="Project catalog"><div className={s.heading}><div><p className={s.eyebrow}>MAKE SOMETHING THAT MATTERS TO YOU</p><h2>Your next project is in here.</h2></div><small>Source checks: {prettyDate(catalog?.meta.lastChecked)}</small></div>
      <div className={s.search}><Search size={21}/><label className={s.sr} htmlFor="maker-search">Search projects and parts</label><input id="maker-search" type="search" value={q} onChange={e=>changeFilter(setQ,e.target.value)} placeholder="Search robots, instruments, displays, parts…"/></div>
      <div className={s.filters}><SlidersHorizontal size={16}/><label>Board<select value={board} onChange={e=>changeFilter(setBoard,e.target.value)}><option value="all">All boards</option>{['ESP32','ESP32-S3','Arduino UNO Q'].map(x=><option key={x}>{x}</option>)}</select></label><label>Interest<select value={category} onChange={e=>changeFilter(setCategory,e.target.value)}><option value="all">All interests</option>{categories.map(x=><option key={x}>{x}</option>)}</select></label><label>Difficulty<select value={difficulty} onChange={e=>changeFilter(setDifficulty,e.target.value)}><option value="all">Any difficulty</option>{['Beginner','Intermediate','Advanced'].map(x=><option key={x}>{x}</option>)}</select></label><label>Order<select value={sort} onChange={e=>changeFilter(setSort,e.target.value)}><option value="newest">Newest additions</option><option value="name">Name, A–Z</option></select></label></div>
      <p className={s.result} role="status">{error||(fetching?'Updating projects…':catalog?`${total} projects${q||board!=='all'||category!=='all'||difficulty!=='all'?' match your filters':''}`:'Opening the collection…')}</p>
      {error&&<button className={s.primary} onClick={()=>window.location.reload()}>Retry collection</button>}
      <div className={s.grid}>{filtered.map(p=><article className={s.card} key={p.id}><button className={s.imageButton} onClick={()=>open(p)} aria-label={`View ${p.title}`}><Photo project={p}/><span>{p.boards.join(' / ')}</span></button><div className={s.cardBody}><div className={s.cardTop}><span>{p.category}</span><small>{p.difficulty}</small></div><h3><button onClick={()=>open(p)}>{p.title}</button></h3><p>{p.summary}</p><small>By {p.creator}</small><div className={s.cardBottom}><span>{p.materials.join(' · ')}</span><button onClick={()=>open(p)}>View build <ArrowUpRight size={16}/></button></div></div></article>)}</div>
      {catalog&&!fetching&&!filtered.length&&<div className={s.empty}><h3>No projects match yet.</h3><p>Try a broader term or clear a filter.</p><button onClick={()=>{if(q||board!=='all'||category!=='all'||difficulty!=='all'||offset){setFetching(true);setError('');}setQ('');setBoard('all');setCategory('all');setDifficulty('all');setOffset(0);}}>Clear filters</button></div>}
      {total>filtered.length&&<div className={s.more}><p>Showing {filtered.length} of {total}</p><button className={s.primary} disabled={fetching||!!error} onClick={()=>{setFetching(true);setOffset(filtered.length);}}>{fetching?'Loading…':'Explore 24 more'} <ArrowUpRight size={17}/></button></div>}
      <p className={s.note}>Original projects remain credited to their creators. These research notes help you plan; use the original guide for complete wiring and assembly. Source checks are not physical build tests.</p>
    </section>
    <Dialog.Root open={!!selected} onOpenChange={v=>!v&&close()}><Dialog.Portal><Dialog.Overlay className={s.overlay}/><Dialog.Content className={s.dialog}>{selected&&<><div className={s.dialogBar}><span>CIRCUIT WORKSHOP / BUILD NOTES</span><Dialog.Close aria-label="Close build" className={s.close}><X size={22}/></Dialog.Close></div><div className={s.dialogScroll}><div className={s.detailHero}><div className={s.detailPhoto}><Photo project={selected}/><small>Photo: {selected.images[0]?.credit||selected.creator}</small></div><div><p className={s.eyebrow}>{selected.category}</p><Dialog.Title className={s.detailTitle}>{selected.title}</Dialog.Title><Dialog.Description className={s.detailSummary}>{selected.summary}</Dialog.Description><p className={s.detailCreator}>A project by {selected.creator}</p><div className={s.tags}>{selected.boards.map(b=><span key={b}><Cpu size={13}/>{b}</span>)}<span>{selected.difficulty}</span></div><a href={`/bridge?build=${encodeURIComponent(selected.id)}`} className={s.primary}><Wrench size={16}/> Plan this build in The Bridge</a><small className={s.privateNote}>Your private workspace · login required</small></div></div>
      <div className={s.tabs} role="group" aria-label="Build information">{[['idea','The idea'],['guide','Parts & build guide'],['files','Files & evidence']].map(([id,label])=><button key={id} aria-pressed={tab===id} aria-controls="maker-panel" onClick={()=>setTab(id)}>{label}</button>)}</div>
      <div id="maker-panel" className={s.panel}>
        {tab==='idea'&&<><h3>Why print it?</h3><p>{selected.whyPrint}</p><h3>At the printer</h3><p>{selected.printNotes}</p><h3>Board compatibility</h3><ul>{(selected.boardDetails??selected.boards).map(x=><li key={x}>{x}</li>)}</ul><h3>Firmware & setup</h3><p>{selected.firmware}</p><div className={s.callout}><strong>Before you build</strong><p>{selected.safety}</p></div>{selected.imageNote&&<p className={s.note}>{selected.imageNote}</p>}</>}
        {tab==='guide'&&<><h3>Gather the parts.</h3><ul className={s.parts}>{selected.parts.map((part,i)=><li key={i}><label><input type="checkbox" checked={checked.includes(`p${i}`)} onChange={()=>setChecked(c=>c.includes(`p${i}`)?c.filter(x=>x!==`p${i}`):[...c,`p${i}`])}/>{part}</label></li>)}</ul><h3>From parts to project.</h3><ol className={s.steps}>{selected.steps.map((step,i)=><li key={i}><span>{String(i+1).padStart(2,'0')}</span><div><h4>{step.title}</h4><p>{step.body}</p></div></li>)}</ol><p className={s.note}>{selected.estimatedBuildTime}. Planning notes; your exact board and printer may need adjustments. Parts checks in this preview reset when you switch builds.</p><Source href={selected.instructionsUrl}>Open the complete creator guide</Source></>}
        {tab==='files'&&<><div className={s.fileLinks}><Source href={selected.modelUrl}><Download size={18}/>3D model files</Source><Source href={selected.modelSourceUrl}>Editable CAD source</Source><Source href={selected.instructionsUrl}>Original build instructions</Source><Source href={selected.sourceUrl}>Creator’s project</Source>{selected.supportingUrls?.map(url=><Source key={url} href={url}>{new URL(url).hostname} documentation</Source>)}</div><div className={s.callout}><strong>Model access</strong><p>{selected.modelStatus}</p></div><h3>What was checked</h3><p>{selected.evidence}</p><p className={s.note}>Sources checked {prettyDate(selected.checkedAt)}.</p><h3>Image credit</h3>{selected.images.map((image,i)=><Source key={i} href={image.sourceUrl}>{image.credit}</Source>)}</>}
      </div></div></>}</Dialog.Content></Dialog.Portal></Dialog.Root>
  </main>;
}
