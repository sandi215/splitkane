// SplitKane UI — vanilla JS, zero deps. State lives in localStorage only.
(function () {
  'use strict';
  const K = window.SplitKane;
  const STORE_KEY = 'splitkane-v1';

  let state = load();

  function load() {
    try {
      const raw = localStorage.getItem(STORE_KEY);
      if (raw) {
        const s = JSON.parse(raw);
        if (Array.isArray(s.people) && Array.isArray(s.expenses)) return s;
      }
    } catch (e) { /* corrupted storage -> fresh start */ }
    return { people: [], expenses: [] };
  }
  function save() { localStorage.setItem(STORE_KEY, JSON.stringify(state)); }
  function uid() { return 'id-' + Date.now().toString(36) + '-' + Math.floor(Math.random() * 1e6).toString(36); }
  function $(id) { return document.getElementById(id); }
  function showError(msg) {
    const el = $('error-message');
    if (msg) { el.textContent = msg; el.hidden = false; }
    else { el.textContent = ''; el.hidden = true; }
  }

  function render() {
    // People
    const pl = $('people-list');
    pl.innerHTML = '';
    state.people.forEach((p) => {
      const li = document.createElement('li');
      li.textContent = p.name;
      li.setAttribute('data-person-id', p.id);
      pl.appendChild(li);
    });
    // Payer select
    const sel = $('expense-payer-select');
    sel.innerHTML = '';
    state.people.forEach((p) => {
      const o = document.createElement('option');
      o.value = p.id; o.textContent = p.name;
      sel.appendChild(o);
    });
    // Expenses
    const el = $('expenses-list');
    el.innerHTML = '';
    state.expenses.forEach((e) => {
      const payer = state.people.find((p) => p.id === e.payerId);
      const li = document.createElement('li');
      li.textContent = e.description + ' — ' + K.formatCents(e.amountCents) +
        ' paid by ' + (payer ? payer.name : '?') +
        ' · split ' + e.memberIds.length + ' ways';
      li.setAttribute('data-expense-id', e.id);
      el.appendChild(li);
    });
    // Balances + settlement
    const { balances, totalSpentCents } = K.computeBalances(state.people, state.expenses);
    $('total-spent').textContent = K.formatCents(totalSpentCents);
    const bl = $('balances-list');
    bl.innerHTML = '';
    state.people.forEach((p) => {
      const b = balances[p.id] || 0;
      const li = document.createElement('li');
      li.setAttribute('data-person-id', p.id);
      const span = document.createElement('span');
      span.textContent = p.name + ': ' + K.formatCents(b) + (b > 0 ? ' (is owed)' : b < 0 ? ' (owes)' : ' (even)');
      span.className = b > 0 ? 'positive' : b < 0 ? 'negative' : '';
      li.appendChild(span);
      bl.appendChild(li);
    });
    const moves = K.settleUp(balances);
    const sl = $('settlement-list');
    sl.innerHTML = '';
    moves.forEach((m) => {
      const from = state.people.find((p) => p.id === m.fromId);
      const to = state.people.find((p) => p.id === m.toId);
      const li = document.createElement('li');
      li.textContent = (from ? from.name : '?') + ' pays ' + (to ? to.name : '?') + ' ' + K.formatCents(m.amountCents);
      sl.appendChild(li);
    });
    $('settled-note').hidden = !(state.expenses.length > 0 && moves.length === 0);
    document.querySelectorAll('#expense-form input, #expense-form select, #expense-form button')
      .forEach((n) => { n.disabled = state.people.length < 2; });
  }

  $('person-form').addEventListener('submit', (ev) => {
    ev.preventDefault();
    const input = $('person-name-input');
    const name = input.value.trim();
    if (!name) return;
    state.people.push({ id: uid(), name });
    input.value = '';
    save(); render();
  });

  $('expense-form').addEventListener('submit', (ev) => {
    ev.preventDefault();
    showError(null);
    const desc = $('expense-desc-input').value.trim();
    const amountCents = K.toCents($('expense-amount-input').value);
    const payerId = $('expense-payer-select').value;
    if (!desc) { showError('Please enter what the expense was for.'); return; }
    if (amountCents === null) { showError('Please enter a valid amount greater than $0 (e.g. 30.00).'); return; }
    if (!payerId || !state.people.find((p) => p.id === payerId)) {
      showError('Please add at least 2 people first, then pick who paid.'); return;
    }
    state.expenses.push({
      id: uid(), description: desc, amountCents,
      payerId, memberIds: state.people.map((p) => p.id),
    });
    $('expense-desc-input').value = '';
    $('expense-amount-input').value = '';
    save(); render();
  });

  $('seed-demo-btn').addEventListener('click', () => {
    if (state.people.length === 0) {
      state.people = [
        { id: uid(), name: 'Aa' },
        { id: uid(), name: 'Sis' },
        { id: uid(), name: 'Budi' },
      ];
    }
    save(); render();
  });

  $('clear-all-btn').addEventListener('click', () => {
    state = { people: [], expenses: [] };
    save(); render();
  });

  render();
})();
