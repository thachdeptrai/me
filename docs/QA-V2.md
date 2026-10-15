# THACH.OS V2 · QA and release gate

## What was verified

- Baseline repository verified at `bd76a9cc`. The old static portfolio had working structural affordances (WebGL renderer, Canvas fallback, 8 orbit labels, 4 project tabs, 9 network nodes, API fallback, mobile navigation and contact).
- Manual source review: V2 script parses as JavaScript and attaches only to dedicated V2 IDs. No shell execution, no GitHub token, no external live telemetry, no new runtime package dependency.
- `npm run build`: validates JS syntax, local files, duplicate IDs and internal links.
- `npm test`: checks V2 DOM targets, feature contracts, legacy feature counts, links, simulation labels, accessibility controls and unsafe-eval avoidance.
- GitHub Actions validates both commands and HTTP responses under the GitHub Pages `/me/` subpath.
- The browser smoke step attempts an actual headless Chrome DOM boot check and saves 1440×900 / 390×844 screenshots when Chrome is available. Consult the latest workflow run for the actual result (never infer completion from this document alone).

## How to reproduce

```bash
npm run build
npm test
npm run dev
# Browse http://localhost:4173/me/
```

Manual user-journey checklist:

1. Try Cinema / Focus / Lite and check that reduced-motion users are not forced into animation.
2. Use Ctrl+K or /; type "Network", arrow up/down, Enter, Escape, mouse interaction.
3. Enter Packet Lab, use Play / Pause / Step / Reset and all three speeds; leave viewport and confirm animation stops.
4. Select every Architecture node and pipeline stage; verify responsibilities and statuses.
5. Type help, about, skills, projects, experience, github, contact and clear in terminal; test arrow history and unknown command.
6. Open each project tab, share its URL, refresh the link and verify correct tab remains selected.
7. Test 390px/768px/1440px widths, keyboard tab sequence, WebGL unavailable, system reduced motion and offline GitHub API.
8. Inspect runtime console, FPS and memory on actual desktop/mobile devices.

## Regression and privacy

- Preserved: WebGL/Canvas fallback, 8 technical domains, 4 project tabs, original 9-step network map, case study, GitHub public API + offline fallback, copy email, mobile navigation and responsive layout.
- Enhanced: cinematic branding, scroll-driven hero camera, reduced complexity modes, navigation palette, interactive lab, deep links, CI.
- No removed live feature identified in the reviewed source.
- All packet/build simulations are explicitly marked and do not transmit data.

## Honest release limitations

- This feature branch has **not** been merged to `main`; GitHub Pages production was not deployed by these changes.
- Real-device FPS/GPU/memory benchmarking, hands-on visual inspection and screen reader audits remain outstanding.
- A dependency-free enhancement of the existing WebGL engine is not equivalent to a full Three.js + React Three Fiber rebuild.
- More complex scene transitions, custom GLSL volumetrics, bilingual translations and real-world project detail pages need separate future milestones with verified assets and test coverage.
- Chrome screenshots, if uploaded by CI, are smoke artifacts and do not automatically prove visual quality.

The Pull Request is the review boundary. Merge only after inspecting changes and verifying the required quality gates.
