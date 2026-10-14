import test from 'node:test';
import assert from 'node:assert/strict';
import {Game,SAVE_KEY} from '../../public/game/claw/game.js';
import {startCampaign,REPLACE_CAMPAIGN_MESSAGE} from '../../public/game/claw/start-campaign.js';

function setup({existing=false,accept=false}={}){
 const data=new Map();
 let writes=0;
 const storage={getItem:key=>data.get(key)??null,setItem:(key,value)=>{writes++;data.set(key,value);}};
 if(existing){const prior=new Game({storage});prior.start('ranger','veteran');prior.state.player.gold=917;prior.save();}
 const game=new Game({storage});
 const calls=[];
 const sound={start:()=>calls.push('audio-start'),configure:settings=>calls.push(['audio-configure',settings])};
 const ui={update:state=>calls.push(['ui-update',state])};
 const confirmOverwrite=message=>{calls.push(['confirm',message]);return accept;};
 return {game,storage,calls,dependencies:{game,sound,ui,confirmOverwrite},writes:()=>writes};
}

test('canceling a replacement leaves the saved campaign, runtime, audio, and UI untouched',()=>{
 const context=setup({existing:true});
 const beforeSave=context.storage.getItem(SAVE_KEY),beforeState=structuredClone(context.game.state),stateIdentity=context.game.state,beforeWrites=context.writes();
 assert.equal(startCampaign(context.dependencies,'weaver','story'),false);
 assert.equal(context.storage.getItem(SAVE_KEY),beforeSave);
 assert.equal(context.writes(),beforeWrites);
 assert.equal(context.game.state,stateIdentity);
 assert.deepEqual(context.game.state,beforeState);
 assert.deepEqual(context.calls,[['confirm',REPLACE_CAMPAIGN_MESSAGE]]);
 assert.match(REPLACE_CAMPAIGN_MESSAGE,/replace your existing saved campaign/);
 assert.match(REPLACE_CAMPAIGN_MESSAGE,/export it from Settings/);
});

test('accepting a replacement starts and saves the chosen campaign only after confirmation',()=>{
 const context=setup({existing:true,accept:true});
 const beforeSave=context.storage.getItem(SAVE_KEY),beforeWrites=context.writes();
 assert.equal(startCampaign(context.dependencies,'weaver','story'),true);
 assert.equal(context.game.state.phase,'playing');
 assert.equal(context.game.state.classId,'weaver');
 assert.equal(context.game.state.difficulty,'story');
 assert.equal(context.writes(),beforeWrites+1);
 assert.notEqual(context.storage.getItem(SAVE_KEY),beforeSave);
 assert.deepEqual(context.calls.map(call=>Array.isArray(call)?call[0]:call),['confirm','audio-start','audio-configure','ui-update']);
 const restored=new Game({storage:context.storage});
 assert.equal(restored.continue(),true);
 assert.equal(restored.state.classId,'weaver');
 assert.equal(restored.state.difficulty,'story');
});

test('a first campaign starts without showing a replacement dialog',()=>{
 const context=setup();
 assert.equal(startCampaign(context.dependencies,'warden','normal'),true);
 assert.equal(context.game.state.phase,'playing');
 assert.equal(context.game.state.classId,'warden');
 assert.equal(context.game.hasSave(),true);
 assert.equal(context.writes(),1);
 assert.deepEqual(context.calls.map(call=>Array.isArray(call)?call[0]:call),['audio-start','audio-configure','ui-update']);
});

test('replacement detection checks current storage instead of a stale title flag',()=>{
 const context=setup();
 const otherSession=new Game({storage:context.storage});
 otherSession.start('ranger','normal');
 assert.equal(context.game.state.saveExists,false);
 const beforeSave=context.storage.getItem(SAVE_KEY);
 assert.equal(startCampaign(context.dependencies,'weaver','story'),false);
 assert.equal(context.storage.getItem(SAVE_KEY),beforeSave);
 assert.deepEqual(context.calls,[['confirm',REPLACE_CAMPAIGN_MESSAGE]]);
});

test('the original campaign can still continue after canceling a new campaign',()=>{
 const context=setup({existing:true});
 assert.equal(startCampaign(context.dependencies,'weaver','story'),false);
 assert.equal(context.game.continue(),true);
 assert.equal(context.game.state.classId,'ranger');
 assert.equal(context.game.state.difficulty,'veteran');
 assert.equal(context.game.state.player.gold,917);
 assert.deepEqual(context.calls,[['confirm',REPLACE_CAMPAIGN_MESSAGE]]);
});
