# SplitKane — VIDEO SCRIPT (3–5 min, YouTube)

Target length: ~4 min. Record screen + voiceover (no face needed).
App URL on screen: the deployed/public URL (GitHub Pages) — fallback:
`http://localhost:8080` with a note that it is the same code.

## Shot list

| # | Time | Shot | Say (voiceover) |
|---|---|---|---|
| 0 | 0:00–0:20 | Title card: "SplitKane — my agent builds it, Kane verifies it" + hackathon name | "AI agents write code fast but can't check their own work. I built SplitKane, an expense splitter — and Kane CLI verifies the math in a real browser before it ships." |
| 1 | 0:20–1:00 | Browser: open the app, click Load demo group, add Dinner $30 paid by Aa | "Zero backend, zero login. Three friends, one $30 dinner. Watch the balances: Aa is owed $20, Sis and Budi owe $10 each — and the settlement plan says exactly who pays whom." |
| 2 | 1:00–1:40 | Show the $10-among-3 edge case: add Snacks $10.00, balances still sum to zero | "The trap in every splitter: $10 split 3 ways. Ours is integer cents — $3.34, $3.33, $3.33 — it always sums back to exactly $10. No cent ever disappears." |
| 3 | 1:40–2:10 | Try the bad input: empty description, amount 0 → error shown, nothing recorded | "And the guard rails: an empty or zero expense gets rejected with an error instead of silently corrupting the totals." |
| 4 | 2:10–3:20 | Terminal: `npm run verify` — Kane CLI opens real Chrome, runs both flows, PASS + evidence link; show `verification/VERIFIED.md` | "Now the loop. One command runs both flows through Kane in real Chrome. Kane reads the page, does the math, and returns pass or fail. This run passed — the evidence pack and Test Manager link are right here." |
| 5 | 3:20–3:50 | Terminal: `npm run ship` → "SHIP: OK"; then show `scripts/kane-loop.cjs` briefly + AGENTS.md rule | "Ship is gated on that pass. No fresh Kane verification, no ship. The loop script parses Kane's verdict, and the agent rule is simple: never hand back a change Kane hasn't checked." |
| 6 | 3:50–4:10 | Closing card: repo URL, "Built with an AI agent, verified with Kane CLI", TestMu AI credit | "SplitKane: built by an agent, verified by Kane. Repo and Kane flows are linked below — try breaking the math, Kane will catch you." |

## Recording checklist

- [ ] App deployed to a public URL (so Kane + judges can reach it without localhost)
- [ ] Fresh browser profile / Clear all clicked before take 1 (no stale localStorage)
- [ ] Terminal font large enough to read at 1080p
- [ ] Kane run recorded live (do NOT fake the PASS — if it fails on camera, that IS the loop: fix + re-run, keep it in)
- [ ] Show the Test Manager evidence link on screen at least once
- [ ] Keep it under 5:00; aim 3:30–4:15
