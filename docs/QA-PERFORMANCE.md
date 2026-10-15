# QA & performance evidence — 2026-10-16

## Tests run locally

- `npm run build`: **PASS** — 51 distinct HTML IDs, valid local assets/anchors, syntax of all JS modules/test scripts, SEO and identity checks.
- `npm test`: **PASS** — 9 test cases spanning chapters, project deep links, packet/pipeline model, safe terminal, native Java PhonePulse identity, DOM/SEO contract, 3D scene structure, reduced-motion and fallback CSS/JS.
- `npm run test:e2e`: **BLOCKED at browser navigation**, not marked pass. Locally available managed Chromium enforces `URLBlocklist: ["*"]` and redirects `http://127.0.0.1:42187/me/` to an organization-blocked error. Node HTTP smoke is accessible; CDP connects, but DOM navigation is disallowed by browser policy. Full browser E2E and screenshots are delegated to unrestricted CI when available.

## Coverage and additional release gates

Browser E2E attempts desktop & mobile 390px navigation, chapter/project render, packet step/reset, pipeline step, switchable bench, simulated warehouse, safe terminal XSS rejection, command dialog, deep-link on reload, Cinema/Lite controls, reduced motion, no horizontal overflow and screenshots. See `tests/e2e.mjs`.

Manual gates before merging: review all four 3D scenes on desktop, Android Chrome and iPhone Safari; confirm keyboard focus visibility, reduced motion and screen reader announcement for lab state, project links, basic readability in Lite/no WebGL; inspect screenshots and test color contrast; run Chromium E2E in CI and resolve any failures.

## Performance budgets and real limitations

Custom renderer uses a single WebGL2 context (instead of four simultaneous contexts). Canvas capped at pixel ratio 1.8 (Cinema), 1.35 (Balanced), 1.0 (Lite). Tab-hidden pause; Reduced Motion freezes time. CPU geometry uploads once at initial renderer creation, and each frame draws only one selected scene. No photos/models/audio files are loaded. Code is served as modules with zero runtime npm dependencies and optional remote fonts.

This is a **design-level budget, not measured FPS/LCP**. Performance measurements on real mobile GPUs, Safari/WebGL2 and Chrome Lighthouse remain unverified until interactive browser testing on permitted devices. Do not claim 60fps, Lighthouse score or accessibility certification.

## Risks tracked

- GPU-intensive many separate draw calls in Cinema on entry-level mobile; use Balanced/Lite.
- WebGL2 unavailable or context loss: CSS-only fallback; manually verify on a real WebGL-disabled browser.
- Third-party Google Fonts and GitHub REST API can be offline, blocked or rate-limited; fallback exists.
- Browser E2E on this managed container blocked by organizational Chrome policy; run in unrestricted CI.
- Astro/React/R3F preference not followed; the custom static WebGL2 renderer is an intentional tradeoff documented in README.
