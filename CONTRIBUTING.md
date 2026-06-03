# Contributing to Florine

There are two very different kinds of contribution, and they almost never
overlap:

- **Content** (French curriculum) → you work in `/content`, in JSON. You do not
  need to know React.
- **Code** (the app engine) → you work in `/src`, `/api`, `/scripts`.

## The golden rule: no French ships without native-speaker review

Every unit has a `review_status.json`. The `status` field moves through:

`draft` → `pending_review` → `approved` (or `needs_changes`)

A unit is only "done" when a **native speaker** has reviewed it and `status` is
`approved`, with their name/date recorded in `reviewers`. Until then the app
shows a visible "not yet approved" warning on that unit. **Do not flip a unit to
`approved` without a real native-speaker sign-off.**

## Adding or editing content

1. Copy an existing unit folder under `content/<level>/` as a starting point.
2. Edit the three files — see [`content/README.md`](content/README.md) for the
   field-by-field schema:
   - `lesson.json` — concept (English), vocabulary, examples
   - `exercises.json` — drills in the six DELF-aligned formats
   - `review_status.json` — keep `status` at `pending_review` until a native
     speaker approves
3. Validate before opening a PR:
   ```bash
   python scripts/validate_content.py
   ```
4. Open a PR. Vercel posts a **preview deployment** so reviewers can click
   through your unit live before it merges.

## Code contributions

```bash
npm install
npm run dev
npm run lint
npm run build   # must pass (runs tsc -b)
```

- The content **schema** lives in `src/lib/content/schema.ts` (Zod). If you
  change it, bump `CONTENT_SCHEMA_VERSION` and note the migration in
  `content/README.md`.
- Keep code and content concerns separate. UI strings about the *interface* can
  be hard-coded; anything that is *French curriculum* belongs in `/content`.

## Issues

Use the templates: **content correction**, **bug report**, or **feature
request**. Content corrections from native speakers are especially welcome.
