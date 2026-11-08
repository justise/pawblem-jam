import type { NextApiRequest, NextApiResponse } from 'next';
import { callBackoffice } from '../../lib/backoffice';
import {
    AGREEMENT_FIELDS,
    householdFields,
    petFields,
    printLayout,
    type Field,
    type Species,
} from '../../lib/intake';

type ResponseData = { ok: boolean; error?: string };

const MAX_PETS = 8;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function toCell(field: Field, raw: unknown): string {
    if (field.type === 'checkboxes') {
        const list = Array.isArray(raw) ? raw : raw ? [raw] : [];
        return list
            .map(String)
            .filter((v) => field.options?.includes(v))
            .join(', ');
    }
    const value = String(raw ?? '')
        .trim()
        .slice(0, 2000);
    if (field.type === 'yesno')
        return value === 'Yes' || value === 'No' ? value : '';
    if (field.type === 'select')
        return field.options?.includes(value) ? value : '';
    return value;
}

function mapFields(fields: Field[], input: Record<string, unknown>) {
    const row: Record<string, string> = {};
    const missing: string[] = [];
    for (const field of fields) {
        const cell = toCell(field, input?.[field.name]);
        row[field.column] = cell;
        if (field.required && !cell) missing.push(field.label);
    }
    return { row, missing };
}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<ResponseData>
) {
    if (req.method !== 'POST') {
        res.setHeader('Allow', 'POST');
        return res.status(405).json({ ok: false, error: 'Method not allowed' });
    }
    const body = typeof req.body === 'object' && req.body ? req.body : {};
    if (body.website) return res.status(200).json({ ok: true }); // honeypot

    const household = mapFields(householdFields(), body.household || {});
    const missing = [...household.missing];

    if (household.row['Email'] && !EMAIL_RE.test(household.row['Email']))
        missing.push('a valid Email');

    const rawPets: unknown[] = Array.isArray(body.pets)
        ? body.pets.slice(0, MAX_PETS)
        : [];
    if (!rawPets.length) missing.push('at least one pet');
    const pets = rawPets.map((p, i) => {
        const input = (p || {}) as Record<string, unknown>;
        const species: Species = input.species === 'Cat' ? 'Cat' : 'Dog';
        const mapped = mapFields(petFields(species), input);
        missing.push(...mapped.missing.map((m) => `Pet ${i + 1}: ${m}`));
        return { ...mapped.row, Species: species };
    });

    const signature = String(body.signature ?? '')
        .trim()
        .slice(0, 200);
    if (body.agree !== true || !signature) missing.push('the signed agreement');

    if (missing.length) {
        return res.status(400).json({
            ok: false,
            error: `Please fill in: ${missing.join(', ')}.`,
        });
    }

    const client = {
        ...household.row,
        [AGREEMENT_FIELDS.signature.column]: signature,
        [AGREEMENT_FIELDS.dateColumn]: new Date().toLocaleDateString('en-CA', {
            timeZone: 'America/Los_Angeles',
        }),
    };

    try {
        const result = await callBackoffice('intakeForms', {
            client,
            pets,
            layout: printLayout(),
        });
        if (!result.ok) {
            console.error('Back office rejected forms:', result.error);
            return res
                .status(502)
                .json({ ok: false, error: 'Could not save your forms.' });
        }
        return res.status(200).json({ ok: true });
    } catch (err) {
        console.error(err);
        return res
            .status(500)
            .json({ ok: false, error: 'Could not save your forms.' });
    }
}
