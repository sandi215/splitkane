#!/usr/bin/env node
/**
 * Ship gate: the app "ships" only if Kane CLI verified it recently.
 *   npm run ship
 * Pass conditions: unit tests pass AND verification/VERIFIED.md exists
 * and is fresher than 24h. Otherwise: refuse, print what to do.
 */
'use strict';

const { spawnSync } = require('node:child_process');
const fs = require('node:fs');
const path = require('node:path');

const ROOT = path.resolve(__dirname, '..');
const VERIFIED = path.join(ROOT, 'verification', 'VERIFIED.md');
const MAX_AGE_MS = 24 * 60 * 60 * 1000;

const unit = spawnSync('node', ['--test', 'tests/split.test.js'], { cwd: ROOT, encoding: 'utf8' });
if (unit.status !== 0) {
  console.error('SHIP BLOCKED: unit tests failed. Fix src/split.js, then re-run.');
  process.exit(1);
}
console.log('Unit tests: PASS');

if (!fs.existsSync(VERIFIED)) {
  console.error('SHIP BLOCKED: no verification/VERIFIED.md — run `npm run verify` (Kane CLI) first.');
  process.exit(1);
}
const ageMs = Date.now() - fs.statSync(VERIFIED).mtimeMs;
if (ageMs > MAX_AGE_MS) {
  console.error(`SHIP BLOCKED: VERIFIED.md is ${Math.round(ageMs / 3600000)}h old — re-run \`npm run verify\`.`);
  process.exit(1);
}
console.log(`Kane verification: FRESH (${Math.round(ageMs / 60000)} min old).`);
console.log('SHIP: OK — SplitKane is verified and may ship. 🚀');
