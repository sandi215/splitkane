# SplitKane — VERIFIED with Kane CLI

Verified: 2026-11-25T08:48:49.324Z · App: http://localhost:8080

Kane CLI drove this app in a real Chrome browser and every flow passed.

## split-happy-path — PASS (85.8s)

- Summary: Reset the group, loaded the demo group, and confirmed that three people were listed.
Added a $30.00 expense named “Dinner” paid by Aa.
The total spent updated to $30.00, and Aa’s balance showed $20.00 is owed.
Saved the settlement details: Sis pays Aa $10.00 and Budi pays Aa $10.00.
- Evidence / Test Manager: https://test-manager.lambdatest.com/projects/01M88XW9RGJGPH64RF7V8FKCQ7/test-cases/01M88Y2WTRFJN42YVBEE152EQY/dashboard/share/US_VCLVGMG9NSE248BHIAHZMDKMAM91YHNTVPQQLESM5MQD5EOIZAJYTB6H70IK19EQ?type=summary&agentView=true&fqdn=summary-page
- Extracted values: `{"url":"http://localhost:8080/","people_list_count":"3","total_spent":"$30.00","aa_balance":"$20.00","aa_is_owed":"true","settlement":"Sis pays Aa $10.00\nBudi pays Aa $10.00"}`

## split-validation — PASS (71.2s)

- Summary: Reset the expense group and loaded the demo group.
Tried to add an expense with a blank description and an amount of 0; an error message appeared and no expense was added.
Added a $10.00 expense named “Snacks” paid by Aa.
The total spent was updated to and saved as $10.00.
- Evidence / Test Manager: https://test-manager.lambdatest.com/projects/01M88XW9RGJGPH64RF7V8FKCQ7/test-cases/01M88Y6EN1ZN2WYNJ1YPMBDVE6/dashboard/share/US_QS9CYESCAMPVUJBCCD188JLY5BZTSP9VSLN9V0ULCE8L6I02X5GXEE8O1KIMR0C0?type=summary&agentView=true&fqdn=summary-page
- Extracted values: `{"url":"http://localhost:8080/","total_spent":"$10.00"}`

Ship gate: `npm run ship` passes while this file is fresh (under 24h).
