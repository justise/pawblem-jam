/**
 * Temporary closure notice. Danielle controls it in the editor
 * (content/closed-notice.json): "show" turns it on or off, and "hideOn" makes
 * it disappear by itself on that date (Pacific time) without a redeploy.
 */
import notice from '../content/closed-notice.json';

export const closedNotice = notice;

/** True while the notice should show (checked again in the visitor's browser). */
export function isClosed(
    now: Date = new Date(),
    n: Pick<typeof notice, 'show' | 'hideOn'> = notice,
): boolean {
    if (!n.show) return false;
    if (!n.hideOn) return true;
    const todayPacific = now.toLocaleDateString('en-CA', {
        timeZone: 'America/Los_Angeles',
    });
    return todayPacific < String(n.hideOn).slice(0, 10);
}
