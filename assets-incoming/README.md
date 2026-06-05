# assets-incoming (staging — gitignored)

Drop raw art / character assets here (e.g. the Duolingo-style "guide" character
faces). **Everything in this folder except this README is gitignored on purpose.**

Why staged instead of committed:

- Many itch.io / asset-pack licenses (including some "Strangers" packs) permit
  use in a game but **forbid redistributing the raw source files**. Florine is a
  **public** repo, so committing such files could break the license.
- Florine's own licenses are MIT (code) + CC BY-SA 4.0 (content). Any bundled art
  must be compatible with redistribution in a public, open-source repo.

Workflow:

1. Put files here (or attach them in chat and they'll be placed here).
2. We record each asset's **source URL + license terms**.
3. If the license allows redistribution → move into `/public/characters/` and
   wire into the UI. If not → keep here (uncommitted) and load/document
   separately so the public repo stays clean.
