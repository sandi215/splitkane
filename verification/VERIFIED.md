# SplitKane — VERIFIED with Kane CLI

Verified: 2026-11-25T08:58:47.983Z · App: http://localhost:8080

Kane CLI drove this app in a real Chrome browser and every flow passed.

## split-happy-path — PASS (66.5s)

- Summary: Reset the group, then loaded the demo group with 3 people.
Added a $30.00 expense named “Dinner,” paid by Aa.
The total spent updated to $30.00, and Aa’s balance showed $20.00 is owed.
The suggested settlements were Sis pays Aa $10.00 and Budi pays Aa $10.00.
- Evidence / Test Manager: https://test-manager.lambdatest.com/projects/01M88XW9RGJGPH64RF7V8FKCQ7/test-cases/01M88YN5N52MJ3WP67DBP8V0PM/dashboard/share/US_9X9B2RQ3AI1H33USZSDDNQIUXPRWCTQBWSGAHQ48V6233UHJ7KKOJH7WN5Z10Z7T?type=summary&agentView=true&fqdn=summary-page
- Extracted values: `{"url":"http://localhost:8080/","people_listed_count":"3","total_spent":"$30.00","aa_balance":"$20.00","aa_status":"is owed","settlement":"Sis pays Aa $10.00; Budi pays Aa $10.00"}`

## split-validation — PASS (80.9s)

- Summary: Reset the expense group and loaded the demo group as requested.
Tried to add an expense with a blank description and a $0 amount; the page showed an error and did not add an expense.
Added the “Snacks” expense for $10.00, paid by Aa.
The total spent was updated to $10.00.
- Evidence / Test Manager: https://test-manager.lambdatest.com/projects/01M88XW9RGJGPH64RF7V8FKCQ7/test-cases/01M88YRC4K7NYHASADNQEZ4PFP/dashboard/share/US_P2VO7TSDH9S5RUZK805IRDKZ6C2JJLW45SDH4P7ABOSDLGLQ77VODL4XK5B2G0FK?type=summary&agentView=true&fqdn=summary-page
- Extracted values: `{"url":"http://localhost:8080/","total_spent":"$10.00"}`

Ship gate: `npm run ship` passes while this file is fresh (under 24h).
