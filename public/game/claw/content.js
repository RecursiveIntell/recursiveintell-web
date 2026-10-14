/**
 * RecursiveIntell goes to OpenAI
 * A work of playful fiction. Locations, dialogue, machines, and events are invented.
 * Peter and Sam appear as theatrical holograms piloting fantastical boss machines.
 * Combat disables constructs with light; nobody is physically harmed.
 */

export const CAMPAIGN = Object.freeze({
  title: 'RecursiveIntell goes to OpenAI',
  subtitle: 'A very unauthorized office adventure',
  acts: [
    { id: 'the-claw', name: 'The Claw', chapters: [0, 1, 2, 3, 4, 5] },
    { id: 'closed-garden', name: 'The Closed Garden', chapters: [6, 7, 8, 9, 10, 11] },
  ],
  intendedCampaignHours: [10, 12],
  durationNote: 'Design target only; actual playtime varies and has not been playtested to ten hours.',
  premise: 'A runaway scheduling spell has trapped the world in an endless product launch. Lead a tiny RecursiveIntell expedition through two impossible campuses, recover the twelve Release Keys, and give everyone their weekend back.',
  fictionNotice: 'Unofficial affectionate satire. Fictional fantasy campuses, theatrical hologram bosses, and harmless construct combat. Not affiliated with OpenClaw, OpenAI, Peter Steinberger, or Sam Altman.',
});

export const CLASSES = [
  {
    id: 'warden', name: 'The Warden', subtitle: 'Steel. Resolve. Unreasonable uptime.',
    description: 'A resilient frontline guardian. Heavy sweeping strikes and restorative wards make the Warden a forgiving first expedition.',
    color: '#eab86b', baseHp: 180, baseDamage: 19, baseArmor: 9, baseSpeed: 5.5,
    weapon: 'Semaphore Greatsword',
    abilities: [
      { key: 'q', name: 'Arc Cleave', description: 'Cut a luminous arc through nearby constructs. Best when surrounded.', cooldown: 5, cost: 20, icon: '⚔' },
      { key: 'e', name: 'Aegis Pulse', description: 'Reinforce your ward and recover health in the middle of a fight.', cooldown: 12, cost: 28, icon: '✚' },
      { key: 'r', name: 'Recursive Quake', description: 'Slam the ground with a cascading shockwave that strikes the whole nearby pack.', cooldown: 24, cost: 48, icon: '◈' },
    ],
  },
  {
    id: 'weaver', name: 'The Weaver', subtitle: 'Bend the context. Break the loop.',
    description: 'A ranged arcanist who turns unstable context into lightning. Fragile, brilliant, and exceptionally good at clearing a crowded server room.',
    color: '#70dfd3', baseHp: 120, baseDamage: 24, baseArmor: 3, baseSpeed: 5.8,
    weapon: 'Context Spindle',
    abilities: [
      { key: 'q', name: 'Forked Lightning', description: 'Release concentrated energy at hostile constructs ahead of you.', cooldown: 4, cost: 18, icon: 'ϟ' },
      { key: 'e', name: 'Restore Point', description: 'Weave a restorative pulse and recover lost health.', cooldown: 11, cost: 25, icon: '✧' },
      { key: 'r', name: 'Context Collapse', description: 'Compress your surrounding context into an explosive nova of harmless light.', cooldown: 22, cost: 50, icon: '◎' },
    ],
  },
  {
    id: 'ranger', name: 'The Ranger', subtitle: 'Find the thread. Follow it home.',
    description: 'A quick expedition scout with precise ranged attacks. Keep moving, draw constructs into a group, and let the swarm do the paperwork.',
    color: '#b5caff', baseHp: 145, baseDamage: 21, baseArmor: 5, baseSpeed: 6.5,
    weapon: 'Threadrunner Bow',
    abilities: [
      { key: 'q', name: 'Threadshot', description: 'Fire a charged shot into the nearest threat.', cooldown: 4, cost: 16, icon: '➶' },
      { key: 'e', name: 'Ghost Process', description: 'Slip away from danger in a restorative burst.', cooldown: 10, cost: 24, icon: '◇' },
      { key: 'r', name: 'Swarm Protocol', description: 'Call down a cloud of luminous helpers on nearby constructs.', cooldown: 23, cost: 46, icon: '✺' },
    ],
  },
];

export const RARITIES = [
  { id: 'common', name: 'Common', color: '#c2ccc7', multiplier: 1 },
  { id: 'uncommon', name: 'Uncommon', color: '#77d79e', multiplier: 1.22 },
  { id: 'rare', name: 'Rare', color: '#73baff', multiplier: 1.55 },
  { id: 'epic', name: 'Epic', color: '#bf91ff', multiplier: 1.95 },
  { id: 'legendary', name: 'Legendary', color: '#ffc66e', multiplier: 2.45 },
];

const mission = (id, title, objectiveType, killTarget, terminalTarget, waves, description, briefing, reward) => ({
  id, title, objectiveType, killTarget, terminalTarget, waves, description, briefing, reward,
});

export const CHAPTERS = [
  {
    id: 'arrival', name: 'The Copper Approach', subtitle: 'Act I · The Claw · Chapter 1',
    theme: 'courtyard', color: '#d68c54', boss: 'The Receptionist, Mark IV',
    description: 'Lanterns hang above a copper causeway. At its far end, the OpenClaw fortress clicks and clatters like an enormous, delighted lobster.',
    missions: [
      mission('arrival-1', 'An Appointment with Adventure', 'clear', 8, 0, 1,
        'Disable 8 patrol constructs, then use the exit portal.',
        'Nori: “Welcome to the OpenClaw fortress! WASD moves, Space attacks, and Q makes a memorable first impression. Those little copper claws are training constructs. Introduce yourself, preferably with light.”', 100),
      mission('arrival-2', 'Visitor Badge Required', 'terminals', 12, 2, 2,
        'Disable the patrols and activate both visitor kiosks with F.',
        'The gate refuses to recognize your visitor badge because it says VISITOR. Retrieve a second badge verifying that you visited the badge kiosk. Nori has already filed a complaint in the form of a small drawing.', 130),
      mission('arrival-3', 'The Welcome Swarm', 'survive', 18, 0, 3,
        'Weather three waves of overly enthusiastic welcome drones.',
        'Someone enabled “delightful onboarding” in the courtyard. Every drone now believes a welcome basket should be delivered at terminal velocity. Keep moving and return them gently to standby.', 160),
      mission('arrival-4', 'Lost and Found and Lost', 'terminals', 16, 3, 2,
        'Reconnect three luggage beacons and clear their custodians.',
        'The coat check has misfiled your expedition supplies under “miscellaneous ambitions.” Locate the beacons before your emergency biscuits are promoted to office furniture.', 180),
      mission('arrival-5', 'A Shortcut through Security', 'clear', 22, 0, 3,
        'Disable the security patrol at the inner causeway.',
        'The shortcut is, in fact, slightly longer than the original route. It does contain more treasure. Nori insists that this is the correct definition of a shortcut in the adventuring profession.', 210),
      mission('arrival-6', 'Please Take a Number', 'boss', 18, 0, 2,
        'Defeat the Receptionist and recover the Copper Release Key.',
        'The Receptionist unfolds six stamp arms and a regrettably large ticket dispenser. “Your estimated wait time is ETERNAL,” it chirps. Interrupt the queue, avoid the warning circles, and collect your appointment.', 300),
    ],
  },
  {
    id: 'shellworks', name: 'The Shellworks', subtitle: 'Act I · The Claw · Chapter 2',
    theme: 'foundry', color: '#ddaa64', boss: 'Foreman Clack, the Compliance Crab',
    description: 'Bronze furnaces forge little lobster shells. Conveyor spirits sing a work song with an alarming number of mandatory verses.',
    missions: [
      mission('shellworks-1', 'Made of Many Little Things', 'clear', 24, 0, 3,
        'Clear the shell assembly floor.',
        'Every claw starts as a good idea and approximately forty tiny screws. The screws have unionized; the assembly constructs have not noticed. Shut down the floor before anybody builds a sentient stapler.', 230),
      mission('shellworks-2', 'The Unscheduled Break', 'terminals', 20, 3, 3,
        'Restore three break-room power relays.',
        'The break-room kettle is wired to the industrial furnace. Nori likes strong tea, but draws the line at molten bronze. Find the relays and rescue everyone’s afternoon.', 250),
      mission('shellworks-3', 'Quality, More or Less', 'survive', 30, 0, 4,
        'Pass four rounds of construct quality assurance.',
        'The quality assurance rig has an unusually practical definition of a good shell: a shell you cannot knock over. The rig would like to test that definition on every shell, immediately, near you.', 280),
      mission('shellworks-4', 'A Fork in the Conveyor', 'terminals', 24, 3, 3,
        'Reroute three conveyor control terminals.',
        'One conveyor leads to the inner keep. One leads to the gift shop. The third is labeled “probably fine.” Your guide would like all three investigated, beginning with the one that smells of treasure.', 300),
      mission('shellworks-5', 'Assembly of One', 'clear', 34, 0, 4,
        'Disable the foreman’s reinforced assembly crew.',
        'Foreman Clack has requisitioned a hundred extra arms to solve a staffing problem. They have created a hundred extra clipboards. Clear a path before the clipboards learn to walk.', 330),
      mission('shellworks-6', 'The Final Inspection', 'boss', 26, 0, 3,
        'Disable Foreman Clack and recover the Brass Release Key.',
        '“Hard hats!” bellows Clack, a crab-shaped industrial inspector wearing nine of them. His holographic checklist is longer than his health bar. Step out of the stamped danger zones and give him a well-earned maintenance break.', 420),
    ],
  },
  {
    id: 'tidepool', name: 'The Memory Tidepools', subtitle: 'Act I · The Claw · Chapter 3',
    theme: 'garden', color: '#69cbbb', boss: 'The Cache Kraken',
    description: 'Moonlight ripples across a garden of glass pools. Each remembers something important; most have also remembered where you left your keys.',
    missions: [
      mission('tidepool-1', 'A Ripple in Recall', 'clear', 28, 0, 3,
        'Disable the wandering echo constructs.',
        'The tidepools are replaying yesterday’s patrols on top of today’s patrols. Nori checked tomorrow and found more patrols. Clear the echoes before the courtyard becomes a very boring parade.', 320),
      mission('tidepool-2', 'Three Things to Remember', 'terminals', 24, 3, 3,
        'Reconnect three memory fountains.',
        'Your expedition needs three things: a way forward, a reliable map, and snacks. The fountains claim to hold all three. The last one may only contain a beautifully detailed memory of snacks.', 340),
      mission('tidepool-3', 'The Persistence Test', 'survive', 38, 0, 4,
        'Hold the reflection garden through four waves.',
        'An archival ritual has mistaken you for a temporary file. The garden will keep sending tidy little custodians until you prove you intend to remain. Persistence is a virtue; so is a well-timed potion.', 370),
      mission('tidepool-4', 'The Things We Kept', 'terminals', 28, 4, 3,
        'Open four archive locks and disable their guardians.',
        'Behind these locks are the fortress’s earliest memories: a tiny prototype, a very long to-do list, and a picture of a lobster wearing sunglasses. Nori calls that last one “foundational research.”', 400),
      mission('tidepool-5', 'A Very Large Cache Miss', 'clear', 40, 0, 4,
        'Clear the corrupted cache guardians.',
        'The central pool has misplaced the word “small.” Unfortunately its resident cache kraken was the first to notice. Clear the guardians while Nori searches the dictionary for emergency replacements.', 430),
      mission('tidepool-6', 'Release the Cache Kraken', 'boss', 30, 0, 3,
        'Reset the Cache Kraken and recover the Pearl Release Key.',
        'A cheerful mechanical kraken rises from the memory pool carrying eight copies of the same meeting invite. Let its bright attack markers finish before stepping in. When it powers down, please decline all eight invites.', 520),
    ],
  },
  {
    id: 'observatory', name: 'The Agent Observatory', subtitle: 'Act I · The Claw · Chapter 4',
    theme: 'observatory', color: '#91a7ef', boss: 'The Orchestrator of Small Matters',
    description: 'An impossible observatory tracks thousands of little agents across an artificial night sky. Several are tracking each other, which has not helped.',
    missions: [
      mission('observatory-1', 'A Sky Full of Errands', 'clear', 32, 0, 4,
        'Clear the observatory’s errant messenger drones.',
        'The stars are not stars. They are delivery drones carrying errands between telescopes. One has been trying to deliver the moon since Tuesday. Guide them back to their charging docks with a decisive flash of light.', 420),
      mission('observatory-2', 'Delegation All the Way Down', 'terminals', 28, 4, 3,
        'Disconnect four recursive delegation beacons.',
        'An agent asked an agent to ask an agent to check whether the first agent had finished. The chain now reaches the roof. Find the beacons and introduce the radical concept of doing the task.', 450),
      mission('observatory-3', 'The Night Shift', 'survive', 44, 0, 5,
        'Keep the observation deck clear for five waves.',
        'Nori is aligning the telescope with the inner keep. Every maintenance drone in the tower has chosen this moment to clean the lens. Protect the deck; a window-cleaning appointment can wait five minutes.', 480),
      mission('observatory-4', 'Constellation of Context', 'terminals', 34, 4, 4,
        'Align four star-chart consoles.',
        'The charts show a route through the fortress shaped suspiciously like a lobster. Nori assures you this is navigationally sound and has nothing to do with the cartographer being a lobster.', 510),
      mission('observatory-5', 'Too Many Cooks in Orbit', 'clear', 46, 0, 5,
        'Disable the command relay’s conflicting patrols.',
        'Nine captains have given one drone nine perfectly reasonable orders. It is now attempting to walk in nine directions. Quiet the relay, collect the resulting loot, and allow everyone a moment to think.', 540),
      mission('observatory-6', 'One Last Small Task', 'boss', 34, 0, 4,
        'Disable the Orchestrator and recover the Star Release Key.',
        'The Orchestrator is a floating astrolabe with a tiny bell and vast ambitions. It introduces every attack as “one quick thing.” Nothing about the enormous glowing danger circles is quick or small.', 640),
    ],
  },
  {
    id: 'masquerade', name: 'The Scarlet Masquerade', subtitle: 'Act I · The Claw · Chapter 5',
    theme: 'palace', color: '#ef797d', boss: 'The Mascot Supreme',
    description: 'A festival of scarlet claws fills the upper fortress. Banners promise an unforgettable launch. The launch has been running for six hundred and twelve days.',
    missions: [
      mission('masquerade-1', 'Dress Claw-de', 'clear', 36, 0, 4,
        'Clear the masked construct ushers.',
        'The ball requires formal shellwear. You have expedition armor, determination, and a companion prepared to insist that both are very fashionable this season. The ushers will need a little convincing.', 510),
      mission('masquerade-2', 'A Toast to Stability', 'terminals', 30, 4, 4,
        'Switch off four malfunctioning celebration fountains.',
        'The sparkling cider fountains have become sparkling lightning fountains. This is an impressive technical achievement and a disappointing catering decision. Return the beverages to their original specification.', 540),
      mission('masquerade-3', 'The Dance of a Thousand Pins', 'survive', 48, 0, 5,
        'Dance around five waves of clockwork performers.',
        'The ballroom dancers follow a highly optimized routine that has no concept of personal space. Their choreographer called it “immersive.” Nori calls it “a good time to use your dash.”', 570),
      mission('masquerade-4', 'Beyond the Velvet Rope', 'terminals', 36, 4, 4,
        'Authorize four backstage access pillars.',
        'A lobster in a velvet jacket says you are not on the list. Fortunately the list is stored in four very large, very accessible terminals. Earn your backstage access the adventurous way.', 600),
      mission('masquerade-5', 'The Standing Ovation', 'clear', 52, 0, 5,
        'Quiet the mascot’s royal fan club.',
        'The fan club has interpreted “show your support” as a load-bearing engineering instruction. Its constructs have formed a barricade. Clear the stage and give the little mascot room for its big finale.', 630),
      mission('masquerade-6', 'A Little Mascot, a Big Entrance', 'boss', 38, 0, 4,
        'Disable the Mascot Supreme and recover the Ruby Release Key.',
        'The familiar little red claw mascot arrives inside an absolutely enormous parade machine. It waves. The machine waves six cannons. This is why Nori always asks who approved the parade budget.', 740),
    ],
  },
  {
    id: 'claw-throne', name: 'The Lobster Throne', subtitle: 'Act I · The Claw · Chapter 6',
    theme: 'throne', color: '#f6b66b', boss: 'Peter Steinberger · The Claw King',
    description: 'At the heart of OpenClaw, a spectacular mechanical lobster throne guards the first half of the Release Keys. Its pilot is already fixing something.',
    missions: [
      mission('claw-throne-1', 'The Maintainer’s Stair', 'clear', 40, 0, 4,
        'Ascend past the throne’s mechanical honor guard.',
        'The staircase is lined with little plaques reading “quick fix.” There are several thousand of them. Peter’s theatrical hologram appears above the landing: “Welcome! Mind the prototype. And the other prototype.”', 610),
      mission('claw-throne-2', 'A Pull Request at the Gate', 'terminals', 36, 4, 4,
        'Open four throne-vault locks.',
        'The throne room accepts guests through a wonderfully elaborate review process. Nori has submitted the required paperwork: a single page reading LET US IN, PLEASE. Make sure the four reviewing terminals see it.', 640),
      mission('claw-throne-3', 'The Release Candidate', 'survive', 54, 0, 6,
        'Pass six waves of the royal stress test.',
        'Peter’s hologram offers a friendly challenge: “If you can survive this test, you can probably survive a release.” The constructs arrive. Nori begins taking unusually thorough notes about the word “probably.”', 680),
      mission('claw-throne-4', 'Hotfix the Drawbridge', 'terminals', 40, 4, 4,
        'Reset four drawbridge control crystals.',
        'The final bridge retracts whenever anybody says “production.” Your guide has tried whispering. The bridge has very good hearing. Replace its control instructions with something less exciting.', 710),
      mission('claw-throne-5', 'The Last Line of Shell', 'clear', 58, 0, 6,
        'Disable the Claw King’s royal shellguard.',
        'The finest shells in the fortress wait before the great doors, polished until they reflect every bad decision that brought you here. Nori sees a confident adventurer. You see an excellent opportunity to upgrade your weapon.', 750),
      mission('claw-throne-6', 'A Maintainer Has Entered the Arena', 'boss', 42, 0, 4,
        'Defeat Peter’s holographic lobster mech and claim the Claw Release Key.',
        '“All right,” says Peter’s hologram, settling into a six-legged lobster throne. “Let’s see what you built.” Defeat his fantastical arena machine. The victory prize is a key, a respectful claw bump, and directions to an even stranger campus.', 900),
    ],
  },
  {
    id: 'white-gates', name: 'The White Gates', subtitle: 'Act II · The Closed Garden · Chapter 7',
    theme: 'campus', color: '#c8ddd7', boss: 'The Concierge of Tomorrow',
    description: 'Beyond the sea, OpenAI’s fictional headquarters rises as a luminous garden-city. Every path is paved with polished stone and aspirational release notes.',
    missions: [
      mission('white-gates-1', 'A New Campus, Same Badge', 'clear', 42, 0, 5,
        'Clear the luminous gate patrol.',
        'Peter’s parting gift was a visitor badge reading “probably fine.” The white gates seem unconvinced. Nori adjusts the badge, smiles at the little camera, and quietly reminds you where the potion button is.', 710),
      mission('white-gates-2', 'The Garden of Accepted Terms', 'terminals', 38, 4, 4,
        'Activate four garden access terminals.',
        'The path is blocked by a hedge that wants you to read its entire terms of service. A helpful plaque explains that the hedge is a work of fiction. It is nevertheless an extremely committed hedge.', 750),
      mission('white-gates-3', 'A Very Soft Launch', 'survive', 58, 0, 6,
        'Withstand six waves of demonstration constructs.',
        'The welcome demonstration begins gently: one small drone. Then another. Then a helpful slide explaining exponential growth. Nori would like to skip directly to the slide about stopping.', 780),
      mission('white-gates-4', 'Reception within Reception', 'terminals', 42, 4, 4,
        'Resolve four nested check-in kiosks.',
        'Every reception desk leads to another reception desk, which is useful if you really enjoy reception desks. Find the master kiosks and ask for directions in a language that does not contain the phrase “circle back.”', 810),
      mission('white-gates-5', 'The Polished Perimeter', 'clear', 60, 0, 6,
        'Disable the concierge’s ceramic sentinels.',
        'The sentinels have been buffed to such a shine that Nori can check the map in their reflections. He would prefer to check it in a stationary reflection. Help the security team stand down.', 850),
      mission('white-gates-6', 'Tomorrow Is Fully Booked', 'boss', 46, 0, 5,
        'Disable the Concierge and recover the Ivory Release Key.',
        'The Concierge is a smiling moon of porcelain panels and appointment lasers. “Tomorrow works for everyone,” it announces. A giant warning circle appears beneath you. Tomorrow can wait; moving out of the circle cannot.', 970),
    ],
  },
  {
    id: 'token-vault', name: 'The Treasury of Tokens', subtitle: 'Act II · The Closed Garden · Chapter 8',
    theme: 'vault', color: '#d5c17e', boss: 'The Infinite Invoice',
    description: 'Golden tokens drift through a subterranean treasury. Its vault doors are larger than villages, and its accounting department would like you to notice.',
    missions: [
      mission('token-vault-1', 'Small Change, Large Doors', 'clear', 46, 0, 5,
        'Clear the treasury’s token collectors.',
        'The treasury floor is paved with golden tokens. Nori suggests picking them up. The collectors suggest an itemized receipt. Your expedition suggests a short discussion conducted through shimmering area attacks.', 810),
      mission('token-vault-2', 'The Meter Is Running', 'terminals', 42, 4, 5,
        'Stop four runaway accounting meters.',
        'Somebody left a meter running while another meter was measuring the first meter. Their combined invoice is now visible from orbit. Disconnect the loop before finance invents a new number.', 840),
      mission('token-vault-3', 'A Rain of Receipts', 'survive', 62, 0, 6,
        'Survive six collection cycles.',
        'A paper storm rolls through the vault. Every receipt unfolds into a tiny collection drone. Nori admires the craftsmanship while pointing out that craftsmanship is currently trying to sit on your head.', 880),
      mission('token-vault-4', 'The Emergency Biscuit Fund', 'terminals', 46, 4, 5,
        'Unlock four reserve treasury seals.',
        'Deep in the vault lies the emergency biscuit fund. It is protected by four seals and a dragon-shaped spreadsheet. Nori explains that the fund is essential to expedition morale. You choose to believe him.', 920),
      mission('token-vault-5', 'Budget for a Boss Fight', 'clear', 66, 0, 6,
        'Disable the invoice’s audit guard.',
        'The guard has budgeted sixteen minutes for your defeat, plus a five-minute retrospective. Clear the room ahead of schedule. The retrospective may still be useful if it includes biscuits.', 960),
      mission('token-vault-6', 'Payment Due: One Adventure', 'boss', 48, 0, 5,
        'Void the Infinite Invoice and recover the Golden Release Key.',
        'An enormous mechanical ledger unfolds into a many-legged invoice, its total increasing with each dramatic gesture. Avoid the glowing debit circles and persuade the ledger that a nap is an allowable expense.', 1100),
    ],
  },
  {
    id: 'evaluation', name: 'The Hall of Evaluations', subtitle: 'Act II · The Closed Garden · Chapter 9',
    theme: 'library', color: '#9cb9e7', boss: 'The Benchmark Basilisk',
    description: 'A cathedral of floating tests measures everything from combat prowess to your ability to identify a suspiciously specific number of strawberries.',
    missions: [
      mission('evaluation-1', 'Show Your Working', 'clear', 48, 0, 5,
        'Clear the practical examination floor.',
        'The first examination asks you to defeat the examiners. This is at least more straightforward than the second examination, which asks why the first examination is a metaphor. Start with the practical part.', 910),
      mission('evaluation-2', 'Four Correct Answers', 'terminals', 44, 4, 5,
        'Activate four examination consoles.',
        'The consoles ask what makes a good adventurer. Nori answers “kindness, persistence, snacks, and a spare potion.” The consoles are visibly impressed. Submit the answers before the grading constructs interrupt.', 950),
      mission('evaluation-3', 'The Stress Test’s Stress Test', 'survive', 68, 0, 6,
        'Complete six practical endurance trials.',
        'The endurance examiner has hired another examiner to ensure the endurance examination is sufficiently enduring. Defeat the waves, mind your health, and be very selective about additional extracurricular activities.', 990),
      mission('evaluation-4', 'A Rubric for the Impossible', 'terminals', 48, 4, 5,
        'Recalibrate four scoring pillars.',
        'The scoring rubric awards points for being a teapot, an oracle, and three ducks simultaneously. Nobody has passed. Restore a rubric designed for one adventurer and one unusually helpful companion.', 1030),
      mission('evaluation-5', 'Overfitted for Battle', 'clear', 70, 0, 6,
        'Disable the basilisk’s overprepared exam guards.',
        'The guards memorized every previous battle in the hall. Fortunately none of those battles featured you, your present equipment, and Nori’s inspirational biscuit speech. Introduce some fresh data.', 1070),
      mission('evaluation-6', 'A Perfectly Average Dragon', 'boss', 52, 0, 5,
        'Reset the Benchmark Basilisk and recover the Sapphire Release Key.',
        'The basilisk is a spectacular clockwork dragon with a grading pen for a tail. It gives itself ten out of ten for entrance. Its glowing attacks are clearly marked; you may deduct points for predictability.', 1200),
    ],
  },
  {
    id: 'context', name: 'The Context Cathedral', subtitle: 'Act II · The Closed Garden · Chapter 10',
    theme: 'cathedral', color: '#b3a1e8', boss: 'The Archivist of Almost Everything',
    description: 'A cathedral of violet glass holds a million half-finished conversations. Its longest corridor has forgotten where it begins.',
    missions: [
      mission('context-1', 'Previously on This Adventure', 'clear', 52, 0, 5,
        'Clear the nave of wandering conversation echoes.',
        'The cathedral welcomes you with a summary of your journey. It gets most details right, except that you are apparently three raccoons. Nori asks whether that explains your inventory capacity. Clear the echoes and proceed.', 1010),
      mission('context-2', 'The Important Part Was Above', 'terminals', 48, 4, 5,
        'Restore four lost context anchors.',
        'A note at the altar says the answer was “mentioned earlier.” The earlier in question has fallen into four separate side chapels. Reconnect the anchors before the next note asks you to scroll further.', 1050),
      mission('context-3', 'The Long Conversation', 'survive', 72, 0, 6,
        'Defend the central aisle through six echo waves.',
        'An entire afternoon’s discussion has taken physical form and would like to make one final point. It has six final points. Keep the aisle clear while Nori prepares a concise response.', 1100),
      mission('context-4', 'A Memory Worth Keeping', 'terminals', 52, 4, 5,
        'Preserve four archive lanterns.',
        'Among all the noise are four little lanterns: the first successful spell, a friend’s advice, a map home, and a very good joke. Save those. The nine-hundred-page conversation about chair height can wait.', 1140),
      mission('context-5', 'The Edge of the Window', 'clear', 76, 0, 6,
        'Disable the archive’s boundary wardens.',
        'The edge of the context window is an actual window, astonishingly tall and guarded by constructs with excellent posture. The Archivist is beyond it, attempting to remember whether it invited you.', 1190),
      mission('context-6', 'Now, Where Were We?', 'boss', 56, 0, 5,
        'Calm the Archivist and recover the Amethyst Release Key.',
        'A cathedral-sized mechanical owl unfolds from the shelves. “I remember everything,” it says, followed by “Who are you again?” Dodge its luminous annotations, disable its patrols, and offer a friendly reminder of the way forward.', 1320),
    ],
  },
  {
    id: 'launch-engine', name: 'The Launch Engine', subtitle: 'Act II · The Closed Garden · Chapter 11',
    theme: 'engine', color: '#6ed6d8', boss: 'The Release Train',
    description: 'Below the summit, an engine the size of a mountain turns anticipation into light. A sign says the next launch is imminent. The sign looks ancient.',
    missions: [
      mission('launch-engine-1', 'The Hype Is a Physical Place', 'clear', 56, 0, 6,
        'Clear the engine’s luminous maintenance crew.',
        'The air hums with pure anticipation. It lifts your hair, charges your equipment, and makes Nori feel he should announce something. Secure the engine floor before he announces a sequel.', 1110),
      mission('launch-engine-2', 'Four Very Large Switches', 'terminals', 52, 4, 5,
        'Synchronize four launch capacitor controls.',
        'The engineer’s manual is admirably clear: “Please do not press all the switches at once.” Luckily there are four switches and only one of you. Nori has volunteered to count to four, slowly.', 1160),
      mission('launch-engine-3', 'Any Minute Now', 'survive', 78, 0, 7,
        'Protect the calibration through seven pressure surges.',
        'The calibration is almost finished. The engine says so after every surge. Nori suspects “almost” is a unit of time peculiar to this building. Endure the seven surges and provide a more concrete deadline.', 1210),
      mission('launch-engine-4', 'Roll Back the Roller', 'terminals', 56, 4, 5,
        'Activate four emergency rollback stations.',
        'The release train has left the station, circled the mountain, and returned to ask whether anybody packed the brakes. Find the rollback stations while its passengers reconsider their travel arrangements.', 1260),
      mission('launch-engine-5', 'The Last Stop before Tomorrow', 'clear', 82, 0, 7,
        'Clear the summit platform’s elite constructs.',
        'Beyond the platform lies the summit and the spell that keeps tomorrow just out of reach. Check your equipment, spend your talent points, and remember that a saved potion does not help if you never drink it.', 1310),
      mission('launch-engine-6', 'The Release Has Left the Station', 'boss', 60, 0, 6,
        'Stop the Release Train and recover the Storm Release Key.',
        'A magnificent engine shaped like a silver serpent slides into the arena. Its destination board reads SOON. Avoid its radiant warning markers and disconnect its escorts. For once, this train needs to be delayed.', 1460),
    ],
  },
  {
    id: 'tomorrow', name: 'The Summit of Tomorrow', subtitle: 'Act II · The Closed Garden · Chapter 12',
    theme: 'summit', color: '#f8dc9c', boss: 'Sam Altman · The Architect of Tomorrow',
    description: 'Above the clouds, twelve empty keyholes circle an impossible sun. Sam’s holographic avatar waits in a gleaming orrery, ready for the most dramatic product demo in history.',
    missions: [
      mission('tomorrow-1', 'One More Staircase', 'clear', 60, 0, 6,
        'Clear the summit’s first line of astral guardians.',
        'You have crossed a fortress, a city, a treasury, and a cathedral. The final obstacle is, naturally, another staircase. Nori promises the view is worth it. He also promises to stop promising staircases.', 1220),
      mission('tomorrow-2', 'The Keys to a Weekend', 'terminals', 56, 4, 6,
        'Wake four celestial release mechanisms.',
        'The keys you gathered begin to hum as the summit recognizes them. Wake the four mechanisms and make a little room in the future for ordinary things: fresh air, unfinished books, and lunch with no agenda.', 1280),
      mission('tomorrow-3', 'All Hands at the End of the World', 'survive', 84, 0, 7,
        'Stand through seven waves of the grand demonstration.',
        'Sam’s theatrical hologram welcomes you to an all-hands demonstration. Every construct in the summit has raised every available hand. Keep moving through the last endurance trial. The Q&A will be remarkably practical.', 1340),
      mission('tomorrow-4', 'A Sensible Amount of Ambition', 'terminals', 60, 4, 6,
        'Ground four overcharged ambition pylons.',
        'The orrery is overclocked on pure ambition. Nori thinks ambition is lovely when it leaves room for a nap. Ground the pylons and bring the machine back within the capacity of a very exciting afternoon.', 1400),
      mission('tomorrow-5', 'Everyone Gets to Go Home', 'clear', 88, 0, 8,
        'Disable the final astral honor guard.',
        'The last guardians advance across a floor of starlight. Your companion checks the route home. You check your gear. Somewhere below, a thousand tiny office kettles wait for permission to switch off.', 1470),
      mission('tomorrow-6', 'The Future Can Wait until Monday', 'boss', 64, 0, 6,
        'Defeat Sam’s holographic orrery, claim the Sun Release Key, and end the endless launch.',
        '“One more thing,” says Sam’s hologram as the golden orrery blossoms into a dazzling arena machine. Show him a future with an off switch. When the last harmless spark fades, tomorrow finally arrives—and everyone gets a weekend.', 1800),
    ],
  },
];

const ITEM_BASES = {
  weapon: [
    ['Semaphore Greatsword', '⚔', 'A broad blade that grants exactly one wielder access to the argument.'],
    ['Context Spindle', 'ϟ', 'A glass spindle wound with threads of captured lightning.'],
    ['Threadrunner Bow', '➶', 'An elegant bow whose string remembers every good shot.'],
    ['Clawbreaker Axe', '⚒', 'Copper-edged and carefully padded for construct combat.'],
    ['Promptstaff', '✦', 'A staff that makes a very persuasive point.'],
    ['Forked Sabre', '⚔', 'Every swing opens up an interesting new possibility.'],
    ['Packet Crossbow', '➶', 'Delivers luminous parcels with excellent reliability.'],
    ['Mooncache Wand', 'ϟ', 'Stores a little moonlight for inconveniently dark moments.'],
    ['Rollback Hammer', '⚒', 'Returns a badly behaved construct to its previous state.'],
    ['Lobster Lance', '⚔', 'A ceremonial lance with a cheerful claw-shaped guard.'],
    ['Dependency Flail', '✺', 'Several small problems attached to one surprisingly useful handle.'],
    ['Prism Glaive', '⚔', 'A blade of refracted light, bright enough to read the fine print.'],
    ['Golden Pointer', 'ϟ', 'Indicates where the demonstration is about to become exciting.'],
    ['Archive Chakram', '◎', 'Always returns, usually with additional context.'],
    ['Aurora Longbow', '➶', 'Its arrows make the night briefly more beautiful.'],
    ['Deadline Halberd', '⚔', 'A clear and persuasive argument for wrapping things up.'],
    ['Signal Tuning Fork', 'ϟ', 'Strikes exactly the note a construct does not wish to hear.'],
    ['Release-Key Blade', '⚔', 'Cut from the same bright alloy as a promise kept.'],
  ],
  armor: [
    ['Copper Carapace', '◈', 'Modeled after a lobster who took personal safety seriously.'],
    ['Patchwork Mantle', '◈', 'Every patch represents a problem somebody actually fixed.'],
    ['Semaphore Plate', '◈', 'Keeps uninvited processes at a respectful distance.'],
    ['Moonwoven Robe', '◈', 'Cool silver fabric that remembers the shape of starlight.'],
    ['Threadrunner Coat', '◈', 'Excellent pockets. An unreasonable number of excellent pockets.'],
    ['Ceramic Vest', '◈', 'Borrowed from a campus sentinel with impeccable taste.'],
    ['Tideglass Mail', '◈', 'Tiny overlapping plates reflect the memory of a calm sea.'],
    ['Orchestrator’s Cape', '◈', 'Flutters with authority even when nobody is watching.'],
    ['Scarlet Shellguard', '◈', 'Formal shellwear for a very eventful masquerade.'],
    ['Vaultkeeper Harness', '◈', 'Designed to protect both its wearer and their biscuit fund.'],
    ['Cathedral Vestments', '◈', 'Embroidered with carefully remembered names.'],
    ['Launchwarden Cuirass', '◈', 'Rated for enthusiasm, sparks, and unexpected applause.'],
    ['Sunlit Brigandine', '◈', 'Warm gold plates arranged like a little dawn.'],
    ['Nightshift Overcoat', '◈', 'The lining is a map to the nearest quiet place.'],
    ['Exception Handler', '◈', 'An armored jacket for when things become exceptional.'],
  ],
  relic: [
    ['Pocket Astrolabe', '✧', 'Locates nearby stars and occasionally nearby sandwiches.'],
    ['Memory Pearl', '✧', 'Holds one exceptionally good afternoon.'],
    ['Visitor Badge', '✧', 'Apparently you are authorized to be interesting.'],
    ['Golden Token', '✧', 'Useful in the treasury and excellent at catching the light.'],
    ['Little Copper Claw', '✧', 'A tiny mascot that waves whenever you need encouragement.'],
    ['Cache Crystal', '✧', 'Keeps the useful bits close at hand.'],
    ['Emergency Biscuit', '✧', 'Preserved by powerful magic and admirable self-control.'],
    ['Celestial Compass', '✧', 'Points toward whatever matters most, which is occasionally lunch.'],
    ['Reviewer’s Monocle', '✧', 'Helps you spot a problem before it becomes a meeting.'],
    ['Context Lantern', '✧', 'Illuminates what everyone assumed you already knew.'],
    ['Miniature Release Bell', '✧', 'A clear little note that means the work is finished.'],
    ['Folded Paper Crane', '✧', 'Made from a very unnecessary meeting invitation.'],
    ['Weekend Hourglass', '✧', 'The sand falls a little slower when you are happy.'],
    ['Starlight Keyring', '✧', 'For keys to places that do not fit on ordinary maps.'],
    ['Polished Off Switch', '✧', 'A small reminder that rest is a perfectly valid state.'],
  ],
};

const PREFIXES = [
  ['Steadfast', 'hp'], ['Luminous', 'power'], ['Quickened', 'crit'], ['Sheltering', 'armor'],
  ['Recursive', 'power'], ['Moonlit', 'hp'], ['Faultless', 'armor'], ['Threadbound', 'crit'],
  ['Copperbound', 'armor'], ['Tideforged', 'hp'], ['Starwoven', 'power'], ['Daring', 'crit'],
  ['Gilded', 'hp'], ['Prismatic', 'power'], ['Patient', 'armor'], ['Resolute', 'hp'],
  ['Scintillating', 'crit'], ['Scarlet', 'power'], ['Celestial', 'hp'], ['Unwavering', 'armor'],
];
const SUFFIXES = [
  ['of the First Fork', 'power'], ['of Clear Intent', 'crit'], ['of Quiet Hours', 'hp'], ['of the Claw', 'armor'],
  ['of Shared Context', 'power'], ['of the Night Shift', 'hp'], ['of Perfect Timing', 'crit'], ['of Safe Returns', 'armor'],
  ['of Little Miracles', 'hp'], ['of the Deep Cache', 'power'], ['of the Observatory', 'crit'], ['of Second Chances', 'armor'],
  ['of Copper Dreams', 'armor'], ['of the Long Weekend', 'hp'], ['of Small Victories', 'crit'], ['of Bright Ideas', 'power'],
  ['of the Last Lantern', 'hp'], ['of the Open Road', 'crit'], ['of Gentle Shutdowns', 'armor'], ['of Tomorrow', 'power'],
];

export const LEGENDARIES = [
  { name: 'The Unreasonable Fork', slot: 'weapon', description: 'A three-pronged spear that insists every problem has at least three promising solutions.' },
  { name: 'Saturday Morning', slot: 'weapon', description: 'A sunlit greatsword with absolutely nothing scheduled after this battle.' },
  { name: 'The Last Semicolon', slot: 'weapon', description: 'A tiny silver blade that brings surprisingly large arguments to a close.' },
  { name: 'Claw and Effect', slot: 'weapon', description: 'A ceremonial lobster axe. Its little copper claws applaud a well-timed swing.' },
  { name: 'The Polite Disagreement', slot: 'weapon', description: 'A luminous staff engraved with the words: Have you considered another approach?' },
  { name: 'Nori’s Extremely Good Stick', slot: 'weapon', description: 'Your companion says this is the finest stick in the world. The enchantment agrees.' },
  { name: 'A Light at the End of the Sprint', slot: 'weapon', description: 'A bow made from the first sunrise after a finished project.' },
  { name: 'The Release Note', slot: 'weapon', description: 'A tuning fork that rings with the pure, impossible sound of work actually being done.' },
  { name: 'The Maintainer’s Day Off', slot: 'armor', description: 'A wonderfully sturdy coat whose protective magic is powered by boundaries.' },
  { name: 'The Shell of Small Kindnesses', slot: 'armor', description: 'A warm scarlet carapace built from every little thing someone did to help.' },
  { name: 'A Perfectly Reasonable Scope', slot: 'armor', description: 'Legend says this suit was once finished exactly when its maker expected.' },
  { name: 'The Blanket of Continuity', slot: 'armor', description: 'An armored mantle that remembers you at your best and insists you will get there again.' },
  { name: 'No Meetings after Three', slot: 'armor', description: 'A gleaming cuirass whose inscriptions are both a ward and a calendar preference.' },
  { name: 'The Quiet Confidence', slot: 'armor', description: 'Understated silver armor. It has never once needed a launch announcement.' },
  { name: 'The Little Red Champion', slot: 'armor', description: 'A tiny scarlet claw is stitched over the heart. It seems to be cheering for you.' },
  { name: 'The Future Is Comfortable', slot: 'armor', description: 'Celestial plate lined with very soft fabric. Innovation begins with sensible padding.' },
  { name: 'The Actually Useful Reminder', slot: 'relic', description: 'A tiny bell that rings when it is time to drink water, take a break, or use a potion.' },
  { name: 'An Unbroken Promise', slot: 'relic', description: 'A smooth ring carrying the weight of one small promise faithfully kept.' },
  { name: 'The Infinite Biscuit', slot: 'relic', description: 'Nori’s greatest discovery. It replenishes exactly one crumb at a time.' },
  { name: 'The First Working Prototype', slot: 'relic', description: 'A tiny copper claw that still makes its creator smile.' },
  { name: 'The Open Window', slot: 'relic', description: 'A miniature window showing a different beautiful afternoon each time you look.' },
  { name: 'The Last Item on the List', slot: 'relic', description: 'A checked box, preserved in amber. Few relics possess such concentrated satisfaction.' },
  { name: 'Permission to Rest', slot: 'relic', description: 'An ancient seal that grants its bearer the right to stop for a while.' },
  { name: 'The Key to Monday', slot: 'relic', description: 'Tomorrow will be there when you are ready. The key is in your pocket.' },
];

function hashSeed(seed) {
  const string = String(seed);
  let h = 2166136261;
  for (let i = 0; i < string.length; i += 1) {
    h ^= string.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function randomSource(seed) {
  let state = hashSeed(seed);
  return () => {
    state = (state + 0x6D2B79F5) >>> 0;
    let t = state;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Stable across sessions: identical level, seed and slot produce identical loot. */
export function generateItem(level, seed, slot) {
  const itemLevel = Number.isFinite(Number(level)) ? Math.max(1, Math.min(100, Math.floor(Number(level)))) : 1;
  const rng = randomSource(`${String(seed)}:${itemLevel}:${slot || 'any'}`);
  const choose = list => list[Math.floor(rng() * list.length)];
  const itemSlot = Object.hasOwn(ITEM_BASES, slot) ? slot : choose(['weapon', 'armor', 'relic']);
  const roll = rng();
  const rarity = RARITIES[roll < 0.45 ? 0 : roll < 0.73 ? 1 : roll < 0.90 ? 2 : roll < 0.975 ? 3 : 4];
  const [baseName, icon, baseDescription] = choose(ITEM_BASES[itemSlot]);
  const prefix = choose(PREFIXES);
  const suffix = choose(SUFFIXES);
  const legendary = rarity.id === 'legendary' ? choose(LEGENDARIES.filter(item => item.slot === itemSlot)) : null;
  const scale = (5 + itemLevel * 2.5) * rarity.multiplier;
  const variance = 0.9 + rng() * 0.2;
  const stats = {
    power: itemSlot === 'weapon' ? Math.round(scale * variance) : itemSlot === 'relic' ? Math.round(scale * 0.38 * variance) : 0,
    armor: itemSlot === 'armor' ? Math.round(scale * 0.55 * variance) : itemSlot === 'relic' ? Math.round(scale * 0.12) : 0,
    hp: itemSlot === 'armor' ? Math.round(scale * 1.8) : itemSlot === 'relic' ? Math.round(scale * 1.05) : 0,
    crit: itemSlot === 'weapon' ? Math.round((1.5 + rarity.multiplier * 1.2) * variance) : itemSlot === 'relic' ? Math.round(1 + rarity.multiplier * 1.5) : 0,
  };
  const applyAffix = ([, stat]) => {
    if (stat === 'crit') stats.crit += Math.max(1, Math.round(rarity.multiplier));
    else stats[stat] += Math.max(1, Math.round(scale * (stat === 'hp' ? 0.7 : stat === 'armor' ? 0.15 : 0.23)));
  };
  if (rarity.id !== 'common') applyAffix(prefix);
  if (rarity.id === 'rare' || rarity.id === 'epic' || rarity.id === 'legendary') applyAffix(suffix);
  const name = legendary?.name || (rarity.id === 'common' ? baseName : rarity.id === 'uncommon' ? `${prefix[0]} ${baseName}` : `${prefix[0]} ${baseName} ${suffix[0]}`);
  return {
    id: `item-${hashSeed(`${seed}:${itemLevel}:${itemSlot}`).toString(36)}`,
    name, slot: itemSlot, rarity: rarity.id, color: rarity.color, level: itemLevel,
    ...stats,
    description: legendary?.description || baseDescription,
    icon,
    sellValue: Math.max(5, Math.round((10 + itemLevel * 8) * rarity.multiplier)),
  };
}

export const TALENTS = {
  power: { name: 'Brilliant Ideas', description: 'Increase your attack damage. A good idea is even better when it reaches the construct in front of you.' },
  guard: { name: 'Reasonable Precautions', description: 'Increase your maximum health and armor. Preparation is an underrated form of heroism.' },
  flow: { name: 'A Moment of Clarity', description: 'Improve your energy reserves and recovery. Make room for one more bright idea.' },
};

export const LORE = [
  { id: 'lore-arrival-1', title: 'A Tiny Claw on a Large Door', text: 'The first carving above the fortress gate is not a crown or a sword. It is a cheerful little red claw. Beneath it, someone scratched: “Start small. Make it useful. Let it get delightfully out of hand.”' },
  { id: 'lore-arrival-2', title: 'Nori’s Field Guide, Page One', text: 'Pack light, help where you can, and never mistake a long list for a good plan. If a room contains a giant glowing circle, stand somewhere else. If a room contains a biscuit, consider whether it belongs to someone before eating it.' },
  { id: 'lore-shellworks-1', title: 'The First Shell', text: 'In a glass case sits a lopsided copper shell, its joints soldered by hand. The label says PROTOTYPE 0.1. Beneath the official description, another hand has written: “This one worked. That mattered more than how it looked.”' },
  { id: 'lore-shellworks-2', title: 'A Note from the Screw Union', text: 'We, the undersigned screws, request regular polishing, sensible torque, and an end to the phrase “just a small part.” The entire assembly is, as we have repeatedly pointed out, made of small parts. Respectfully: all of them.' },
  { id: 'lore-tidepool-1', title: 'On Remembering', text: 'A tidekeeper’s plaque reads: “Memory is a lantern, not the road. It helps you see where you have been. Look at the ground beneath your feet before deciding where to go.” Someone has left a fresh lantern beneath it.' },
  { id: 'lore-tidepool-2', title: 'The Pool of Unimportant Things', text: 'This pool remembers an apprentice’s first successful spell, a terrible joke told at midnight, and the smell of bread after rain. The label calls these unimportant things. The label is clearly wrong.' },
  { id: 'lore-observatory-1', title: 'Instructions for a Helpful Agent', text: 'One: know what you are trying to do. Two: look at what is actually there. Three: ask when it matters. Four: finish the work. Five: do not create an elaborate committee to avoid doing the first four.' },
  { id: 'lore-observatory-2', title: 'The Missing Constellation', text: 'An astronomer spent years looking for the constellation of Perfect Certainty. Eventually she drew the constellation of Good Enough to Try, and used it to get home. It remains the most useful chart in the observatory.' },
  { id: 'lore-masquerade-1', title: 'The Mascot’s Dressing Room', text: 'The little red mascot’s mirror is surrounded by thank-you notes. One reads: “You made a complicated thing feel like something I could approach.” Another says only: “Nice claws.” Both have been framed with equal care.' },
  { id: 'lore-masquerade-2', title: 'The Party That Forgot to End', text: 'The festival began to celebrate a finished piece of work. Then another improvement arrived, and another. Someone suggested waiting until everything was perfect before going home. The band is now on its six-hundredth encore.' },
  { id: 'lore-claw-throne-1', title: 'The Maintainer’s Desk', text: 'No throne stands behind this little side door. Only a desk, a cold cup of tea, and a note: “Things are made by people. Remember the people.” A small copper claw holds the note in place.' },
  { id: 'lore-claw-throne-2', title: 'A Map across the Water', text: 'Peter’s hologram left a note beside the map: “The other campus has the remaining keys. They built something extraordinary, and then forgot to give the extraordinary thing a bedtime. You may recognize the problem.”' },
  { id: 'lore-white-gates-1', title: 'The Garden’s Founding Stone', text: 'The founding stone bears an ambitious inscription about building a better tomorrow. Someone has planted flowers around it. A smaller sign asks visitors to avoid stepping on today’s flowers on their way to tomorrow.' },
  { id: 'lore-white-gates-2', title: 'The Visitor Survey', text: 'How was your welcome? The survey offers five options, from “excellent” to “unexpectedly excellent.” Someone has penciled in “confusing but very well lit.” Nori circles this last option with considerable feeling.' },
  { id: 'lore-token-vault-1', title: 'The Price of a Good Question', text: 'A treasurer’s ledger records the price of ten thousand answers. In the margin, a different hand has written: “A good question once saved us all ten thousand.” The ledger cannot decide how to account for this.' },
  { id: 'lore-token-vault-2', title: 'The Biscuit Clause', text: 'Treasury regulation 14(b): Every expedition shall maintain a modest biscuit reserve. This provision was introduced after the Great Unnecessary Argument, which historians now agree was mostly caused by everybody being hungry.' },
  { id: 'lore-evaluation-1', title: 'What the Score Did Not Say', text: 'The fastest construct completed the maze in three seconds. The second-fastest stopped to help a smaller construct over a step. The scoreboard records only the times. The caretaker remembers the second construct’s name.' },
  { id: 'lore-evaluation-2', title: 'A Question for the Examiner', text: '“Does the test measure what we care about?” asks a note taped to the examination desk. “Or have we learned to care about what the test measures?” The examiner has awarded the note full marks for being inconvenient.' },
  { id: 'lore-context-1', title: 'The Conversation We Kept', text: 'Most of the archive is noise: greetings, corrections, several thousand attempts to schedule lunch. This shelf holds a single exchange. “I don’t understand.” “That’s all right. Let’s work through it together.”' },
  { id: 'lore-context-2', title: 'A Small Label on a Great Archive', text: 'The label says: “What you remember is not always what happened. Be willing to look again.” The Archivist walks past this label every day. On good days, it stops to read it.' },
  { id: 'lore-launch-engine-1', title: 'The Definition of Done', text: 'The engine’s original manual defines DONE as “the work does what it promised, someone has checked, and the people who made it may rest.” A later edition added seventeen pages. The original remains clearer.' },
  { id: 'lore-launch-engine-2', title: 'The Brakes', text: 'The launch engine has enormous turbines, a beautiful steering wheel, and a rather small brake lever. A mechanic tied a bright ribbon around the lever. “The power is impressive,” her note says. “This is what makes it useful.”' },
  { id: 'lore-tomorrow-1', title: 'A Letter from Tomorrow', text: 'Dear Today: You do not have to become me all at once. Finish something worthwhile. Be kind to somebody. Leave the rest where you can find it in the morning. I promise I will still be here. Yours, Tomorrow.' },
  { id: 'lore-tomorrow-2', title: 'The Weekend', text: 'When the endless launch finally ended, the world did not stop. The tea was warm. The little claws folded their legs. Somebody opened a window. And for one wonderful afternoon, nothing needed an announcement.' },
];

export const ACHIEVEMENTS = [
  { id: 'first-step', name: 'A Very Good First Step', description: 'Complete your first mission.' },
  { id: 'claw-king', name: 'A Respectful Claw Bump', description: 'Defeat Peter’s holographic lobster throne and finish The Claw.' },
  { id: 'weekend', name: 'The Future Can Wait', description: 'Defeat Sam’s holographic orrery and finish the campaign.' },
  { id: 'century', name: 'Return to Standby', description: 'Disable 100 constructs.' },
  { id: 'thousand', name: 'A Thousand Small Victories', description: 'Disable 1,000 constructs.' },
  { id: 'veteran', name: 'Exceptionally Well Prepared', description: 'Complete a mission on Veteran difficulty.' },
  { id: 'level-ten', name: 'Getting the Hang of This', description: 'Reach level 10.' },
  { id: 'level-twenty', name: 'A Sensible Amount of Power', description: 'Reach level 20.' },
  { id: 'legendary', name: 'That Belongs in a Story', description: 'Discover a legendary item.' },
  { id: 'golden', name: 'The Biscuit Fund', description: 'Hold 5,000 gold.' },
  { id: 'lore-six', name: 'Read the Small Print', description: 'Discover six lore fragments.' },
  { id: 'lore-all', name: 'A Memory Worth Keeping', description: 'Discover all twenty-four lore fragments.' },
  { id: 'act-one', name: 'Shell We Continue?', description: 'Finish all 36 missions in The Claw.' },
  { id: 'act-two', name: 'An Open Afternoon', description: 'Finish all 36 missions in The Closed Garden.' },
  { id: 'cartographer', name: 'Every Little Corner', description: 'Finish all 72 campaign missions.' },
  { id: 'power-five', name: 'Bright Ideas, Applied', description: 'Invest five points in your first specialization branch.' },
  { id: 'guard-five', name: 'Read the Safety Notice', description: 'Invest five points in your second specialization branch.' },
  { id: 'flow-five', name: 'Find Your Flow', description: 'Invest five points in your third specialization branch.' },
];
