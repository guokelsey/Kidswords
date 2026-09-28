# LearnQuest

An open-source kids learning game (ages 6–10). Two modes:

- **Spelling** — see Chinese, type English.
- **Mental math** — answer fast, deal damage.

Correct answers attack monsters. Streaks stack the damage multiplier. Boss fights every few monsters. Daily challenges build return-visit habits. Earn gems, redeem cosmetic skins for your projectile and HUD.

## Why this exists

Most "edu games" are paywalled, ad-laden, or single-platform. LearnQuest is:

- **MIT licensed** — fork it, modify it, ship it.
- **Offline-first** — no server, no account, no analytics, no tracking. All progress lives in the browser's localStorage.
- **Privacy-respecting by default** — the parent dashboard requires no PIN because kids shouldn't be locked out of _seeing their own progress_.
- **Content-author-friendly** — drop your own word lists into `content/words/user.json` (gitignored) and the game uses them.

## Quick start

Requires Node ≥ 22.

```sh
npm install
npm run dev      # http://localhost:5173
```

Other scripts:

```sh
npm test         # run vitest
npm run check    # svelte-check type check
npm run lint     # prettier + eslint
npm run build    # static bundle in build/  (deploy to any static host)
```

## Project status

🚧 **Pre-release.** Milestone M1 (scaffold) shipped. See [ROADMAP](#roadmap).

## Stack

- **SvelteKit** (Svelte 5 + runes) — small bundle, fast hydration
- **TypeScript** — strict mode
- **PixiJS** — sprite/animation engine
- **WebAudio** — procedural sound, zero asset weight
- **Vitest** — unit tests on pure core functions

## Architecture

```
src/
├── core/         pure game logic: damage, streak, skills, difficulty, daily, gems
├── content/      📁 JSON: words/, math/, monsters/, shop/  (hot-loadable)
├── scenes/       UI screens: home, battle, result, shop, parent, settings
├── components/   reusable UI (Button, MonsterSprite, HPBar, …)
├── lib/          audio, storage (versioned localStorage), pixi mount, i18n
└── routes/       SvelteKit pages

tests/            vitest specs — focused on src/core/ purity
```

Key design rules:

1. **`core/` is pure functions.** No DOM, no Pixi, no Svelte. Trivial to test.
2. **`content/` is JSON.** Add a word list, drop the file, done.
3. **No network calls in production code.** All assets ship with the bundle.

## Roadmap

Milestones, each = one PR:

| M   | Status | Deliverable                                             |
| --- | ------ | ------------------------------------------------------- |
| M1  | ✅     | Scaffold, CI, Pages deploy, procedural audio stub       |
| M2  | ⏳     | Battle loop: 1 monster, spelling mode, damage + streak  |
| M3  | ⏳     | Math mode + adaptive difficulty                         |
| M4  | ⏳     | Multi-monster world (4 small + 1 boss)                  |
| M5  | ⏳     | Daily streak + daily challenge                          |
| M6  | ⏳     | Gems currency + cosmetic shop                           |
| M7  | ⏳     | Parent dashboard                                        |
| M8  | ⏳     | i18n (zh-CN / en-US) + audio polish                     |
| M9  | ⏳     | Content authoring docs + sample word pack + monster art |
| M10 | ⏳     | v1.0 release notes, screenshots, GIF demo               |

## Content authoring

### Custom word lists

Create `content/words/user.json` (gitignored):

```json
{
  "version": 1,
  "grade": 1,
  "words": [
    { "zh": "苹果", "en": ["apple", "an apple"], "accept": ["apples"] },
    { "zh": "你好", "en": ["hello", "hi"], "accept": [] }
  ]
}
```

Format rules: `en[0]` is the canonical answer; `accept` are extra accepted forms. Comparison is case-insensitive, trim, ignore final punctuation.

### Custom monster packs

Create `content/monsters/user.json`:

```json
{
  "version": 1,
  "monsters": [
    { "id": "slime", "hp": 20, "art": "🟢", "skills": [] },
    { "id": "dragon", "hp": 120, "art": "🐉", "skills": ["aoe"], "boss": true }
  ]
}
```

More docs land in M9.

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md). Bug reports and PRs welcome. Please open an issue before sending non-trivial PRs.

## License

MIT. See [LICENSE](./LICENSE).
