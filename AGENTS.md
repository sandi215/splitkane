# AGENTS.md — instructions for any AI coding agent working on SplitKane

## The rule

**Never hand back a change to this app without verifying it in a real
browser with Kane CLI.** You write code fast; you cannot check your own
work. Kane closes that loop.

## How to verify (every change, every time)

```bash
npm start            # serve the app on http://localhost:8080 (keep running)
npm run verify       # runs all Kane flows, parses the run_end verdict
```

- `npm run verify` runs `scripts/kane-loop.cjs`, which calls:
  `kane-cli run "<objective>" --agent --headless --url http://localhost:8080 --name <flow>`
- `--agent` is REQUIRED: it switches stdout to NDJSON. Read the LAST line
  (`run_end`): `status`, `summary`, extracted values, Test Manager link.
- Exit code `0` = passed. Anything else = failed: read the failing step's
  remark, fix the app, re-run the SAME objective until it passes.
- On all-pass the loop writes `verification/VERIFIED.md`; on any fail it
  writes `verification/FAILURE.md` and exits non-zero.
- `npm run ship` refuses to ship unless unit tests pass AND
  `verification/VERIFIED.md` is fresher than 24h.

## Writing objectives

- One objective = one flow, starting with `Go to <url> and …`.
- Use the "store as" pattern for values the verdict needs:
  `… and store the settlement list text as 'settlement'` — never just
  "read the total".
- Keep flows under ~15 steps; split longer flows into multiple runs.
- Flows live in `kane/objectives.md`. First passing run with `--name`
  saves a replayable `<flow>_test.md` — commit it.

## Prereqs (human does this once)

```bash
npm install -g @testmuai/kane-cli   # Node 18+, Google Chrome required
kane-cli login --oauth              # approve in the browser within 2 min
kane-cli balance                    # 1,000 free credits on a new TestMu AI account (verified 25 Nov 2026)
```

## Never

- Do not drive a browser with Playwright/Puppeteer/Selenium for checks
  you run yourself — use `kane-cli`.
- Do not claim a flow "passes" from reading the code. Only a Kane
  `run_end` with status `passed` (or `verification/VERIFIED.md`) proves it.
- Do not edit `verification/VERIFIED.md` by hand. It is written only by
  the loop script after a real passing run.
