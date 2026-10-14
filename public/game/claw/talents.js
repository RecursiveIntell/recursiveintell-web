export const TALENT_BUDGET = 24;

const node = (id, name, description, effects, tier, parent, iconIndex) => ({
  id, name, description, effects, maxRank: tier === 3 ? 1 : 3, cost: 1,
  level: [2, 5, 9, 15][tier], parent, parentRank: 2, iconIndex,
  exclusiveGroup: tier === 3 ? 'keystone' : null,
});
const branch = (id, name, description, color, definitions, start) => ({
  id, name, description, color,
  nodes: definitions.map(([key, title, text, effects], tier) => node(key, title, text, effects, tier, tier ? definitions[tier - 1][0] : null, start + tier)),
});

export const CLASS_TREES = {
  warden: {
    name: 'The Warden’s Oath', description: 'Turn armor into a weapon, stand behind an unbreakable ward, or survive through the strength of fallen constructs.',
    branches: [
      branch('steel', 'The Crimson Blade', 'Wide cleaves and dangerous conviction.', '#e3a16e', [
        ['w_arc', 'Sweeping Argument', '+0.6 Arc Cleave radius per rank. Reach more constructs with Q.', { qRadiusBonus: .6 }],
        ['w_edge', 'Honed Intent', '+6% damage per rank to attacks and abilities.', { damageMultiplier: .06 }],
        ['w_fury', 'Last Stand', '+12% damage per rank while below 40% health.', { lowHealthDamageBonus: .12 }],
        ['w_blood', 'Unshielded Conviction', 'Keystone: +50% damage, but lose 50% of armor. Excludes the other two keystones.', { damageMultiplier: .5, armorMultiplier: -.5 }],
      ], 0),
      branch('bastion', 'The Living Bastion', 'Block danger and return it to its sender.', '#8db9cf', [
        ['w_plate', 'Layered Shell', '+4 armor per rank.', { armorBonus: 4 }],
        ['w_block', 'Deflection', '+8% chance per rank to completely block a hit.', { blockChance: .08 }],
        ['w_reprise', 'Reprisal', 'A successful block strikes a nearby foe for 20% of your damage per rank.', { retaliate: .2 }],
        ['w_fortress', 'Living Fortress', 'Keystone: +18% block chance and +25% health, but deal 20% less damage.', { blockChance: .18, hpMultiplier: .25, damageMultiplier: -.2 }],
      ], 4),
      branch('renewal', 'The Undying Thread', 'Recover in battle and keep your promise.', '#87cfa9', [
        ['w_vitality', 'Iron Vitality', '+22 maximum health per rank.', { hpBonus: 22 }],
        ['w_second', 'Second Wind', 'Recover 1.2% maximum health per rank whenever you defeat a construct.', { healOnKill: .012 }],
        ['w_aegis', 'Restorative Aegis', 'Aegis Pulse restores an extra 4% maximum health per rank.', { healBonus: .04 }],
        ['w_rally', 'A Promise Kept', 'Keystone: kills restore an extra 4% health and gain +20% armor; abilities cost 15% more focus.', { healOnKill: .04, armorMultiplier: .2, costMultiplier: .15 }],
      ], 8),
    ],
  },
  weaver: {
    name: 'The Weaver’s Paradox', description: 'Build a branching storm, master the economy of focus, or sacrifice safety for spectacular novas.',
    branches: [
      branch('conduction', 'The Forking Storm', 'One idea becomes many bright consequences.', '#7cd8e0', [
        ['v_fork', 'Forked Thought', 'Forked Lightning strikes one additional target per rank.', { qTargets: 1 }],
        ['v_charge', 'Charged Filament', '+10% Forked Lightning damage per rank.', { qDamageMultiplier: .1 }],
        ['v_capacitor', 'Living Capacitor', 'Critical hits restore 4 focus per rank.', { energyOnCrit: 4 }],
        ['v_storm', 'Stormheart', 'Keystone: Q gains three targets and +55% damage; all damage is reduced by 15%.', { qTargets: 3, qDamageMultiplier: .55, damageMultiplier: -.15 }],
      ], 0),
      branch('focus', 'The Clear Mind', 'More spells, fewer empty reserves.', '#c3b6ef', [
        ['v_well', 'Deep Well', '+12 maximum focus per rank.', { energyBonus: 12 }],
        ['v_lucid', 'Lucid Recovery', '+1.1 focus regeneration per second per rank.', { regenBonus: 1.1 }],
        ['v_efficient', 'Elegant Spellwork', 'Abilities cost 7% less focus per rank.', { costMultiplier: -.07 }],
        ['v_overload', 'Overload', 'Keystone: +45% damage, but abilities cost 50% more focus.', { damageMultiplier: .45, costMultiplier: .5 }],
      ], 4),
      branch('collapse', 'The Violet Singularity', 'A beautiful answer with a dangerous price.', '#dd9ade', [
        ['v_horizon', 'Expanding Horizon', '+0.7 Context Collapse radius per rank.', { rRadiusBonus: .7 }],
        ['v_compress', 'Compression', '+12% Context Collapse damage per rank.', { rDamageMultiplier: .12 }],
        ['v_glass', 'Glass Threads', '+3% critical chance per rank.', { critBonus: .03 }],
        ['v_cannon', 'Glass Cannon', 'Keystone: +40% damage, but lose 30% of maximum health.', { damageMultiplier: .4, hpMultiplier: -.3 }],
      ], 8),
    ],
  },
  ranger: {
    name: 'The Ranger’s Trail', description: 'Specialize in precise single-target shots, dancing area attacks, or the loyal companion at your side.',
    branches: [
      branch('precision', 'The Silver Needle', 'Make one shot count.', '#e5c58c', [
        ['r_eye', 'Keen Eye', '+3.5% critical chance per rank.', { critBonus: .035 }],
        ['r_needle', 'Needlepoint', '+20% critical damage multiplier per rank.', { critMultiplier: .2 }],
        ['r_split', 'Split the Thread', 'Basic attacks fire at one extra nearby target per rank for 50% damage.', { basicTargets: 1 }],
        ['r_deadeye', 'Deadeye', 'Keystone: basic attacks and Q hit one target for +70% damage, plus +10% per invested Split the Thread rank. R deals 45% less damage.', { basicDamageMultiplier: .7, qDamageMultiplier: .7, basicTargetsOverride: 1, qTargetsOverride: 1, rDamageMultiplier: -.45, splitConversion: .1 }],
      ], 0),
      branch('motion', 'The Dancing Gale', 'Stay moving and make room for the storm.', '#92b8ed', [
        ['r_trail', 'Trailblazer', '+0.22 movement speed per rank.', { speedBonus: .22 }],
        ['r_ghost', 'Ghost Step', 'Dash cooldown is 12% shorter per rank.', { dashCooldownMultiplier: -.12 }],
        ['r_dodge', 'Between the Frames', 'Dash grants 0.12 seconds more invulnerability per rank.', { dashInvulnerabilityBonus: .12 }],
        ['r_hurricane', 'Hurricane', 'Keystone: basic attacks hit two extra foes; R gains +2 radius and +35% damage; all damage is reduced by 12%.', { basicTargets: 2, rRadiusBonus: 2, rDamageMultiplier: .35, damageMultiplier: -.12 }],
      ], 4),
      branch('bond', 'The Loyal Signal', 'Your companion becomes part of your build.', '#a8d3a0', [
        ['r_bond', 'Bonded Signal', '+35% companion damage per rank.', { companionDamageMultiplier: .35 }],
        ['r_command', 'Quick Commands', 'Companion attack cooldown is 12% shorter per rank.', { companionCooldownMultiplier: -.12 }],
        ['r_shared', 'Shared Triumph', 'Each defeat restores 1% maximum health and 2 focus per rank.', { healOnKill: .01, energyOnKill: 2 }],
        ['r_pack', 'Pack Leader', 'Keystone: companion gains +200% damage and you gain +12% health; your damage is reduced by 15%.', { companionDamageMultiplier: 2, hpMultiplier: .12, damageMultiplier: -.15 }],
      ], 8),
    ],
  },
};

const TALENT_ICONS = {
  w_arc: 0, w_edge: 11, w_fury: 2, w_blood: 11, w_plate: 14, w_block: 1, w_reprise: 14, w_fortress: 1, w_vitality: 4, w_second: 4, w_aegis: 1, w_rally: 4,
  v_fork: 3, v_charge: 3, v_capacitor: 15, v_storm: 3, v_well: 15, v_lucid: 15, v_efficient: 15, v_overload: 3, v_horizon: 5, v_compress: 5, v_glass: 13, v_cannon: 5,
  r_eye: 13, r_needle: 13, r_split: 6, r_deadeye: 6, r_trail: 9, r_ghost: 7, r_dodge: 7, r_hurricane: 8, r_bond: 12, r_command: 12, r_shared: 4, r_pack: 12,
};
for (const tree of Object.values(CLASS_TREES)) for (const branch of tree.branches) for (const talent of branch.nodes) talent.iconIndex = TALENT_ICONS[talent.id];

export const talentNodes = classId => (CLASS_TREES[classId] || CLASS_TREES.warden).branches.flatMap(branch => branch.nodes);
export const spentTalentPoints = state => talentNodes(state.classId).reduce((sum, node) => sum + (state.skills?.[node.id] || 0) * node.cost, 0);

export function talentStatus(state, id) {
  const nodes = talentNodes(state.classId), node = nodes.find(candidate => candidate.id === id), rank = state.skills?.[id] || 0;
  let reason = '';
  if (!node) reason = 'This talent belongs to another constellation.';
  else if (rank >= node.maxRank) reason = 'Mastered';
  else if (state.player.level < node.level) reason = `Requires level ${node.level}`;
  else if (node.parent && (state.skills?.[node.parent] || 0) < node.parentRank) reason = `Requires ${nodes.find(parent => parent.id === node.parent).name} rank ${node.parentRank}`;
  else if (node.exclusiveGroup && nodes.some(other => other.id !== id && other.exclusiveGroup === node.exclusiveGroup && state.skills?.[other.id])) reason = 'Another keystone is active. Respec to change your oath.';
  else if ((state.skillPoints || 0) < node.cost) reason = 'Earn a talent point by leveling up.';
  return { canBuy: !reason, reason, rank, node };
}

export function migrateTalents(state) {
  if (!state.skills || typeof state.skills !== 'object' || Array.isArray(state.skills)) state.skills = {};
  const available = Number(state.skillPoints);
  state.skillPoints = Number.isFinite(available) ? Math.max(0, Math.floor(available)) : 0;
  if (state.talentVersion !== 2) {
    const refund = ['power', 'guard', 'flow'].reduce((sum, key) => {
      const rank = Number(state.skills[key]);
      return sum + (Number.isFinite(rank) ? Math.max(0, Math.floor(rank)) : 0);
    }, 0);
    state.skillPoints += refund;
    state.talentVersion = 2;
  }
  const normalized = { power: 0, guard: 0, flow: 0 };
  let keystone = false;
  for (const node of talentNodes(state.classId)) {
    const raw = Number(state.skills[node.id]);
    const rank = Number.isFinite(raw) ? Math.max(0, Math.min(node.maxRank, Math.floor(raw))) : 0;
    if (!rank) continue;
    if (node.exclusiveGroup && keystone) { state.skillPoints += rank * node.cost; continue; }
    normalized[node.id] = rank;
    if (node.exclusiveGroup) keystone = true;
  }
  state.skills = normalized;
  return state;
}

export function deriveBuild(classId, skills = {}) {
  const build = { damageMultiplier: 1, basicDamageMultiplier: 1, armorMultiplier: 1, hpMultiplier: 1, hpBonus: 0, armorBonus: 0,
    critBonus: 0, critMultiplier: 1.75, speedBonus: 0, energyBonus: 0, regenBonus: 0, costMultiplier: 1,
    dashCooldownMultiplier: 1, dashInvulnerabilityBonus: 0, qRadiusBonus: 0, qDamageMultiplier: 1,
    rRadiusBonus: 0, rDamageMultiplier: 1, healBonus: 0, healOnKill: 0, blockChance: 0, retaliate: 0,
    lowHealthDamageBonus: 0, basicTargets: 1, qTargets: classId === 'warden' ? 99 : 3,
    companionDamageMultiplier: 1, companionCooldownMultiplier: 1, energyOnKill: 0, energyOnCrit: 0, splitConversion: 0 };
  for (const node of talentNodes(classId)) {
    const rank = Math.max(0, Math.min(node.maxRank, Number(skills[node.id]) || 0));
    if (!rank) continue;
    for (const [key, value] of Object.entries(node.effects)) {
      if (key.endsWith('Override')) build[key] = value;
      else build[key] = (build[key] || 0) + value * rank;
    }
  }
  const convertedSplit = Math.max(0, Math.min(3, Number(skills.r_split) || 0)) * build.splitConversion;
  build.basicDamageMultiplier += convertedSplit;
  build.qDamageMultiplier += convertedSplit;
  if (build.basicTargetsOverride) build.basicTargets = build.basicTargetsOverride;
  if (build.qTargetsOverride) build.qTargets = build.qTargetsOverride;
  return build;
}
