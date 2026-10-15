# THACH.OS V2 — engineering handoff

## Baseline audit · 15 Oct 2026

- Base commit: `bd76a9cc3364ba1be776fc357b858eac518e5861` (`main`).
- Runtime: static HTML, CSS, ES modules. No bundler/dependencies. GitHub Pages path `/me/`.
- Existing files: `index.html`, `assets/style.css`, `assets/{app,data,universe}.js`, `scripts/{check,serve}.mjs`, `package.json`.
- Existing interactions to preserve: WebGL 3D + Canvas fallback, orbit controls, motion pause, eight skill nodes, project tabs/keyboard controls, nine-step packet architecture, copy email, mobile navigation, GitHub API graceful fallback, reduced-motion, scroll progress, case studies.
- Identity: Nguyễn Ngọc Thạch; VinFast warehouse operations / SAP EWM. No unverified titles, statistics or fake portfolio screenshots.
- No framework migration: adding dependencies for a complete rewrite would increase deployment complexity and risk without improving the current static GitHub Pages constraints.

## V2 approach

Creative: restrained graphite, mint, blue and lilac, typographic scenes and depth layers. Animation remains opt-in safe, never scroll-hijacking. 4D describes 3D + time + interaction, not physical 4D rendering.

Implementation slices:

1. Identity and design enhancement via additive V2 stylesheet, while retaining legacy selectors.
2. Experience switch (Cinema / Focus / Lite), chapter progress and exploration keyboard controls.
3. Engineering Lab: packet sandbox, architecture inspector, command terminal; all labeled simulations.
4. Regression and CI checks for assets, anchors, syntax, safety, and feature affordances.
5. Review on a feature branch; no automatic merging to main.

## Security and privacy

- No secrets, server IPs, shell execution, eval, tracking scripts or authenticated GitHub calls.
- Terminal commands are a fixed allowlist, no arbitrary execution.
- Public external navigation requires safe attributes.
- Assets remain local; fonts retain system fallbacks.
- Do not misrepresent simulation as telemetry or deployment as verified.

## Evidence and remaining work

The CI workflow runs static checks and unit assertions. Browser-based screenshot, FPS, GPU profiling and real-device QA remain separate manual gates. Public Pages release requires deliberate PR merge and deployment verification. No claim of production completion before those gates.
