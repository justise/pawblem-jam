# Setup Checklist (Kris)

Manual steps that code can't do. Each phase is blocked until its setup items
are checked off and verified. Check a box (`[x]`) when done.

## Phase 2 — Request form → Sheet + email (BLOCKING Phase 3)

Details for steps 1–6: [apps-script/README.md](apps-script/README.md).

- [x]   1. Signed in as **pawblemsolved@gmail.com**, create Google Sheet **Pawblem Solved – Clients**
       ([open Sheet](https://docs.google.com/spreadsheets/d/1PEBeLvcSF5aigG6ydhvHGXcz8TgyPKMCDs0TXNpYTVA/edit))
- [x]   2. Extensions → Apps Script: paste `apps-script/Code.gs` and `appsscript.json`
- [x]   3. Run `setup` once and approve permissions (tabs appear in the Sheet)
- [x]   4. Settings tab: fill in **Tracking Start Date** (yyyy-mm-dd)
- [x]   5. Script properties: add `SHARED_SECRET` (`openssl rand -hex 32`)
- [x]   6. Deploy → Web app (execute as Me, access **Anyone**, not "Anyone with Google account"); copy the `/exec` URL
- [x]   7. Local `.env`: add `APPS_SCRIPT_URL` and `APPS_SCRIPT_SECRET` (see `.env.example`)
- [x]   8. **Verify locally:** ask Claude to run the end-to-end test. It submits a test request, and you confirm a row in Clients + Requests and an email at pawblemsolved@gmail.com (then delete the test rows)
  - ✅ 2026-11-07: rows C0001 / R0001 written and email received. Delete the two test rows when convenient.
- [ ]   9. Netlify: create a site from this repo (build settings come from `netlify.toml`)
- [ ]   10. Netlify → Site configuration → Environment variables: add `APPS_SCRIPT_URL` and `APPS_SCRIPT_SECRET`
- [ ]   11. **Verify on Netlify:** submit the form on the deploy preview; confirm row + email
- [ ]   12. Point the `pawblemsolved.com` DNS at Netlify (do this when ready to go live; not blocking Phase 3)

## Phase 3 — Online client & pet forms  ✅ verified 2026-11-07

The script gained new code and needs Google Docs + Drive permissions (for the
printable pet sheets), so it must be re-pasted, re-authorized and redeployed.

- [x] 1. Apps Script editor: replace `Code.gs` with the new `apps-script/Code.gs`, and `appsscript.json` with the new `apps-script/appsscript.json`. Save.
- [x] 2. Run `setup` once and **approve the new permissions** (Docs + Drive). Adds `Pet Sheet` and `Updated` columns to Pets.
- [x] 3. Deploy → Manage deployments → ✏️ → Version: **New version** → Deploy (same URL, keep access **Anyone**)
- [ ] 4. **Verify locally:** ask Claude to run the forms end-to-end test. It submits a test household with a dog and a cat. You confirm the rows, an email "Forms submitted: …", and that two pet sheets appear in Drive folder **Pawblem Solved – Pet Sheets** (then delete test rows + docs)
  - ✅ 2026-11-07: client C0002 + pets P0001/P0002 written with all columns.
  - ❌ Pet sheets not linked: bug (Doc URL read after close). Fixed in code.
  - [x] 4a. Re-paste `apps-script/Code.gs` (manifest unchanged) → Deploy → Manage deployments → ✏️ → New version → Deploy
  - [x] 4b. Delete any half-made Docs in Drive folder **Pawblem Solved – Pet Sheets**, then tell Claude to rerun the test
  - [x] 4c. Script properties: set `PET_SHEETS_FOLDER_ID` = `14jELzEDMJtPi-bLq44uFAgesHteiiKS-` (edit the existing value), then delete the auto-created **Pawblem Solved – Pet Sheets** folder
  - ❌ 2nd test: rows updated, Pet Sheet still empty. Likely `setItalic` on a Paragraph (not a valid method). Fixed in code.
  - ❌ 4d run: `setHeading` of null — `Paragraph.setText()` returns nothing; fixed in code.
  - [x] 4d. Re-paste `apps-script/Code.gs` → in the editor, select `refreshAllPetSheets` → **Run** (shows any error right there) → if OK, Deploy → Manage deployments → ✏️ → New version → Deploy
    - ✅ 3rd test: Pet Sheet links filled. ❌ But resubmits create a NEW Doc each time (Doc.getUrl() returns `open?id=` links the reuse check didn't recognise). Fixed in code.
  - [x] 4f. Re-paste `apps-script/Code.gs` → Deploy → Manage deployments → ✏️ → New version → Deploy
  - [ ] 4g. Share the pet sheets folder with kgray.justise@gmail.com (Viewer) so Claude can verify the Docs (optional)
  - [ ] 4e. Delete any TestDog/TestCat Docs from the failed runs (your folder, and the root of pawblemsolved's My Drive), then tell Claude to rerun the test
  - ✅ 4th test (3 submits): Pet Sheet links stable across resubmits (Docs reused); rows updated in place.
  - [x] 4h. Kris: open the TestDog Doc from the Pets tab and confirm it looks right; confirm the folder holds only the 2 linked Docs; confirm a "Forms submitted" email arrived. Then delete test rows (Clients C0001–C0002, Requests R0001, Pets P0001–P0002) and the 2 Docs.
- [ ] 5. Danielle reviews the agreement wording on `/forms` (adapted from the paper agreement; text lives in `lib/intake.ts` → `AGREEMENT_TEXT`)

## Phase 4 — Calendar billing + phone dashboard  (BLOCKING Phase 5)

- [x] 1. Apps Script editor: replace `Code.gs` and `appsscript.json`; add **+ → Script** files `Billing` and `DashboardApp` (paste `Billing.gs`, `DashboardApp.gs`); add **+ → HTML** file named `Dashboard` (paste `Dashboard.html`). Save. (A script and an HTML file can't share a name.)
- [x] 2. Run `setup` and **approve the new Calendar permission**. Adds the Payments tab, rate rows on Settings, and a Visit Rate column on Clients. Check the rates on Settings.
- [ ] 3. Settings → Calendar ID: leave `primary` if walks are on Danielle's main calendar; otherwise paste the walks calendar's ID (Calendar settings → Integrate calendar → Calendar ID).
- [ ] 4. Website deployment: Deploy → Manage deployments → (website) → ✏️ → New version → Deploy.
- [ ] 5. Dashboard deployment: Deploy → **New deployment** → Web app → Description `Dashboard`, Execute as **Me**, Who has access **Only myself** → Deploy. Copy the URL.
- [ ] 6. Script properties: add `DASHBOARD_URL` = that URL.
- [ ] 7. In the walks calendar, create test events (after Tracking Start Date): `TestDog` earlier today (default color), `TestDog` tomorrow, `TestCat` earlier today colored **Tangerine**, `Dentist` today. Need the TestDog/TestCat pets back first: ask Claude to resubmit the forms test.
- [ ] 8. Editor: run `logBillingThisMonth`; paste the log to Claude. Expected: TestDog $45 completed + 1 scheduled, TestCat $19 late cancel (50% of $38), Dentist unmatched.
- [ ] 9. Open the dashboard URL on the phone **signed in as pawblemsolved@gmail.com** → check Upcoming / Clients / Billing; record a $1 test payment. Then **Add to Home Screen**.
- [ ] 10. Clean up: delete test events, test rows (Clients/Pets/Payments) and test Docs.

## Decisions needed from Danielle (not blocking)

- [ ] Kris's bio on About ("Part-Time Pet Nanny and Dog Walker"): keep, edit, or remove?
- [ ] Dogs per household: FAQ says 3, Services says 2. Which is right?
- [ ] Days of service: still Mon–Fri? Same for cat visits?
- [ ] Public contact email: `info@pawblemsolved.com` or `pawblemsolved@gmail.com`?
