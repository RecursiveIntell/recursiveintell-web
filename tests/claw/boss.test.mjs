import test from 'node:test';
import assert from 'node:assert/strict';
import { Game } from '../../public/game/claw/game.js';

function arena(chapter = 0, phase = 1) {
  const game = new Game();
  game.start('warden', 'normal');
  game.state.chapter = chapter;
  game.state.mission = 5;
  game.state.map.obstacles = [];
  game.state.player.x = 0;
  game.state.player.z = 0;
  game.state.player.invulnerable = 0;
  game.state.companion.cooldown = 999;
  game.state.objective.killTarget = 1;
  game.state.spawned = 1;
  const boss = { id: 'test-boss', x: 0, z: -4, hp: 10000, maxHp: 10000, damage: 20, speed: 1.25,
    type: 'boss', name: 'Test boss', phase, angle: 0, aggro: true, attackTime: 0, telegraph: 0, cooldown: 0 };
  game.state.enemies = [boss];
  game.state.effects = [];
  return { game, boss };
}

test('the twelve bosses have deterministic distinct patterns with reaction windows', () => {
  const kinds = new Set(), layouts = new Set();
  for (let chapter = 0; chapter < 12; chapter += 1) {
    const { game, boss } = arena(chapter);
    const plan = game.planBossAttack(boss);
    assert.deepEqual(plan, game.planBossAttack(boss));
    kinds.add(plan.kind);
    layouts.add(JSON.stringify(plan.zones));
    assert.ok(plan.zones.length >= 3);
    assert.ok(plan.zones.every(zone => zone.windup >= .9 && zone.radius > 0 && zone.radius <= 2.5));
  }
  assert.equal(kinds.size, 12);
  assert.equal(layouts.size, 12);
});

test('every pending damage zone has the same position, radius, and time as its visible warning', () => {
  for (let chapter = 0; chapter < 12; chapter += 1) {
    const { game, boss } = arena(chapter);
    game.armBossAttack(boss);
    for (const impact of boss.pendingImpacts) {
      const warning = game.state.effects.find(effect => effect.impactId === impact.id);
      assert.ok(warning);
      assert.equal(warning.type, 'telegraph');
      assert.deepEqual([warning.x, warning.z, warning.radius, warning.duration], [impact.x, impact.z, impact.radius, impact.remaining]);
    }
  }
});

test('boss damage never lands before the warning expires and uses the warning boundary', () => {
  const { game, boss } = arena(1);
  game.armBossAttack(boss);
  const hp = game.state.player.hp;
  game.updateBossAttack(boss, 1.09);
  assert.equal(game.state.player.hp, hp);
  game.updateBossAttack(boss, .02);
  assert.ok(game.state.player.hp < hp);
  const outside = arena(1);
  outside.game.armBossAttack(outside.boss);
  outside.game.state.player.x = 1.51;
  outside.game.state.player.z = 1.51;
  const outsideHp = outside.game.state.player.hp;
  outside.game.updateBossAttack(outside.boss, 1.11);
  assert.equal(outside.game.state.player.hp, outsideHp);
});

test('a dodge protects against pending boss impacts and movement escapes fixed target zones', () => {
  const dodging = arena(6);
  dodging.game.armBossAttack(dodging.boss);
  dodging.game.state.player.invulnerable = .65;
  const hp = dodging.game.state.player.hp;
  dodging.game.updateBossAttack(dodging.boss, 1.01);
  assert.equal(dodging.game.state.player.hp, hp);
  const moved = arena(6);
  moved.game.armBossAttack(moved.boss);
  moved.game.state.player.x = 8;
  const movedHp = moved.game.state.player.hp;
  moved.game.updateBossAttack(moved.boss, 2.5);
  assert.equal(moved.game.state.player.hp, movedHp);
});

test('Sam changes attack pattern at both boss phase thresholds', () => {
  const { game, boss } = arena(11);
  game.update(.01);
  assert.equal(boss.phase, 1);
  assert.equal(boss.attackPattern, 'solar');
  boss.pendingImpacts = []; boss.cooldown = 0; boss.hp = 6000;
  game.update(.01);
  assert.equal(boss.phase, 2);
  assert.equal(boss.attackPattern, 'horizon');
  boss.pendingImpacts = []; boss.cooldown = 0; boss.hp = 2500;
  game.update(.01);
  assert.equal(boss.phase, 3);
  assert.equal(boss.attackPattern, 'finale');
});

test('restoring mid-attack recreates visible warnings before dealing damage', () => {
  const { game, boss } = arena(6);
  game.armBossAttack(boss);
  game.updateBossAttack(boss, .95);
  const restored = new Game();
  restored.importSave(game.serialize());
  const restoredBoss = restored.state.enemies[0], hp = restored.state.player.hp;
  assert.equal(restored.state.effects.length, 0);
  restored.update(.05);
  assert.equal(restored.state.player.hp, hp);
  for (const impact of restoredBoss.pendingImpacts) {
    assert.ok(impact.remaining >= .84);
    assert.ok(restored.state.effects.some(effect => effect.impactId === impact.id && effect.type === 'telegraph'));
  }
});

test('normal frame updates resolve telegraphs instead of repeatedly rearming them', () => {
  const { game, boss } = arena(0);
  game.state.player.invulnerable = 10;
  game.update(.05);
  const cast = boss.attackCount;
  for (let frame = 0; frame < 36; frame += 1) game.update(.05);
  assert.equal(boss.attackCount, cast);
  assert.equal(boss.pendingImpacts.length, 0);
  assert.equal(boss.telegraph, 0);
});
