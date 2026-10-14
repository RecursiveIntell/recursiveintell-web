import test from 'node:test';
import assert from 'node:assert/strict';
import { Game, SAVE_KEY } from '../../public/game/claw/game.js';
import { CHAPTERS, CLASSES, generateItem } from '../../public/game/claw/content.js';

function harness() {
  const values = new Map(); let loads = 0;
  const game = new Game({
    storage: { getItem: key => values.get(key), setItem: (key, value) => values.set(key, value) },
    onLoad: () => loads++,
  });
  game.start();
  return { game, values, loads: () => loads };
}

function rejectsWithoutMutation(mutate) {
  const h = harness(), save = JSON.parse(h.game.serialize());
  const previous = h.game.state, snapshot = JSON.stringify(previous), stored = h.values.get(SAVE_KEY), loads = h.loads();
  mutate(save.state);
  assert.throws(() => h.game.importSave(JSON.stringify(save)), /save|data/i);
  assert.equal(h.game.state, previous);
  assert.equal(JSON.stringify(h.game.state), snapshot);
  assert.equal(h.values.get(SAVE_KEY), stored);
  assert.equal(h.loads(), loads, 'Rejected data must not reach the renderer');
}

test('HTML in item levels and upgrades is rejected in equipment, inventory and dropped loot before render', () => {
  const payload = '<img src=x onerror=globalThis.clawImportExecuted=true>';
  for (const field of ['level', 'upgrades']) {
    for (const location of ['equipment', 'inventory', 'drops']) {
      rejectsWithoutMutation(state => {
        const item = { ...state.equipment.weapon, [field]: payload };
        if (location === 'equipment') state.equipment.weapon = item;
        if (location === 'inventory') state.inventory = [item];
        if (location === 'drops') state.drops = [{ id: 'drop-security', x: 0, z: 0, item }];
      });
    }
  }
});

test('save import bounds renderer map loops and world allocations', () => {
  for (const size of [1e8, -40, 0, 64.5, '40', null]) rejectsWithoutMutation(s => { s.map.size = size; });
  rejectsWithoutMutation(s => { s.map.obstacles = Array.from({ length: 129 }, () => s.map.obstacles[0]); });
  rejectsWithoutMutation(s => { s.enemies = Array.from({ length: 65 }, (_, i) => ({ ...s.enemies[0], id: `enemy-${i}` })); });
  rejectsWithoutMutation(s => { s.inventory = Array.from({ length: 121 }, () => s.equipment.weapon); });
  rejectsWithoutMutation(s => { s.drops = Array.from({ length: 129 }, (_, i) => ({ id: `drop-${i}`, x: 0, z: 0, item: s.equipment.weapon })); });
});

test('malformed nested world, numeric, enum, text and setting data is rejected atomically', () => {
  const mutations = [
    s => { s.map.obstacles[0].w = 1e9; },
    s => { s.map.obstacles[0].x = -1e9; },
    s => { s.map.obstacles[0].type = 'unknown'; },
    s => { s.player.x = 1e9; },
    s => { s.player.level = 1.5; },
    s => { s.player.angle = 'north'; },
    s => { s.companion = null; },
    s => { s.enemies[0].type = 'unknown'; },
    s => { s.enemies[0].maxHp = null; },
    s => { s.enemies[0].name = '<svg onload=alert(1)>'; },
    s => { s.enemies[0].id = 'enemy" onclick="alert(1)'; },
    s => { s.objects[0].active = 'yes'; },
    s => { s.objects = []; },
    s => { s.equipment.weapon.power = '999'; },
    s => { s.equipment.weapon.hp = -10; },
    s => { s.equipment.weapon.rarity = 'infinite'; },
    s => { s.equipment.weapon.color = 'red;background:url(https://example.test)'; },
    s => { s.equipment.weapon.slot = 'relic'; },
    s => { s.equipment.weapon.upgrades = 11; },
    s => { s.drops = [null]; },
    s => { s.settings.sound = {}; },
    s => { s.settings.music = 'false'; },
    s => { s.cooldowns.q = null; },
    s => { s.objective.killTarget = 1e9; },
    s => { s.objective.complete = []; },
    s => { s.skills.w_arc = {}; },
    s => { s.discoveredLore = ['unknown']; },
    s => { s.completedMissions = ['unknown']; },
    s => { s.log = [{}]; },
    s => { s.extra = JSON.parse('{"__proto__":{"polluted":true}}'); },
  ];
  mutations.forEach(rejectsWithoutMutation);
});

test('boss pending impacts validate geometry, time, colors and collection size', () => {
  const impact = { id: 'impact-1', x: 0, z: 0, radius: 2, remaining: 1, damage: 20, color: '#f17760' };
  for (const bad of [{ radius: 1e9 }, { x: '0' }, { remaining: -1 }, { damage: null }, { color: '<img>' }]) {
    rejectsWithoutMutation(s => { s.enemies[0].type = 'boss'; s.enemies[0].pendingImpacts = [{ ...impact, ...bad }]; });
  }
  rejectsWithoutMutation(s => { s.enemies[0].type = 'boss'; s.enemies[0].pendingImpacts = Array(17).fill(impact); });
});

test('all authored missions and classes retain valid v1 save compatibility, including upgraded loot', () => {
  for (const classInfo of CLASSES) {
    const { game } = harness(); game.start(classInfo.id, 'veteran');
    for (let chapter = 0; chapter < CHAPTERS.length; chapter++) {
      for (let mission = 0; mission < CHAPTERS[chapter].missions.length; mission++) {
        game.loadMission(chapter, mission, false);
        game.state.inventory = [generateItem(100, chapter * 100 + mission)];
        game.state.equipment.weapon.upgrades = 10;
        const save = game.serialize(), restored = new Game();
        restored.importSave(save);
        assert.equal(restored.state.chapter, chapter);
        assert.equal(restored.state.mission, mission);
        assert.equal(restored.state.classId, classInfo.id);
        assert.deepEqual(restored.state.inventory, game.state.inventory);
        assert.equal(restored.state.equipment.weapon.upgrades, 10);
      }
    }
  }
});

test('new expeditions preserve title-screen sound, music, particle and shake preferences', () => {
  const { game, values } = harness();
  const settings = { sound: false, music: false, particles: false, shake: false };
  game.state.settings = { ...settings };
  game.start('weaver', 'story');
  assert.deepEqual(game.state.settings, settings);
  assert.deepEqual(JSON.parse(values.get(SAVE_KEY)).state.settings, settings);
  assert.equal(game.state.classId, 'weaver');
  assert.equal(game.state.difficulty, 'story');
});

test('all twelve boss patterns and in-progress ordinary attacks can be restored', () => {
  for (let chapter = 0; chapter < CHAPTERS.length; chapter++) {
    const { game } = harness(); game.loadMission(chapter, 5, false);
    const boss = game.state.enemies[0]; boss.type = 'boss'; boss.aggro = true;
    game.armBossAttack(boss);
    const restored = new Game(); restored.importSave(game.serialize());
    assert.deepEqual(restored.state.enemies[0].pendingImpacts, boss.pendingImpacts);
    restored.update(.01);
    assert.ok(restored.state.effects.some(effect => effect.type === 'telegraph'));
  }
  const { game } = harness(), enemy = game.state.enemies[0];
  enemy.x = game.state.player.x; enemy.z = game.state.player.z - 1;
  enemy.aggro = true; enemy.cooldown = 0;
  for (let frame = 0; frame < 25; frame++) {
    game.update(.05);
    const restored = new Game();
    assert.doesNotThrow(() => restored.importSave(game.serialize()));
  }
});

test('the parser rejects oversized and deeply nested input before loading state', () => {
  assert.throws(() => Game.parseSave(' '.repeat(5000001)), /5 MB/);
  rejectsWithoutMutation(s => { let nested = {}; s.extra = nested; for (let i = 0; i < 15; i++) { nested.child = {}; nested = nested.child; } });
});

test('a lethal boss impact autosave restores even when written before expired zones are removed', () => {
  const { game, values } = harness();
  game.loadMission(11, 5, false);
  const boss = game.state.enemies[0]; boss.type = 'boss'; boss.aggro = true;
  game.armBossAttack(boss);
  const impact = boss.pendingImpacts[0];
  game.state.player.hp = 1;
  game.state.player.invulnerable = 0;
  game.state.player.x = impact.x;
  game.state.player.z = impact.z;
  impact.remaining = .01;
  game.updateBossAttack(boss, .05);

  const autosave = JSON.parse(values.get(SAVE_KEY));
  assert.equal(autosave.state.phase, 'dead');
  assert.equal(autosave.state.player.hp, 0);
  const savedImpact = autosave.state.enemies[0].pendingImpacts.find(zone => zone.id === impact.id);
  assert.ok(savedImpact.remaining < 0 && savedImpact.remaining > -.1,
    'Exercise the actual death autosave written inside hurt(), before impact cleanup');

  assert.equal(game.continue(), true);
  assert.equal(game.state.phase, 'dead');
  assert.equal(game.state.player.hp, 0);
  assert.ok(!game.state.enemies[0].pendingImpacts.some(zone => zone.id === impact.id));
  assert.ok(game.state.enemies[0].pendingImpacts.every(zone => zone.remaining > 0));
  const health = game.state.player.hp;
  game.update(.05);
  assert.equal(game.state.player.hp, health);
  game.restart();
  assert.equal(game.state.phase, 'playing');
  assert.equal(game.state.player.hp, game.state.player.maxHp);
});
