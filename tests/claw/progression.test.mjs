import test from 'node:test';
import assert from 'node:assert/strict';
import { Game, SAVE_KEY } from '../../public/game/claw/game.js';
import { CHAPTERS, LORE } from '../../public/game/claw/content.js';
import { TALENT_BUDGET, spentTalentPoints } from '../../public/game/claw/talents.js';

const memory = () => {
  const values = new Map();
  return { getItem: key => values.get(key) || null, setItem: (key, value) => values.set(key, value), removeItem: key => values.delete(key) };
};
const create = (storage = memory()) => {
  const game = new Game({ storage });
  game.start('warden', 'normal');
  return game;
};

test('restoring a death save repeatedly keeps zero HP until checkpoint restart', () => {
  const storage = memory(), game = create(storage);
  game.state.player.invulnerable = 0;
  game.hurt(1e6);
  assert.equal(game.state.player.hp, 0);
  for (let restore = 0; restore < 3; restore += 1) {
    assert.equal(game.continue(), true);
    assert.equal(game.state.phase, 'dead');
    assert.equal(game.state.paused, true);
    assert.equal(game.state.player.hp, 0);
    assert.equal(JSON.parse(storage.getItem(SAVE_KEY)).state.player.hp, 0);
  }
  game.restart();
  assert.equal(game.state.phase, 'playing');
  assert.equal(game.state.player.hp, game.state.player.maxHp);
});

test('legacy dead saves with positive HP remain dead and level gains cannot revive them', () => {
  const game = create(), save = JSON.parse(game.serialize());
  save.state.phase = 'dead';
  save.state.player.hp = 1;
  game.importSave(JSON.stringify(save));
  assert.equal(game.state.phase, 'dead');
  assert.equal(game.state.player.hp, 0);
  game.addXp(game.state.player.xpNext);
  assert.equal(game.state.player.level, 2);
  assert.equal(game.state.player.hp, 0);
});

test('campaign reward progression stays within five levels of chapter guardians', () => {
  const game = create();
  for (let chapter = 0; chapter < CHAPTERS.length; chapter += 1) {
    for (let mission = 0; mission < CHAPTERS[chapter].missions.length; mission += 1) {
      game.loadMission(chapter, mission, false);
      while (game.state.objective.kills < game.state.objective.killTarget) {
        for (const enemy of [...game.state.enemies]) game.hit(enemy, 1e9);
        game.update(0.01);
      }
      for (const terminal of game.state.objects.filter(object => object.type === 'terminal')) {
        game.state.player.x = terminal.x;
        game.state.player.z = terminal.z;
        game.interact();
      }
      if (mission === 0 || mission === 3) {
        const archive = game.state.objects.find(object => object.type === 'lore');
        game.state.player.x = archive.x;
        game.state.player.z = archive.z;
        game.interact();
      }
      game.checkComplete();
      assert.equal(game.state.objective.complete, true);
    }
    const guardianLevel = chapter * 4 + 3;
    assert.ok(Math.abs(game.state.player.level - guardianLevel) <= 5,
      `chapter ${chapter + 1}: player ${game.state.player.level}, guardian ${guardianLevel}`);
    assert.ok(game.state.skillPoints <= 36);
  }
  assert.ok(game.state.player.level >= 43 && game.state.player.level <= 50);
});

test('talent awards stop at the class-tree budget including purchased ranks', () => {
  const game = create();
  game.state.player.level = 35;
  game.state.skills = { power: 0, guard: 0, flow: 0, w_arc: 3, w_edge: 3, w_fury: 3 };
  game.state.skillPoints = 13;
  game.recalculate();
  game.addXp(1e6);
  assert.equal(game.state.player.level, 60);
  assert.equal(game.state.skillPoints + spentTalentPoints(game.state), TALENT_BUDGET);
  game.respec();
  assert.equal(game.state.skillPoints, TALENT_BUDGET);
  game.addXp(1e6);
  assert.equal(game.state.skillPoints, TALENT_BUDGET);
});

test('older saves preserve and refund every legacy talent point', () => {
  const game = create(), save = JSON.parse(game.serialize());
  save.state.skills = { power: 12, guard: 8, flow: 4 };
  delete save.state.talentVersion;
  save.state.skillPoints = 40;
  game.importSave(JSON.stringify(save));
  assert.equal(game.state.skillPoints, 64);
});

test('each chapter reveals only its own two lore fragments without early ending spoilers', () => {
  const game = create();
  for (let chapter = 0; chapter < CHAPTERS.length; chapter += 1) {
    for (let mission = 0; mission < 6; mission += 1) {
      game.loadMission(chapter, mission, false);
      const archive = game.state.objects.find(object => object.type === 'lore');
      game.state.player.x = archive.x;
      game.state.player.z = archive.z;
      game.interact();
      const expectedCount = chapter * 2 + (mission >= 3 ? 2 : 1);
      assert.equal(game.state.discoveredLore.length, expectedCount);
      assert.deepEqual(game.state.discoveredLore, LORE.slice(0, expectedCount).map(fragment => fragment.id));
    }
  }
  assert.equal(game.state.discoveredLore.length, 24);
});
