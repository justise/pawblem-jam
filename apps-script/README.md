# Pawblem Solved back office (Google Sheet + Apps Script)

The Google Sheet **"Pawblem Solved – Clients"** in the pawblemsolved@gmail.com
Drive is the business database. The Apps Script bound to it receives website
submissions, writes them to the Sheet, and emails Danielle through Gmail. It
costs nothing and needs no third-party services.

## Tabs

| Tab | Purpose |
|---|---|
| Settings | Owner email, calendar ID, **Tracking Start Date** (calendar events before this date are ignored for billing) |
| Clients | One row per household. New website requests come in as `Prospect`; change Status to `Active` once they're a client |
| Requests | Every service request submitted on the website |
| Pets | One row per pet (filled by the online pet forms, coming next) |

Columns are matched by header name, so you can add your own columns to the
right or reorder freely. Don't rename the existing headers.

### Calendar naming convention (for billing, coming later)

Walk/visit events are matched to pets by the **Calendar Name** column on the
Pets tab. It defaults to the pet's name (e.g. `Buddy`). When two clients have
pets with the same name, set the Calendar Name to include the last name
(e.g. `Buddy Smith`) and title calendar events the same way.

## One-time setup (Kris, signed in as pawblemsolved@gmail.com)

1. Create a new Google Sheet named **Pawblem Solved – Clients**.
2. **Extensions → Apps Script.** Replace `Code.gs` with `apps-script/Code.gs`
   from this repo. In **Project Settings**, tick *Show "appsscript.json"* and
   replace it with `apps-script/appsscript.json`.
3. Pick `setup` in the function dropdown and **Run**. Approve the permissions
   prompt. The tabs appear in the Sheet (reload it to see the
   **Pawblem Solved** menu).
4. Fill in **Tracking Start Date** on the Settings tab.
5. **Project Settings → Script properties →** add `SHARED_SECRET` with a long
   random value (e.g. `openssl rand -hex 32`).
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

Edit the code, then **Deploy → Manage deployments → ✏️ → Version: New
version → Deploy**. Editing *the existing* deployment keeps the same URL, so
Netlify doesn't need changing.

Optional: use [`clasp`](https://github.com/google/clasp) (`clasp push`) from
this folder instead of copy/paste.
