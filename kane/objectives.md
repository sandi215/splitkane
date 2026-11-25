# Kane CLI flows for SplitKane

Run them all with one command (app must be serving first — see README):

```bash
npm start            # serves the app on http://localhost:8080
npm run verify       # runs every flow below through Kane CLI in real Chrome
```

`npm run verify` (scripts/kane-loop.cjs) passes `--agent --headless` so Kane
streams NDJSON; the loop parses the `run_end` event and the exit code
(0 = pass). Each flow is also saved with `--name <flow>`, which makes Kane
write a replayable `<flow>_test.md` + `output-<flow>/` recording — commit
those after the first passing run so the suite replays from cache.

## Flow 1 — split-happy-path (the money flow)

> Go to the app, click "Clear all" to reset, then click "Load demo group"
> and verify 3 people are listed. Add an expense with description "Dinner",
> amount "30.00", paid by "Aa". Then verify Total spent shows "$30.00",
> verify Aa's balance shows "$20.00" and "is owed", and store the
> settlement list text as 'settlement'.

Why it matters: $30 split 3 ways is $10 each; Aa paid $30 so the group owes
Aa $20. If the math is off by even one cent, Kane fails the run. Expected
settlement: Sis pays Aa $10.00, Budi pays Aa $10.00.

## Flow 2 — split-validation (the guard-rail flow)

> Go to the app, click "Clear all" to reset, then click "Load demo group".
> Try to add an expense with an empty description and amount "0" and verify
> an error message is shown and no expense is added. Then add an expense
> with description "Snacks", amount "10.00", paid by "Aa", and verify Total
> spent shows "$10.00", and store the total spent text as 'total_spent'.

Why it matters: proves the form rejects garbage instead of silently
recording a $0 expense — the kind of bug an agent-written app ships
without noticing.

## Manual one-off (no loop script)

```bash
kane-cli run "Go to http://localhost:8080 and verify the page title contains 'SplitKane'" --agent --headless
echo $?   # 0 = passed
```
