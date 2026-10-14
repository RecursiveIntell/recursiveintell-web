import test from 'node:test';
import assert from 'node:assert/strict';
import { Game } from '../../public/game/claw/game.js';
import { GameUI } from '../../public/game/claw/ui.js';

test('inventory and forge escape item metadata even if it bypasses save validation', () => {
  const game = new Game();
  game.start();
  const ui = Object.create(GameUI.prototype);
  ui.inventoryFilter = 'all';
  const payload = '<img src=x onerror="window.__clawInjected=true">';
  const item = { ...game.state.equipment.weapon, level: payload, upgrades: payload };
  game.state.inventory = [item];
  game.state.equipment.weapon = item;
  for (const html of [ui.inventoryPanel(game.state), ui.forgePanel(game.state)]) {
    assert.ok(html.includes('&lt;img'), 'The malicious value must be shown as escaped text');
    assert.doesNotMatch(html, /<img\b/i, 'Imported metadata must never create an HTML element');
  }
});
