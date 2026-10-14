# RecursiveIntell goes to OpenAI

The standalone isometric action RPG is served directly by this website at
`https://www.recursiveintell.com/game/claw`. Its source snapshot is game version
**0.2.0**, imported from the approved game's `dist/` directory. The game includes
its own interface and fills the browser viewport; it does not render the website
navigation or depend on an iframe, the prior Sites host, a CDN, or an API key.

## Routing and assets

`next.config.ts` rewrites the exact `/game/claw` path internally to
`/game/claw/index.html`. The browser keeps the requested URL. Next serves the
game's JavaScript, CSS, textures, icon atlas, fonts, and Three.js from
`public/game/claw/`. The HTML sets `<base href="/game/claw/">` before its asset
links, so relative document URLs also work without a trailing slash. Module
imports and renderer texture URLs resolve relative to their own module URLs.
The site's existing security headers apply without changes.

Three.js and font license files are included beside the bundled assets. Audio
is synthesized locally through Web Audio after user interaction; it needs no
remote sound service. The game needs WebGL and benefits from hardware
acceleration. Desktop keyboard and mouse provide the complete control set.

## Saves and changing origins

Progress is saved in this browser's local storage using
`recursiveintell-rpg-v1`. It is not uploaded to the website and is not shared
between devices or browser profiles. Browser storage belongs to an origin:
the previous `chatgpt.site` game, `www.recursiveintell.com`, and
`recursiveintell.com` have separate save storage.

To transfer progress, open the old game, export a JSON save from its Settings
screen, then import that file from Settings on the website. Existing version 1
saves remain compatible, including the class-tree migration in game 0.2.0.
Clearing site data clears local progress; an exported save is a portable backup.

## Updating and verifying

1. Replace `public/game/claw/` with a verified game release's complete `dist/`
   contents, including `assets/`, `vendor/`, and their licenses.
2. Restore the deployment-specific base and canonical links in `index.html`:
   `<base href="/game/claw/">` and
   `<link rel="canonical" href="https://www.recursiveintell.com/game/claw">`.
   Keep them before stylesheet and script references. Do not copy a standalone
   game's `.openai/`, credentials, save exports, or hosting configuration.
3. Refresh the game's regression tests in `tests/claw/`, changing their imports
   from `../dist/` to `../../public/game/claw/`. Run `npm run test:claw`.
4. Run the website's normal `npm run lint`, `npm test`, and
   `npm run validate:artifact` gates. After a successful production build, run
   `npm run test:claw:route` to verify the built rewrite and local asset graph.
5. Browser-smoke-test the exact `/game/claw` URL against `npm start`: begin a
   campaign, move and use a skill, open the class tree, export/import a save,
   and check for failed network requests or browser errors. Confirm the same
   URL after publishing through the website's normal deployment workflow.

The game package is excluded from the website's lint pass because it is a
standalone source snapshot with its own style. Its 51 regression tests exercise
combat, navigation, progression, save compatibility, and class specializations.
The separate route regression follows module imports, CSS resources, renderer
texture references, and font files from the document base. No new runtime or
development dependencies are required.

The campaign has 72 missions across two acts. The ten-hour playtime is a design
target, not a duration verified by a complete human playthrough.
