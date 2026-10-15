# Visual system and implementation contracts

THACH.OS / Beyond the interface. A dark editorial technology observatory: oversized Vietnamese name, engineered orbital core, precise section indices, generous negative space, thin grid lines. Mint anchors interactions; cyan and violet distinguish secondary systems. No fake console metrics or game art represented as owned assets.

Palette: background #05070B, secondary #0A1016, surface #101820, text #F0F5F4, secondary #A0ADB4, mint #A1FFD4, cyan #5EDCFF, violet #B49CFF, warm #F2D6A0. System sans fallback must retain Vietnamese glyphs; typography is responsive and wrap-safe.

Journey: arrival → two worlds → enterprise → constellation → projects → packet architecture → build pipeline → case studies → lab terminal → timeline → GitHub → quiet philosophy → contact. Natural scrolling; no hijacking. Mobile favors readable type, linear content and tap controls. 3D is an optional presentation layer.

## Actual agent organization

Six native subagents, coordinated by the root integrator. Roles are combined deliberately to avoid ten agents editing overlapping files.

| Owner | Roles | Deliverable / acceptance |
| --- | --- | --- |
| design | Creative direction, UX/UI, identity | Semantic chapter HTML and responsive tokenized CSS; meaningful fallback text |
| graphics | 3D, performance | Three.js core/constellation/warehouse; lifecycle, quality, context fallback |
| lab | Systems interaction | Real packet/pipeline controls and safe command terminal |
| projects | Content verification, public data | Evidence-backed project cases, cached GitHub workspace |
| motion_navigation | Motion and keyboard UX | GSAP scroll narrative, palette, menu, contact and minimap |
| qa_release | QA, security, release | Unit/component/E2E suites, static validator, CI/Pages workflow and measured reports |
| root | Frontend architecture, integration, final review | Dependencies, module wiring, milestones, review, commits and PR |

## Shared interfaces

- `createUniverse(canvas, {reducedMotion, quality, onSelect})`: returns `setPaused`, `select`, `setQuality`, `setProgress`, `dispose`. Warehouse/constellation use same lifecycle where applicable.
- `initLab`, `initProjects`, `initGitHub`, `initNavigation`: return disposal handle/function.
- `initMotion({onProgress})`: returns `setPaused`, `dispose`.
- `thach:motion` window event detail `{paused}` synchronizes timed experiences.
- HTML: `#universe-canvas`, `#universe`, `[data-field]`, `#field-name`, `#field-description`, `#motion-toggle`, `#quality-select`.
- Modules own `#lab-root`, `#pipeline-root`, `#terminal-root`, `#project-showcase`, `#project-detail`, `#github-workspace`, `#case-list`.
- Palette: `#command-dialog`, `#command-search`, `#command-results`, `#command-open`.
- Deep links: `#project/<id>`; normal chapter hashes remain valid.
- Shared CSS variables and `.button`, `.mono`, `.eyebrow`, `.tags`, `.section-shell`; module CSS uses scoped prefixes.

## Asset policy

Create geometry in code. No unstable image hotlinks or unauthorized brand assets. Distinguish diagram illustration from shipped application screenshot. No audio or translation toggle until a finished implementation exists.
