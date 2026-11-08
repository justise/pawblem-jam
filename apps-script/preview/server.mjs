#!/usr/bin/env node
/**
 * Local preview of the owner dashboard: `npm run preview:dashboard`
 *
 * Serves apps-script/Dashboard.html and answers its google.script.run calls
 * by running the REAL Code.gs / Billing.gs / DashboardApp.gs in a sandbox
 * with fake Sheet + Calendar data (fixtures.mjs). Files are re-read on every
 * request: edit, then refresh the browser. Narrow the window to see the
 * phone layout. Each page load rebuilds the sample data, so payments
 * recorded in the preview disappear on refresh.
 */
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const scriptDir = path.resolve(here, '..');
const PORT = Number(process.env.PORT || 4000);
const TZ = 'America/Los_Angeles';
process.env.TZ = TZ; // match the Apps Script project timezone

// ---------------------------------------------------------------------------
// Fake Google services
// ---------------------------------------------------------------------------

function pad(n) {
    return String(n).padStart(2, '0');
}

/** Subset of Utilities.formatDate patterns used by the scripts. */
function formatDate(d, _tz, pattern) {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const h12 = d.getHours() % 12 || 12;
    const tokens = {
        yyyy: String(d.getFullYear()),
        MMM: months[d.getMonth()],
        MM: pad(d.getMonth() + 1),
        dd: pad(d.getDate()),
        d: String(d.getDate()),
        EEE: days[d.getDay()],
        h: String(h12),
        mm: pad(d.getMinutes()),
        a: d.getHours() < 12 ? 'AM' : 'PM',
    };
    return pattern.replace(/yyyy|MMM|MM|dd|EEE|mm|d|h|a/g, (t) => tokens[t]);
}

function makeSheet(name, headers, rows) {
    const data = [headers.slice(), ...rows.map((r) => headers.map((h) => r[h] ?? ''))];
    const sheet = {
        getName: () => name,
        getLastRow: () => data.length,
        getLastColumn: () => Math.max(0, ...data.map((r) => r.length)),
        getDataRange: () => ({
            getValues: () => {
                const w = sheet.getLastColumn();
                return data.map((r) => {
                    const x = r.slice();
                    while (x.length < w) x.push('');
                    return x;
                });
            },
        }),
        getRange: (r, c, nr = 1, nc = 1) => ({
            getValues: () =>
                Array.from({ length: nr }, (_, i) =>
                    Array.from({ length: nc }, (_, j) => (data[r - 1 + i] || [])[c - 1 + j] ?? '')
                ),
            setValues: (v) => {
                for (let i = 0; i < nr; i++) {
                    data[r - 1 + i] = data[r - 1 + i] || [];
                    for (let j = 0; j < nc; j++) data[r - 1 + i][c - 1 + j] = v[i][j];
                }
                return { setFontWeight() {} };
            },
            setFontWeight() {},
        }),
        appendRow: (r) => data.push(r.slice()),
        setFrozenRows() {},
    };
    return sheet;
}

async function buildWorld() {
    const fx = await import(path.join(here, 'fixtures.mjs') + '?t=' + Date.now());
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const start = new Date(today);
    start.setDate(start.getDate() - 21);
    const settings = { ...fx.settings, 'Tracking Start Date': start };
    const union = (rows) => [...new Set(rows.flatMap((r) => Object.keys(r)))];
    const sheets = {
        Settings: makeSheet(
            'Settings',
            ['Setting', 'Value', 'Notes'],
            Object.entries(settings).map(([k, v]) => ({ Setting: k, Value: v }))
        ),
        Clients: makeSheet('Clients', union(fx.clients), fx.clients),
        Pets: makeSheet('Pets', union(fx.pets), fx.pets),
        Payments: makeSheet(
            'Payments',
            ['Payment ID', 'Date', 'Client ID', 'Client Name', 'Amount', 'Method', 'Notes'],
            fx.payments.map((p) => ({ ...p, Date: new Date(today.getTime() - p.daysAgo * 864e5) }))
        ),
        Requests: makeSheet('Requests', ['Request ID'], []),
    };
    const events = fx.buildEvents(today).map((e, i) => ({
        getId: () => 'evt' + i,
        getTitle: () => e.title,
        getStartTime: () => e.start,
        getEndTime: () => e.end,
        getColor: () => e.color,
        isAllDayEvent: () => !!e.allDay,
        isRecurringEvent: () => false,
    }));
    return { sheets, events };
}

let world = await buildWorld();

function runInSandbox(fn, args) {
    const calendar = {
        getName: () => "Danielle's Schedule (preview)",
        getId: () => 'pawblemsolved@gmail.com',
        getEvents: (a, b) => world.events.filter((e) => e.getStartTime() >= a && e.getStartTime() < b),
    };
    const owner = 'pawblemsolved@gmail.com';
    const ctx = {
        console,
        // Share the host Date so `instanceof Date` works on fixture dates
        // (a vm context otherwise has its own Date constructor).
        Date,
        SpreadsheetApp: {
            getActive: () => ({
                getSheetByName: (n) => world.sheets[n] || null,
                getUrl: () => 'https://docs.google.com/spreadsheets/d/1PEBeLvcSF5aigG6ydhvHGXcz8TgyPKMCDs0TXNpYTVA/edit',
            }),
        },
        CalendarApp: { getDefaultCalendar: () => calendar, getCalendarById: () => calendar },
        Session: {
            getActiveUser: () => ({ getEmail: () => owner }),
            getEffectiveUser: () => ({ getEmail: () => owner }),
        },
        LockService: { getScriptLock: () => ({ waitLock() {}, releaseLock() {} }) },
        PropertiesService: { getScriptProperties: () => ({ getProperty: () => null, setProperty() {} }) },
        Utilities: { formatDate },
    };
    vm.createContext(ctx);
    for (const f of ['Code.gs', 'Billing.gs', 'DashboardApp.gs']) {
        vm.runInContext(fs.readFileSync(path.join(scriptDir, f), 'utf8'), ctx, { filename: f });
    }
    if (!/^api_/.test(fn) || typeof ctx[fn] !== 'function') throw new Error('Unknown function ' + fn);
    return ctx[fn](...args);
}

// Browser-side stand-in for google.script.run: forwards calls to /api/<fn>.
const STUB = `<script>
var google = { script: { get run() {
  var ok = function () {}, fail = function (e) { console.error(e); };
  var runner = new Proxy({}, { get: function (_, name) {
    if (name === 'withSuccessHandler') return function (f) { ok = f; return runner; };
    if (name === 'withFailureHandler') return function (f) { fail = f; return runner; };
    return function () {
      var args = Array.prototype.slice.call(arguments);
      fetch('/api/' + name, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(args) })
        .then(function (r) { return r.json(); })
        .then(function (j) { j.error ? fail(new Error(j.error)) : ok(j.result); })
        .catch(fail);
    };
  } });
  return runner;
} } };
</script>
<div style="position:fixed;bottom:6px;right:8px;font:11px sans-serif;opacity:.55;z-index:99;pointer-events:none">PREVIEW · sample data</div>`;

const server = http.createServer(async (req, res) => {
    try {
        if (req.method === 'GET' && (req.url === '/' || req.url.startsWith('/?'))) {
            world = await buildWorld();
            const html = fs.readFileSync(path.join(scriptDir, 'Dashboard.html'), 'utf8');
            res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
            return res.end(html.replace(/<script>/, STUB + '<script>'));
        }
        if (req.method === 'POST' && req.url.startsWith('/api/')) {
            let body = '';
            for await (const chunk of req) body += chunk;
            const fn = req.url.slice(5);
            try {
                const result = runInSandbox(fn, JSON.parse(body || '[]'));
                res.writeHead(200, { 'Content-Type': 'application/json' });
                return res.end(JSON.stringify({ result }));
            } catch (err) {
                console.error(err);
                res.writeHead(200, { 'Content-Type': 'application/json' });
                return res.end(JSON.stringify({ error: String(err && err.message) }));
            }
        }
        res.writeHead(404);
        res.end('Not found');
    } catch (err) {
        console.error(err);
        res.writeHead(500);
        res.end(String(err));
    }
});

server.listen(PORT, () => {
    console.log(`Dashboard preview: http://localhost:${PORT}  (Ctrl+C to stop)`);
    console.log('Edits to apps-script/*.gs, Dashboard.html and preview/fixtures.mjs apply on refresh.');
});
