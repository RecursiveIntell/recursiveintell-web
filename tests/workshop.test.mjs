import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {queryWorkshop} from '../app/lib/workshop-query.ts';
const catalog=JSON.parse(await readFile(new URL('../app/data/workshop-public.json',import.meta.url),'utf8'));
test('public catalog supports bounded pages, exact build links and useful filters',()=>{
 const first=queryWorkshop(catalog,new URLSearchParams());assert.equal(first.projects.length,Math.min(24,catalog.projects.length));
 const second=queryWorkshop(catalog,new URLSearchParams('offset=24'));assert.equal(first.projects.some(p=>second.projects.some(other=>p.id===other.id)),false);
 assert.equal(queryWorkshop(catalog,new URLSearchParams('limit=10000')).projects.length,Math.min(60,catalog.projects.length));
 const selected=catalog.projects[0];assert.deepEqual(queryWorkshop(catalog,new URLSearchParams({project:selected.id})).projects,[selected]);
 assert.equal(queryWorkshop(catalog,new URLSearchParams('project=does-not-exist')).projects.length,0);
 assert.ok(queryWorkshop(catalog,new URLSearchParams({board:'ESP32-S3'})).projects.every(p=>p.boards.includes('ESP32-S3')));
 const byPart=queryWorkshop(catalog,new URLSearchParams({q:selected.title,limit:'60'}));assert.ok(byPart.projects.some(p=>p.id===selected.id));
});
test('public projection contains maker records and local pictures, no private workspace fields',async()=>{
 const allowed=new Set(['id','title','creator','category','boards','boardDetails','difficulty','materials','summary','whyPrint','parts','steps','printNotes','firmware','sourceUrl','instructionsUrl','supportingUrls','modelUrl','modelSourceUrl','modelStatus','images','imageNote','imagePath','checkedAt','evidence','safety','estimatedBuildTime','addedAt']);
 assert.equal(new Set(catalog.projects.map(p=>p.id)).size,catalog.projects.length);
 for(const p of catalog.projects){assert.ok(Object.keys(p).every(k=>allowed.has(k)));assert.match(p.imagePath,/^\/workshop-images\/[a-zA-Z0-9._-]+$/);assert.ok(p.steps.length>=6&&p.modelUrl);const photo=await readFile(new URL('../public'+p.imagePath,import.meta.url));assert.ok(photo.length>1000);}
 assert.equal(catalog.projects.filter(p=>p.boards.some(b=>b==='ESP32'||b==='ESP32-S3')).length/catalog.projects.length>=.9,true);
});
