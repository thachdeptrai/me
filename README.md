# THACH.OS REBORN — Systems in Motion

An original, interactive, four-scene 3D portfolio for **Nguyễn Ngọc Thạch**.

**Production target:** https://thachdeptrai.github.io/me/  
**Source:** https://github.com/thachdeptrai/me  
**Identity:** VinFast / Warehouse Data & SAP EWM Operations; independent software/game builder. These activities are clearly separated.

## Why a new custom renderer?

The previous V2 had overlapping CSS/JS layers and a line/point visualization. Reborn replaces the complete frontend and renderer, rather than adding another skin.

The brief prefers Astro, React, TypeScript, React Three Fiber and GSAP. This implementation deliberately chooses a **dependency-free static ES module architecture with a custom WebGL2 geometry renderer** instead. Reasons: real geometry and material lighting/shaders without runtime CDN dependencies, no npm installation/build output to configure for GitHub Pages, and predictable `/me/` compatibility. It is **not** an Astro/React project; that preference is an explicit architectural deviation. Source is modular and could be migrated later without changing the content/evidence model.

WebGL2 scenes include:

1. **Mechanical Heart** — articulated concentric torus rings, moving mechanical blocks and particle nodes.
2. **Conceptual Warehouse** — floor grid, shelves, pallets, moving simulated unit and overhead fixtures.
3. **NRO Network** — six connected nodes, 3D links and step-controlled packet marker.
4. **Builder's Workstation** — actual 3D desk, monitor, mobile device, server stack, orbiting objects.

All are generated from original vertex/index buffers using proper 3D model/view/projection matrices, normals, material uniforms, depth testing, lighting and shader fog. Animation stops when browser tab is hidden or reduced motion is requested. Lite mode displays a CSS fallback, keeping all content and controls.

## Local run

Node.js 22+, no package installation required:

```sh
npm run dev           # http://127.0.0.1:4173/me/
npm run build         # source/asset/metadata verification
npm test              # node:test source and model tests
npm run test:e2e      # Chromium CDP browser tests + screenshots
```

The root is the **production output**, intentionally: GitHub Pages can deploy from `main` / root after a reviewed PR is merged, using `.nojekyll`. All script and stylesheet URLs are relative to the site root. Anchors and `?project=<slug>#projects` deep links survive refresh.

## Controls & keyboard

Use scroll or eight chapter navigation points; `Ctrl/⌘+K` (or `/` outside forms) opens a searchable command dialog. Scene grab areas respond to pointer drag or arrow keys; core also uses Space to pulse. Changing the graphics mode persists in localStorage where available. Packet Journey and Build Pipeline support play/pause/step/reset. Safe terminal uses fixed local commands only, with `textContent` and no shell, eval or remote command execution.

## GitHub availability

Only public GitHub metadata is fetched from `api.github.com/repos/thachdeptrai/me`, with a short timeout and explicit fallback; no tokens or private repo reads. Project links and case study text come from public repository audit and remain available offline (navigation outside the site still needs network).

## Source & verification

- `index.html` — accessible narrative, semantic content and SEO.
- `src/style.css` — design, responsive layout, reduced-motion mode and fallback.
- `src/world.js` — one WebGL2 context, shaders and four original 3D scenes.
- `src/model.js` — checked public-project evidence, safe command and simulation data.
- `src/app.js` — navigation, accessibility, simulations, state, API fallback.
- `scripts/` — local `/me/` web server and checks.
- `tests/` — source/unit/browser E2E checks.
- `.github/workflows/portfolio-ci.yml` — validation, HTTP smoke, Chromium E2E when available, screenshot artifacts.
- `docs/` — audit, evidence, QA and license/asset report.

## Limits

These are conceptual illustrations, **not real SAP transactions, internal company data, live telemetry, or a live game server**. No fictional project metrics, professional rank, certificates or live operations are claimed. No custom photo or product screenshots were available. Cinema mode can be GPU-heavy on weak devices; Balanced/Lite address this. WebGL2 unsupported/lost contexts fall back to usable static content. Font is an optional Google Fonts import with system fallback.

No third-party code is embedded. All geometry and shader code is original. External font service and repository references are disclosed in `docs/ASSET-LICENSES.md`.
