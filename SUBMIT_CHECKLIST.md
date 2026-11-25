# SplitKane — SUBMIT CHECKLIST

Deadline: **Thu 26 Nov 2026, 11:59 PM IST = Fri 27 Nov 2026, 01:29 WIB**.
Form: the "Submit your project" link on https://www.kaneclihack.sh
(one submission per team; can update until the deadline).

## Done (builder, 25 Nov)

- [x] Rules read (kaneclihack.sh + TestMu AI Kane CLI docs)
- [x] Concept chosen: SplitKane, expense splitter + Kane verify loop
- [x] App built: index.html + styles.css + app.js + src/split.js (zero deps)
- [x] Unit tests for the split math: `npm run test:unit` (6 tests — MUST re-run, see below)
- [x] Kane flows written: kane/objectives.md (happy path + validation)
- [x] Closed loop built: scripts/kane-loop.cjs + scripts/ship-gate.cjs + AGENTS.md
- [x] Kane CLI installed on builder VM: v0.10.9 (`npm install -g @testmuai/kane-cli`)
- [x] README, VIDEO_SCRIPT, POSTS drafts, this checklist
- [x] Local git repo init + committed (see NOTES.md)

## Still needs parent / Sandi (browser + HP steps — builder cannot do these)

- [ ] **1. TestMu AI account**: register at https://www.testmuai.com/register/
      with **sandixhunter@gmail.com** — DONE 25 Nov ~15:19 WIB (Sandi Supriatna,
      via Google). Credits verified: **1,000 (not 10,000)**.
      (Eligibility requirement — entries without a TestMu signup can't be scored.)
- [ ] **2. Kane login**: on a machine WITH Google Chrome installed:
      `kane-cli login --oauth` (approve in browser within 2 min),
      then `kane-cli balance` (verified: 1,000 credits).
      ⚠️ Builder VM has NO Chrome — Kane runs cannot execute there.
- [ ] **3. Deploy the app to a public URL** (GitHub Pages from the repo is
      easiest — free, no backend). Update APP_URL in the verify command and
      in kane/objectives.md if it differs from http://localhost:8080.
- [ ] **4. Run Kane for real**: `npm start` (or use the public URL) then
      `npm run verify`. Must show both flows PASS + Test Manager evidence
      links. Commit `verification/VERIFIED.md` and the generated
      `<flow>_test.md` + `output-<flow>/` recordings.
      If a flow FAILS: fix the app, re-run — that IS the demo story.
- [ ] **5. GitHub repo (public)**: create `sandi215/splitkane` (Sandi's GitHub
      account is sandi215).
      Create via GitHub web UI (builder has no repo-create scope), then
      `git remote add origin … && git push -u origin main`.
      Repo MUST be public and init date ≥ 12 Nov 2026 (ours: 25 Nov ✓).
- [ ] **6. Demo video 3–5 min** on YouTube (script: VIDEO_SCRIPT.md).
      Record the REAL Kane run (step 4) — do not fake the PASS.
- [ ] **7. Two public posts** (drafts: POSTS.md) — X @Aldixx07 + Hacker News
      Show HN minimum. Save both live URLs for the form.
- [ ] **8. Submit the form** before 27 Nov 01:29 WIB with: repo URL,
      YouTube URL, the 2 post URLs, TestMu AI email (sandixhunter@gmail.com),
      confirmation Kane CLI was run.
- [ ] **9. (Optional, brownie points)** Join the hackathon Slack (link on
      kaneclihack.sh) for extra credits / help if Kane runs low on credits.

## Judging bars (must clear all three, then 4×25% scoring)

1. It works end to end — app runs, flow completes in a real browser.
2. Kane CLI caught or proved something — the two flows prove the split
   math + the validation guard-rail (evidence packs linked).
3. Agent and Kane talked to each other — kane-loop.cjs + AGENTS.md +
   ship gate; Kane's verdict decides whether the app ships.

Scoring: Ships 25% · Verified 25% · Closed loop 25% · Craft 25%.
Ties break on Verified, then Closed loop.
