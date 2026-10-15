import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import vm from 'node:vm';
import ts from 'typescript';
import {queryWorkshop} from '../app/lib/workshop-query.ts';
const catalog=JSON.parse(readFileSync(new URL('../app/data/workshop-public.json',import.meta.url),'utf8'));
const source=readFileSync(new URL('../app/workshop/workshop-explorer.tsx',import.meta.url),'utf8');
const compiled=ts.transpileModule(source,{compilerOptions:{module:ts.ModuleKind.CommonJS,jsx:ts.JsxEmit.ReactJSX,target:ts.ScriptTarget.ES2022}}).outputText;

// Exercise the real component's event/effect ordering with controlled timers.
// This checks component logic, not layout or browser behavior.
function harness(){
  const hooks=[],timers=new Map(),requests=[];let cursor=0,nextTimer=1,failed=false;
  let pendingEffects=[];
  const element=(type,props,key)=>({type,props:props??{},key});
  const react={
    useState(initial){const slot=cursor++;if(!(slot in hooks))hooks[slot]=typeof initial==='function'?initial():initial;return [hooks[slot],value=>{hooks[slot]=typeof value==='function'?value(hooks[slot]):value;}];},
    useEffect(effect,deps){const slot=cursor++,prior=hooks[slot];if(!prior||deps.some((value,i)=>!Object.is(value,prior.deps[i]))){pendingEffects.push(()=>{prior?.cleanup?.();hooks[slot]={deps,cleanup:effect()};});}},
  };
  const componentModule={exports:{}};
  const context=vm.createContext({module:componentModule,exports:componentModule.exports,URL,URLSearchParams,AbortController,
    window:{location:{search:'',href:'https://recursiveintell.com/workshop'},history:{replaceState(){}}},
    setTimeout(fn){const id=nextTimer++;timers.set(id,fn);return id;},clearTimeout(id){timers.delete(id);},
    async fetch(url){const params=new URL(url,'https://recursiveintell.com').searchParams;requests.push(Object.fromEntries(params));if(failed){failed=false;return {ok:false};}return {ok:true,json:async()=>queryWorkshop(catalog,params)};},
    require(name){if(name==='react')return react;if(name==='react/jsx-runtime')return {jsx:element,jsxs:element};if(name==='radix-ui')return {Dialog:new Proxy({},{get:(_,key)=>`dialog-${String(key)}`})};if(name==='lucide-react')return new Proxy({},{get:(_,key)=>String(key)});if(name.endsWith('.css'))return {default:new Proxy({},{get:(_,key)=>String(key)})};throw Error('Unexpected import '+name);},
  });
  vm.runInContext(compiled,context);
  return {requests,failNext(){failed=true;},render(){cursor=0;pendingEffects=[];const tree=componentModule.exports.default();for(const effect of pendingEffects)effect();return tree;},async tick(){const callbacks=[...timers.values()];timers.clear();for(const fn of callbacks)fn();for(let i=0;i<12;i++)await Promise.resolve();}};
}
function nodes(node){if(Array.isArray(node))return node.flatMap(nodes);if(!node||typeof node!=='object')return [];return [node,...nodes(node.props?.children)];}
function text(node){if(Array.isArray(node))return node.map(text).join('');if(node===null||node===undefined||typeof node==='boolean')return '';if(typeof node==='object')return text(node.props?.children);return String(node);}
const more=tree=>nodes(tree).find(n=>n.type==='button'&&/Explore 24 more|Loading…/.test(text(n)));
const board=tree=>nodes(tree).find(n=>n.type==='select');
const cards=tree=>nodes(tree).filter(n=>n.type==='article').map(n=>catalog.projects.find(p=>p.id===n.key));

test('changing a filter disables paging immediately, fetches page zero and keeps later pages in that filter',async()=>{
 const h=harness();h.render();await h.tick();let tree=h.render();assert.equal(cards(tree).length,24);
 board(tree).props.onChange({target:{value:'ESP32-S3'}});tree=h.render();assert.equal(more(tree).props.disabled,true);
 await h.tick();tree=h.render();assert.equal(h.requests.at(-1).offset,'0');assert.equal(h.requests.at(-1).board,'ESP32-S3');assert.ok(cards(tree).every(p=>p.boards.includes('ESP32-S3')));
 assert.equal(more(tree).props.disabled,false);more(tree).props.onClick();tree=h.render();assert.equal(more(tree).props.disabled,true);
 await h.tick();tree=h.render();assert.equal(h.requests.at(-1).offset,'24');assert.equal(cards(tree).length,48);assert.ok(cards(tree).every(p=>p.boards.includes('ESP32-S3')));
});
test('a failed filter request cannot enable paging against stale results',async()=>{
 const h=harness();h.render();await h.tick();let tree=h.render();h.failNext();
 board(tree).props.onChange({target:{value:'ESP32-S3'}});h.render();await h.tick();tree=h.render();
 assert.equal(more(tree).props.disabled,true);assert.match(text(nodes(tree).find(n=>n.props?.role==='status')),/could not be loaded/);
 board(tree).props.onChange({target:{value:'ESP32'}});h.render();await h.tick();tree=h.render();assert.equal(h.requests.at(-1).offset,'0');assert.ok(cards(tree).every(p=>p.boards.includes('ESP32')));
});
