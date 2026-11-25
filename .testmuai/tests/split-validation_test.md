---
mode: testing
max_steps: 50
timeout: 300
target: chrome
headless: true
---

# Session: split-validation

## Step 1
Go to http://localhost:8080 and click "Clear all" to reset, then click "Load demo group". Try to add an expense with an empty description and amount "0" and verify an error message is shown and no expense is added. Then add an expense with description "Snacks", amount "10.00", paid by "Aa", and verify Total spent shows "$10.00", and store the total spent text as 'total_spent'.
