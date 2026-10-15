# Repository audit — 2026-10-16

## Baseline

Repository: `thachdeptrai/me`, default `main` at merge commit `ea301dda5f838c4a61c302bf7ab60c42c0cc79e7` (PR #1, V2). Confirmed from GitHub connector.

Old structure inspected: `index.html` (~40 KB), `assets/style.css` (~41 KB), `assets/os-v2.css` (~13 KB), `assets/app.js` (~12 KB), `assets/os-v2.js` (~17 KB), `assets/universe.js` (~13 KB), `assets/data.js`, source-check scripts, V2 tests and a static GitHub Actions workflow. CSS and JS were layered, and 3D used a lightweight custom line/point renderer with Canvas fallback. Previous workflow assumed `os-v2.css`, `os-v2.js` and specific V2 terminal strings; cannot be reused unchanged.

## Approach

All V2 frontend architecture is removed on the feature branch. Reborn introduces a single static document, one stylesheet, one app controller, a separate pure-data module and a custom real-geometry WebGL2 renderer. V2's valuable interaction *concepts* (keyboard navigation, safe terminal, packet demo, project deep links, API fallback, responsive and reduced motion) are rebuilt, not imported.

## Verified public project sources (never open private credential files)

| Public repo | Files inspected | Supported claim |
| --- | --- | --- |
| [NroGT-Releases](https://github.com/thachdeptrai/NroGT-Releases) | README, tree | platform-specific Windows ZIP, Android APK, iOS unsigned IPA instructions |
| [web-kpah](https://github.com/thachdeptrai/web-kpah) | README, tree | PHP community portal, routing, accounts, rankings, wallet/points, workflows |
| [20-10](https://github.com/thachdeptrai/20-10) | README, tree | interactive letter V3, WebGL/Canvas, Three.js vendor, QR, reduced motion |
| [PhonePulse](https://github.com/thachdeptrai/PhonePulse) | `app/build.gradle.kts`, tree | native Android/Java/Gradle client, Retrofit, Room, commerce-related screens |
| [APIPhonePulse](https://github.com/thachdeptrai/APIPhonePulse) | `package.json`, tree | Express, Mongoose, Socket.IO, routes/controllers/models; no performance claims |
| [PanelAdminPhonePulse](https://github.com/thachdeptrai/PanelAdminPhonePulse) | `composer.json`, tree | PHP admin interface, MongoDB/Guzzle dependencies, views/endpoints |

These repos are offered as **code evidence**, not a claim of professional work at VinFast, complete production rollout, user counts, security guarantee or ownership of every line. Do not mirror their source or disclose private configurations.

## CI & migration

Previous workflow validated static entry files and optional headless Chrome screens. The new workflow checks updated assets, runs `node:test`, verifies `/me/` paths via HTTP and attempts CDP-based browser E2E. Previous legacy files are deleted in the same migration commit, not layered.
