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

## Phase 3 — Online client & pet forms  (BLOCKING Phase 4)

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
  - [ ] 4d. Re-paste `apps-script/Code.gs` → in the editor, select `refreshAllPetSheets` → **Run** (shows any error right there) → if OK, Deploy → Manage deployments → ✏️ → New version → Deploy
  - [ ] 4e. Delete any TestDog/TestCat Docs from the failed runs (your folder, and the root of pawblemsolved's My Drive), then tell Claude to rerun the test
- [ ] 5. Danielle reviews the agreement wording on `/forms` (adapted from the paper agreement; text lives in `lib/intake.ts` → `AGREEMENT_TEXT`)

## Decisions needed from Danielle (not blocking)

- [ ] Kris's bio on About ("Part-Time Pet Nanny and Dog Walker"): keep, edit, or remove?
- [ ] Dogs per household: FAQ says 3, Services says 2. Which is right?
- [ ] Days of service: still Mon–Fri? Same for cat visits?
- [ ] Public contact email: `info@pawblemsolved.com` or `pawblemsolved@gmail.com`?
