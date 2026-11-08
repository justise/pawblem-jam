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

## Decisions needed from Danielle (not blocking)

- [ ] Kris's bio on About ("Part-Time Pet Nanny and Dog Walker"): keep, edit, or remove?
- [ ] Dogs per household: FAQ says 3, Services says 2. Which is right?
- [ ] Days of service: still Mon–Fri? Same for cat visits?
- [ ] Public contact email: `info@pawblemsolved.com` or `pawblemsolved@gmail.com`?
