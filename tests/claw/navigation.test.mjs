import test from 'node:test';
import assert from 'node:assert/strict';
import {Game,distance} from '../../public/game/claw/game.js';

function scene(){
 const game=new Game();game.start('warden','normal');
 game.state.map={size:40,seed:91,obstacles:[{x:7.5,z:0,w:1.5,d:1.5,type:'pillar'}]};
 game.state.enemies=[];game.state.effects=[];game.state.objects=[];game.state.objective.killTarget=999;
 return game;
}
function follow(game,unit,target,steps=240){
 const trace=[];
 for(let i=0;i<steps&&distance(unit,target)>.2;i++){
  game.state.elapsed+=.05;game.move(unit,target.x-unit.x,target.z-unit.z,.05,4);
  assert.ok(game.walkable(unit.x,unit.z),'route stays outside scenery and within bounds');trace.push([unit.x,unit.z]);
 }
 return trace;
}

test('click movement routes around a pillar instead of stalling head-on',()=>{
 const game=scene(),p=game.state.player;Object.assign(p,{x:7.5,z:3});const goal={x:7.5,z:-3};
 const trace=follow(game,p,goal);
 assert.ok(distance(p,goal)<.25,'player reaches the far side of the pillar');
 assert.ok(trace.some(([x])=>Math.abs(x-7.5)>1.2),'path visibly detours around collision');
});

test('enemy pursuit and companion follow use the same safe detour',()=>{
 for(const kind of ['enemy','companion']){
  const game=scene(),unit=kind==='companion'?game.state.companion:{id:'pursuer',x:7.5,z:-3};
  Object.assign(unit,{x:7.5,z:-3});const goal={x:7.5,z:3};follow(game,unit,goal);
  assert.ok(distance(unit,goal)<.25,`${kind} reaches player across a pillar`);
 }
});

test('keyboard remains direct and does not silently steer around obstacles',()=>{
 const game=scene(),p=game.state.player;Object.assign(p,{x:7.5,z:3});game.keys={w:true};
 for(let i=0;i<80;i++)game.move(p,0,-1,.05,4);
 assert.equal(p.x,7.5);assert.ok(p.z>=1.2);assert.ok(game.walkable(p.x,p.z));
});

test('click routing can recover after keyboard movement stops against scenery',()=>{
 const game=scene(),p=game.state.player;Object.assign(p,{x:7.5,z:3});game.keys={w:true};
 for(let i=0;i<300;i++)game.move(p,0,-1,.016,4);
 assert.ok(p.z<1.25,'starts close to the collision edge');game.keys={};
 follow(game,p,{x:7.5,z:-3});assert.ok(distance(p,{x:7.5,z:-3})<.25);
});

test('routing stays within map bounds and cannot tunnel through thin walls',()=>{
 const game=scene(),p=game.state.player;Object.assign(p,{x:0,z:0});follow(game,p,{x:50,z:0});
 assert.ok(p.x<=19&&p.x>=18.7);assert.ok(game.walkable(p.x,p.z));
 game.state.map={size:40,obstacles:[{x:0,z:0,w:8,d:.2,type:'wall'}]};Object.assign(p,{x:0,z:3});game.keys={w:true};
 game.move(p,0,-10,1,20);assert.ok(p.z>=.55);assert.ok(game.walkable(p.x,p.z));
});

test('detours are deterministic and cache work across frames',()=>{
 const a=scene(),b=scene();Object.assign(a.state.player,{x:7.5,z:3});Object.assign(b.state.player,{x:7.5,z:3});
 const goal={x:7.5,z:-3};
 a.move(a.state.player,0,-6,.05,4);const route=a._navPaths.get(a.state.player),world=a._navWorld;
 a.move(a.state.player,goal.x-a.state.player.x,goal.z-a.state.player.z,.05,4);
 assert.equal(a._navPaths.get(a.state.player),route);assert.equal(a._navWorld,world);
 Object.assign(a.state.player,{x:7.5,z:3});a._navPaths=new WeakMap();
 assert.deepEqual(follow(a,a.state.player,goal),follow(b,b.state.player,goal));
});

test('navigation rebuilds after the map changes and blocked clicks stay safe',()=>{
 const game=scene(),p=game.state.player;Object.assign(p,{x:7.5,z:3});game.move(p,0,-6,.05,4);const old=game._navWorld;
 game.state.map={size:40,obstacles:[{x:7.5,z:0,w:4,d:1,type:'wall'}]};Object.assign(p,{x:7.5,z:3});follow(game,p,{x:7.5,z:-3});
 assert.notEqual(game._navWorld,old);assert.ok(distance(p,{x:7.5,z:-3})<.25);
 follow(game,p,{x:7.5,z:0},100);assert.ok(game.walkable(p.x,p.z));
});
