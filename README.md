# EDUTOPIA — The Living Explorer’s Atlas

[Open the live EDUTOPIA site](https://edutopia-living-atlas.relaxedwand2.chatgpt.site/)

An immersive learning platform where students explore real-world challenges, investigate evidence with Atlas, and design community projects.

The live site runs server-side research and tutor routes. This repository contains the source. Use the included local Worker or a Worker-compatible host to run those routes.

A complete browser-first educational chapter set in fictionalized learning environments in Addis Ababa. Original atlas and city illustrations, interactive learning activities, a guided companion, student proposals, live research discovery, and Markdown field-note downloads.

## Run locally

Requires Python 3 and Node.js 18+ (no package installation).

```sh
python3 build.py
node dev.mjs
```

Open http://localhost:4173. Rebuild and restart after changing source assets. Client source is in `dist/app.js`, `dist/style.css`, `dist/index.html`, and `dist/scene.js`; the packager embeds these in `dist/server/index.js`. The generated Worker is the deployment entrypoint. This deliberately uses plain JavaScript and browser APIs to keep the demo dependency-free; it does not use React or TypeScript at runtime. Curriculum types are declared in `data/curriculum.d.ts`.

## Complete journey

Welcome → explorer name and one of four avatars → SDG board → Atlas learning plan → travel → city map → market (inspect all three objects, answer with retry) → sorting station (match three pathways, answer with retry) → three-question reflection → six-section project → save and feedback → research → completion → field notes.

Both locations must be complete before assessment. All assessment answers must be correct before the laboratory. Every project section requires at least 10 characters. Drafts and completed work persist in browser local storage. Field notes can be downloaded at any stage. Other SDGs are explicitly labeled future previews.

## Integration status

- **Keenable: implemented server-side REST integration.** Official SDK behavior was checked against https://github.com/keenableai/keenable-sdk/blob/main/typescript/src/client.ts. `/api/research` uses the public endpoint without a key. Optional `KEENABLE_API_KEY` switches to authenticated search. Includes input validation, timeout, failure state, retry, source titles/URLs/excerpts, and distinct research/opportunity tabs. Never set a key in client JavaScript. Search queries are sent to Keenable; student project text is not automatically sent.
- **Atlas answers with Keenable.** The tutor searches for pages and uses Keenable’s prompted fetch to answer the student from a page. Follow-ups can revisit the cited page with recent dialogue. An unsupported answer triggers a second page lookup or a clarification. The chat places the supporting page in an expandable source note and saves the link to field notes. This path works with Keenable’s public tier or a server-side Keenable key.

- **Snowflake: local curriculum active.** `/api/curriculum` returns the typed dataset in `data/curriculum.json`. Set server secrets `SNOWFLAKE_ACCOUNT_URL` and `SNOWFLAKE_TOKEN` (programmatic access token) and run `data/snowflake-seed.sql` to prepare the optional SQL API connection. The token’s user needs a default warehouse and scoped SELECT access. A missing, async, malformed, or failed live response uses labeled local fallback. Live Snowflake has not been tested against a real account. The normalized tables and aggregated curriculum document share identical record structures. Official SQL API reference: https://docs.snowflake.com/en/developer-guide/sql-api/submitting-requests.
- **Epic Fab: no asset supplied.** Put a suitably licensed GLB at `public/assets/addis-scene.glb`, rebuild, and open “3D scene.” `dist/scene.js` probes for the asset and loads Google’s model-viewer component with orbit controls and lighting only when a model exists. Missing or failed assets leave the illustrated adventure intact. The absent-asset fallback is tested; real GLB loading is not tested. Confirm license and redistribute dependencies appropriately.

## Educational boundaries

The city illustration, market, station, and sorting assumptions are fictional teaching environments, not verified current facilities. No claims about 2026 Addis Ababa infrastructure. Actual accepted materials vary with service, contamination, and processing routes. Research results are external evidence to evaluate, not verified by Atlas. Opportunities require direct eligibility/deadline/availability checks. Proposals are student ideas, not approved implementations. Assessment is informal and not accredited.

## Files and deployment

`.openai/hosting.json` retains Site identity. `build.py` creates a self-contained Worker with embedded WebP images, so hosting needs no external asset bucket or browser secrets. Runtime environment variables belong in Sites secret configuration. `data/snowflake-seed.sql` is optional and should be reviewed before running against an account.

`DESIGN.md` describes the visual direction and original artwork prompts. `QA.md` records checks and limitations.
