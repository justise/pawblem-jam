# pawblem-jam
Pawblem Solved converted to JAM Stack

## Editing the site (Danielle)

Page text, photos and the "closed" banner live in `content/*.json` and are edited
in the browser at **https://pawblemsolved.com/admin/** (Decap CMS, sign in with
Google). Each Publish commits to `master`; Netlify redeploys in about 1–2 minutes.
In Chrome or Edge, use **Install** in the address bar to get a "Pawblem Editor"
desktop app. Uploaded photos go to `public/images/uploads/` and are served
resized (WebP/AVIF) through the Netlify Image CDN.

Editor fields are defined in `public/admin/config.yml`. To try the editor locally
without signing in: `npm run dev` and `npx decap-server`, then open
http://localhost:3000/admin/ (it edits your local files).

Setup steps (Netlify Identity, Google login, Git Gateway, invites) are in `SETUP.md`, Phase 5.
