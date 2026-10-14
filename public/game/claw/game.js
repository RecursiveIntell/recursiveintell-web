import { CHAPTERS, CLASSES, generateItem, LORE } from './content.js';
import { TALENT_BUDGET, deriveBuild, talentStatus, spentTalentPoints, migrateTalents } from './talents.js';

export const SAVE_KEY = 'recursiveintell-rpg-v1';
export const clamp = (n,a,b)=>Math.max(a,Math.min(b,n));
export const distance = (a,b)=>Math.hypot(a.x-b.x,a.z-b.z);
export function rng(seed) { let a=seed>>>0; return ()=>{a+=0x6D2B79F5;let t=a;t=Math.imul(t^t>>>15,t|1);t^=t+Math.imul(t^t>>>7,t|61);return ((t^t>>>14)>>>0)/4294967296;}; }
const clone=v=>JSON.parse(JSON.stringify(v));
const classFor=id=>CLASSES.find(c=>c.id===id)||CLASSES[0];
const safeStore={getItem:()=>null,setItem:()=>{},removeItem:()=>{}};

// Imports cross a trust boundary, including saves read from localStorage. Keep
// validation ahead of state assignment and renderer callbacks. These limits
// exceed the authored 40-unit maps, 88-kill missions and 120-item pack.
function validateSaveState(s) {
 const fail=()=>{throw Error('Save contains invalid or unsafe game data.');};
 const check=(ok)=>{if(!ok)fail();};
 const object=v=>check(v!==null&&typeof v==='object'&&!Array.isArray(v));
 const number=(v,min=0,max=1e12,integer=false)=>check(typeof v==='number'&&Number.isFinite(v)&&v>=min&&v<=max&&(!integer||Number.isInteger(v)));
 const text=(v,max=4096)=>check(typeof v==='string'&&v.length<=max&&!/[<>\u0000-\u0008\u000b\u000c\u000e-\u001f]/.test(v));
 const id=v=>{text(v,100);check(/^[a-zA-Z0-9_-]+$/.test(v));};
 const oneOf=(v,list)=>check(list.includes(v));
 const bool=v=>check(typeof v==='boolean');
 const array=(v,max)=>check(Array.isArray(v)&&v.length<=max);
 const optional=(o,key,validate,fallback)=>{if(o[key]===undefined){if(fallback!==undefined)o[key]=fallback;}else validate(o[key]);};
 let nodes=0;
 const audit=(value,depth=0)=>{
  check(++nodes<=20000&&depth<=12);
  if(typeof value==='string')text(value);
  else if(typeof value==='number')number(value,-1e12,1e12);
  else if(value!==null&&typeof value==='object'){
   if(Array.isArray(value)){array(value,256);for(const child of value)audit(child,depth+1);}
   else{check(Object.keys(value).length<=80);for(const [key,child] of Object.entries(value)){check(!['__proto__','constructor','prototype'].includes(key));text(key,100);audit(child,depth+1);}}
  }
 };
 audit(s);object(s);oneOf(s.version,[1]);oneOf(s.phase,['title','playing','dead','victory']);oneOf(s.difficulty,['story','normal','veteran']);
 number(s.chapter,0,CHAPTERS.length-1,true);number(s.mission,0,CHAPTERS[s.chapter].missions.length-1,true);
 object(s.map);number(s.map.size,24,64,true);number(s.map.seed,0,Number.MAX_SAFE_INTEGER,true);array(s.map.obstacles,128);
 const position=o=>{object(o);number(o.x,-s.map.size/2-2,s.map.size/2+2);number(o.z,-s.map.size/2-2,s.map.size/2+2);};
 const unit=o=>{position(o);id(o.id);optional(o,'angle',v=>number(v,-1e6,1e6),0);optional(o,'moving',bool,false);};
 for(const o of s.map.obstacles){position(o);number(o.w,.05,16);number(o.d,.05,16);oneOf(o.type,['pillar','tree','server','wall']);}
 const p=s.player;unit(p);
 for(const key of ['maxHp','maxEnergy'])number(p[key],1,1e7);
 number(p.hp,0,p.maxHp);number(p.energy,0,p.maxEnergy);number(p.level,1,60,true);
 for(const key of ['xp','gold','shards'])number(p[key]);
 number(p.xpNext,1,1e9);number(p.potions,0,20,true);number(p.damage,0,1e7);number(p.armor,0,1e7);number(p.speed,0,30);
 optional(p,'crit',v=>number(v,0,1));optional(p,'attackTime',v=>number(v,0,60),0);optional(p,'invulnerable',v=>number(v,0,3600),0);
 const pet=s.companion;unit(pet);number(pet.maxHp,1,1e7);number(pet.hp,0,pet.maxHp);optional(pet,'cooldown',v=>number(v,0,3600),0);
 const item=i=>{
  object(i);id(i.id);text(i.name,160);text(i.description,1200);text(i.icon,32);
  oneOf(i.slot,['weapon','armor','relic']);oneOf(i.rarity,['common','uncommon','rare','epic','legendary']);
  check(typeof i.color==='string'&&/^#[0-9a-f]{6}$/i.test(i.color));number(i.level,1,100,true);optional(i,'upgrades',v=>number(v,0,10,true));
  for(const key of ['power','armor','hp','sellValue'])number(i[key],0,100000);
  number(i.crit,0,100);
 };
 array(s.inventory,120);s.inventory.forEach(item);object(s.equipment);check(Object.keys(s.equipment).length===3);
 for(const slot of ['weapon','armor','relic']){item(s.equipment[slot]);check(s.equipment[slot].slot===slot);}
 array(s.drops,128);for(const d of s.drops){position(d);id(d.id);item(d.item);}
 array(s.objects,64);for(const o of s.objects){position(o);id(o.id);oneOf(o.type,['portal','chest','shrine','lore','terminal']);bool(o.active);text(o.label,160);}
 check(s.objects.filter(o=>o.type==='portal').length===1);
 array(s.enemies,64);check(s.enemies.filter(e=>e?.type==='boss').length<=1);
 for(const e of s.enemies){
  unit(e);oneOf(e.type,['boss','claw','drone','warden','caster']);text(e.name,160);number(e.maxHp,1,1e7);number(e.hp,-1e10,e.maxHp);number(e.damage,0,1e6);number(e.speed,0,30);
  optional(e,'level',v=>number(v,1,100,true),s.chapter*4+1);optional(e,'elite',bool,false);optional(e,'aggro',bool,false);optional(e,'phase',v=>number(v,1,3,true),1);
  optional(e,'attackTime',v=>number(v,0,60),0);
  // A non-boss windup may finish a fraction below zero during its final frame.
  optional(e,'telegraph',v=>number(v,-.1,60),0);
  number(e.cooldown,-1e8,3600);optional(e,'attackCount',v=>number(v,0,1e9,true));optional(e,'attackPattern',v=>text(v,40));
  if(e.targetX!==undefined||e.targetZ!==undefined||e.type!=='boss'&&e.telegraph>0)position({x:e.targetX,z:e.targetZ});
  if(e.pendingImpacts!==undefined){
   array(e.pendingImpacts,16);check(e.type==='boss'||!e.pendingImpacts.length);
   // A lethal impact saves synchronously inside hurt(), before the frame removes
   // expired zones. Accept that bounded frame overshoot in existing v1 saves,
   // then discard expired zones so importing cannot replay their damage.
   for(const impact of e.pendingImpacts){position(impact);id(impact.id);number(impact.radius,.05,16);number(impact.remaining,-.1,60);number(impact.damage,0,1e6);check(typeof impact.color==='string'&&/^#[0-9a-f]{6}$/i.test(impact.color));}
   e.pendingImpacts=e.pendingImpacts.filter(impact=>impact.remaining>1e-8);
   e.telegraph=e.pendingImpacts.length?Math.max(...e.pendingImpacts.map(impact=>impact.remaining)):0;
  }
 }
 for(const collection of [s.enemies,s.objects,s.drops])check(new Set(collection.map(o=>o.id)).size===collection.length);
 object(s.objective);text(s.objective.title,160);text(s.objective.description);number(s.objective.killTarget,1,128,true);number(s.objective.kills,0,128,true);number(s.objective.terminalTarget,0,16,true);number(s.objective.terminals,0,16,true);bool(s.objective.complete);optional(s.objective,'bossDefeated',bool,false);
 object(s.cooldowns);const cooldownKeys=['attack','q','e','r','dash','potion'];check(Object.keys(s.cooldowns).every(key=>cooldownKeys.includes(key)));for(const key of cooldownKeys)number(s.cooldowns[key],0,3600);
 object(s.settings);const settingsKeys=['sound','music','particles','shake'];check(Object.keys(s.settings).every(key=>settingsKeys.includes(key)));for(const key of settingsKeys)optional(s.settings,key,bool,true);
 object(s.skills);for(const rank of Object.values(s.skills))check(rank===null||typeof rank==='number'||typeof rank==='string'&&rank.length<=64);
 number(s.skillPoints,0,100000,true);optional(s,'talentVersion',v=>oneOf(v,[1,2]));
 const missions=CHAPTERS.flatMap(chapter=>chapter.missions.map(m=>m.id));array(s.completedMissions,missions.length);for(const value of s.completedMissions)oneOf(value,missions);
 array(s.discoveredLore,LORE.length);for(const value of s.discoveredLore)check(LORE.some(lore=>lore.id===value));
 for(const values of [s.completedMissions,s.discoveredLore])check(new Set(values).size===values.length);
 array(s.log,40);for(const line of s.log)text(line);
 for(const key of ['elapsed','missionTime'])number(s[key],0,1e10);
 for(const key of ['totalKills','killStreak','run'])number(s[key],0,1e10,true);
 number(s.wave,1,128,true);number(s.waveTotal,1,128,true);number(s.spawned,0,128,true);
 optional(s,'selectedEnemy',value=>{if(value!==null)id(value);},null);optional(s,'interaction',v=>text(v,200),'');
 // Transient and derived values never come from imported data.
 s.effects=[];s.floats=[];s.panel=null;s.paused=false;delete p.build;
 return s;
}

export class Game {
 constructor({storage=safeStore,onEvent=()=>{},onLoad=()=>{}}={}) {
  this.storage=storage;this.onEvent=onEvent;this.onLoad=onLoad;this.serial=1;this.keys={};this.target=null;this.enemyTarget=null;this.saveTimer=0;
  this.state=this.fresh('warden','normal');
  this.state.phase='title';this.state.saveExists=this.hasSave();this.loadMission(0,0,false);
 }
 fresh(classId,difficulty) {
  const c=classFor(classId), weapon=generateItem(1,100,'weapon'),armor=generateItem(1,121,'armor'),relic=generateItem(1,311,'relic');
  return {version:1,phase:'playing',paused:false,panel:null,chapter:0,mission:0,difficulty,classId:c.id,
   player:{id:'player',x:0,z:12,hp:c.baseHp,maxHp:c.baseHp,energy:100,maxEnergy:100,level:1,xp:0,xpNext:100,gold:100,potions:5,shards:0,damage:c.baseDamage,armor:c.baseArmor,speed:c.baseSpeed,angle:Math.PI,moving:false,attackTime:0,invulnerable:0},
   companion:{id:'companion',x:1.5,z:13.5,angle:Math.PI,moving:false,hp:100,maxHp:100},inventory:[],equipment:{weapon,armor,relic},skills:{power:0,guard:0,flow:0},skillPoints:0,talentVersion:2,
   enemies:[],objects:[],drops:[],effects:[],floats:[],map:{size:40,obstacles:[],seed:42},objective:{title:'',description:'',kills:0,killTarget:0,terminals:0,terminalTarget:0,complete:false},cooldowns:{attack:0,q:0,e:0,r:0,dash:0,potion:0},elapsed:0,totalKills:0,completedMissions:[],discoveredLore:[],log:[],selectedEnemy:null,settings:{sound:true,music:true,particles:true,shake:true},saveExists:false,interaction:'',wave:1,waveTotal:1,spawned:0,missionTime:0,killStreak:0,run:0};
 }
 id(prefix='id'){return `${prefix}-${this.serial++}`;}
 hasSave(){try{return !!this.storage.getItem(SAVE_KEY);}catch{return false;}}
 event(type,text,detail={}){this.onEvent({type,text,...detail});if(text){this.state.log.unshift(text);this.state.log=this.state.log.slice(0,40);}}
 start(classId='warden',difficulty='normal') {const settings={...this.state.settings};this.state=this.fresh(classId,difficulty);this.state.settings={...this.state.settings,...settings};this.recalculate(true);this.loadMission(0,0);this.save();}
 recalculate(fill=false) {
  const s=this.state,p=s.player,c=classFor(s.classId),items=Object.values(s.equipment).filter(Boolean),oldMax=p.maxHp;
  migrateTalents(s);const b=p.build=deriveBuild(s.classId,s.skills);
  p.maxHp=Math.round((c.baseHp+(p.level-1)*14+b.hpBonus+items.reduce((n,i)=>n+(i.hp||0),0))*b.hpMultiplier);
  p.damage=Math.round((c.baseDamage+(p.level-1)*3+items.reduce((n,i)=>n+(i.power||0),0))*b.damageMultiplier);
  p.armor=Math.max(0,Math.round((c.baseArmor+b.armorBonus+items.reduce((n,i)=>n+(i.armor||0),0))*b.armorMultiplier));
  p.speed=(c.baseSpeed||5)+b.speedBonus;p.maxEnergy=100+b.energyBonus;
  p.crit=clamp(.06+b.critBonus+items.reduce((n,i)=>n+(i.crit||0),0)/100,0,.85);
  p.xpNext=650+13*p.level*p.level;
  s.skillPoints=Math.max(0,Number(s.skillPoints)||0);
  p.hp=s.phase==='dead'||p.hp<=0?0:fill?p.maxHp:clamp(p.hp/Math.max(1,oldMax)*p.maxHp,0,p.maxHp);p.energy=fill?p.maxEnergy:Math.min(p.energy,p.maxEnergy);
 }
 loadMission(chapter,mission,announce=true) {
  const s=this.state,c=CHAPTERS[chapter],m=c?.missions[mission];if(!m) return false;
  s.chapter=chapter;s.mission=mission;s.panel=null;s.paused=false;s.missionTime=0;s.wave=1;s.run=(s.run||0)+1;
  s.map={size:40,seed:(chapter+1)*1109+(mission+1)*67+s.run*13,obstacles:[]};
  const rand=rng(s.map.seed);this.random=rand;this.target=null;this.enemyTarget=null;this.keys={};
  for(let z=-14;z<=12;z+=7)for(const side of [-1,1]){
   s.map.obstacles.push({x:side*7.5,z,w:1.5,d:1.5,type:'pillar'});
   s.map.obstacles.push({x:side*(12+rand()*2),z:z-1,w:2.2,d:3.3,type:chapter<6?(chapter%3===1?'tree':'server'):'server'});
  }
  if(mission%3===1)for(const side of [-1,1])s.map.obstacles.push({x:side*6.5,z:0,w:4.4,d:1.1,type:'wall'});
  s.player.x=0;s.player.z=12;s.player.angle=Math.PI;s.player.hp=s.player.maxHp;s.player.energy=s.player.maxEnergy;s.player.invulnerable=2;
  s.companion.x=1.5;s.companion.z=13.5;s.companion.hp=100;
  s.enemies=[];s.effects=[];s.floats=[];s.drops=[];s.selectedEnemy=null;s.spawned=0;
  const target=Math.max(4,m.killTarget||12);
  s.objective={title:m.title,description:m.description,kills:0,killTarget:target,terminals:0,terminalTarget:m.terminalTarget||0,complete:false,bossDefeated:false};
  s.waveTotal=Math.max(1,m.waves||Math.ceil(target/10));
  s.objects=[{id:this.id('portal'),x:0,z:-16,type:'portal',active:false,label:'Next sector'},{id:this.id('chest'),x:-10,z:8,type:'chest',active:true,label:'Salvage cache'},{id:this.id('chest'),x:10,z:-10,type:'chest',active:true,label:'Sealed reliquary'},{id:this.id('shrine'),x:9,z:8,type:'shrine',active:true,label:'Restore vitality'},{id:this.id('lore'),x:-10,z:-10,type:'lore',active:true,label:'Recovered archive'}];
  for(let i=0;i<s.objective.terminalTarget;i++)s.objects.push({id:this.id('terminal'),x:i%2?-4.7:4.7,z:6-i*6,type:'terminal',active:true,label:'Release the firewall'});
  this.spawnWave();this.onLoad(s);if(announce)this.event('mission',m.briefing||m.description);return true;
 }
 spawnWave() {
  const s=this.state,m=CHAPTERS[s.chapter].missions[s.mission],remaining=s.objective.killTarget-s.spawned;
  const count=Math.min(remaining,Math.max(4,Math.ceil(s.objective.killTarget/s.waveTotal))),rand=this.random||rng(s.map.seed+s.wave);
  const level=s.chapter*4+Math.floor(s.mission/2)+1;
  for(let i=0;i<count;i++) {
   const isBoss=m.objectiveType==='boss' && s.spawned+1>=s.objective.killTarget;
   const type=isBoss?'boss':['claw','claw','drone','warden','caster'][(i+s.chapter+s.wave)%5];
   const elite=!isBoss&&s.chapter>1&&rand()<.14;
   const difficulty={story:.68,normal:1,veteran:1.4}[s.difficulty]||1;
   const hp=Math.round((isBoss?460+level*80:42+level*14)*(elite?2.4:1)*difficulty);
   let pos={x:(rand()-.5)*19,z:6-rand()*20};
   if(isBoss)pos={x:0,z:-11};
   if(!this.walkable(pos.x,pos.z,.8))pos.x=rand()<.5?-3:3;
   const name=isBoss?CHAPTERS[s.chapter].boss:({claw:s.chapter<6?'Claw sentinel':'Token scavenger',drone:'Telemetry wisp',warden:'Firewall guardian',caster:'Prompt sorcerer'}[type]);
   s.enemies.push({id:this.id('enemy'),...pos,hp,maxHp:hp,type,name,elite,angle:0,moving:false,attackTime:0,telegraph:0,cooldown:1+rand()*2,speed:type==='warden'?1.5:type==='boss'?1.25:2.2+rand()*.5,damage:(isBoss?22:7)+level*1.4,level,aggro:false,phase:1});s.spawned++;
  }
  if(s.wave>1)this.event('wave',`Reinforcements · wave ${s.wave} of ${s.waveTotal}`);
 }
 walkable(x,z,r=.45){const map=this.state.map,b=map.size/2-1;if(Math.abs(x)>b||Math.abs(z)>b)return false;return !map.obstacles.some(o=>Math.abs(x-o.x)<o.w/2+r&&Math.abs(z-o.z)<o.d/2+r);}
 move(unit,dx,dz,dt,speed){
  let len=Math.hypot(dx,dz);unit.moving=false;if(!Number.isFinite(len)||len<=.01||dt<=0||speed<=0)return;
  const player=unit===this.state.player,k=this.keys||{},manual=player&&(k.w||k.a||k.s||k.d||k.ArrowUp||k.ArrowDown||k.ArrowLeft||k.ArrowRight);
  // Keyboard movement and normalized dash vectors stay under direct control.
  // Click destinations, pursuit, and the companion use routes around scenery.
  if(!manual&&(!player||len>1.05)){
   const waypoint=this.pathStep(unit,unit.x+dx,unit.z+dz);
   if(waypoint){dx=waypoint.x-unit.x;dz=waypoint.z-unit.z;len=Math.hypot(dx,dz);if(len<=.01)return;}
  }else if(manual)this._navPaths?.delete(unit);
  dx/=len;dz/=len;unit.angle=Math.atan2(dx,dz);const oldX=unit.x,oldZ=unit.z,step=Math.min(speed*dt,len),steps=Math.max(1,Math.ceil(step/.2)),sx=dx*step/steps,sz=dz*step/steps;
  // Small collision steps also prevent a dash from tunnelling through a wall.
  for(let i=0;i<steps;i++){if(this.walkable(unit.x+sx,unit.z))unit.x+=sx;if(this.walkable(unit.x,unit.z+sz))unit.z+=sz;}
  unit.moving=Math.hypot(unit.x-oldX,unit.z-oldZ)>.0001;
 }
 pathStep(unit,targetX,targetZ){
  const map=this.state.map,bound=map.size/2-1,tx=clamp(targetX,-bound,bound),tz=clamp(targetZ,-bound,bound),margin=.45;
  // Segment/AABB intersection gives exact clearance without sampling every tile.
  const clear=(ax,az,bx,bz)=>{
   if(!this.walkable(ax,az,margin)||!this.walkable(bx,bz,margin))return false;
   const dx=bx-ax,dz=bz-az;
   for(const o of map.obstacles){
    let near=0,far=1;
    for(const [p,d,center,half] of [[ax,dx,o.x,o.w/2+margin],[az,dz,o.z,o.d/2+margin]]){
     if(Math.abs(d)<1e-9){if(p<center-half||p>center+half){near=2;break;}}
     else{const a=(center-half-p)/d,c=(center+half-p)/d;near=Math.max(near,Math.min(a,c));far=Math.min(far,Math.max(a,c));if(near>far)break;}
    }
    if(near<=far&&near<=1&&far>=0)return false;
   }
   return true;
  };
  if(!this._navPaths)this._navPaths=new WeakMap();
  if(clear(unit.x,unit.z,tx,tz)){this._navPaths.delete(unit);return{x:tx,z:tz};}
  if(!this._navWorld||this._navWorld.map!==map){
   const width=Math.floor(bound*2)+1,open=new Uint8Array(width*width);
   for(let z=0;z<width;z++)for(let x=0;x<width;x++)open[z*width+x]=this.walkable(x-bound,z-bound,.55)?1:0;
   this._navWorld={map,width,open};this._navPaths=new WeakMap();
  }
  const world=this._navWorld,{width,open}=world,point=id=>({x:id%width-bound,z:Math.floor(id/width)-bound}),now=this.state.elapsed||0;
  let route=this._navPaths.get(unit);
  if(route&&(route.map!==map||Math.hypot(route.tx-tx,route.tz-tz)>1.25||route.failed&&now>=route.retryAt))route=null;
  if(!route){
   const nearest=(x,z,requireClear)=>{
    const cx=clamp(Math.round(x+bound),0,width-1),cz=clamp(Math.round(z+bound),0,width-1);let best=-1,bestDistance=Infinity;
    for(let radius=0;radius<=4;radius++){
     for(let iz=Math.max(0,cz-radius);iz<=Math.min(width-1,cz+radius);iz++)for(let ix=Math.max(0,cx-radius);ix<=Math.min(width-1,cx+radius);ix++){
      if(radius&&Math.max(Math.abs(ix-cx),Math.abs(iz-cz))!==radius)continue;
      const id=iz*width+ix;if(!open[id])continue;const p=point(id),d=(p.x-x)**2+(p.z-z)**2;
      if(d<bestDistance&&(!requireClear||clear(x,z,p.x,p.z))){best=id;bestDistance=d;}
     }
     if(best!==-1)return best;
    }
    return -1;
   };
   const start=nearest(unit.x,unit.z,true),goal=nearest(tx,tz,this.walkable(tx,tz,margin));
   route={map,tx,tz,path:[],index:0,failed:true,retryAt:now+1};
   if(start!==-1&&goal!==-1){
    const cost=new Float32Array(open.length);cost.fill(Infinity);const previous=new Int32Array(open.length);previous.fill(-1);const closed=new Uint8Array(open.length),heap=[];
    const goalX=goal%width,goalZ=Math.floor(goal/width),heuristic=id=>{const x=Math.abs(id%width-goalX),z=Math.abs(Math.floor(id/width)-goalZ);return Math.max(x,z)+.41421356237*Math.min(x,z);};
    const push=(id,score)=>{let i=heap.length;heap.push({id,score});while(i){const parent=(i-1)>>1;if(heap[parent].score<=score)break;heap[i]=heap[parent];i=parent;}heap[i]={id,score};};
    const pop=()=>{const first=heap[0],last=heap.pop();if(heap.length){let i=0;while(i*2+1<heap.length){let child=i*2+1;if(child+1<heap.length&&heap[child+1].score<heap[child].score)child++;if(heap[child].score>=last.score)break;heap[i]=heap[child];i=child;}heap[i]=last;}return first.id;};
    cost[start]=0;push(start,heuristic(start));let found=false,visited=0;
    while(heap.length&&visited++<2000){
     const current=pop();if(closed[current])continue;if(current===goal){found=true;break;}closed[current]=1;
     const cx=current%width,cz=Math.floor(current/width);
     for(const [dx,dz] of [[0,-1],[-1,0],[1,0],[0,1],[-1,-1],[1,-1],[-1,1],[1,1]]){
      const x=cx+dx,z=cz+dz;if(x<0||z<0||x>=width||z>=width)continue;const next=z*width+x;
      if(!open[next]||closed[next]||dx&&dz&&(!open[cz*width+x]||!open[z*width+cx]))continue;
      const candidate=cost[current]+(dx&&dz?Math.SQRT2:1);if(candidate>=cost[next])continue;
      cost[next]=candidate;previous[next]=current;push(next,candidate+heuristic(next));
     }
    }
    if(found){
     const path=[];for(let id=goal;id!==-1;id=previous[id]){path.push(point(id));if(id===start)break;}path.reverse();
     if(this.walkable(tx,tz,margin))path.push({x:tx,z:tz});
     route.path=path;route.failed=false;
    }
   }
   this._navPaths.set(unit,route);
  }
  if(route.failed)return null;
  while(route.index<route.path.length&&distance(unit,route.path[route.index])<.24)route.index++;
  if(route.index>=route.path.length){route.failed=true;route.retryAt=now+1;return null;}
  // Look ahead through visible waypoints so navigation does not feel grid-bound.
  for(let i=route.path.length-1;i>route.index;i--)if(clear(unit.x,unit.z,route.path[i].x,route.path[i].z)){route.index=i;break;}
  return route.path[route.index];
 }
 click(point){if(!point||this.state.phase!=='playing'||this.state.paused)return;const enemy=this.state.enemies.filter(e=>e.hp>0).sort((a,b)=>distance(a,point)-distance(b,point))[0];if(enemy&&distance(enemy,point)<1.6){this.enemyTarget=enemy.id;this.state.selectedEnemy=enemy.id;this.target=null;}else{this.enemyTarget=null;this.state.selectedEnemy=null;this.target={x:clamp(point.x,-18,18),z:clamp(point.z,-18,18)};}}
 fx(type,x,z,color='#7ce9d5',duration=.55,extra={}){this.state.effects.push({id:this.id('fx'),type,x,z,color,age:0,duration,...extra});}
 float(x,z,text,color='#f2dda8'){this.state.floats.push({id:this.id('float'),x,z,text:String(text),color,age:0});}
 nearest(range=100){const p=this.state.player;return this.state.enemies.filter(e=>e.hp>0&&distance(p,e)<range).sort((a,b)=>distance(p,a)-distance(p,b))[0];}
 planBossAttack(enemy){
  const p=this.state.player,phase=enemy.phase||1,cast=enemy.attackCount||0,chapter=this.state.chapter;
  const angle=Math.atan2(p.z-enemy.z,p.x-enemy.x),dx=Math.cos(angle),dz=Math.sin(angle),sx=-dz,sz=dx,zones=[];
  const add=(x,z,radius,windup)=>zones.push({x:clamp(x,-17,17),z:clamp(z,-17,17),radius,windup});
  const at=(side,forward,radius,windup)=>add(p.x+sx*side+dx*forward,p.z+sz*side+dz*forward,radius,windup);
  const ring=(count,radius,zoneRadius,windup,rotation=0,cx=p.x,cz=p.z)=>{
   for(let i=0;i<count;i++){const a=rotation+i*Math.PI*2/count;add(cx+Math.cos(a)*radius,cz+Math.sin(a)*radius,zoneRadius,windup+i*.035);}
  };
  let name,kind;
  switch(chapter){
   case 0:
    name='Ticket Stamps';kind='stamps';
    for(const [i,side] of [-3.4,0,3.4].entries())at(side,0,1.45,.95+i*.35);
    break;
   case 1:
    name='The Compliance Cross';kind='cross';
    at(0,0,1.5,1.1);for(const sign of [-1,1]){at(sign*3.6,0,1.35,1.1);at(0,sign*3.6,1.35,1.1);}
    break;
   case 2:
    name='Cache Tidewheel';kind='tidewheel';
    ring(6,4,1.35,1.05,cast*.35);at(0,0,1.6,1.75);
    break;
   case 3:
    name='Orbital Errands';kind='orbit';
    ring(5,4.6,1.35,1.05,angle+cast*.6,enemy.x,enemy.z);at(0,0,1.55,1.55);
    break;
   case 4: {
    name='The Grand Confetti Fan';kind='fan';const reach=clamp(distance(p,enemy),3,9);
    for(let i=-2;i<=2;i++){const a=angle+i*.36;add(enemy.x+Math.cos(a)*reach,enemy.z+Math.sin(a)*reach,1.4,1.05+(i+2)*.12);}
    break;
   }
   case 5:
    name='Royal Claw Pincer';kind='pincer';
    for(const side of [-3.5,3.5])for(const forward of [-2.8,0,2.8])at(side,forward,1.35,1.1);
    at(0,0,1.8,1.9);if(phase===3){at(0,-5.2,1.3,2.2);at(0,5.2,1.3,2.2);}
    break;
   case 6:
    name='Three Available Appointments';kind='pulses';
    for(let i=0;i<3;i++)at(0,0,1.55+i*.35,1+i*.7);
    break;
   case 7:
    name='Itemized Danger';kind='checkerboard';
    for(let row=-1;row<=1;row++)for(let column=-1;column<=1;column++)if((row+column)%2===0)at(column*3.7,row*3.7,1.5,1.05+(row+1)*.25);
    break;
   case 8:
    name='The Practical Examination';kind='scan';
    for(let i=0;i<6;i++)add(enemy.x+dx*(2+i*1.9),enemy.z+dz*(2+i*1.9),1.25,.95+i*.17);
    break;
   case 9:
    name='Turning the Pages';kind='pages';
    for(let i=-2;i<=2;i++)at(i*2.7,i*1.8,1.35,1.05+(i+2)*.18);
    at(0,0,2,2.15);
    break;
   case 10:
    name='Mind the Release Train';kind='track';
    for(let i=-3;i<=3;i++)at(0,i*2.1,1.6,1.2+(i+3)*.09);
    break;
   default:
    if(phase===1){name='The Solar Argument';kind='solar';ring(3,4.2,1.6,1.2,angle+cast*.4);at(0,0,1.8,1.2);}
    else if(phase===2){name='The Expanding Horizon';kind='horizon';ring(7,4.8,1.4,1.15,cast*.35);at(0,0,1.9,2.1);}
    else{name='One More Thing';kind='finale';for(const side of [-3.6,0,3.6])at(side,0,1.4,1.1);for(const forward of [-3.6,3.6])at(0,forward,1.4,1.65);ring(4,5.4,1.4,2.3,Math.PI/4+cast*.35);at(0,0,2,2.3);}
  }
  return{name,kind,color:chapter===11?'#ffc66e':chapter===5?'#ff916e':'#f17d72',zones};
 }
 armBossAttack(enemy){
  const plan=this.planBossAttack(enemy),damage=enemy.damage*(1+(enemy.phase||1)*.3);
  enemy.attackCount=(enemy.attackCount||0)+1;enemy.attackPattern=plan.kind;enemy.moving=false;
  enemy.pendingImpacts=plan.zones.map(zone=>({id:this.id('boss-impact'),x:zone.x,z:zone.z,radius:zone.radius,remaining:zone.windup,damage,color:plan.color}));
  for(const impact of enemy.pendingImpacts)this.fx('telegraph',impact.x,impact.z,impact.color,impact.remaining,{radius:impact.radius,impactId:impact.id});
  enemy.telegraph=Math.max(...enemy.pendingImpacts.map(impact=>impact.remaining));
  enemy.cooldown=Math.max(1.1,2-(enemy.phase||1)*.2);
  this.event('boss',plan.name);
 }
 updateBossAttack(enemy,dt){
  const p=this.state.player,pending=enemy.pendingImpacts||[];
  if(enemy.hp<=0){enemy.pendingImpacts=[];enemy.telegraph=0;return;}
  for(const impact of pending){
   // Saves omit transient effects. Recreate every missing warning and give the
   // player a fresh reaction window before a restored impact can deal damage.
   if(!this.state.effects.some(effect=>effect.type==='telegraph'&&effect.impactId===impact.id)){
    impact.remaining=Math.max(.9,impact.remaining);
    this.fx('telegraph',impact.x,impact.z,impact.color,impact.remaining,{radius:impact.radius,impactId:impact.id});
   }
   impact.remaining-=dt;
   if(impact.remaining<=1e-8){
    if(Math.hypot(p.x-impact.x,p.z-impact.z)<impact.radius)this.hurt(impact.damage);
    enemy.attackTime=.4;
    this.fx('bolt',enemy.x,enemy.z,impact.color,.22,{tx:impact.x,tz:impact.z});
    this.fx('nova',impact.x,impact.z,impact.color,.5,{radius:impact.radius});
   }
  }
  enemy.pendingImpacts=pending.filter(impact=>impact.remaining>1e-8);
  enemy.telegraph=enemy.pendingImpacts.length?Math.max(...enemy.pendingImpacts.map(impact=>impact.remaining)):0;
 }
 action(key) {
  const s=this.state,p=s.player,b=p.build||deriveBuild(s.classId,s.skills);if(s.phase!=='playing'||s.paused||s.panel)return;
  if(key==='interact'||key==='f'){this.interact();return;}
  if(key==='potion'||key==='1'){if(p.potions>0&&!s.cooldowns.potion&&p.hp<p.maxHp){p.potions--;p.hp=Math.min(p.maxHp,p.hp+p.maxHp*.6);s.cooldowns.potion=7;this.fx('heal',p.x,p.z);this.event('heal','Vitality restored');}return;}
  if(key==='dash'||key==='shift'){if(s.cooldowns.dash>0||p.energy<12)return;const dest=this.target;let dx=dest?dest.x-p.x:Math.sin(p.angle),dz=dest?dest.z-p.z:Math.cos(p.angle),len=Math.hypot(dx,dz)||1;dx/=len;dz/=len;for(let n=0;n<16;n++)this.move(p,dx,dz,.04,8);p.invulnerable=.65+b.dashInvulnerabilityBonus;p.energy-=12;s.cooldowns.dash=2.5*b.dashCooldownMultiplier;this.fx('dash',p.x,p.z);this.event('dash');return;}
  if(key==='attack'||key===' '){if(s.cooldowns.attack>0)return;const range=s.classId==='warden'?2.8:9,targets=s.enemies.filter(e=>e.hp>0&&distance(p,e)<range).sort((a,c)=>distance(p,a)-distance(p,c)).slice(0,b.basicTargets);s.cooldowns.attack=s.classId==='ranger'?.34:.5;p.attackTime=.3;this.fx('slash',p.x,p.z);for(const [index,target] of targets.entries()){p.angle=Math.atan2(target.x-p.x,target.z-p.z);if(s.classId!=='warden')this.fx('bolt',p.x,p.z,'#95fff1',.22,{tx:target.x,tz:target.z});this.hit(target,p.damage*b.basicDamageMultiplier*(index?.5:1));}this.event('attack');return;}
  if(!['q','e','r'].includes(key)||s.cooldowns[key]>0)return;
  const ability=classFor(s.classId).abilities.find(a=>a.key===key),cost=ability?Math.ceil(ability.cost*b.costMultiplier):0;if(!ability||p.energy<cost){this.event('notice','Not enough focus');return;}
  p.energy-=cost;s.cooldowns[key]=ability.cooldown;p.attackTime=.5;
  if(key==='e') {p.hp=Math.min(p.maxHp,p.hp+p.maxHp*(.24+b.healBonus)+10);p.invulnerable=s.classId==='warden'?2.4:1.4;this.fx('heal',p.x,p.z,'#82f4c8',1.2);if(s.classId==='ranger'){for(let i=0;i<8;i++)this.move(p,Math.sin(p.angle),Math.cos(p.angle),.04,8);}}
  else {const radius=key==='r'?9+b.rRadiusBonus:(s.classId==='warden'?5:11)+b.qRadiusBonus,mult=key==='r'?3.7*b.rDamageMultiplier:2*b.qDamageMultiplier;let targets=s.enemies.filter(e=>e.hp>0&&distance(p,e)<=radius);if(key==='q')targets=targets.sort((a,c)=>distance(p,a)-distance(p,c)).slice(0,b.qTargets);for(const e of targets){this.hit(e,p.damage*mult);if(s.classId!=='warden')this.fx('bolt',p.x,p.z,'#acbfff',.4,{tx:e.x,tz:e.z});}this.fx('nova',p.x,p.z,key==='r'?'#e4b56d':'#72e7df',.8,{radius});}
  this.event('ability',ability.name);
 }
 hit(enemy,amount) {
  if(enemy.hp<=0)return;const p=this.state.player,b=p.build||deriveBuild(this.state.classId,this.state.skills),critical=(this.random?.()??Math.random())<p.crit,desperate=p.hp<p.maxHp*.4?1+b.lowHealthDamageBonus:1,damage=Math.max(1,Math.round(amount*(critical?b.critMultiplier:1)*desperate));enemy.hp-=damage;if(critical&&b.energyOnCrit)p.energy=Math.min(p.maxEnergy,p.energy+b.energyOnCrit);enemy.aggro=true;this.float(enemy.x,enemy.z,critical?`${damage}!`:damage,critical?'#ffe8a3':'#e7eee9');this.fx('hit',enemy.x,enemy.z);
  if(enemy.hp<=0){this.kill(enemy);}
 }
 kill(enemy) {
  const s=this.state,p=s.player;s.objective.kills++;s.totalKills++;s.killStreak++;p.gold+=Math.round((enemy.type==='boss'?120:8)+enemy.level*2);this.addXp(enemy.type==='boss'?240+enemy.level*20:20+enemy.level*4);
  if(enemy.type==='boss'){s.objective.bossDefeated=true;this.event('boss',`${enemy.name} yields. The way is open.`);}
  if((this.random?.()||0)<.27||enemy.type==='boss'||enemy.elite){const item=generateItem(Math.max(p.level,enemy.level),Math.floor((this.random?.()??.5)*1e9));s.drops.push({id:this.id('loot'),x:enemy.x,z:enemy.z,item});}
  if((this.random?.()||0)<.06)p.potions=Math.min(20,p.potions+1);
  const build=p.build;if(build&&p.hp>0&&s.phase==='playing'){p.hp=Math.min(p.maxHp,p.hp+p.maxHp*build.healOnKill);p.energy=Math.min(p.maxEnergy,p.energy+build.energyOnKill);}
  this.event('kill');
 }
 addXp(n){const s=this.state,p=s.player;p.xp+=n;while(p.xp>=p.xpNext&&p.level<60){p.xp-=p.xpNext;p.level++;const earned=s.skillPoints+spentTalentPoints(s)<TALENT_BUDGET;if(earned)s.skillPoints++;this.recalculate(true);this.fx('nova',p.x,p.z,'#efcd88',1.4,{radius:4});this.event('level',`Level ${p.level}${earned?' · talent point earned':' · vitality and damage increased'}`);} }
 hurt(amount){const s=this.state,p=s.player,b=p.build||deriveBuild(s.classId,s.skills);if(p.invulnerable>0)return;if(b.blockChance>0&&(this.random?.()??Math.random())<b.blockChance){p.invulnerable=.2;this.float(p.x,p.z,'BLOCK','#9ddbd0');this.fx('heal',p.x,p.z,'#a6dbff',.5);const attacker=this.nearest(6);if(attacker&&b.retaliate)this.hit(attacker,p.damage*b.retaliate);return;}const factor={story:.6,normal:1,veteran:1.35}[s.difficulty]||1,d=Math.max(1,Math.round(amount*factor*(100/(100+p.armor*3))));p.hp=Math.max(0,p.hp-d);p.invulnerable=.2;this.float(p.x,p.z,`−${d}`,'#ff8f83');this.event('hurt');if(p.hp<=0){s.phase='dead';s.paused=true;this.event('death','Your thread has been interrupted. Restore at the checkpoint.');this.save();}}
 interact(){const s=this.state,p=s.player,near=s.objects.filter(o=>o.active&&distance(p,o)<3.2).sort((a,b)=>distance(p,a)-distance(p,b))[0];if(!near){if(s.drops.some(d=>distance(p,d)<4))this.collectLoot(4);else this.event('notice','Move closer to a cache, archive, terminal, or gateway.');return;}
  if(near.type==='portal'){this.advance();return;}
  if(near.type==='chest'){near.active=false;p.gold+=40+s.chapter*12;p.shards+=2;this.collect(generateItem(p.level+1,this.serial*997));this.event('chest','Cache recovered · gold, shards, and equipment');}
  if(near.type==='shrine'){near.active=false;p.hp=p.maxHp;p.energy=p.maxEnergy;p.potions=Math.min(20,p.potions+1);this.fx('heal',p.x,p.z,'#8ffac8',1.3);this.event('heal','Restored at the sanctuary');}
  if(near.type==='terminal'){near.active=false;s.objective.terminals++;this.fx('nova',near.x,near.z,'#84dbf8',1,{radius:3});this.event('terminal',`Firewall released · ${s.objective.terminals}/${s.objective.terminalTarget}`);}
  if(near.type==='lore'){near.active=false;const lore=LORE[s.chapter*2+(s.mission>=3?1:0)];if(lore&&!s.discoveredLore.includes(lore.id)){s.discoveredLore.push(lore.id);this.addXp(65);this.event('lore',`${lore.title}: ${lore.text}`);}else this.event('lore','You have already recovered this archive.');}
  this.checkComplete();this.save();
 }
 collect(item){const s=this.state;if(s.inventory.length>=120){s.player.shards+=2;s.player.gold+=item.sellValue||10;this.event('loot','Pack full · item converted into salvage');return;}s.inventory.push(item);this.event('loot',`${item.name}`,{item});}
 collectLoot(range=2.1){const s=this.state;for(let i=s.drops.length-1;i>=0;i--){const d=s.drops[i];if(distance(s.player,d)<range){this.collect(d.item);s.drops.splice(i,1);}}}
 checkComplete(){const s=this.state,o=s.objective,m=CHAPTERS[s.chapter].missions[s.mission];if(o.complete)return;if(o.kills>=o.killTarget&&o.terminals>=o.terminalTarget&&(m.objectiveType!=='boss'||o.bossDefeated)){o.complete=true;s.objects.find(o=>o.type==='portal').active=true;if(!s.completedMissions.includes(m.id))s.completedMissions.push(m.id);s.player.gold+=m.reward||100;this.addXp(100+s.chapter*40);s.player.hp=Math.min(s.player.maxHp,s.player.hp+s.player.maxHp*.35);this.event('complete','Sector secured. Enter the northern gateway to continue.');this.save();}}
 advance(){const s=this.state;if(!s.objective.complete)return;let c=s.chapter,m=s.mission+1;if(m>=CHAPTERS[c].missions.length){c++;m=0;}if(c>=CHAPTERS.length){s.phase='victory';s.paused=true;this.event('victory','The gates are open. Your impossible expedition is complete.');this.save();return;}this.loadMission(c,m);this.save();}
 unlocked(c,m){if(!CHAPTERS[c]?.missions[m])return false;if(c===0&&m===0)return true;const prev=m?CHAPTERS[c].missions[m-1]:CHAPTERS[c-1]?.missions.at(-1);return this.state.completedMissions.includes(prev?.id);}
 travel(c,m){if(!this.unlocked(c,m)){this.event('notice','Finish the preceding sector to unlock this destination.');return false;}this.state.phase='playing';this.loadMission(c,m);this.save();return true;}
 equip(id){const s=this.state,i=s.inventory.findIndex(i=>i.id===id);if(i<0)return;const item=s.inventory.splice(i,1)[0],old=s.equipment[item.slot];s.equipment[item.slot]=item;if(old)s.inventory.push(old);this.recalculate();this.event('equip',`${item.name} equipped`);this.save();}
 salvage(id){const s=this.state,i=s.inventory.findIndex(i=>i.id===id);if(i<0)return;const item=s.inventory.splice(i,1)[0];s.player.shards+=({common:1,uncommon:2,rare:4,epic:8,legendary:16}[item.rarity]||1);s.player.gold+=item.sellValue||10;this.event('salvage',`${item.name} salvaged`);this.save();}
 buyPotion(){const p=this.state.player;if(p.gold<40){this.event('notice','You need 40 gold.');return;}if(p.potions>=20){this.event('notice','Your potion belt is full.');return;}p.gold-=40;p.potions++;this.save();}
 upgrade(slot){const s=this.state,item=s.equipment[slot];if(!item)return;const n=(item.upgrades||0)+1;if(n>10){this.event('notice','This item is fully tempered.');return;}if(s.player.gold<60*n||s.player.shards<3*n){this.event('notice',`Tempering requires ${60*n} gold and ${3*n} shards.`);return;}s.player.gold-=60*n;s.player.shards-=3*n;item.upgrades=n;for(const stat of ['power','armor','hp'])if(item[stat])item[stat]=Math.ceil(item[stat]*1.12);this.recalculate();this.event('forge',`${item.name} tempered to +${n}`);this.save();}
 talent(key){const s=this.state,status=talentStatus(s,key);if(!status.canBuy){this.event('notice',status.reason);return false;}s.skills[key]=(s.skills[key]||0)+1;s.skillPoints-=status.node.cost;this.recalculate();this.event('notice',`${status.node.name} · rank ${s.skills[key]}`);this.save();return true;}
 respec(){const s=this.state,refund=spentTalentPoints(s);s.skillPoints+=refund;s.skills={power:0,guard:0,flow:0};s.talentVersion=2;this.recalculate();this.event('notice',`${refund} talent points returned. Choose a new path.`);this.save();return refund;}
 restart(){this.state.phase='playing';this.loadMission(this.state.chapter,this.state.mission);this.save();}
 update(dt){const s=this.state;dt=clamp(dt,0,.05);if(s.phase!=='playing'||s.paused||s.panel)return;s.elapsed+=dt;s.missionTime+=dt;const p=s.player;p.invulnerable=Math.max(0,p.invulnerable-dt);p.attackTime=Math.max(0,p.attackTime-dt);p.energy=Math.min(p.maxEnergy,p.energy+dt*(8+(p.build?.regenBonus||0)));for(const key of Object.keys(s.cooldowns))s.cooldowns[key]=Math.max(0,s.cooldowns[key]-dt);
  let mx=0,mz=0;const k=this.keys;if(k.w||k.ArrowUp){mx--;mz--;}if(k.s||k.ArrowDown){mx++;mz++;}if(k.a||k.ArrowLeft){mx--;mz++;}if(k.d||k.ArrowRight){mx++;mz--;}
  const targetEnemy=s.enemies.find(e=>e.id===this.enemyTarget&&e.hp>0);if(mx||mz){this.target=null;this.enemyTarget=null;this.move(p,mx,mz,dt,p.speed);}else if(targetEnemy){const range=s.classId==='warden'?2.2:7;if(distance(p,targetEnemy)>range)this.move(p,targetEnemy.x-p.x,targetEnemy.z-p.z,dt,p.speed);else{p.moving=false;this.action('attack');}}else if(this.target&&distance(p,this.target)>.25){this.move(p,this.target.x-p.x,this.target.z-p.z,dt,p.speed);}else{p.moving=false;this.target=null;}
  if(k[' '])this.action('attack');
  for(const e of s.enemies){if(e.hp<=0)continue;e.attackTime=Math.max(0,e.attackTime-dt);const dist=distance(p,e);if(dist<9||e.hp<e.maxHp||s.objective.kills>0&&s.enemies.filter(e=>e.hp>0).length<3)e.aggro=true;if(!e.aggro){e.moving=false;continue;}
   const boss=e.type==='boss',ranged=e.type==='caster'||e.type==='drone',range=boss?4:ranged?8:1.6;e.angle=Math.atan2(p.x-e.x,p.z-e.z);
   if(boss){
    const phase=e.hp/e.maxHp<.3?3:e.hp/e.maxHp<.65?2:1;if(phase!==e.phase){e.phase=phase;this.event('boss',`${e.name} · phase ${phase}`);this.fx('nova',e.x,e.z,'#e57a7b',1,{radius:5});}
    if(e.pendingImpacts?.length){e.moving=false;this.updateBossAttack(e,dt);continue;}
    e.telegraph=0;e.cooldown-=dt;
    if(dist>10)this.move(e,p.x-e.x,p.z-e.z,dt,e.speed*(e.phase*.2+1));
    else{e.moving=false;if(e.cooldown<=0){this.armBossAttack(e);this.updateBossAttack(e,dt);}}
    continue;
   }
   if(e.telegraph>0){e.telegraph-=dt;e.moving=false;if(e.telegraph<=0){e.attackTime=.4;const tx=e.targetX,tz=e.targetZ,r=boss?2.5+e.phase*.35:ranged?1.2:1.8;if(Math.hypot(p.x-tx,p.z-tz)<r)this.hurt(e.damage*(boss?e.phase*.5+1:1));this.fx(boss?'nova':'hit',tx,tz,'#ec795d',.5,{radius:r});e.cooldown=boss?2.5-e.phase*.3:ranged?2.2:1.35;}continue;}
   e.cooldown-=dt;if(dist>range)this.move(e,p.x-e.x,p.z-e.z,dt,e.speed*(boss?e.phase*.2+1:1));else{e.moving=false;if(e.cooldown<=0){e.telegraph=boss?1.1:ranged?.85:.65;e.targetX=p.x;e.targetZ=p.z;this.fx('telegraph',p.x,p.z,'#f17760',e.telegraph,{radius:boss?2.5+e.phase*.35:ranged?1.2:1.8});}}
  }
  s.enemies=s.enemies.filter(e=>e.hp>0);
  if(!s.enemies.length&&s.spawned<s.objective.killTarget){s.wave++;this.spawnWave();}
  const pet=s.companion,petTarget=this.nearest(8);pet.cooldown=Math.max(0,(pet.cooldown||0)-dt);const petDest=petTarget||{x:p.x+1.5,z:p.z+1.5};if(distance(pet,petDest)>2)this.move(pet,petDest.x-pet.x,petDest.z-pet.z,dt,p.speed*1.08);else pet.moving=false;if(distance(pet,p)>12){pet.x=p.x+1;pet.z=p.z+1;}if(petTarget&&distance(pet,petTarget)<4&&!pet.cooldown){pet.cooldown=1.5*(p.build?.companionCooldownMultiplier||1);this.fx('bolt',pet.x,pet.z,'#ffba7c',.3,{tx:petTarget.x,tz:petTarget.z});this.hit(petTarget,p.damage/Math.max(.1,p.build?.damageMultiplier||1)*.22*(p.build?.companionDamageMultiplier||1));}
  for(const e of s.effects)e.age+=dt;for(const f of s.floats)f.age+=dt;s.effects=s.effects.filter(e=>e.age<e.duration);s.floats=s.floats.filter(f=>f.age<1.2);
  this.collectLoot();this.checkComplete();const obj=s.objects.filter(o=>o.active&&distance(p,o)<3.2).sort((a,b)=>distance(p,a)-distance(p,b))[0];s.interaction=obj?`F · ${obj.label}`:'';
  this.saveTimer+=dt;if(this.saveTimer>15){this.saveTimer=0;this.save();}
 }
 serialize(){const s=clone(this.state);s.effects=[];s.floats=[];s.panel=null;s.paused=false;return JSON.stringify({format:'recursiveintell-rpg',version:1,savedAt:new Date().toISOString(),state:s});}
 save(){try{this.storage.setItem(SAVE_KEY,this.serialize());this.state.saveExists=true;return true;}catch{this.event('notice','Browser storage is unavailable. Export your save from Settings.');return false;}}
 static parseSave(text){if(typeof text!=='string'||text.length>5000000)throw Error('Save files must be smaller than 5 MB.');const data=JSON.parse(text),s=data?.state;if(data?.format!=='recursiveintell-rpg'||data.version!==1||!s||!CLASSES.some(c=>c.id===s.classId))throw Error('This is not a compatible RecursiveIntell save.');return validateSaveState(s);}
 importSave(text){const incoming=migrateTalents(Game.parseSave(text));this.state=incoming;this.state.phase=incoming.phase==='victory'?'victory':incoming.phase==='dead'||incoming.player.hp<=0?'dead':'playing';if(this.state.phase==='dead')this.state.player.hp=0;this.state.paused=this.state.phase!=='playing';this.state.panel=null;this.state.effects=[];this.state.floats=[];this.state.saveExists=true;this.serial=Date.now()%1e9;this.random=rng(this.state.map.seed+this.state.spawned);this.target=null;this.enemyTarget=null;this.keys={};this.recalculate();this.onLoad(this.state);this.save();this.event('notice','Expedition restored');}
 continue(){try{const text=this.storage.getItem(SAVE_KEY);if(!text)throw Error('No saved expedition found.');this.importSave(text);return true;}catch(error){this.event('notice',error.message);return false;}}
}
