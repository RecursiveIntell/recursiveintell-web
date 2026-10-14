import {Game,SAVE_KEY} from './game.js';
import {GameUI} from './ui.js';
import {WorldRenderer} from './renderer.js';
import {Soundscape} from './audio.js';
import {startCampaign} from './start-campaign.js';

const sound=new Soundscape();let renderer,ui,storage;
try{storage=window.localStorage;}catch{storage=undefined;}
const game=new Game({storage,onLoad:s=>{renderer?.load(s);ui?.closePanel();},onEvent:e=>{sound.event(e.type,{classId:game.state.classId,chapter:game.state.chapter,key:e.key,name:e.text,rarity:e.item?.rarity||e.rarity});if(e.text)ui?.toast(e.text);if(e.type==='hurt'&&game.state.settings.shake){document.body.classList.remove('damage-flash');void document.body.offsetWidth;document.body.classList.add('damage-flash');}}});
function closePanel(){game.state.panel=null;game.state.paused=false;ui.closePanel();game.keys={};}
function panel(name){sound.event('ui');if(game.state.phase==='title'&&name!=='settings')return;if(game.state.panel===name){closePanel();return;}game.state.panel=name;game.state.paused=true;game.keys={};if(game.state.phase==='playing')game.save();ui.showPanel(name,game.state);}
function refreshPanel(){if(game.state.panel)ui.showPanel(game.state.panel,game.state);ui.update(game.state);}
const actions={
 start:(classId,difficulty)=>startCampaign({game,sound,ui,confirmOverwrite:message=>window.confirm(message)},classId,difficulty),
 continue:()=>{sound.start();if(game.continue()){sound.configure(game.state.settings);ui.update(game.state);}},
 action:key=>{sound.start();game.action(key);},panel,
 equip:id=>{game.equip(id);refreshPanel();},salvage:id=>{game.salvage(id);refreshPanel();},buyPotion:()=>{game.buyPotion();refreshPanel();},upgrade:slot=>{game.upgrade(slot);refreshPanel();},talent:key=>{game.talent(key);sound.event('ui');refreshPanel();},respec:()=>{game.respec();sound.event('ui');refreshPanel();},
 travel:(chapter,mission)=>{if(game.travel(chapter,mission))closePanel();},quit:()=>{game.save();game.state.phase='title';game.state.paused=false;game.state.panel=null;game.keys={};ui.closePanel();ui.update(game.state);},resume:closePanel,restart:()=>{game.restart();closePanel();},
 setSetting:(key,value)=>{if(Object.hasOwn(game.state.settings,key)){game.state.settings[key]=!!value;sound.configure(game.state.settings);if(game.state.phase!=='title')game.save();}},
 setDifficulty:value=>{if(['story','normal','veteran'].includes(value)){game.state.difficulty=value;game.save();}},
 exportSave:()=>{const blob=new Blob([game.serialize()],{type:'application/json'}),url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download='recursiveintell-expedition.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);ui.toast('Save exported. Keep this file to continue on another browser.');},
 importSave:async file=>{if(!file)return;try{if(file.size>5000000)throw Error('Save files must be smaller than 5 MB.');game.importSave(await file.text());sound.start();sound.configure(game.state.settings);ui.update(game.state);}catch(e){ui.toast(e.message||'Unable to import that save.');}},
 resetSave:()=>{try{storage?.removeItem(SAVE_KEY);}catch{}game.state.saveExists=false;game.state.phase='title';game.state.panel=null;game.state.paused=false;ui.closePanel();ui.update(game.state);ui.toast('Saved expedition removed. Choose a class to begin again.');}
};
ui=new GameUI(actions);ui.update(game.state);
const canvas=document.getElementById('world');
try{renderer=new WorldRenderer(canvas);renderer.load(game.state);}catch(error){console.error(error);const fallback=document.createElement('div');fallback.className='render-error';fallback.style.cssText='position:fixed;z-index:1000;bottom:24px;left:24px;right:24px;padding:18px;color:#ffe1a9;background:#20191c;border:1px solid #a66';fallback.textContent='The 3D renderer could not start. Enable hardware acceleration and WebGL in your browser, then reload. '+error.message;document.body.append(fallback);document.querySelectorAll('[data-ui="start"]').forEach(b=>b.disabled=true);}
const floatLayer=document.createElement('div');floatLayer.id='combat-labels';floatLayer.style.cssText='position:fixed;inset:0;pointer-events:none;z-index:8;overflow:hidden';document.body.append(floatLayer);
let last=performance.now(),uiElapsed=0,frame=0;
function tick(time){const dt=Math.min((time-last)/1000,.05);last=time;game.update(dt);sound.update?.(game.state,dt);if(game.state.phase==='playing'&&!game.state.paused)renderer?.render(game.state,dt);uiElapsed+=dt;
 if(uiElapsed>.09){ui.update(game.state);uiElapsed=0;const s=game.state;floatLayer.replaceChildren();if(s.phase==='playing'&&!s.panel&&renderer){for(const f of s.floats){const point=renderer.project(f.x,f.z,2+f.age*1.5);if(!point.visible)continue;const el=document.createElement('span');el.textContent=f.text;el.style.cssText=`position:absolute;left:${point.x}px;top:${point.y}px;color:${f.color};opacity:${1-f.age/1.2};font:700 18px Georgia,serif;text-shadow:0 2px 4px #000;transform:translate(-50%,-50%);`;floatLayer.append(el);}for(const e of s.enemies){if(e.hp>=e.maxHp&&e.id!==s.selectedEnemy)continue;const point=renderer.project(e.x,e.z,e.type==='boss'?5:2.2);if(!point.visible)continue;const el=document.createElement('div');el.style.cssText=`position:absolute;left:${point.x}px;top:${point.y}px;width:44px;height:4px;background:#1b171c;border:1px solid #493939;transform:translateX(-50%);`;const fill=document.createElement('div');fill.style.cssText=`width:${Math.max(0,e.hp/e.maxHp)*100}%;height:100%;background:${e.elite?'#dcaa68':'#e37e66'};`;el.append(fill);floatLayer.append(el);}}}
 frame=requestAnimationFrame(tick);
}
requestAnimationFrame(tick);
canvas.addEventListener('pointerdown',e=>{if(e.button!==0||!renderer)return;sound.start();const point=renderer.groundPoint(e.clientX,e.clientY);game.click(point);canvas.setPointerCapture?.(e.pointerId);});
canvas.addEventListener('contextmenu',e=>{e.preventDefault();game.action('attack');});
canvas.addEventListener('wheel',e=>{e.preventDefault();renderer?.setZoom(e.deltaY);},{passive:false});
const hotkeys={i:'inventory',j:'journal',k:'skills',m:'map',b:'forge'};
window.addEventListener('keydown',e=>{if(['INPUT','TEXTAREA','SELECT'].includes(e.target.tagName)||e.ctrlKey||e.metaKey||e.altKey)return;const key=e.key.length===1?e.key.toLowerCase():e.key;if([' ','ArrowUp','ArrowDown','ArrowLeft','ArrowRight'].includes(key))e.preventDefault();if(key==='Escape'){if(game.state.panel)closePanel();else if(game.state.phase==='playing')panel('settings');return;}if(game.state.phase!=='playing')return;if(hotkeys[key]&&!e.repeat){panel(hotkeys[key]);return;}if(game.state.paused)return;game.keys[key]=true;if(!e.repeat){if(['q','e','r','f','1'].includes(key))game.action(key);if(key==='Shift')game.action('dash');}});
window.addEventListener('keyup',e=>{const key=e.key.length===1?e.key.toLowerCase():e.key;game.keys[key]=false;});
window.addEventListener('blur',()=>{game.keys={};if(game.state.phase==='playing'&&!game.state.paused)panel('settings');});
window.addEventListener('resize',()=>renderer?.resize());
window.addEventListener('beforeunload',()=>{if(game.state.phase!=='title')game.save();});
document.addEventListener('visibilitychange',()=>{if(document.hidden){game.keys={};if(game.state.phase==='playing')game.save();}});
// A read-only snapshot is available to aid issue reports without exposing mutation controls.
window.recursiveIntell={getSnapshot:()=>JSON.parse(game.serialize()),getRenderStats:()=>renderer?{calls:renderer.renderer.info.render.calls,triangles:renderer.renderer.info.render.triangles,geometries:renderer.renderer.info.memory.geometries}:null,getAudioStats:()=>sound.getDiagnostics?.(),version:'0.2.1'};
