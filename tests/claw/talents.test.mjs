import test from 'node:test';
import assert from 'node:assert/strict';
import { Game } from '../../public/game/claw/game.js';
import { CLASS_TREES, TALENT_BUDGET, talentNodes, talentStatus, spentTalentPoints } from '../../public/game/claw/talents.js';
import { GameUI } from '../../public/game/claw/ui.js';

function create(classId = 'warden', skills = {}) {
  const game = new Game();
  game.start(classId, 'normal');
  game.state.player.level = 20;
  game.state.skills = { power: 0, guard: 0, flow: 0, ...skills };
  game.recalculate(true);
  game.state.player.x = 0; game.state.player.z = 0; game.state.player.invulnerable = 0;
  game.state.map.obstacles = [];
  game.state.enemies = [];
  game.random = () => .99;
  return game;
}
const foe = (x = 1, z = 0) => ({ id: `foe-${x}-${z}`, x, z, hp: 10000, maxHp: 10000, type: 'claw', level: 1, damage: 0, speed: 0, cooldown: 999, attackTime: 0, telegraph: 0, aggro: false });

test('each class has twelve distinct talents across three prerequisite branches', () => {
  const ids = new Set();
  for (const classId of Object.keys(CLASS_TREES)) {
    assert.equal(CLASS_TREES[classId].branches.length, 3);
    assert.equal(talentNodes(classId).length, 12);
    assert.equal(talentNodes(classId).filter(node => node.exclusiveGroup).length, 3);
    for (const branch of CLASS_TREES[classId].branches) {
      assert.equal(branch.nodes.length, 4);
      for (const [index, node] of branch.nodes.entries()) {
        assert.ok(!ids.has(node.id)); ids.add(node.id);
        assert.equal(node.parent, index ? branch.nodes[index - 1].id : null);
        assert.ok(Object.keys(node.effects).length > 0);
      }
    }
  }
});

test('purchases enforce class, level, rank prerequisites, maximum ranks, and point cost', () => {
  const game = create(); game.state.skillPoints = 10; game.state.player.level = 1;
  assert.equal(game.talent('w_arc'), false);
  game.state.player.level = 2;
  assert.equal(game.talent('w_arc'), true);
  assert.equal(game.state.skillPoints, 9);
  assert.equal(game.talent('w_edge'), false);
  game.state.player.level = 5;
  assert.equal(game.talent('w_edge'), false);
  game.talent('w_arc');
  assert.equal(game.talent('w_edge'), true);
  assert.equal(game.talent('r_eye'), false);
  game.talent('w_arc');
  assert.equal(game.talent('w_arc'), false);
  assert.match(talentStatus(game.state, 'w_arc').reason, /Mastered/);
});

test('keystones are mutually exclusive and free respec refunds every purchased point', () => {
  const game = create(); game.state.skillPoints = 24;
  for (const id of ['w_arc', 'w_edge', 'w_fury', 'w_plate', 'w_block', 'w_reprise']) {
    assert.equal(game.talent(id), true); assert.equal(game.talent(id), true);
  }
  assert.equal(game.talent('w_blood'), true);
  assert.equal(game.talent('w_fortress'), false);
  assert.match(talentStatus(game.state, 'w_fortress').reason, /Another keystone/);
  const spent = spentTalentPoints(game.state);
  assert.equal(game.respec(), spent);
  assert.equal(game.state.skillPoints, 24);
  assert.equal(spentTalentPoints(game.state), 0);
  assert.equal(game.state.player.build.damageMultiplier, 1);
});

test('legacy flat-tree saves refund investment without losing points and migrate once', () => {
  const legacy = JSON.parse(create().serialize());
  delete legacy.state.talentVersion;
  legacy.state.skills = { power: 12, guard: 8, flow: 6 };
  legacy.state.skillPoints = 10;
  const restored = new Game(); restored.importSave(JSON.stringify(legacy));
  assert.equal(restored.state.skillPoints, 36);
  assert.deepEqual(restored.state.skills, { power: 0, guard: 0, flow: 0 });
  restored.importSave(restored.serialize());
  assert.equal(restored.state.skillPoints, 36);
  assert.equal(restored.state.talentVersion, 2);
});

test('new talent investments and derived effects survive save restoration', () => {
  const game = create('weaver'); game.state.skillPoints = 4;
  game.talent('v_well'); game.talent('v_well'); game.talent('v_lucid');
  const restored = new Game(); restored.importSave(game.serialize());
  assert.deepEqual(restored.state.skills, game.state.skills);
  assert.equal(restored.state.skillPoints, 1);
  assert.equal(restored.state.player.maxEnergy, 124);
  assert.equal(restored.state.player.build.regenBonus, 1.1);
});

test('malformed imported ranks are bounded and duplicate keystones are safely refunded', () => {
  const save = JSON.parse(create().serialize());
  save.state.skills = { w_arc: 999, w_edge: -3, w_plate: 'bad', w_blood: 1, w_fortress: 1, r_eye: 3 };
  save.state.skillPoints = 2;
  const restored = new Game(); restored.importSave(JSON.stringify(save));
  assert.equal(restored.state.skills.w_arc, 3);
  assert.equal(restored.state.skills.w_edge, undefined);
  assert.equal(restored.state.skills.w_plate, undefined);
  assert.equal(restored.state.skills.r_eye, undefined);
  assert.equal(restored.state.skills.w_blood, 1);
  assert.equal(restored.state.skills.w_fortress, undefined);
  assert.equal(restored.state.skillPoints, 3);
  assert.ok(Number.isFinite(restored.state.player.damage));
  assert.ok(Number.isFinite(restored.state.player.maxHp));
});

test('Warden cleave radius and damage-versus-armor keystone alter actual combat stats', () => {
  const base = create(), wide = create('warden', { w_arc: 2 });
  for (const game of [base, wide]) { game.state.enemies = [foe(6)]; game.action('q'); }
  assert.equal(base.state.enemies[0].hp, 10000);
  assert.ok(wide.state.enemies[0].hp < 10000);
  const blood = create('warden', { w_blood: 1 });
  assert.ok(blood.state.player.damage > base.state.player.damage * 1.45);
  assert.ok(blood.state.player.armor < base.state.player.armor * .6);
});

test('Warden blocks retaliate, low-health strikes strengthen, and kills restore health', () => {
  const block = create('warden', { w_block: 3, w_reprise: 3 });
  block.state.enemies = [foe()]; block.random = () => 0;
  const hp = block.state.player.hp; block.hurt(100);
  assert.equal(block.state.player.hp, hp);
  assert.ok(block.state.enemies[0].hp < 10000);
  const fury = create('warden', { w_fury: 3, w_second: 3 });
  fury.state.player.hp = fury.state.player.maxHp * .2;
  const target = foe(); fury.hit(target, 100);
  assert.equal(10000 - target.hp, 136);
  const before = fury.state.player.hp;
  fury.kill({ ...foe(), hp: 0 });
  assert.ok(fury.state.player.hp > before);
});

test('Weaver branches change target count, focus cost, regeneration, and nova damage', () => {
  const plain = create('weaver'), storm = create('weaver', { v_fork: 3, v_efficient: 3, v_lucid: 3, v_horizon: 3, v_compress: 3 });
  for (const game of [plain, storm]) {
    game.state.enemies = Array.from({ length: 6 }, (_, i) => foe(1 + i));
    game.action('q');
  }
  assert.equal(plain.state.enemies.filter(enemy => enemy.hp < 10000).length, 3);
  assert.equal(storm.state.enemies.filter(enemy => enemy.hp < 10000).length, 6);
  assert.ok(storm.state.player.energy > plain.state.player.energy);
  for (const game of [plain, storm]) { game.state.enemies = [foe(10)]; game.state.player.energy = 100; game.action('r'); }
  assert.equal(plain.state.enemies[0].hp, 10000);
  assert.ok(storm.state.enemies[0].hp < 10000);
  plain.state.enemies = []; storm.state.enemies = [];
  plain.state.player.energy = 0; storm.state.player.energy = 0;
  plain.update(.05); storm.update(.05);
  assert.ok(storm.state.player.energy > plain.state.player.energy);
});

test('Weaver keystones have real health and focus tradeoffs', () => {
  const base = create('weaver'), glass = create('weaver', { v_cannon: 1 }), overload = create('weaver', { v_overload: 1 });
  assert.ok(glass.state.player.maxHp < base.state.player.maxHp * .71);
  assert.ok(glass.state.player.damage > base.state.player.damage * 1.35);
  base.action('q'); overload.action('q');
  assert.ok(overload.state.player.energy < base.state.player.energy);
});

test('Ranger multishot and Deadeye choose between target coverage and focused damage', () => {
  const spread = create('ranger', { r_split: 3 }), focused = create('ranger', { r_split: 3, r_deadeye: 1 });
  for (const game of [spread, focused]) { game.state.enemies = [foe(1), foe(2), foe(3), foe(4)]; game.action('attack'); }
  assert.equal(spread.state.enemies.filter(enemy => enemy.hp < 10000).length, 4);
  assert.equal(focused.state.enemies.filter(enemy => enemy.hp < 10000).length, 1);
  assert.ok(focused.state.enemies[0].hp < spread.state.enemies[0].hp);
  assert.equal(focused.state.player.build.basicDamageMultiplier, 2);
  assert.equal(focused.state.player.build.qDamageMultiplier, 2);
});

test('Deadeye converts each multishot rank into additional basic and Q damage', () => {
  const two = create('ranger', { r_split: 2, r_deadeye: 1 }), three = create('ranger', { r_split: 3, r_deadeye: 1 });
  for (const game of [two, three]) { game.state.enemies = [foe(1), foe(2)]; game.action('attack'); }
  assert.ok(three.state.enemies[0].hp < two.state.enemies[0].hp);
  for (const game of [two, three]) {
    assert.equal(game.state.enemies[1].hp, 10000);
    game.state.enemies = [foe(1), foe(2)];
    game.action('q');
    assert.equal(game.state.enemies[1].hp, 10000);
  }
  assert.ok(three.state.enemies[0].hp < two.state.enemies[0].hp);
});

test('purchasing health talents and respeccing preserve health ratio without free healing', () => {
  for (const [classId, path, keystone] of [
    ['weaver', ['v_horizon', 'v_compress', 'v_glass'], 'v_cannon'],
    ['warden', [], 'w_vitality'],
  ]) {
    const game = create(classId); game.state.skillPoints = 7;
    for (const id of path) { game.talent(id); game.talent(id); }
    const maximum = game.state.player.maxHp;
    game.state.player.hp = 1;
    const ratio = game.state.player.hp / maximum;
    game.talent(keystone);
    assert.ok(Math.abs(game.state.player.hp / game.state.player.maxHp - ratio) < 1e-12);
    game.respec();
    assert.ok(Math.abs(game.state.player.hp - 1) < 1e-10);
    assert.equal(game.state.player.maxHp, maximum);
  }
});

test('health equipment changes preserve injury percentage while level-up still restores health', () => {
  const game = create();
  game.state.player.hp = game.state.player.maxHp * .2;
  const armor = { ...game.state.equipment.armor, id: 'ratio-armor', hp: 250 };
  game.state.inventory.push(armor);
  game.equip(armor.id);
  assert.ok(Math.abs(game.state.player.hp / game.state.player.maxHp - .2) < 1e-12);
  game.state.player.gold = 1000; game.state.player.shards = 100;
  game.upgrade('armor');
  assert.ok(Math.abs(game.state.player.hp / game.state.player.maxHp - .2) < 1e-12);
  game.addXp(game.state.player.xpNext);
  assert.equal(game.state.player.hp, game.state.player.maxHp);
});

test('Ranger mobility, criticals, and companion investment affect gameplay', () => {
  const base = create('ranger'), talented = create('ranger', { r_trail: 3, r_ghost: 3, r_dodge: 3, r_eye: 3, r_needle: 3, r_bond: 3, r_command: 3 });
  assert.ok(talented.state.player.speed > base.state.player.speed);
  assert.ok(talented.state.player.crit > base.state.player.crit);
  for (const game of [base, talented]) game.action('dash');
  assert.ok(talented.state.cooldowns.dash < base.state.cooldowns.dash);
  assert.ok(talented.state.player.invulnerable > base.state.player.invulnerable);
  for (const game of [base, talented]) {
    game.state.player.x = 0; game.state.player.z = 0; game.state.companion.x = 1; game.state.companion.z = 0;
    game.state.enemies = [foe(2)]; game.state.companion.cooldown = 0; game.update(.05);
  }
  assert.ok(talented.state.enemies[0].hp < base.state.enemies[0].hp);
  assert.ok(talented.state.companion.cooldown < base.state.companion.cooldown);
});

test('skill UI renders class-specific nodes, lock reasons, atlas art, and free respec', () => {
  const game = create('weaver'); game.state.skillPoints = 2;
  const html = GameUI.prototype.skillsPanel(game.state);
  assert.equal((html.match(/data-talent-node=/g) || []).length, 12);
  assert.match(html, /The Weaver/);
  assert.match(html, /Requires Forked Thought rank 2/);
  assert.match(html, /data-respec="true"/);
  assert.match(html, /data-skill-icon=/);
  assert.doesNotMatch(html, /data-talent="power"/);
  assert.equal(TALENT_BUDGET, 24);
});
