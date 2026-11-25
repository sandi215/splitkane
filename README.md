# SplitKane

**Split expenses with friends. The math is verified in a real browser by Kane CLI — every release ships only if Kane passes.**

Built for the [Kane CLI Online Hackathon](https://www.kaneclihack.sh) (TestMu AI, 12–26 Nov 2026). Solo entry, zero backend, zero login, zero cost.

## The problem

AI coding agents write code fast but can't check their own work. A
hand-rolled split calculator is exactly the kind of app that ships a
one-cent rounding bug nobody notices — $10 split 3 ways comes out $9.99
and the group quietly loses a cent forever.

SplitKane fixes the loop: the agent builds the app, **Kane CLI drives it
in real Chrome and checks the split math end to end**, and the result
feeds back into the agent. Fail → fix → re-run until green. Ship is
gated on a fresh Kane pass.

## What it does

- Add people, add expenses (description, amount, who paid), split
  equally. All money is integer cents — `$10 / 3 = $3.34 + $3.33 + $3.33`,
  never `$9.99`.
- Live balances (who is owed / who owes) and a minimal settlement plan
  ("Sis pays Aa $10.00").
- Form validation: empty description or amount ≤ $0 shows an inline
  error and records nothing.
- Demo seed button, clear-all, data saved only in your browser
  (localStorage). No account, no tracking, no backend to deploy.

## Run it (30 seconds)

```bash
npm start        # serves on http://localhost:8080 — or open index.html directly
```

No build step, no dependencies. Any static host works (GitHub Pages,
Netlify Drop, `python3 -m http.server`).

## Verify it with Kane CLI (the point of the project)

Prereqs, once: a TestMu AI account (1,000 free credits for new
accounts — verified 25 Nov 2026 — register at testmuai.com with the same email as the
hackathon), Google Chrome, and:

```bash
npm install -g @testmuai/kane-cli
kane-cli login --oauth     # approve in the browser within 2 minutes
kane-cli balance           # check your free credits
```

Then:

```bash
npm run verify   # runs every flow in kane/objectives.md through Kane
npm run ship     # refuses to ship unless unit tests pass AND Kane passed <24h ago
```

What Kane checks, in a real browser:

| Flow | What Kane proves |
|---|---|
| `split-happy-path` | $30 dinner, 3 people, Aa paid → total $30.00, Aa is owed $20.00, settlement is Sis→Aa $10 + Budi→Aa $10 |
| `split-validation` | Empty / $0 expense is rejected with an error and recorded nowhere; a valid $10 expense then totals $10.00 |

Passing runs write `verification/VERIFIED.md` (with the Test Manager
evidence links); failures write `verification/FAILURE.md` with the
failing step. First passing run also saves replayable
`<flow>_test.md` files via `--name` — commit them so the suite replays
from cache.

Unit tests for the same math (no browser needed): `npm run test:unit`.

## How the loop works

```
agent edits code → npm run verify → Kane drives real Chrome
      ↑                                │
      └──── fix, re-run ─── FAIL ───────┤
                                        └─ PASS → VERIFIED.md → npm run ship ✅
```

See `AGENTS.md` for the agent instructions and `scripts/kane-loop.cjs`
for the loop (NDJSON `run_end` parsing, exit-code gating).

## Repo layout

```
index.html / styles.css / app.js   the app (vanilla JS, zero deps)
src/split.js                       pure split math (shared by browser + Node tests)
tests/split.test.js               unit tests for the math Kane verifies
kane/objectives.md                 the plain-English Kane flows
scripts/kane-loop.cjs              verify loop: Kane → verdict → VERIFIED/FAILURE.md
scripts/ship-gate.cjs              ship gate: unit tests + fresh Kane pass
verification/                      VERIFIED.md / FAILURE.md (written by the loop only)
```

## Hackathon submission

- Demo video (3–5 min, YouTube) + 2 public posts: see
  `VIDEO_SCRIPT.md` and `POSTS.md`.
- Submit via the form linked on kaneclihack.sh before
  **26 Nov 2026, 11:59 PM IST (27 Nov 01:29 WIB)**.
- Status checklist: `SUBMIT_CHECKLIST.md`. Build notes: `NOTES.md`.
