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
        'Pet Sheet',
        'Updated',
        'Notes',
    ],
};
// Form questions add more columns to Clients and Pets automatically
// (defined in lib/intake.ts on the website).

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
        .addItem('Refresh all pet sheets', 'refreshAllPetSheets')
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
                .getRange(
                    1,
                    existing.filter(String).length + 1,
                    1,
                    missing.length
                )
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
        var secret =
            PropertiesService.getScriptProperties().getProperty(
                'SHARED_SECRET'
            );
        if (!secret || body.secret !== secret) {
            return json_({ ok: false, error: 'unauthorized' });
        }

        switch (body.action) {
            case 'serviceRequest':
                return json_(handleServiceRequest_(body.data || {}));
            case 'intakeForms':
                return json_(handleIntakeForms_(body.data || {}));
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

    notifyOwner_(data, {
        clientId: clientId,
        requestId: requestId,
        isNew: isNew,
    });
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
        'Dates: ' +
            (clean_(data.startDate) || '?') +
            ' to ' +
            (clean_(data.endDate) || '?'),
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
// Intake forms (household + pets)
// ---------------------------------------------------------------------------

/**
 * data = {
 *   client: { 'Name': ..., 'Email': ..., <Sheet column>: value, ... },
 *   pets:   [{ 'Pet Name': ..., 'Species': 'Dog'|'Cat', <column>: value }],
 *   layout: print layout (see printLayout() in lib/intake.ts)
 * }
 * Clients are matched by email; pets by client + pet name, so resubmitting
 * updates rows instead of duplicating them.
 */
function handleIntakeForms_(data) {
    var input = data.client || {};
    var email = clean_(input['Email']).toLowerCase();
    if (!clean_(input['Name']) || !email) {
        return { ok: false, error: 'name and email required' };
    }
    if (data.layout) {
        PropertiesService.getScriptProperties().setProperty(
            'PRINT_LAYOUT',
            JSON.stringify(data.layout)
        );
    }

    var lock = LockService.getScriptLock();
    lock.waitLock(30000);
    var client,
        isNewClient,
        petResults = [];
    try {
        var clients = table_('Clients');
        var fields = cleanObject_(input);
        fields['Email'] = email;
        fields['Forms Submitted'] = new Date();
        client = clients.find(function (r) {
            return String(r['Email']).toLowerCase() === email;
        });
        isNewClient = !client;
        if (client) {
            clients.update(client, fields);
        } else {
            fields['Client ID'] = nextId_('C', clients.rows, 'Client ID');
            fields['Status'] = CLIENT_STATUS.PROSPECT;
            fields['Created'] = new Date();
            client = clients.append(fields);
        }

        var pets = table_('Pets');
        (data.pets || []).forEach(function (p) {
            petResults.push(upsertPet_(pets, client, cleanObject_(p)));
        });
    } finally {
        lock.releaseLock();
    }

    // Docs are slow; build them outside the lock.
    petResults.forEach(function (r) {
        try {
            r.sheetUrl = writePetSheet_(r.pets, r.pet, client);
        } catch (err) {
            console.error('Pet sheet failed for ' + r.pet['Pet ID'], err);
            r.sheetError = String((err && err.message) || err);
        }
    });

    notifyIntake_(client, petResults, isNewClient);
    return {
        ok: true,
        clientId: client['Client ID'],
        petIds: petResults.map(function (r) {
            return r.pet['Pet ID'];
        }),
    };
}

function upsertPet_(pets, client, fields) {
    var clientId = client['Client ID'];
    var petName = clean_(fields['Pet Name']);
    var existing = pets.find(function (r) {
        return (
            r['Client ID'] === clientId &&
            String(r['Pet Name']).toLowerCase() === petName.toLowerCase()
        );
    });
    fields['Updated'] = new Date();

    if (existing) {
        pets.update(existing, fields);
        return { pets: pets, pet: existing, isNew: false };
    }

    // Calendar convention: events are titled with the pet's name. If another
    // client's active pet already uses that name, add this client's last name.
    var calendarName = petName;
    var clash = pets.find(function (r) {
        return (
            r['Client ID'] !== clientId &&
            String(r['Active']).toLowerCase() !== 'no' &&
            String(r['Calendar Name']).toLowerCase() === petName.toLowerCase()
        );
    });
    if (clash) calendarName = petName + ' ' + lastName_(client['Name']);

    fields['Pet ID'] = nextId_('P', pets.rows, 'Pet ID');
    fields['Client ID'] = clientId;
    fields['Calendar Name'] = calendarName;
    fields['Active'] = 'Yes';
    var pet = pets.append(fields);
    return { pets: pets, pet: pet, isNew: true, renamed: !!clash };
}

function lastName_(name) {
    // "Jane & John Smith" -> "Smith"
    var parts = String(name).trim().split(/\s+/);
    return parts[parts.length - 1] || '';
}

function notifyIntake_(client, petResults, isNewClient) {
    var lines = [
        (isNewClient ? 'NEW client' : 'Client') +
            ' submitted their forms: ' +
            client['Name'] +
            ' (' +
            client['Client ID'] +
            ')',
        '',
    ];
    petResults.forEach(function (r) {
        var p = r.pet;
        lines.push(
            (r.isNew ? 'New pet: ' : 'Updated: ') +
                p['Pet Name'] +
                ' (' +
                p['Species'] +
                ') · Calendar name: "' +
                p['Calendar Name'] +
                '"'
        );
        if (r.renamed) {
            lines.push(
                '   ⚠ Another client already has a pet named ' +
                    p['Pet Name'] +
                    ', so use "' +
                    p['Calendar Name'] +
                    '" in calendar events.'
            );
        }
        if (r.sheetUrl) lines.push('   Printable sheet: ' + r.sheetUrl);
        if (r.sheetError)
            lines.push('   ⚠ Printable sheet failed: ' + r.sheetError);
    });
    lines.push('', SpreadsheetApp.getActive().getUrl());
    MailApp.sendEmail({
        to: getSetting_('Owner Email') || Session.getEffectiveUser().getEmail(),
        replyTo: client['Email'],
        subject: 'Forms submitted: ' + client['Name'],
        body: lines.join('\n'),
    });
}

// ---------------------------------------------------------------------------
// Printable pet sheets (one Google Doc per pet, refreshed on every submit)
// ---------------------------------------------------------------------------

var SKIP_ON_SHEET = [
    'Pet ID',
    'Client ID',
    'Active',
    'Pet Sheet',
    'Updated',
    'Species',
    'Pet Name',
];

function petSheetsFolder_() {
    var props = PropertiesService.getScriptProperties();
    var id = props.getProperty('PET_SHEETS_FOLDER_ID');
    if (id) {
        var folder;
        try {
            folder = DriveApp.getFolderById(id);
        } catch (e) {
            throw new Error(
                'Cannot open pet sheets folder ' +
                    id +
                    ' (check PET_SHEETS_FOLDER_ID and that pawblemsolved@gmail.com can edit it): ' +
                    e.message
            );
        }
        if (folder.isTrashed()) {
            throw new Error('Pet sheets folder ' + id + ' is in the trash.');
        }
        return folder;
    }
    var created = DriveApp.createFolder('Pawblem Solved – Pet Sheets');
    props.setProperty('PET_SHEETS_FOLDER_ID', created.getId());
    return created;
}

function writePetSheet_(pets, pet, client) {
    var layout = JSON.parse(
        PropertiesService.getScriptProperties().getProperty('PRINT_LAYOUT') ||
            '{}'
    );
    var title =
        pet['Pet Name'] +
        ' (' +
        lastName_(client['Name']) +
        ') – ' +
        pet['Species'];

    var doc = null;
    var url = String(pet['Pet Sheet'] || '');
    var match = url.match(/\/d\/([\w-]+)/);
    if (match) {
        try {
            doc = DocumentApp.openById(match[1]);
            if (DriveApp.getFileById(match[1]).isTrashed()) doc = null;
        } catch (e) {
            doc = null;
        }
    }
    if (!doc) {
        var folder = petSheetsFolder_(); // before creating, so failures leave no orphan Doc
        doc = DocumentApp.create(title);
        DriveApp.getFileById(doc.getId()).moveTo(folder);
    } else {
        doc.setName(title);
    }

    var body = doc.getBody();
    body.clear();
    body.setMarginTop(36)
        .setMarginBottom(36)
        .setMarginLeft(48)
        .setMarginRight(48);
    body.getParagraphs()[0]
        .setText(pet['Pet Name'] + ' – ' + pet['Species'])
        .setHeading(DocumentApp.ParagraphHeading.TITLE);
    body.appendParagraph(
        client['Name'] +
            ' · Calendar name: ' +
            pet['Calendar Name'] +
            ' · Updated ' +
            Utilities.formatDate(
                new Date(),
                'America/Los_Angeles',
                'MMM d, yyyy'
            )
    )
        .editAsText()
        .setItalic(true);

    var petSections = (layout.pet && layout.pet[pet['Species']]) || [
        { title: 'Details', columns: pets.headers },
    ];
    petSections.forEach(function (s) {
        appendSection_(body, s.title, s.columns, pet);
    });
    (layout.household || []).forEach(function (s) {
        appendSection_(body, s.title, s.columns, client);
    });

    // Read the URL before closing: a closed Document throws on any access.
    var docUrl = doc.getUrl();
    doc.saveAndClose();
    pets.update(pet, { 'Pet Sheet': docUrl });
    return docUrl;
}

function appendSection_(body, title, columns, row) {
    var cells = [];
    columns.forEach(function (c) {
        if (SKIP_ON_SHEET.indexOf(c) !== -1) return;
        var v = row[c];
        if (v === '' || v === undefined || v === null) return;
        if (v instanceof Date) {
            v = Utilities.formatDate(v, 'America/Los_Angeles', 'MMM d, yyyy');
        }
        cells.push([c, String(v)]);
    });
    if (!cells.length) return;
    body.appendParagraph(title).setHeading(
        DocumentApp.ParagraphHeading.HEADING2
    );
    var table = body.appendTable(cells);
    table.setBorderColor('#cccccc');
    for (var i = 0; i < table.getNumRows(); i++) {
        var label = table.getCell(i, 0);
        label.setWidth(150).setBackgroundColor('#f3f3f3');
        label.editAsText().setBold(true);
        table.getCell(i, 1).editAsText().setBold(false);
    }
}

/** Menu: rebuild every active pet's sheet (e.g. after editing the Sheet). */
function refreshAllPetSheets() {
    var clients = table_('Clients');
    var pets = table_('Pets');
    var count = 0;
    pets.rows.forEach(function (pet) {
        if (String(pet['Active']).toLowerCase() === 'no') return;
        var client = clients.find(function (c) {
            return c['Client ID'] === pet['Client ID'];
        });
        if (!client) return;
        writePetSheet_(pets, pet, client);
        count++;
    });
    SpreadsheetApp.getActive().toast('Refreshed ' + count + ' pet sheet(s).');
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Trims every value and drops keys starting with "_". */
function cleanObject_(obj) {
    var out = {};
    Object.keys(obj || {}).forEach(function (k) {
        if (k.charAt(0) === '_') return;
        out[String(k).slice(0, 100)] = clean_(obj[k]);
    });
    return out;
}

function json_(obj) {
    return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(
        ContentService.MimeType.JSON
    );
}

/**
 * Trims and caps a submitted value. Values starting with = + - @ are stored
 * as plain text (leading apostrophe) so a submission can't inject a formula.
 */
function clean_(v) {
    var s =
        v === undefined || v === null ? '' : String(v).trim().slice(0, 2000);
    return /^[=+\-@]/.test(s) ? "'" + s : s;
}

/**
 * Reads a tab into objects keyed by header. Each row object carries its
 * sheet row number in `_row`. append()/update() write by header name.
 */
function table_(name) {
    var sheet = SpreadsheetApp.getActive().getSheetByName(name);
    if (!sheet) throw new Error('Missing tab "' + name + '" – run setup.');
    var values = sheet.getDataRange().getValues();
    var headers = (values.shift() || []).map(String);
    var rows = values.map(function (r, i) {
        var o = { _row: i + 2 };
        headers.forEach(function (h, j) {
            o[h] = r[j];
        });
        return o;
    });
    var t = {
        sheet: sheet,
        headers: headers,
        rows: rows,
        find: function (fn) {
            return rows.filter(fn)[0];
        },
        /** Adds any columns in `obj` that the tab doesn't have yet. */
        ensureColumns: function (obj) {
            var missing = Object.keys(obj).filter(function (k) {
                return k.charAt(0) !== '_' && headers.indexOf(k) === -1;
            });
            if (!missing.length) return;
            sheet
                .getRange(1, headers.length + 1, 1, missing.length)
                .setValues([missing])
                .setFontWeight('bold');
            headers.push.apply(headers, missing);
        },
        append: function (obj) {
            t.ensureColumns(obj);
            sheet.appendRow(
                headers.map(function (h) {
                    return obj[h] === undefined ? '' : obj[h];
                })
            );
            var row = { _row: sheet.getLastRow() };
            headers.forEach(function (h) {
                row[h] = obj[h] === undefined ? '' : obj[h];
            });
            rows.push(row);
            return row;
        },
        /** Overwrites only the keys present in `obj` on an existing row. */
        update: function (row, obj) {
            t.ensureColumns(obj);
            var range = sheet.getRange(row._row, 1, 1, headers.length);
            var current = range.getValues()[0];
            headers.forEach(function (h, j) {
                if (obj[h] !== undefined) {
                    current[j] = obj[h];
                    row[h] = obj[h];
                }
            });
            range.setValues([current]);
            return row;
        },
    };
    return t;
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
