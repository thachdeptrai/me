# THACH.OS V2 — repository audit

Baseline: `bd76a9c` on `main`, inspected 2026-10-15. Clean checkout before changes.

## Existing architecture and observed behavior

Static HTML plus three JavaScript modules; no dependencies, production compilation or CI workflow. `scripts/check.mjs` passes baseline syntax, local asset, anchor, ID and identity checks. This is a static check, not a browser usability or performance measurement.

- `index.html`: biography, VinFast / EWM work, dual identity, eight capability groups, four project tabs, network map, build flow, release case study, timeline, Labs descriptions, GitHub and contact.
- `assets/app.js`: tab keyboard navigation, menu, pause toggle, packet timer, copy email, section progress, lazy public GitHub fetch.
- `assets/universe.js`: custom line/point WebGL sphere with drag and Canvas fallback. No resource disposal or context restoration; no materials, raycast selection, scene choreography or quality choices.
- `assets/data.js`: technology labels, nine network steps, one release case study.
- `assets/style.css`: large compressed stylesheet, responsive rules and motion settings.
- `scripts/serve.mjs`: development static server. Existing README describes root-branch GitHub Pages; actual Pages source setting is not confirmed.

## Migration decisions

Keep semantic, server-readable HTML for biography and chapters. Use Vite for reproducible production bundles, dependency locking and `/me/` asset paths. React/TypeScript in the brief is proposed rather than mandatory: adding a client framework solely to render this static content would reduce no-JS resilience without solving a state-sharing requirement. Interactive modules use scoped lifecycle and explicit contracts.

| Existing capability | V2 destination | Disposition |
| --- | --- | --- |
| Hero WebGL sphere and drag | Lazy Three.js custom lit core, constellation, warehouse | Replaced and expanded |
| Eight field buttons | Semantic selectors with HTML detail and renderer selection | Preserved |
| Motion pause / reduced motion | Shared motion state + quality modes | Expanded |
| Four project tabs | Verified project destinations and deep-linked case dialog | Replaced; unsupported claims corrected |
| Network map and packet run | Lab: inspect, play, pause, step, reset, speed, persistence | Expanded |
| Build flow | Interactive labeled pipeline simulation | Expanded |
| Labs descriptions | Working safe terminal and simulations | Replaced |
| Public GitHub API | Cached validated search/filter/release workspace | Expanded |
| VinFast / EWM, education, timeline | Dedicated authored chapters | Preserved; no private operational data |
| Contact copy and menu | Navigation module and accessible dialogs | Preserved |
| Static Pages URLs | Vite `/me/`, hash details, Actions build/deploy gate | Preserved |

## Risk controls

Keep real personal work separate from enterprise employment. Verify public README/code/releases before featuring repository claims. No tokens, internal IPs, fake screenshots, invented metrics or unsupported seniority. All architecture illustrations and packet/pipeline data are labeled simulations. API data goes through schema and URL validation and safe DOM construction. No eval, raw HTML injection or shell execution in terminal.

Heavy graphics load independently, never gate text. Lite/reduced motion and WebGL failure preserve content. Visibility and intersection pause GPU/timers; renderer owns cleanup. Test fallback, keyboard, deep links and 320–1920 px layouts. Browser and real device benchmarks are reported only when actually run.

## Delivery boundaries

Feature branch `feat/thach-os-v2`, incremental commits, reviewed PR targeting main. No force pushes. The prompt explicitly prohibits merging main without instruction: production deployment remains gated by that merge and Pages configuration. A successful build or PR is not represented as a deployed site.
