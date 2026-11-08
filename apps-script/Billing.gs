/**
 * Billing: turns Google Calendar events into charged visits.
 *
 * Conventions (see README):
 *  - Event title contains each pet's "Calendar Name" (Pets tab).
 *  - Event color marks the outcome: default = completed (once it has ended),
 *    "Cancelled Color" = no charge, "Late Cancel Color" = Late Cancel Percent.
 *  - Events before Settings "Tracking Start Date" are ignored.
 *
 * Pure functions (no Google services) end in "Pure_" so they can be unit
 * tested outside Apps Script.
 */

var TZ = 'America/Los_Angeles';

/** Google Calendar event color ids (CalendarApp.EventColor). */
var EVENT_COLORS = {
    lavender: '1',
    sage: '2',
    grape: '3',
    flamingo: '4',
    banana: '5',
    tangerine: '6',
    peacock: '7',
    graphite: '8',
    blueberry: '9',
    basil: '10',
    tomato: '11',
};

var STATUS = {
    COMPLETED: 'Completed',
    SCHEDULED: 'Scheduled',
    CANCELLED: 'Cancelled',
    LATE_CANCEL: 'Late Cancel',
};

// ---------------------------------------------------------------------------
// Google-facing wrappers
// ---------------------------------------------------------------------------

function billingConfig_() {
    var s = {};
    table_('Settings').rows.forEach(function (r) {
        s[r['Setting']] = r['Value'];
    });
    return billingConfigPure_(s);
}

/** Loads everything needed to compute visits between two Dates. */
function loadBillingData_(from, to) {
    var cfg = billingConfig_();
    var start = from < cfg.trackingStart ? cfg.trackingStart : from;
    var events = [];
    if (to > start) {
        var cal =
            cfg.calendarId === 'primary' || !cfg.calendarId
                ? CalendarApp.getDefaultCalendar()
                : CalendarApp.getCalendarById(cfg.calendarId);
        if (!cal) throw new Error('Calendar not found: ' + cfg.calendarId);
        events = cal.getEvents(start, to).map(function (e) {
            return {
                id: e.getId() + '@' + e.getStartTime().getTime(),
                title: e.getTitle(),
                start: e.getStartTime(),
                end: e.getEndTime(),
                color: e.getColor(),
                allDay: e.isAllDayEvent(),
            };
        });
    }
    return {
        cfg: cfg,
        events: events,
        clients: table_('Clients').rows,
        pets: table_('Pets').rows,
        payments: table_('Payments').rows,
    };
}

function dayKey_(d) {
    return Utilities.formatDate(d, TZ, 'yyyy-MM-dd');
}

// ---------------------------------------------------------------------------
// Pure logic
// ---------------------------------------------------------------------------

function num_(v, fallback) {
    var n = parseFloat(String(v).replace(/[$,%\s]/g, ''));
    return isNaN(n) ? fallback : n;
}

function colorId_(v, fallback) {
    var s = String(v || '')
        .trim()
        .toLowerCase();
    if (!s) return fallback;
    if (EVENT_COLORS[s]) return EVENT_COLORS[s];
    // Anything else (an id like "11", or whatever logEventColors() shows for
    // newer color labels) is compared as-is.
    return s;
}

function parseDate_(v) {
    if (v instanceof Date) return v;
    var s = String(v || '').trim();
    var m = s.match(/^(\d{4})-(\d{1,2})-(\d{1,2})$/);
    if (m) return new Date(+m[1], +m[2] - 1, +m[3]);
    m = s.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
    if (m) return new Date(+m[3], +m[1] - 1, +m[2]);
    return null;
}

function billingConfigPure_(s) {
    return {
        calendarId: String(s['Calendar ID'] || 'primary').trim(),
        trackingStart:
            parseDate_(s['Tracking Start Date']) || new Date(2100, 0, 1),
        dogRate: num_(s['Dog Walk Rate'], 45),
        dogsIncluded: num_(s['Dogs Included'], 2),
        extraDog: num_(s['Additional Dog Fee'], 3),
        catRate: num_(s['Cat Visit Rate'], 38),
        catsIncluded: num_(s['Cats Included'], 2),
        extraCat: num_(s['Additional Cat Fee'], 3),
        holiday: num_(s['Holiday Surcharge'], 10),
        lateCancelPct: num_(s['Late Cancel Percent'], 50),
        cancelledColor: colorId_(s['Cancelled Color'], EVENT_COLORS.flamingo),
        lateCancelColor: colorId_(
            s['Late Cancel Color'],
            EVENT_COLORS.tangerine
        ),
        // Blank = every event is considered. Set = only events with the walk,
        // cancelled or late-cancel color count; all others are ignored.
        walkColor: colorId_(s['Walk Color'], ''),
    };
}

function escapeRe_(s) {
    return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * Finds pets named in an event title. Longest calendar names match first and
 * consume their text, so "Buddy Jones" doesn't also count as "Buddy".
 */
function matchPetsPure_(title, pets) {
    var text = ' ' + String(title).toLowerCase() + ' ';
    var candidates = pets
        .filter(function (p) {
            return (
                String(p['Active']).toLowerCase() !== 'no' &&
                String(p['Calendar Name']).trim()
            );
        })
        .sort(function (a, b) {
            return (
                String(b['Calendar Name']).length -
                String(a['Calendar Name']).length
            );
        });
    var found = [];
    candidates.forEach(function (p) {
        var name = String(p['Calendar Name']).trim().toLowerCase();
        var re = new RegExp(
            '(^|[^a-z0-9])' + escapeRe_(name) + '(?=[^a-z0-9]|$)'
        );
        var m = text.match(re);
        if (m) {
            found.push(p);
            var at = m.index + m[1].length;
            text =
                text.slice(0, at) +
                Array(name.length + 1).join('#') +
                text.slice(at + name.length);
        }
    });
    return found;
}

/** US holidays from the Rates page, as yyyy-MM-dd keys. */
function holidaysPure_(year) {
    function key(m, d) {
        return year + '-' + ('0' + m).slice(-2) + '-' + ('0' + d).slice(-2);
    }
    function nthWeekday(month, weekday, n) {
        // n-th (1-based) weekday of month; n = -1 for last
        if (n > 0) {
            var first = new Date(year, month - 1, 1).getDay();
            return 1 + ((weekday - first + 7) % 7) + (n - 1) * 7;
        }
        var lastDate = new Date(year, month, 0).getDate();
        var lastDay = new Date(year, month - 1, lastDate).getDay();
        return lastDate - ((lastDay - weekday + 7) % 7);
    }
    // Easter (Anonymous Gregorian algorithm)
    var a = year % 19,
        b = Math.floor(year / 100),
        c = year % 100;
    var d = Math.floor(b / 4),
        e = b % 4,
        f = Math.floor((b + 8) / 25);
    var g = Math.floor((b - f + 1) / 3);
    var h = (19 * a + b - d - g + 15) % 30;
    var i = Math.floor(c / 4),
        k = c % 4;
    var l = (32 + 2 * e + 2 * i - h - k) % 7;
    var m = Math.floor((a + 11 * h + 22 * l) / 451);
    var easterMonth = Math.floor((h + l - 7 * m + 114) / 31);
    var easterDay = ((h + l - 7 * m + 114) % 31) + 1;

    var list = {};
    list[key(1, 1)] = "New Year's Day";
    list[key(easterMonth, easterDay)] = 'Easter Sunday';
    list[key(5, nthWeekday(5, 1, -1))] = 'Memorial Day';
    list[key(7, 4)] = '4th of July';
    list[key(9, nthWeekday(9, 1, 1))] = 'Labor Day';
    list[key(11, nthWeekday(11, 4, 4))] = 'Thanksgiving';
    list[key(12, 24)] = 'Christmas Eve';
    list[key(12, 25)] = 'Christmas Day';
    list[key(12, 31)] = "New Year's Eve";
    return list;
}

function round2_(n) {
    return Math.round(n * 100) / 100;
}

/** Base price for one visit to one household. */
function visitPricePure_(cfg, client, dogs, cats) {
    var override = num_(client && client['Visit Rate'], NaN);
    if (dogs > 0) {
        var base = isNaN(override) ? cfg.dogRate : override;
        return base + Math.max(0, dogs - cfg.dogsIncluded) * cfg.extraDog;
    }
    var catBase = isNaN(override) ? cfg.catRate : override;
    return catBase + Math.max(0, cats - cfg.catsIncluded) * cfg.extraCat;
}

/**
 * events: [{id,title,start,end,color,allDay}] (Dates)
 * keyOf: function(Date) -> 'yyyy-MM-dd' in the business timezone
 * Returns { visits: [...], unmatched: [...] }. One visit per household per
 * event; an event naming pets from two households yields two visits.
 */
function computeVisitsPure_(data, now, keyOf) {
    var cfg = data.cfg;
    var clientsById = {};
    data.clients.forEach(function (c) {
        clientsById[c['Client ID']] = c;
    });
    var holidayCache = {};
    var visits = [];
    var unmatched = [];

    data.events.forEach(function (ev) {
        if (ev.allDay || ev.start < cfg.trackingStart) return;
        var color = String(ev.color || '').toLowerCase();
        if (
            cfg.walkColor &&
            color !== cfg.walkColor &&
            color !== cfg.cancelledColor &&
            color !== cfg.lateCancelColor
        ) {
            return; // not a walk (e.g. a personal event on the same calendar)
        }
        var pets = matchPetsPure_(ev.title, data.pets);
        if (!pets.length) {
            unmatched.push({
                title: ev.title,
                start: ev.start,
                day: keyOf(ev.start),
            });
            return;
        }
        var byClient = {};
        pets.forEach(function (p) {
            (byClient[p['Client ID']] = byClient[p['Client ID']] || []).push(p);
        });

        var status =
            color === cfg.cancelledColor
                ? STATUS.CANCELLED
                : color === cfg.lateCancelColor
                  ? STATUS.LATE_CANCEL
                  : ev.end <= now
                    ? STATUS.COMPLETED
                    : STATUS.SCHEDULED;

        var day = keyOf(ev.start);
        var year = day.slice(0, 4);
        holidayCache[year] = holidayCache[year] || holidaysPure_(+year);
        var holidayName = holidayCache[year][day] || '';

        Object.keys(byClient).forEach(function (clientId) {
            var group = byClient[clientId];
            var client = clientsById[clientId] || {};
            var dogs = group.filter(function (p) {
                return p['Species'] === 'Dog';
            }).length;
            var cats = group.length - dogs;
            var full =
                visitPricePure_(cfg, client, dogs, cats) +
                (holidayName ? cfg.holiday : 0);
            var amount =
                status === STATUS.COMPLETED
                    ? full
                    : status === STATUS.LATE_CANCEL
                      ? full * (cfg.lateCancelPct / 100)
                      : 0;
            visits.push({
                eventId: ev.id,
                title: ev.title,
                start: ev.start,
                end: ev.end,
                day: day,
                clientId: clientId,
                clientName:
                    client['Name'] || '(unknown client ' + clientId + ')',
                pets: group.map(function (p) {
                    return p['Pet Name'];
                }),
                dogs: dogs,
                cats: cats,
                status: status,
                holiday: holidayName,
                fullPrice: round2_(full),
                amount: round2_(amount),
            });
        });
    });
    visits.sort(function (a, b) {
        return a.start - b.start;
    });
    return { visits: visits, unmatched: unmatched };
}

/**
 * Per-client totals. Period = [from, to). Lifetime balance counts every
 * charge since tracking start (completed + late cancels) minus all payments.
 */
function summarizePure_(clients, visits, payments, from, to) {
    var rows = {};
    clients.forEach(function (c) {
        rows[c['Client ID']] = {
            clientId: c['Client ID'],
            name: c['Name'],
            status: c['Status'],
            period: {
                completed: 0,
                lateCancels: 0,
                cancelled: 0,
                scheduled: 0,
                holidays: 0,
                charges: 0,
                visits: [],
            },
            totalCharged: 0,
            chargedBefore: 0,
            totalPaid: 0,
            balance: 0,
        };
    });
    visits.forEach(function (v) {
        var r = rows[v.clientId];
        if (!r) return;
        r.totalCharged += v.amount;
        if (v.start < from) r.chargedBefore += v.amount;
        if (v.start >= from && v.start < to) {
            var p = r.period;
            if (v.status === STATUS.COMPLETED) p.completed++;
            if (v.status === STATUS.LATE_CANCEL) p.lateCancels++;
            if (v.status === STATUS.CANCELLED) p.cancelled++;
            if (v.status === STATUS.SCHEDULED) p.scheduled++;
            if (v.holiday && v.amount) p.holidays++;
            p.charges += v.amount;
            p.visits.push(v);
        }
    });
    payments.forEach(function (pay) {
        var r = rows[pay['Client ID']];
        if (r) r.totalPaid += num_(pay['Amount'], 0);
    });
    return Object.keys(rows).map(function (id) {
        var r = rows[id];
        r.totalCharged = round2_(r.totalCharged);
        r.chargedBefore = round2_(r.chargedBefore);
        r.totalPaid = round2_(r.totalPaid);
        r.balance = round2_(r.totalCharged - r.totalPaid);
        r.period.charges = round2_(r.period.charges);
        return r;
    });
}

function money_(n) {
    return '$' + (Math.round(n * 100) / 100).toFixed(2);
}

/** Plain-text invoice Danielle can paste into an email or text message. */
function invoiceTextPure_(row, periodLabel, cfg) {
    var lines = ['Pawblem Solved – ' + periodLabel, row.name, ''];
    row.period.visits.forEach(function (v) {
        if (!v.amount) return;
        lines.push(
            v.day +
                '  ' +
                v.pets.join(' & ') +
                (v.status === STATUS.LATE_CANCEL
                    ? ' (late cancellation, ' + cfg.lateCancelPct + '%)'
                    : '') +
                (v.holiday ? ' (' + v.holiday + ')' : '') +
                '  ' +
                money_(v.amount)
        );
    });
    lines.push('', 'Total this period: ' + money_(row.period.charges));
    // Only charges up to the end of this period count; later visits belong
    // to a later invoice. All payments received so far are applied.
    var previous = round2_(row.chargedBefore - row.totalPaid);
    if (Math.abs(previous) >= 0.01) {
        lines.push(
            (previous > 0 ? 'Previous balance: ' : 'Credit: ') +
                money_(Math.abs(previous))
        );
    }
    lines.push(
        'Amount due: ' + money_(Math.max(0, previous + row.period.charges)),
        '',
        'Thank you!'
    );
    return lines.join('\n');
}

/**
 * Run from the editor. For each event from 7 days ago to 7 days ahead, logs
 * the raw color, whether billing counts it (and why not), matched pets,
 * status and amount. If the "Google Calendar API" advanced service is
 * enabled (Editor → Services → +), also logs the API's colorId for
 * comparison with CalendarApp's getColor().
 */
function logEventColors() {
    var cfg = billingConfig_();
    var cal =
        cfg.calendarId === 'primary' || !cfg.calendarId
            ? CalendarApp.getDefaultCalendar()
            : CalendarApp.getCalendarById(cfg.calendarId);
    var now = new Date();
    var from = new Date(now.getTime() - 7 * 864e5);
    var to = new Date(now.getTime() + 7 * 864e5);
    var events = cal.getEvents(from, to);
    var pets = table_('Pets').rows;
    var clients = table_('Clients').rows;

    console.log('=== Settings ===');
    console.log(
        'Calendar ID setting="' +
            cfg.calendarId +
            '" → using "' +
            cal.getName() +
            '" (id ' +
            cal.getId() +
            ')'
    );
    console.log(
        'Tracking Start Date: ' +
            Utilities.formatDate(cfg.trackingStart, TZ, 'yyyy-MM-dd')
    );
    console.log(
        'Walk Color="' +
            cfg.walkColor +
            '"' +
            (cfg.walkColor ? '' : ' (blank: every event counts)') +
            ' · Cancelled Color="' +
            cfg.cancelledColor +
            '" · Late Cancel Color="' +
            cfg.lateCancelColor +
            '"'
    );
    console.log(
        'Rates: dog $' +
            cfg.dogRate +
            ' (≤' +
            cfg.dogsIncluded +
            ' dogs, +$' +
            cfg.extraDog +
            ') · cat $' +
            cfg.catRate +
            ' (≤' +
            cfg.catsIncluded +
            ' cats, +$' +
            cfg.extraCat +
            ') · holiday +$' +
            cfg.holiday +
            ' · late cancel ' +
            cfg.lateCancelPct +
            '%'
    );
    console.log(
        'Active pets / Calendar Names: ' +
            pets
                .filter(function (p) {
                    return String(p['Active']).toLowerCase() !== 'no';
                })
                .map(function (p) {
                    return (
                        '"' +
                        p['Calendar Name'] +
                        '" (' +
                        p['Species'] +
                        ', ' +
                        p['Client ID'] +
                        ')'
                    );
                })
                .join(', ')
    );

    // Optional: colorIds straight from the Calendar API (advanced service).
    var apiColors = {};
    var apiNote =
        'Advanced "Google Calendar API" service not enabled; API colorId not shown.';
    if (typeof Calendar !== 'undefined') {
        try {
            var items =
                Calendar.Events.list(cal.getId(), {
                    timeMin: from.toISOString(),
                    timeMax: to.toISOString(),
                    singleEvents: true,
                    maxResults: 250,
                }).items || [];
            items.forEach(function (it) {
                var start = it.start && (it.start.dateTime || it.start.date);
                apiColors[it.summary + '|' + new Date(start).getTime()] =
                    it.colorId || '';
            });
            apiNote = 'Calendar API returned ' + items.length + ' event(s).';
        } catch (e) {
            apiNote = 'Calendar API call failed: ' + e.message;
        }
    }
    console.log(apiNote);

    console.log('=== ' + events.length + ' event(s) ===');
    var counted = 0;
    events.forEach(function (e) {
        var start = e.getStartTime();
        var color = String(e.getColor() || '').toLowerCase();
        var api = apiColors[e.getTitle() + '|' + start.getTime()];
        var line =
            Utilities.formatDate(start, TZ, 'EEE MMM d h:mma') +
            '  "' +
            e.getTitle() +
            '"  getColor="' +
            color +
            '"' +
            (api !== undefined ? '  apiColorId="' + api + '"' : '') +
            (e.isRecurringEvent() ? '  (recurring)' : '');

        var verdict;
        if (e.isAllDayEvent()) verdict = 'IGNORED: all-day event';
        else if (start < cfg.trackingStart)
            verdict = 'IGNORED: before Tracking Start Date';
        else if (
            cfg.walkColor &&
            color !== cfg.walkColor &&
            color !== cfg.cancelledColor &&
            color !== cfg.lateCancelColor
        )
            verdict =
                'IGNORED: color "' +
                color +
                '" is not Walk/Cancelled/Late Cancel Color';
        else {
            var matched = matchPetsPure_(e.getTitle(), pets);
            if (!matched.length) {
                verdict = 'UNMATCHED: no Calendar Name found in title';
            } else {
                var r = computeVisitsPure_(
                    {
                        cfg: cfg,
                        clients: clients,
                        pets: pets,
                        events: [
                            {
                                id: 'x',
                                title: e.getTitle(),
                                start: start,
                                end: e.getEndTime(),
                                color: color,
                                allDay: false,
                            },
                        ],
                    },
                    now,
                    dayKey_
                );
                verdict = r.visits
                    .map(function (v) {
                        return (
                            'COUNTED: ' +
                            v.clientName +
                            ' · ' +
                            v.pets.join(' & ') +
                            ' · ' +
                            v.status +
                            ' · $' +
                            v.amount.toFixed(2) +
                            (v.holiday ? ' (' + v.holiday + ')' : '')
                        );
                    })
                    .join(' | ');
                counted++;
            }
        }
        console.log(line + '\n      → ' + verdict);
    });
    console.log('=== ' + counted + ' counted ===');
}
