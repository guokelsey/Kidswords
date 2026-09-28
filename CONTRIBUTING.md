# Contributing to LearnQuest

Thanks for helping build an open-source learning game for kids.

## Ground rules

- **Kid-first.** No dark patterns, no FOMO timers, no pay-to-win. Cosmetics only.
- **Privacy-first.** No network calls in production code. No analytics. No tracking. PRs that add any of these will be rejected.
- **Offline-first.** All progress lives in `localStorage`. Server code is out of scope.
- **Accessibility-first.** Big tap targets, readable fonts, screen-reader labels, color-not-only signals. PRs that regress a11y will be rejected.
- **No copyrighted content shipped.** Word lists must be self-authored or CC0/CC-BY-SA. Do not commit PEP textbook excerpts. Do not commit song lyrics, book passages, or scraped content.

## Development

Requires Node ≥ 22.

```sh
npm install
npm run dev       # local server with HMR
npm test          # unit tests (vitest, watch mode: npm run test:watch)
npm run check     # svelte-check type check
npm run lint      # prettier + eslint (CI runs the same)
npm run build     # production bundle
```

## Code layout

| Path                | Rule                                                              |
| ------------------- | ----------------------------------------------------------------- |
| `src/core/**`       | Pure functions only. No DOM/Pixi/Svelte imports. Trivial to test. |
| `src/lib/**`        | Side-effecty helpers (Audio, Storage, Pixi mount).                |
| `src/scenes/**`     | Svelte components per game screen.                                |
| `src/components/**` | Reusable UI atoms.                                                |
| `content/**`        | JSON-only. Add a file, that's it.                                 |
| `tests/**`          | Mirror `src/` structure where useful.                             |

## Pull requests

1. Open an issue first for non-trivial changes (new feature, refactor, behavior change). Trivial fixes (typos, dead-code removal) can go straight to PR.
2. One logical change per PR. Smaller PRs merge faster.
3. `npm run check`, `npm test`, `npm run lint` must all pass locally. CI runs the same.
4. Add tests for any new `src/core/` function. Existing tests are the spec.
5. Screenshots/GIFs welcome for any UI change.
6. PR description: what changed + why. Link the issue if there is one.

## Commit messages

Imperative mood, ≤ 72 chars subject, blank line, optional body explaining _why_:

```
combat: cap streak multiplier at 5x

Pure damage formula was unbounded for long streaks, making late-game
trivial. Cap preserves the reward curve without breaking existing
tests; new test covers the cap.
```

## Reporting bugs

Use GitHub Issues. Include:

- What you expected vs what happened
- Browser + OS
- Steps to reproduce (the smaller the repro, the faster the fix)
- Console output if relevant

## Proposing features

Open an issue with the `feature` label. Describe:

- Who benefits (kid? parent? teacher? contributor?)
- What success looks like
- Rough scope (small/medium/large)
- Alternatives considered

Large features → design doc first.

## Code of conduct

Be kind. Assume good faith. Don't ship anything that would embarrass you in front of a 7-year-old.

## License

By contributing, you agree your contributions are MIT-licensed, same as the project.
