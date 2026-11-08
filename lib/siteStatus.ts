/**
 * Temporary closure. The notice shows until REOPEN_DATE (Pacific time) and
 * then hides itself in the browser, so no redeploy is needed on the day.
 * To remove it for good, delete <ClosedNotice /> from components/header.tsx.
 */
export const REOPEN_DATE = '2027-01-01';
export const REOPEN_LABEL = 'January 1, 2027';

/** True while the business is still closed (checked in the visitor's browser). */
export function isClosed(now: Date = new Date()): boolean {
    const todayPacific = now.toLocaleDateString('en-CA', {
        timeZone: 'America/Los_Angeles',
    });
    return todayPacific < REOPEN_DATE;
}
