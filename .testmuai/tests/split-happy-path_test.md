---
mode: testing
max_steps: 50
timeout: 300
target: chrome
headless: true
---

# Session: split-happy-path

## Step 1
Go to http://localhost:8080 and click "Clear all" to reset, then click "Load demo group" and verify 3 people are listed. Add an expense with description "Dinner", amount "30.00", paid by "Aa". Then verify Total spent shows "$30.00", verify Aa's balance shows "$20.00" and "is owed", and store the settlement list text as 'settlement'.
