# SplitKane — PUBLIC POSTS (2 minimum required)

Post both AFTER the repo is public and the demo video is on YouTube, so
every post links repo + video. Post from @Aldixx07 (main) — never from
@S4nd169 for this. Keep each post native to the platform (no link-dump).

## Post 1 — X (@Aldixx07)

> My agent built an expense splitter in an afternoon. Then I made it prove the math.
>
> $10 split 3 ways = $3.34 + $3.33 + $3.33. Never $9.99.
>
> Kane CLI drives it in real Chrome and fails the build if one cent is off. No fresh Kane pass = no ship.
>
> Built for the Kane CLI Hackathon by @testmuai 🧪
> Repo: <REPO_URL>
> Demo: <YOUTUBE_URL>

Alt shorter version (if the above is too long for one post, thread it 2 posts):

1/ Agents write code fast but can't check their own work. So I built SplitKane — an expense splitter that refuses to ship until Kane CLI verifies the split math in a real browser.
2/ $30 dinner, 3 friends, Aa paid → Aa is owed $20.00. Kane checks it live. Fail = fix + re-run. Repo + demo 👇 <REPO_URL> <YOUTUBE_URL>

## Post 2 — Hacker News (Show HN)

Title: `Show HN: SplitKane – an expense splitter that won't ship until Kane CLI verifies the math`

Body:

> I built a tiny expense splitter (vanilla JS, zero backend) for the Kane CLI Hackathon. The interesting part isn't the app — it's the loop around it.
>
> Every change goes through `npm run verify`: Kane CLI opens real Chrome, adds people and expenses in plain English, and checks the balances. $10 split 3 ways must come back $3.34 + $3.33 + $3.33 — if a cent goes missing, the run fails and `npm run ship` refuses.
>
> The loop script parses Kane's NDJSON `run_end` verdict and writes VERIFIED.md / FAILURE.md; the agent instructions (AGENTS.md) forbid handing back any change Kane hasn't checked.
>
> Repo: <REPO_URL>
> Demo video: <YOUTUBE_URL>
>
> Happy to hear how others wire browser verification into agent loops — what do you gate your deploys on?

## Optional Post 3 — LinkedIn (brownie points)

> AI coding agents can write a working app in minutes. What they can't do is check their own work.
>
> For the Kane CLI Online Hackathon I built SplitKane: a zero-backend expense splitter with one rule — it only ships if Kane CLI verifies the split math in a real browser.
>
> The loop: agent edits → `npm run verify` → Kane drives Chrome → pass writes VERIFIED.md, fail writes FAILURE.md and blocks the ship.
>
> Repo + 4-min demo: <REPO_URL> / <YOUTUBE_URL>
> #AI #Testing #Hackathon #TestMuAI

## Posting checklist

- [ ] Replace <REPO_URL> and <YOUTUBE_URL> with the real links
- [ ] Post 1 (X) + Post 2 (HN) at minimum; LinkedIn optional extra
- [ ] Save the live URLs of both posts — the submission form asks for them
- [ ] Do NOT post from @S4nd169; use @Aldixx07
