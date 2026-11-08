/**
 * Owner dashboard (phone-friendly), served by a SEPARATE web app deployment:
 *   Execute as: Me · Who has access: Only myself
 * The website deployment ("Anyone") shares this code, so every entry point
 * checks the viewer is the owner; anonymous visitors get nothing.
 */

function isOwner_() {
    var active = Session.getActiveUser().getEmail();
    var owner = Session.getEffectiveUser().getEmail();
    return !!active && active.toLowerCase() === String(owner).toLowerCase();
}

function assertOwner_() {
    if (!isOwner_()) throw new Error('Not authorized');
}

function doGet() {
    if (!isOwner_()) {
        return HtmlService.createHtmlOutput(
            '<p style="font-family:sans-serif">Not authorized.</p>'
        );
    }
    return HtmlService.createTemplateFromFile('Dashboard')
        .evaluate()
        .setTitle('Pawblem Solved')
        .addMetaTag('viewport', 'width=device-width, initial-scale=1')
        .setFaviconUrl('https://www.pawblemsolved.com/images/favicon.png');
}

/** Sheet menu: show the dashboard URL (set in script property DASHBOARD_URL). */
function showDashboardLink() {
    var url =
        PropertiesService.getScriptProperties().getProperty('DASHBOARD_URL');
    var html = url
        ? '<p><a href="' +
          url +
          '" target="_blank">Open dashboard</a></p><p style="word-break:break-all">' +
          url +
          '</p>'
        : '<p>Set script property <b>DASHBOARD_URL</b> to the dashboard deployment URL.</p>';
    SpreadsheetApp.getUi().showModalDialog(
        HtmlService.createHtmlOutput(
            '<div style="font-family:sans-serif">' + html + '</div>'
        ),
        'Dashboard'
    );
}

// ---------------------------------------------------------------------------
// API for Dashboard.html (google.script.run). Dates go out as ms numbers.
// ---------------------------------------------------------------------------

function startOfDay_(d) {
    return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

function visitOut_(v, extra) {
    var out = {
        title: v.title,
        start: v.start.getTime(),
        end: v.end.getTime(),
        day: v.day,
        clientId: v.clientId,
        clientName: v.clientName,
        pets: v.pets,
        status: v.status,
        holiday: v.holiday,
        amount: v.amount,
    };
    if (extra)
        Object.keys(extra).forEach(function (k) {
            out[k] = extra[k];
        });
    return out;
}

/** Upcoming visits + client list with balances. */
function api_overview() {
    assertOwner_();
    var now = new Date();
    var horizon = new Date(startOfDay_(now).getTime() + 8 * 864e5);
    var cfg = billingConfig_();
    var data = loadBillingData_(cfg.trackingStart, horizon);
    var result = computeVisitsPure_(data, now, dayKey_);
    var summary = summarizePure_(
        data.clients,
        result.visits,
        data.payments,
        startOfDay_(now),
        horizon
    );

    var clientsById = {};
    data.clients.forEach(function (c) {
        clientsById[c['Client ID']] = c;
    });
    var petsByClient = {};
    data.pets.forEach(function (p) {
        (petsByClient[p['Client ID']] =
            petsByClient[p['Client ID']] || []).push({
            id: p['Pet ID'],
            name: p['Pet Name'],
            species: p['Species'],
            calendarName: p['Calendar Name'],
            active: String(p['Active']).toLowerCase() !== 'no',
            sheet: p['Pet Sheet'] || '',
        });
    });

    var today = startOfDay_(now).getTime();
    var upcoming = result.visits
        .filter(function (v) {
            return v.end.getTime() >= today && v.status !== STATUS.CANCELLED;
        })
        .map(function (v) {
            var c = clientsById[v.clientId] || {};
            return visitOut_(v, {
                phone: String(c['Phone'] || ''),
                address: String(c['Address'] || ''),
                sheets: (petsByClient[v.clientId] || [])
                    .filter(function (p) {
                        return v.pets.indexOf(p.name) !== -1 && p.sheet;
                    })
                    .map(function (p) {
                        return { name: p.name, url: p.sheet };
                    }),
            });
        });

    var clients = summary.map(function (r) {
        var c = clientsById[r.clientId] || {};
        return {
            id: r.clientId,
            name: r.name,
            status: r.status,
            email: String(c['Email'] || ''),
            phone: String(c['Phone'] || ''),
            address: String(c['Address'] || ''),
            emergency: [c['Emergency Contact'], c['Emergency Contact Phone']]
                .filter(String)
                .join(' · '),
            vet: [c['Vet Name'], c['Vet Phone']].filter(String).join(' · '),
            key: String(c['Extra Key Location'] || ''),
            pets: petsByClient[r.clientId] || [],
            totalCharged: r.totalCharged,
            totalPaid: r.totalPaid,
            balance: r.balance,
        };
    });
    clients.sort(function (a, b) {
        var rank = { Active: 0, Prospect: 1 };
        var ra = rank[a.status] !== undefined ? rank[a.status] : 2;
        var rb = rank[b.status] !== undefined ? rank[b.status] : 2;
        return ra - rb || String(a.name).localeCompare(String(b.name));
    });

    return {
        generatedAt: now.getTime(),
        upcoming: upcoming,
        clients: clients,
        unmatchedCount: result.unmatched.filter(function (u) {
            return u.start >= startOfDay_(now);
        }).length,
        sheetUrl: SpreadsheetApp.getActive().getUrl(),
    };
}

/** Billing for [fromDay, toDay] inclusive; strings 'yyyy-MM-dd'. */
function api_billing(fromDay, toDay) {
    assertOwner_();
    var from = parseDate_(fromDay);
    var toInclusive = parseDate_(toDay);
    if (!from || !toInclusive || toInclusive < from)
        throw new Error('Invalid date range');
    var to = new Date(toInclusive.getTime() + 864e5);
    var now = new Date();
    var cfg = billingConfig_();
    // Load from tracking start so balances are complete.
    var loadTo = to > now ? to : now;
    var data = loadBillingData_(cfg.trackingStart, loadTo);
    var result = computeVisitsPure_(data, now, dayKey_);
    var label =
        Utilities.formatDate(from, TZ, 'MMM d') +
        ' – ' +
        Utilities.formatDate(toInclusive, TZ, 'MMM d, yyyy');
    var rows = summarizePure_(
        data.clients,
        result.visits,
        data.payments,
        from,
        to
    )
        .filter(function (r) {
            return r.period.visits.length || Math.abs(r.balance) >= 0.01;
        })
        .map(function (r) {
            return {
                clientId: r.clientId,
                name: r.name,
                completed: r.period.completed,
                lateCancels: r.period.lateCancels,
                cancelled: r.period.cancelled,
                scheduled: r.period.scheduled,
                holidays: r.period.holidays,
                charges: r.period.charges,
                totalPaid: r.totalPaid,
                balance: r.balance,
                invoice: invoiceTextPure_(r, label, cfg),
                visits: r.period.visits.map(function (v) {
                    return visitOut_(v);
                }),
            };
        });
    rows.sort(function (a, b) {
        return String(a.name).localeCompare(String(b.name));
    });
    return {
        label: label,
        rows: rows,
        totalCharges: round2_(
            rows.reduce(function (s, r) {
                return s + r.charges;
            }, 0)
        ),
        unmatched: result.unmatched
            .filter(function (u) {
                return u.start >= from && u.start < to;
            })
            .map(function (u) {
                return { title: u.title, day: u.day, start: u.start.getTime() };
            }),
        trackingStart: dayKey_(cfg.trackingStart),
    };
}

/** p = {clientId, amount, date: 'yyyy-MM-dd', method, notes} */
function api_recordPayment(p) {
    assertOwner_();
    var amount = num_(p && p.amount, NaN);
    if (!p || !p.clientId || isNaN(amount) || amount <= 0)
        throw new Error('Enter a client and a positive amount.');
    var lock = LockService.getScriptLock();
    lock.waitLock(20000);
    try {
        var client = table_('Clients').find(function (c) {
            return c['Client ID'] === p.clientId;
        });
        if (!client) throw new Error('Unknown client ' + p.clientId);
        var payments = table_('Payments');
        var id = nextId_('PAY', payments.rows, 'Payment ID');
        payments.append({
            'Payment ID': id,
            Date: parseDate_(p.date) || new Date(),
            'Client ID': p.clientId,
            'Client Name': client['Name'],
            Amount: round2_(amount),
            Method: clean_(p.method),
            Notes: clean_(p.notes),
        });
        return { ok: true, paymentId: id };
    } finally {
        lock.releaseLock();
    }
}

/** Run from the editor to check billing for the current month in the log. */
function logBillingThisMonth() {
    var now = new Date();
    var b = api_billing(
        dayKey_(new Date(now.getFullYear(), now.getMonth(), 1)),
        dayKey_(new Date(now.getFullYear(), now.getMonth() + 1, 0))
    );
    console.log(
        'Billing ' +
            b.label +
            ' (tracking from ' +
            b.trackingStart +
            '): total ' +
            money_(b.totalCharges)
    );
    b.rows.forEach(function (r) {
        console.log(
            r.name +
                ': ' +
                money_(r.charges) +
                ' · ' +
                r.completed +
                ' completed, ' +
                r.lateCancels +
                ' late, ' +
                r.cancelled +
                ' cancelled, ' +
                r.scheduled +
                ' scheduled · balance ' +
                money_(r.balance)
        );
    });
    b.unmatched.forEach(function (u) {
        console.log('Unmatched: ' + u.day + ' ' + u.title);
    });
}
