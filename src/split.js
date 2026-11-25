// SplitKane — pure money-split math (no DOM, no deps).
// Amounts are integer CENTS everywhere so $10 split 3 ways never loses a cent.
// Works in the browser (window.SplitKane) and in Node (module.exports).

(function (root, factory) {
  const api = factory();
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else root.SplitKane = api;
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  /** "12.34" / 12.34 / "12" -> 1234 cents, or null when invalid. */
  function toCents(value) {
    if (value === null || value === undefined) return null;
    const s = String(value).trim().replace(/[$,\s]/g, '');
    if (!/^\d+(\.\d{1,2})?$/.test(s)) return null;
    const n = Math.round(parseFloat(s) * 100);
    if (!Number.isFinite(n) || n <= 0) return null;
    return n;
  }

  function formatCents(cents) {
    const sign = cents < 0 ? '-' : '';
    const abs = Math.abs(cents);
    return sign + '$' + (abs / 100).toFixed(2);
  }

  /**
   * Split totalCents equally among n people.
   * Remainder cents go one-by-one to the FIRST members (deterministic,
   * auditable, and the shares always sum back to exactly totalCents).
   * e.g. splitCents(1000, 3) -> [334, 333, 333]
   */
  function splitCents(totalCents, n) {
    if (!Number.isInteger(totalCents) || totalCents < 0) throw new Error('bad total');
    if (!Number.isInteger(n) || n <= 0) throw new Error('bad n');
    const base = Math.floor(totalCents / n);
    const rem = totalCents - base * n;
    const out = new Array(n).fill(base);
    for (let i = 0; i < rem; i++) out[i] += 1;
    return out;
  }

  /**
   * people: [{id, name}]
   * expenses: [{id, description, amountCents, payerId, memberIds}]
   * Returns { balances: {personId: cents}, totalSpentCents }.
   * balance > 0 means the group owes this person; < 0 means they owe.
   * Balances always sum to exactly 0.
   */
  function computeBalances(people, expenses) {
    const balances = {};
    people.forEach((p) => { balances[p.id] = 0; });
    let totalSpentCents = 0;
    expenses.forEach((e) => {
      const members = e.memberIds.filter((id) => balances[id] !== undefined);
      if (members.length === 0) return;
      if (balances[e.payerId] === undefined) return;
      totalSpentCents += e.amountCents;
      const shares = splitCents(e.amountCents, members.length);
      members.forEach((id, i) => { balances[id] -= shares[i]; });
      balances[e.payerId] += e.amountCents;
    });
    return { balances, totalSpentCents };
  }

  /** Greedy minimal settlement: [{fromId, toId, amountCents}]. */
  function settleUp(balances) {
    const debtors = []; // owe money: balance < 0
    const creditors = []; // owed money: balance > 0
    Object.entries(balances).forEach(([id, b]) => {
      if (b < 0) debtors.push({ id, amount: -b });
      else if (b > 0) creditors.push({ id, amount: b });
    });
    debtors.sort((a, b) => b.amount - a.amount);
    creditors.sort((a, b) => b.amount - a.amount);
    const moves = [];
    let i = 0, j = 0;
    while (i < debtors.length && j < creditors.length) {
      const pay = Math.min(debtors[i].amount, creditors[j].amount);
      moves.push({ fromId: debtors[i].id, toId: creditors[j].id, amountCents: pay });
      debtors[i].amount -= pay;
      creditors[j].amount -= pay;
      if (debtors[i].amount === 0) i++;
      if (creditors[j].amount === 0) j++;
    }
    return moves;
  }

  return { toCents, formatCents, splitCents, computeBalances, settleUp };
});
