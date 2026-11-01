import type {MakerCatalog} from '../workshop/types';
// Keep responses small as the catalog grows; searches include documented parts.
export function queryWorkshop(catalog:MakerCatalog,params:URLSearchParams):MakerCatalog{
 const id=params.get('project');
 const words=(params.get('q')??'').slice(0,200).toLowerCase().trim().split(/\s+/).filter(Boolean);
 const board=params.get('board')??'all',category=params.get('category')??'all',difficulty=params.get('difficulty')??'all';
 const offset=Math.max(0,Math.min(10000,Math.floor(Number(params.get('offset'))||0)));
 const limit=Math.max(1,Math.min(60,Math.floor(Number(params.get('limit'))||24)));
 const result=catalog.projects.filter(p=>id?p.id===id:(board==='all'||p.boards.includes(board))&&(category==='all'||p.category===category)&&(difficulty==='all'||p.difficulty===difficulty)&&words.every(w=>`${p.title} ${p.summary} ${p.parts.join(' ')} ${p.creator}`.toLowerCase().includes(w)));
 result.sort((a,b)=>params.get('sort')==='name'?a.title.localeCompare(b.title):(b.addedAt||b.checkedAt).localeCompare(a.addedAt||a.checkedAt)||a.id.localeCompare(b.id));
 return {projects:result.slice(id?0:offset,id?1:offset+limit),meta:{...catalog.meta,matched:result.length,offset:id?0:offset,pageSize:limit,categories:[...new Set(catalog.projects.map(p=>p.category))].sort()}};
}
