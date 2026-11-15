# Verification — November 13, 2026

## Browser checks completed

- Welcome action and required-name validation.
- Explorer name and selection among four avatars; selected Wayfinder persisted after reload.
- Adventure board and future-chapter dialog; playable SDG 12 entry.
- Personalized plan with six stages and transparent guided-demo label.
- World-travel screen and transition to city map.
- Both destination controls; explorer moves before activity opens.
- Market: all three observations, locked completion before exploration, incorrect-answer feedback, retry, correct answer, location completion.
- Sorting: empty/incorrect pathway feedback, three correct matches, knowledge question incorrect/correct retry, location completion.
- Map progress advances from 0/2 through 1/2 to 2/2; assessment unlocks only at 2/2.
- Assessment: wrong answer and retry; score advances to 3/3; laboratory unlocks.
- Sample proposal, original edit to solution, save, feedback strength/question/next step, completion summary preserves edit.
- Live Keenable search: loading state followed by actual source titles, URLs, excerpts, and open-source links in UI. Public tier used without a key.
- Research/opportunity tabs and opportunity-verification notice.
- Ask Atlas: question entry and an explicitly labeled programmed explanation.
- Completion, review journey, return to world, and continue after reload with saved progress.
- Markdown download actually created `EDUTOPIA-River-field-notes.md`; file contents checked for name, observations, answers, and edited proposal (3,225 characters in initial test).
- No-GLB fallback displayed without affecting the adventure.
- Desktop 1440×1000 and mobile 390×844 reviewed visually. Mobile map has no horizontal overflow; title contrast and dialogue overlap corrected.

## Automated / server checks completed

- JavaScript syntax checks.
- Worker build embeds all six required web assets and serves HTML, scripts, images, and curriculum endpoint.
- API tests: missing-key curriculum fallback, empty and oversized query rejection, method validation, public and authenticated Keenable endpoint selection, rate-limit error, network error, unavailable Snowflake fallback.
- Real public Keenable call returned Addis Ababa research through the server endpoint.
- Browser preview HTTP 200.

## Limits

No live AI tutor or real Snowflake account was configured, so those live connections were not tested. Optional GLB viewer only tested with the asset absent. Authenticated Keenable routing was tested with a mock key, not real paid credentials. Opportunity search shares the verified live research transport; program eligibility and deadlines were not independently verified. Browser error presentation uses the same error contract tested in API checks; no outage was induced through the UI. No audio, multiplayer, accounts, accreditation, or external project submission.

The source uses plain JavaScript and CSS rather than the brief’s preferred React/TypeScript/Tailwind stack; the runnable demo requires no package installation. The included curriculum has TypeScript type declarations.

## Atlas and Earth revision

Browser checks covered the flight from Begin Journey to the city, the supplied owl portrait, the next-clue control, typed market observations and restoration after a reload, a landfill question followed by a simpler explanation, a composting question, and Keenable source lookup for a question outside the lesson. The live model endpoint is optional and was not exercised with a model credential.

## Automatic Keenable tutor revision

Browser verified automatic Keenable searches for a banana-peel composting question, source links and dates, and the contextual follow-up about making them break down faster. A live server call also returned sources for Earth’s seasons. Regression checks cover search without a model key, exact excerpt preservation, query context, new topics, empty results, rate limits, and source-grounded model requests with a mock response. Live model synthesis remains unverified without a configured model key.

## Conversational Atlas revision

Verified Keenable prompted page reading through the built Worker. Atlas answered a question about seasons, used the same NASA page to explain opposite seasons in Australia and Canada, and switched sources for how bees make honey. The homepage heading and supporting text were checked in the browser. The tutor uses Keenable for generation as well as retrieval. Its live path requires no OpenAI key.
