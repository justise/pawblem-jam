import type { NextApiRequest, NextApiResponse } from 'next';
import { callBackoffice } from '../../lib/backoffice';

type ResponseData = { ok: boolean; error?: string };

const FIELDS = [
    'name',
    'email',
    'phone',
    'address',
    'startDate',
    'endDate',
    'dogs',
    'cats',
    'referral',
    'comments',
] as const;

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<ResponseData>
) {
    if (req.method !== 'POST') {
        res.setHeader('Allow', 'POST');
        return res.status(405).json({ ok: false, error: 'Method not allowed' });
    }

    const body = typeof req.body === 'object' && req.body ? req.body : {};

    // Honeypot: real people never fill the hidden "website" field.
    if (body.website) return res.status(200).json({ ok: true });

    const data: Record<string, string> = {};
    for (const key of FIELDS) {
        data[key] = String(body[key] ?? '')
            .trim()
            .slice(0, 2000);
    }
    if (!data.name || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
        return res
            .status(400)
            .json({
                ok: false,
                error: 'Please enter your name and a valid email.',
            });
    }

    try {
        const result = await callBackoffice('serviceRequest', data);
        if (!result.ok) {
            console.error('Back office rejected request:', result.error);
            return res
                .status(502)
                .json({ ok: false, error: 'Could not send request.' });
        }
        return res.status(200).json({ ok: true });
    } catch (err) {
        console.error(err);
        return res
            .status(500)
            .json({ ok: false, error: 'Could not send request.' });
    }
}
