#!/usr/bin/env node
/**
 * SplitKane verify loop — the closed loop between the agent and Kane CLI.
 *
 *   npm run verify
 *
 * 1. Makes sure the app is serving (APP_URL, default http://localhost:8080).
 * 2. Runs each flow in kane/objectives.md through Kane CLI in a REAL Chrome
 *    browser: `kane-cli run "<objective>" --agent --headless --url <APP_URL>`.
 *    --agent streams NDJSON; the last event (run_end) carries the verdict.
 *    --name saves the flow as a replayable _test.md for next time.
 * 3. On ALL PASS: writes verification/VERIFIED.md (timestamp, per-flow
 *    summary, Test Manager links) — this is what `npm run ship` gates on.
 * 4. On ANY FAIL: writes verification/FAILURE.md with the failing step and
 *    exits non-zero, so the agent (or CI) must fix the app and re-run.
 *
 * Prereqs (one time, see README.md "Verify with Kane CLI"):
 *   npm install -g @testmuai/kane-cli
 *   kane-cli login --oauth        (approve in the browser within 2 minutes)
 *   kane-cli balance              (1,000 free credits on a new TestMu AI account — verified 25 Nov 2026)
 *   Google Chrome installed; app running on APP_URL.
 */
'use strict';

const { spawnSync } = require('node:child_process');
const fs = require('node:fs');
const path = require('node:path');

const ROOT = path.resolve(__dirname, '..');
const APP_URL = process.env.APP_URL || 'http://localhost:8080';
const OUT_DIR = path.join(ROOT, 'verification');
fs.mkdirSync(OUT_DIR, { recursive: true });

// Plain-English objectives. One objective = one flow. "Store as" pattern
// for every value the verdict depends on.
const FLOWS = [
  {
    name: 'split-happy-path',
    objective:
      `Go to ${APP_URL} and click "Clear all" to reset, then click "Load demo group" and verify 3 people are listed. ` +
      `Add an expense with description "Dinner", amount "30.00", paid by "Aa". ` +
      `Then verify Total spent shows "$30.00", verify Aa's balance shows "$20.00" and "is owed", ` +
      `and store the settlement list text as 'settlement'.`,
  },
  {
    name: 'split-validation',
    objective:
      `Go to ${APP_URL} and click "Clear all" to reset, then click "Load demo group". ` +
      `Try to add an expense with an empty description and amount "0" and verify an error message is shown and no expense is added. ` +
      `Then add an expense with description "Snacks", amount "10.00", paid by "Aa", and verify Total spent shows "$10.00", ` +
      `and store the total spent text as 'total_spent'.`,
  },
];

function runFlow(flow) {
  console.log(`\n=== Kane: ${flow.name} ===`);
  const args = [
    'run', flow.objective,
    '--agent', '--headless', '--timeout', '300',
    '--url', APP_URL, '--name', flow.name,
  ];
  const res = spawnSync('kane-cli', args, { encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 });
  const lines = (res.stdout || '').split('\n').filter(Boolean);
  let runEnd = null;
  const failedSteps = [];
  for (const line of lines) {
    let ev;
    try { ev = JSON.parse(line); } catch { continue; }
    if (ev.type === 'run_end') runEnd = ev;
    if (ev.status === 'failed' || ev.status === 'error') {
      failedSteps.push(`step ${ev.step ?? '?'}: ${ev.remark || ev.message || JSON.stringify(ev)}`);
    }
  }
  const passed = res.status === 0 && runEnd && runEnd.status === 'passed';
  return {
    name: flow.name,
    passed: Boolean(passed),
    exitCode: res.status,
    duration: runEnd ? runEnd.duration : null,
    summary: runEnd ? runEnd.summary : (res.stderr || '').trim().slice(0, 500) || 'no run_end event',
    testUrl: runEnd ? runEnd.test_url : null,
    finalState: runEnd ? runEnd.final_state : null,
    failedSteps,
    stderrTail: (res.stderr || '').trim().slice(-1000),
  };
}

function main() {
  // Preflight: is kane-cli even here?
  const which = spawnSync('kane-cli', ['--version'], { encoding: 'utf8' });
  if (which.error || which.status !== 0) {
    console.error('kane-cli is not installed. Run: npm install -g @testmuai/kane-cli');
    process.exit(2);
  }
  console.log(`kane-cli ${String(which.stdout || '').trim()} · app: ${APP_URL}`);

  const results = FLOWS.map(runFlow);
  const stamp = new Date().toISOString();
  const allPassed = results.every((r) => r.passed);

  for (const r of results) {
    console.log(`\n[${r.passed ? 'PASS' : 'FAIL'}] ${r.name} (exit ${r.exitCode}, ${r.duration ?? '?'}s)`);
    console.log(`  ${r.summary}`);
    if (r.testUrl) console.log(`  evidence: ${r.testUrl}`);
    if (!r.passed && r.failedSteps.length) r.failedSteps.forEach((s) => console.log(`  FAILED: ${s}`));
  }

  if (allPassed) {
    const md = [
      '# SplitKane — VERIFIED with Kane CLI',
      '',
      `Verified: ${stamp} · App: ${APP_URL}`,
      '',
      'Kane CLI drove this app in a real Chrome browser and every flow passed.',
      '',
      ...results.flatMap((r) => [
        `## ${r.name} — PASS (${r.duration ?? '?'}s)`,
        '',
        `- Summary: ${r.summary}`,
        ...(r.testUrl ? [`- Evidence / Test Manager: ${r.testUrl}`] : []),
        ...(r.finalState ? [`- Extracted values: \`${JSON.stringify(r.finalState)}\``] : []),
        '',
      ]),
      'Ship gate: `npm run ship` passes while this file is fresh (under 24h).',
      '',
    ].join('\n');
    fs.writeFileSync(path.join(OUT_DIR, 'VERIFIED.md'), md);
    fs.rmSync(path.join(OUT_DIR, 'FAILURE.md'), { force: true });
    console.log('\nAll flows passed. Wrote verification/VERIFIED.md — the app may ship.');
    process.exit(0);
  }

  const md = [
    '# SplitKane — Kane CLI run FAILED',
    '',
    `Run: ${stamp} · App: ${APP_URL}`,
    '',
    'Do NOT ship. Fix the failing flow below, then re-run `npm run verify`.',
    '',
    ...results.flatMap((r) => [
      `## ${r.name} — ${r.passed ? 'PASS' : 'FAIL'} (exit ${r.exitCode})`,
      '',
      `- Summary: ${r.summary}`,
      ...(r.failedSteps.length ? r.failedSteps.map((s) => `- ${s}`) : []),
      ...(r.testUrl ? [`- Evidence / Test Manager: ${r.testUrl}`] : []),
      '',
    ]),
  ].join('\n');
  fs.writeFileSync(path.join(OUT_DIR, 'FAILURE.md'), md);
  fs.rmSync(path.join(OUT_DIR, 'VERIFIED.md'), { force: true });
  console.log('\nKane caught a failure. Wrote verification/FAILURE.md — fix it, then re-run.');
  process.exit(1);
}

main();
