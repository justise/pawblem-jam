# Pawblem Solved back office (Google Sheet + Apps Script)

The Google Sheet **"Pawblem Solved – Clients"** in the pawblemsolved@gmail.com
Drive is the business database
([open Sheet](https://docs.google.com/spreadsheets/d/1PEBeLvcSF5aigG6ydhvHGXcz8TgyPKMCDs0TXNpYTVA/edit)). The Apps Script bound to it receives website
submissions, writes them to the Sheet, and emails Danielle through Gmail. It
costs nothing and needs no third-party services.

## Tabs

| Tab | Purpose |
|---|---|
| Settings | Owner email, calendar ID, **Tracking Start Date** (calendar events before this date are ignored for billing) |
| Clients | One row per household. New website requests come in as `Prospect`; change Status to `Active` once they're a client |
| Requests | Every service request submitted on the website |
| Payments | One row per payment received (recorded from the dashboard or typed in directly) |
| Pets | One row per pet, filled by the online forms at `/forms`. `Calendar Name` is set automatically (pet name, plus client last name if another client's pet already has that name). `Pet Sheet` links to a printable Google Doc in the **Pawblem Solved – Pet Sheets** Drive folder |

Clients also gets the household/vet/agreement columns from the online forms. Form questions are defined in `lib/intake.ts`; the script creates any missing columns automatically.

Columns are matched by header name, so you can add your own columns to the
right or reorder freely. Don't rename the existing headers.

### Calendar naming convention (billing)

Walk/visit events are matched to pets by the **Calendar Name** column on the
Pets tab. It defaults to the pet's name (e.g. `Buddy`). When two clients have
pets with the same name, set the Calendar Name to include the last name
(e.g. `Buddy Smith`) and title calendar events the same way. The forms set
this automatically.

- **Title**: include each pet's Calendar Name, e.g. `Buddy` or `Buddy & Max`
  (extra words like "walk" are fine). Pets of one household in one event are
  billed as one visit ($45 up to 2 dogs, +$3 per extra dog).
- **Color**: walks live on pawblemsolved's main calendar alongside other
  events, so visits use named color labels. **Each label must use one of
  Google's 11 classic event colors**: the newer extended palette is invisible
  to scripts (both CalendarApp and the Calendar API report no color).
  - **Pawblem Walks**: green, Basil = `10`. A visit, charged once it has
    ended (Settings **Walk Color**).
  - **Walk Cancelled**: pink, Flamingo = `4`. No charge (**Cancelled Color**).
  - **Walk Cancelled - Late Fee**: orange, Tangerine = `6`. Charged Late
    Cancel Percent, 50% (**Late Cancel Color**).
  Classic ids: 1 Lavender, 2 Sage, 3 Grape, 4 Flamingo, 5 Banana,
  6 Tangerine, 7 Peacock, 8 Graphite, 9 Blueberry, 10 Basil, 11 Tomato. Events in any other color are ignored. Leaving
  Walk Color blank makes every event count. Run `logEventColors` in the
  editor to see the exact color values the script reads.
- Holidays from the Rates page add the Holiday Surcharge automatically.
- Events before **Tracking Start Date**, all-day events, and walk-colored
  events that name no pet are not billed. The last group is listed under
  Billing → Unmatched in the dashboard so titles can be fixed.

Rates are on the Settings tab. A client-specific price can go in the Clients
**Visit Rate** column (replaces the base walk/visit price for that client).

## Dashboard (phone)

A second web app deployment of the same script, visible only to the
pawblemsolved@gmail.com account: **Upcoming** visits (call / text / map /
pet sheet), **Clients** (balances, contact, record a payment), **Billing**
(per-month totals, copyable invoice text, unmatched events). Sheet menu
**Pawblem Solved → Open dashboard link** shows the URL (script property
`DASHBOARD_URL`). From the editor, run `logBillingThisMonth` to see the
current month's billing in the log.

## One-time setup (Kris, signed in as pawblemsolved@gmail.com)

1. Create a new Google Sheet named **Pawblem Solved – Clients**.
2. **Extensions → Apps Script.** Replace `Code.gs` with `apps-script/Code.gs`
   from this repo. In **Project Settings**, tick *Show "appsscript.json"* and
   replace it with `apps-script/appsscript.json`.
3. Pick `setup` in the function dropdown and **Run**. Approve the permissions
   prompt. The tabs appear in the Sheet (reload it to see the
   **Pawblem Solved** menu).
4. Fill in **Tracking Start Date** on the Settings tab.
5. **Project Settings** (gear icon, left sidebar) → scroll to **Script
   properties** → **Add script property**. Property: `SHARED_SECRET`, Value:
   a long random string (generate with `openssl rand -hex 32`). Put the
   **same** value in `APPS_SCRIPT_SECRET` in `.env`/Netlify. It's a password
   the website sends with every request so only our site can write to the
   Sheet.
6. **Deploy → New deployment → Web app.** Execute as *Me*, access *Anyone*.
   Copy the `/exec` URL.
   (Anyone can reach the URL, but every request must carry the shared secret,
   which only the website server knows.)
7. In Netlify (and `.env` locally) set:
   ```
   APPS_SCRIPT_URL=https://script.google.com/macros/s/.../exec
   APPS_SCRIPT_SECRET=<same value as SHARED_SECRET>
   ```

### Updating the script later

The project has these files: `Code.gs`, `Billing.gs`, `DashboardApp.gs`,
`Dashboard.html` (HTML file named `Dashboard`), and `appsscript.json`. A script
file and an HTML file can't share a name, hence `DashboardApp`.

Edit the code, then for **each** deployment (Website and Dashboard):
**Deploy → Manage deployments → select it → ✏️ → Version: New version →
Deploy**. Editing the existing deployment keeps the same URL, so Netlify and
Danielle's home-screen shortcut don't need changing.

Pet sheet Docs are created in the Drive folder whose ID is in the script property
`PET_SHEETS_FOLDER_ID` (currently
[this folder](https://drive.google.com/drive/folders/14jELzEDMJtPi-bLq44uFAgesHteiiKS-)).
If the property is missing, the script creates a folder and saves its ID there.
Changing it takes effect immediately; no redeploy needed.

Sheet menu **Pawblem Solved → Refresh all pet sheets** rebuilds the printable Docs after you edit the Sheet by hand.

Optional: use [`clasp`](https://github.com/google/clasp) (`clasp push`) from
this folder instead of copy/paste.

## Troubleshooting

- **Website says "Could not send request" and the server log shows HTTP 401 /
  a Google sign-in page:** the deployment's *Who has access* is not
  **Anyone**. Choosing "Anyone with Google account" or "Only myself" makes
  Google demand a login. Fix: Deploy → Manage deployments → ✏️ → Who has
  access: **Anyone** → Version: New version → Deploy (the URL stays the same).
- **`{"ok":false,"error":"unauthorized"}`:** `APPS_SCRIPT_SECRET` doesn't match
  the `SHARED_SECRET` script property exactly (watch for spaces).
- **Still 401 right after changing access:** a redeploy can take a minute to
  take effect. Retry before changing anything else.
