// Unit tests for the split math Kane will verify in the browser.
// Run: npm run test:unit   (node:test, no deps)
const test = require('node:test');
const assert = require('node:assert/strict');
const K = require('../src/split.js');

test('toCents parses dollars to integer cents', () => {
  assert.equal(K.toCents('30.00'), 3000);
  assert.equal(K.toCents('10'), 1000);
  assert.equal(K.toCents('0.50'), 50);
  assert.equal(K.toCents(' 12.34 '), 1234);
  assert.equal(K.toCents(''), null);
  assert.equal(K.toCents('abc'), null);
  assert.equal(K.toCents('0'), null);
  assert.equal(K.toCents('-5'), null);
  assert.equal(K.toCents('10.999'), null);
});

test('splitCents: $10 among 3 sums back to exactly $10', () => {
  const shares = K.splitCents(1000, 3);
  assert.deepEqual(shares, [334, 333, 333]);
  assert.equal(shares.reduce((a, b) => a + b, 0), 1000);
});

test('splitCents: $30 among 2 is $15 each', () => {
  assert.deepEqual(K.splitCents(3000, 2), [1500, 1500]);
});

test('computeBalances: $30 dinner, Aa paid, split 2 ways', () => {
  const people = [{ id: 'a', name: 'Aa' }, { id: 'b', name: 'Sis' }];
  const expenses = [{ id: 'e1', description: 'Dinner', amountCents: 3000, payerId: 'a', memberIds: ['a', 'b'] }];
  const { balances, totalSpentCents } = K.computeBalances(people, expenses);
  assert.equal(totalSpentCents, 3000);
  assert.equal(balances.a, 1500); // Aa is owed $15
  assert.equal(balances.b, -1500); // Sis owes $15
  assert.equal(balances.a + balances.b, 0); // balances always sum to zero
});

test('computeBalances: $10 among 3, first member paid', () => {
  const people = [{ id: 'a', name: 'Aa' }, { id: 'b', name: 'Sis' }, { id: 'c', name: 'Budi' }];
  const expenses = [{ id: 'e1', description: 'Snacks', amountCents: 1000, payerId: 'a', memberIds: ['a', 'b', 'c'] }];
  const { balances } = K.computeBalances(people, expenses);
  // Aa paid 1000, owes 334 -> +666; Sis owes 333; Budi owes 333.
  assert.deepEqual(balances, { a: 666, b: -333, c: -333 });
  assert.equal(Object.values(balances).reduce((x, y) => x + y, 0), 0);
});

test('settleUp produces minimal payments', () => {
  const moves = K.settleUp({ a: 1500, b: -1500 });
  assert.deepEqual(moves, [{ fromId: 'b', toId: 'a', amountCents: 1500 }]);
  assert.deepEqual(K.settleUp({ a: 0, b: 0 }), []);
  const moves3 = K.settleUp({ a: 666, b: -333, c: -333 });
  assert.equal(moves3.length, 2);
  assert.equal(moves3.reduce((s, m) => s + m.amountCents, 0), 666);
});
