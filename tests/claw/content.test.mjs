import test from 'node:test';
import assert from 'node:assert/strict';
import { CHAPTERS, CAMPAIGN, CLASSES, RARITIES, generateItem, LORE, LEGENDARIES, TALENTS, ACHIEVEMENTS } from '../../public/game/claw/content.js';

test('campaign contains two ordered six-chapter acts and 72 reachable missions', () => {
  assert.equal(CHAPTERS.length, 12);
  assert.deepEqual(CAMPAIGN.acts.flatMap(act => act.chapters), Array.from({ length: 12 }, (_, i) => i));
  const completed = new Set();
  for (const [chapterIndex, chapter] of CHAPTERS.entries()) {
    assert.equal(chapter.missions.length, 6);
    assert.ok(chapter.name && chapter.description && chapter.boss);
    for (const [missionIndex, mission] of chapter.missions.entries()) {
      const index = chapterIndex * 6 + missionIndex;
      const previous = index ? CHAPTERS[Math.floor((index - 1) / 6)].missions[(index - 1) % 6] : null;
      assert.ok(!previous || completed.has(previous.id), `${mission.id} has a reachable predecessor`);
      assert.ok(!completed.has(mission.id), `unique mission ${mission.id}`);
      assert.ok(['clear', 'terminals', 'survive', 'boss'].includes(mission.objectiveType));
      assert.ok(Number.isInteger(mission.killTarget) && mission.killTarget > 0);
      assert.ok(Number.isInteger(mission.terminalTarget) && mission.terminalTarget >= 0);
      assert.ok(Number.isInteger(mission.waves) && mission.waves > 0);
      assert.equal(mission.objectiveType === 'terminals', mission.terminalTarget > 0);
      assert.ok(mission.briefing.length > 80 && mission.description.length > 15);
      assert.ok(mission.reward > 0);
      assert.equal(mission.objectiveType === 'boss', missionIndex === 5);
      completed.add(mission.id);
    }
  }
  assert.equal(completed.size, 72);
  assert.equal(CHAPTERS[0].missions[0].killTarget, 8);
  assert.match(CHAPTERS[5].boss, /Peter Steinberger/);
  assert.match(CHAPTERS[11].boss, /Sam Altman/);
  assert.equal(new Set(CHAPTERS.map(chapter => chapter.boss)).size, 12);
});

test('loot is deterministic and constrained to valid item shapes', () => {
  const fields = ['id', 'name', 'slot', 'rarity', 'color', 'level', 'power', 'armor', 'hp', 'crit', 'description', 'icon', 'sellValue'];
  for (let seed = 0; seed < 1000; seed += 1) {
    const level = seed % 40 + 1;
    const item = generateItem(level, seed);
    assert.deepEqual(item, generateItem(level, seed));
    for (const field of fields) assert.ok(Object.hasOwn(item, field), `missing ${field}`);
    assert.ok(['weapon', 'armor', 'relic'].includes(item.slot));
    assert.ok(RARITIES.some(rarity => rarity.id === item.rarity));
    for (const stat of ['power', 'armor', 'hp', 'crit', 'sellValue']) assert.ok(Number.isFinite(item[stat]) && item[stat] >= 0);
    assert.equal(item.level, level);
    assert.equal(generateItem(level, seed, 'armor').slot, 'armor');
  }
});

test('loot distribution reaches all rarities and offers substantial variety', () => {
  const items = Array.from({ length: 12000 }, (_, seed) => generateItem(20, `distribution-${seed}`));
  assert.deepEqual(new Set(items.map(item => item.rarity)), new Set(RARITIES.map(rarity => rarity.id)));
  assert.ok(new Set(items.map(item => item.name)).size > 2500);
  assert.ok(new Set(items.map(item => item.id)).size > 11990);
  const legendaryNames = new Set(items.filter(item => item.rarity === 'legendary').map(item => item.name));
  assert.equal(legendaryNames.size, LEGENDARIES.length);
  const ordinary = items.filter(item => item.rarity === 'common');
  const legendary = items.filter(item => item.rarity === 'legendary');
  assert.ok(ordinary.length > legendary.length * 8);
});

test('loot inputs are bounded and forced slots are stable', () => {
  for (const level of [undefined, NaN, Infinity, -100, 0, 1.5, 10000]) {
    const item = generateItem(level, 'edge-case', 'relic');
    assert.ok(Number.isInteger(item.level) && item.level >= 1 && item.level <= 100);
    assert.equal(item.slot, 'relic');
    assert.ok(Number.isFinite(item.hp));
  }
  assert.ok(['weapon', 'armor', 'relic'].includes(generateItem(1, 'invalid-slot', '__proto__').slot));
  assert.notDeepEqual(generateItem(1, 'seed', 'weapon'), generateItem(20, 'seed', 'weapon'));
});

test('supporting content has unique identifiers and complete class abilities', () => {
  assert.equal(LORE.length, 24);
  assert.equal(new Set(LORE.map(lore => lore.id)).size, LORE.length);
  assert.equal(new Set(ACHIEVEMENTS.map(achievement => achievement.id)).size, ACHIEVEMENTS.length);
  assert.deepEqual(Object.keys(TALENTS), ['power', 'guard', 'flow']);
  assert.deepEqual(CLASSES.map(character => character.id), ['warden', 'weaver', 'ranger']);
  for (const character of CLASSES) {
    assert.deepEqual(character.abilities.map(ability => ability.key), ['q', 'e', 'r']);
    assert.ok(character.baseHp > 0 && character.baseDamage > 0 && character.baseSpeed > 0);
    for (const ability of character.abilities) assert.ok(ability.cost > 0 && ability.cooldown > 0);
  }
});
