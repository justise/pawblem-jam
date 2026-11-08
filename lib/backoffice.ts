/**
 * Server-side client for the Apps Script back office (see apps-script/).
 * Never import this from browser code: it carries the shared secret.
 */
export async function callBackoffice<T = Record<string, unknown>>(
    action: string,
    data: Record<string, unknown>
): Promise<{ ok: boolean; error?: string } & T> {
    const url = process.env.APPS_SCRIPT_URL;
    const secret = process.env.APPS_SCRIPT_SECRET;
    if (!url || !secret) {
        throw new Error('APPS_SCRIPT_URL / APPS_SCRIPT_SECRET not configured');
    }

    // Apps Script answers POSTs with a 302 to the result; fetch follows it.
    const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify({ secret, action, data }),
        redirect: 'follow',
    });
    const text = await res.text();
    try {
        return JSON.parse(text);
    } catch {
        throw new Error(
            `Back office returned non-JSON (HTTP ${res.status}): ${text.slice(0, 200)}`
        );
    }
}
