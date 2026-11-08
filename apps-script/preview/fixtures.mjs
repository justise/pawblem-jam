// Sample data for the dashboard preview. Dates are relative to today so the
// preview always has recent and upcoming visits. Colors follow the live
// Settings: walk = 6, cancelled = 4, late cancel = 10.

export const settings = {
    'Owner Email': 'pawblemsolved@gmail.com',
    'Calendar ID': 'primary',
    'Tracking Start Date': null, // filled in below (21 days ago)
    'Dog Walk Rate': 45,
    'Dogs Included': 2,
    'Additional Dog Fee': 3,
    'Cat Visit Rate': 38,
    'Cats Included': 2,
    'Additional Cat Fee': 3,
    'Holiday Surcharge': 10,
    'Late Cancel Percent': 50,
    'Walk Color': '6',
    'Cancelled Color': '4',
    'Late Cancel Color': '10',
};

export const clients = [
    { 'Client ID': 'C0001', Status: 'Active', Name: 'Jane & Tom Smith', Email: 'jane@example.com', Phone: '425-555-0101', Address: '16011 NE 36th Way, Redmond, WA 98052', 'Emergency Contact': 'Tom Smith', 'Emergency Contact Phone': '425-555-0102', 'Vet Name': 'Redmond Animal Hospital', 'Vet Phone': '425-555-0150', 'Extra Key Location': 'Lockbox on side gate, code 2468' },
    { 'Client ID': 'C0002', Status: 'Active', Name: 'Bob Jones', Email: 'bob@example.com', Phone: '425-555-0201', Address: '11820 NE 116th St, Kirkland, WA 98034', 'Vet Name': 'Juanita Bay Vet', 'Vet Phone': '425-555-0250', 'Extra Key Location': 'Under the blue planter' },
    { 'Client ID': 'C0003', Status: 'Active', Name: 'Priya Patel', Email: 'priya@example.com', Phone: '425-555-0301', Address: '8301 161st Ave NE, Redmond, WA 98052', 'Visit Rate': 40 },
    { 'Client ID': 'C0004', Status: 'Active', Name: 'Lee Nguyen', Email: 'lee@example.com', Phone: '425-555-0401', Address: '12500 NE 85th St, Kirkland, WA 98033' },
    { 'Client ID': 'C0005', Status: 'Prospect', Name: 'Morgan Diaz', Email: 'morgan@example.com', Phone: '425-555-0501' },
    { 'Client ID': 'C0006', Status: 'Inactive', Name: 'Sam Carter', Email: 'sam@example.com' },
];

export const pets = [
    { 'Pet ID': 'P0001', 'Client ID': 'C0001', 'Pet Name': 'Buddy', 'Calendar Name': 'Buddy', Species: 'Dog', Active: 'Yes', 'Pet Sheet': 'https://docs.google.com/open?id=example1' },
    { 'Pet ID': 'P0002', 'Client ID': 'C0001', 'Pet Name': 'Max', 'Calendar Name': 'Max', Species: 'Dog', Active: 'Yes', 'Pet Sheet': 'https://docs.google.com/open?id=example2' },
    { 'Pet ID': 'P0003', 'Client ID': 'C0002', 'Pet Name': 'Buddy', 'Calendar Name': 'Buddy Jones', Species: 'Dog', Active: 'Yes', 'Pet Sheet': 'https://docs.google.com/open?id=example3' },
    { 'Pet ID': 'P0004', 'Client ID': 'C0003', 'Pet Name': 'Kona', 'Calendar Name': 'Kona', Species: 'Cat', Active: 'Yes' },
    { 'Pet ID': 'P0005', 'Client ID': 'C0003', 'Pet Name': 'Riley', 'Calendar Name': 'Riley', Species: 'Cat', Active: 'Yes' },
    { 'Pet ID': 'P0006', 'Client ID': 'C0004', 'Pet Name': 'Luna', 'Calendar Name': 'Luna', Species: 'Dog', Active: 'Yes' },
    { 'Pet ID': 'P0007', 'Client ID': 'C0004', 'Pet Name': 'Ziggy', 'Calendar Name': 'Ziggy', Species: 'Dog', Active: 'Yes' },
    { 'Pet ID': 'P0008', 'Client ID': 'C0004', 'Pet Name': 'Pepper', 'Calendar Name': 'Pepper', Species: 'Dog', Active: 'Yes' },
    { 'Pet ID': 'P0009', 'Client ID': 'C0006', 'Pet Name': 'Old Yeller', 'Calendar Name': 'Old Yeller', Species: 'Dog', Active: 'No' },
];

export const payments = [
    { 'Payment ID': 'PAY0001', 'Client ID': 'C0001', 'Client Name': 'Jane & Tom Smith', Amount: 225, Method: 'Check', daysAgo: 7 },
    { 'Payment ID': 'PAY0002', 'Client ID': 'C0002', 'Client Name': 'Bob Jones', Amount: 135, Method: 'Venmo', daysAgo: 3 },
];

/**
 * Calendar events: [dayOffset, hour, minute, durationMin, title, color].
 * Weekend days are skipped automatically for the recurring walks.
 */
export function buildEvents(today) {
    const events = [];
    const add = (offset, h, m, dur, title, color) => {
        const start = new Date(today);
        start.setDate(start.getDate() + offset);
        start.setHours(h, m, 0, 0);
        events.push({ title, start, end: new Date(start.getTime() + dur * 60000), color, allDay: false });
    };
    for (let offset = -21; offset <= 8; offset++) {
        const d = new Date(today);
        d.setDate(d.getDate() + offset);
        const dow = d.getDay();
        if (dow === 0 || dow === 6) continue;
        if (dow === 1 || dow === 3 || dow === 5) add(offset, 10, 0, 45, 'Buddy & Max', '6');
        if (dow === 2 || dow === 4) add(offset, 11, 0, 45, 'Buddy Jones walk', '6');
        if (dow === 1 || dow === 4) add(offset, 12, 30, 45, 'Luna, Ziggy & Pepper', '6');
        if (dow === 3) add(offset, 13, 30, 30, 'Kona & Riley visit', '6');
        add(offset, 17, 0, 60, 'Gym', ''); // personal event: ignored
    }
    // Outcomes on a few past visits
    const mark = (offset, titleStart, color) => {
        const target = events.find((e) => {
            const diff = Math.round((new Date(e.start).setHours(0, 0, 0, 0) - new Date(today).setHours(0, 0, 0, 0)) / 864e5);
            return diff === offset && e.title.startsWith(titleStart);
        });
        if (target) target.color = color;
    };
    for (let o = -14; o <= -1; o++) {
        mark(o, 'Buddy Jones', o === -9 ? '4' : '6');
        mark(o, 'Buddy & Max', o === -5 ? '10' : '6');
    }
    add(-2, 14, 0, 45, 'Bisquit walk', '6'); // walk color but unknown pet: unmatched
    return events;
}
