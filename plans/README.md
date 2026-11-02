# Animation plans

Plans for the motion audit. Each file is self-contained. An executor should follow the file and not invent values.

| Plan | Title | Severity | Status |
| --- | --- | --- | --- |
| 001 | Ease the phone sheet out | HIGH | DONE |
| 002 | Shorten the nav and footer rolls | MEDIUM | DONE |
| 003 | Keep the rolls off touch screens | MEDIUM | DONE |

## Order

1. **001** — `_sass/_components/_wallo.scss` only. No dependency.
2. **002** — three `transition` declarations in `_sass/_components/_home-v2.scss`.
3. **003** — hover selectors in the same stylesheet. Run it after 002 so the shorter roll is what touch screens lose.

001 can run beside 002. Do not run 002 and 003 at the same time. They edit the same file.

## Not in this batch

Findings 4–9 and the missed opportunities are not planned yet.
