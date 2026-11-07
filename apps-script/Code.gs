/**
 * Pawblem Solved back office.
 *
 * Bound to the "Pawblem Solved – Clients" Google Sheet owned by
 * pawblemsolved@gmail.com. The Sheet is the database; this script:
 *   - creates/repairs the tabs (setup)
 *   - receives website submissions (doPost) and emails the owner
 *
 * See apps-script/README.md for setup and deployment.
 */

// ---------------------------------------------------------------------------
// Schema. Columns are looked up by header name, so new columns can be added
// to the right of these (or reordered) without breaking anything.
// ---------------------------------------------------------------------------

var TABS = {
    Settings: ['Setting', 'Value', 'Notes'],
    Clients: [
        'Client ID',
        'Status',
        'Created',
        'Name',
        'Email',
        'Phone',
        'Address',
        'Referred By',
        'Notes',
    ],
    Requests: [
        'Request ID',
        'Received',
        'Client ID',
        'Name',
        'Email',
        'Start Date',
        'End Date',
        'Dogs',
        'Cats / Other',
        'Comments',
    ],
    Pets: [
        'Pet ID',
        'Client ID',
        'Pet Name',
        'Calendar Name',
        'Species',
        'Active',
        'Notes',
    ],
};

var DEFAULT_SETTINGS = [
    [
        'Owner Email',
        'pawblemsolved@gmail.com',
        'Where new request notifications are sent.',
    ],
    [
        'Calendar ID',
        'primary',
        'Calendar that holds walks/visits. "primary" = the main calendar of this account.',
    ],
    [
        'Tracking Start Date',
        '',
        'Calendar events BEFORE this date are ignored for billing (yyyy-mm-dd).',
    ],
];

var CLIENT_STATUS = {
    PROSPECT: 'Prospect',
    ACTIVE: 'Active',
    INACTIVE: 'Inactive',
};

// ---------------------------------------------------------------------------
// Menu + setup
// ---------------------------------------------------------------------------

function onOpen() {
    SpreadsheetApp.getUi()
        .createMenu('Pawblem Solved')
        .addItem('Set up / repair tabs', 'setup')
        .addToUi();
}

/** Creates any missing tabs/headers and default settings. Safe to re-run. */
function setup() {
    var ss = SpreadsheetApp.getActive();
    Object.keys(TABS).forEach(function (name) {
        var sheet = ss.getSheetByName(name) || ss.insertSheet(name);
        var headers = TABS[name];
        var existing = sheet.getLastColumn()
            ? sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0]
            : [];
        var missing = headers.filter(function (h) {
            return existing.indexOf(h) === -1;
        });
        if (missing.length) {
            sheet
                .getRange(1, existing.filter(String).length + 1, 1, missing.length)
                .setValues([missing]);
        }
        sheet.setFrozenRows(1);
        sheet.getRange(1, 1, 1, sheet.getLastColumn()).setFontWeight('bold');
    });

    var settings = ss.getSheetByName('Settings');
    var have = settings
        .getRange(1, 1, Math.max(settings.getLastRow(), 1), 1)
        .getValues()
        .map(function (r) {
            return r[0];
        });
    DEFAULT_SETTINGS.forEach(function (row) {
        if (have.indexOf(row[0]) === -1) settings.appendRow(row);
    });

    var sheet1 = ss.getSheetByName('Sheet1');
    if (sheet1 && sheet1.getLastRow() === 0 && ss.getSheets().length > 1) {
        ss.deleteSheet(sheet1);
    }
}

// ---------------------------------------------------------------------------
// Web endpoint (called server-side by the website, never by browsers)
// ---------------------------------------------------------------------------

function doPost(e) {
    try {
        var body = JSON.parse((e && e.postData && e.postData.contents) || '{}');
        var secret = PropertiesService.getScriptProperties().getProperty(
            'SHARED_SECRET'
        );
        if (!secret || body.secret !== secret) {
            return json_({ ok: false, error: 'unauthorized' });
        }

        switch (body.action) {
            case 'serviceRequest':
                return json_(handleServiceRequest_(body.data || {}));
            default:
                return json_({ ok: false, error: 'unknown action' });
        }
    } catch (err) {
        console.error(err);
        return json_({ ok: false, error: 'server error' });
    }
}

function handleServiceRequest_(data) {
    var name = clean_(data.name);
    var email = clean_(data.email).toLowerCase();
    if (!name || !email) return { ok: false, error: 'name and email required' };

    var lock = LockService.getScriptLock();
    lock.waitLock(20000);
    var clientId, requestId, isNew;
    try {
        var clients = table_('Clients');
        var existing = clients.find(function (row) {
            return String(row['Email']).toLowerCase() === email;
        });
        isNew = !existing;
        if (existing) {
            clientId = existing['Client ID'];
        } else {
            clientId = nextId_('C', clients.rows, 'Client ID');
            clients.append({
                'Client ID': clientId,
                Status: CLIENT_STATUS.PROSPECT,
                Created: new Date(),
                Name: name,
                Email: email,
                Phone: clean_(data.phone),
                Address: clean_(data.address),
                'Referred By': clean_(data.referral),
            });
        }

        var requests = table_('Requests');
        requestId = nextId_('R', requests.rows, 'Request ID');
        requests.append({
            'Request ID': requestId,
            Received: new Date(),
            'Client ID': clientId,
            Name: name,
            Email: email,
            'Start Date': clean_(data.startDate),
            'End Date': clean_(data.endDate),
            Dogs: clean_(data.dogs),
            'Cats / Other': clean_(data.cats),
            Comments: clean_(data.comments),
        });
    } finally {
        lock.releaseLock();
    }

    notifyOwner_(data, { clientId: clientId, requestId: requestId, isNew: isNew });
    return { ok: true, clientId: clientId, requestId: requestId };
}

function notifyOwner_(data, meta) {
    var lines = [
        meta.isNew
            ? 'New client request (added to Clients as a Prospect).'
            : 'Request from an existing client.',
        '',
        'Name: ' + clean_(data.name),
        'Email: ' + clean_(data.email),
        'Phone: ' + clean_(data.phone),
        'Address: ' + clean_(data.address),
        'Dates: ' + (clean_(data.startDate) || '?') + ' to ' + (clean_(data.endDate) || '?'),
        'Dogs: ' + clean_(data.dogs) + '   Cats/Other: ' + clean_(data.cats),
        'Heard about us: ' + clean_(data.referral),
        '',
        'Comments:',
        clean_(data.comments) || '(none)',
        '',
        'Client ' + meta.clientId + ' · Request ' + meta.requestId,
        SpreadsheetApp.getActive().getUrl(),
    ];
    MailApp.sendEmail({
        to: getSetting_('Owner Email') || Session.getEffectiveUser().getEmail(),
        replyTo: clean_(data.email),
        subject: 'Service request: ' + clean_(data.name),
        body: lines.join('\n'),
    });
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function json_(obj) {
    return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(
        ContentService.MimeType.JSON
    );
}

function clean_(v) {
    return v === undefined || v === null ? '' : String(v).trim().slice(0, 2000);
}

/** Reads a tab into objects keyed by header; append() writes by header. */
function table_(name) {
    var sheet = SpreadsheetApp.getActive().getSheetByName(name);
    if (!sheet) throw new Error('Missing tab "' + name + '" – run setup.');
    var values = sheet.getDataRange().getValues();
    var headers = values.shift() || [];
    var rows = values.map(function (r) {
        var o = {};
        headers.forEach(function (h, i) {
            o[h] = r[i];
        });
        return o;
    });
    return {
        sheet: sheet,
        headers: headers,
        rows: rows,
        find: function (fn) {
            return rows.filter(fn)[0];
        },
        append: function (obj) {
            sheet.appendRow(
                headers.map(function (h) {
                    return obj[h] === undefined ? '' : obj[h];
                })
            );
        },
    };
}

/** C0001, C0002, ... based on the highest existing number. */
function nextId_(prefix, rows, column) {
    var max = 0;
    rows.forEach(function (r) {
        var n = parseInt(String(r[column]).replace(prefix, ''), 10);
        if (n > max) max = n;
    });
    return prefix + ('000' + (max + 1)).slice(-4);
}

function getSetting_(key) {
    var row = table_('Settings').find(function (r) {
        return r['Setting'] === key;
    });
    return row ? row['Value'] : '';
}
