import { useState, type FormEvent } from 'react';
import Header from '../components/header';
import Footer from '../components/footer';
import {
    AGREEMENT_FIELDS,
    AGREEMENT_TEXT,
    HOUSEHOLD,
    PET_NOTES,
    PET_SECTIONS,
    type Field,
    type Species,
} from '../lib/intake';

type Values = Record<string, string | string[]>;
type Pet = { key: number; species: Species; values: Values };
type Status = 'idle' | 'sending' | 'sent' | 'error';

let nextKey = 1;
const newPet = (species: Species = 'Dog'): Pet => ({
    key: nextKey++,
    species,
    values: {},
});

function FieldInput({
    field,
    idPrefix,
    value,
    onChange,
}: {
    field: Field;
    idPrefix: string;
    value: string | string[] | undefined;
    onChange: (v: string | string[]) => void;
}) {
    const id = `${idPrefix}-${field.name}`;
    const str = typeof value === 'string' ? value : '';
    const label = (
        <>
            {field.label}
            {field.required && <span className="required-mark"> *</span>}
        </>
    );
    const help = field.help && (
        <small className="field-help">{field.help}</small>
    );
    const cls = `intake-field${field.wide || field.type === 'textarea' ? ' wide' : ''}`;

    if (field.type === 'yesno') {
        return (
            <fieldset className={`${cls} yesno`}>
                <legend>{label}</legend>
                {['Yes', 'No'].map((opt) => (
                    <label key={opt} className="inline">
                        <input
                            type="radio"
                            name={id}
                            value={opt}
                            checked={str === opt}
                            onChange={() => onChange(opt)}
                        />{' '}
                        {opt}
                    </label>
                ))}
            </fieldset>
        );
    }

    if (field.type === 'checkboxes') {
        const list = Array.isArray(value) ? value : [];
        return (
            <fieldset className={cls}>
                <legend>{label}</legend>
                {field.options!.map((opt) => (
                    <label key={opt} className="inline">
                        <input
                            type="checkbox"
                            checked={list.includes(opt)}
                            onChange={(e) =>
                                onChange(
                                    e.target.checked
                                        ? [...list, opt]
                                        : list.filter((o) => o !== opt)
                                )
                            }
                        />{' '}
                        {opt}
                    </label>
                ))}
            </fieldset>
        );
    }

    return (
        <div className={cls}>
            <label htmlFor={id}>{label}</label>
            {field.type === 'textarea' ? (
                <textarea
                    id={id}
                    className="shorttext"
                    required={field.required}
                    value={str}
                    onChange={(e) => onChange(e.target.value)}
                />
            ) : field.type === 'select' ? (
                <select
                    id={id}
                    required={field.required}
                    value={str}
                    onChange={(e) => onChange(e.target.value)}
                >
                    <option value="">Select…</option>
                    {field.options!.map((o) => (
                        <option key={o} value={o}>
                            {o}
                        </option>
                    ))}
                </select>
            ) : (
                <input
                    id={id}
                    type={field.type}
                    className="text"
                    required={field.required}
                    value={str}
                    min={field.type === 'number' ? 0 : undefined}
                    onChange={(e) => onChange(e.target.value)}
                />
            )}
            {help}
        </div>
    );
}

function FieldGrid({
    fields,
    idPrefix,
    values,
    setValue,
}: {
    fields: Field[];
    idPrefix: string;
    values: Values;
    setValue: (name: string, v: string | string[]) => void;
}) {
    return (
        <div className="intake-grid">
            {fields.map((f) => (
                <FieldInput
                    key={f.name}
                    field={f}
                    idPrefix={idPrefix}
                    value={values[f.name]}
                    onChange={(v) => setValue(f.name, v)}
                />
            ))}
        </div>
    );
}

const Forms = () => {
    const [household, setHousehold] = useState<Values>({});
    const [pets, setPets] = useState<Pet[]>(() => [newPet()]);
    const [agree, setAgree] = useState(false);
    const [signature, setSignature] = useState('');
    const [status, setStatus] = useState<Status>('idle');
    const [error, setError] = useState('');

    const setHouseholdValue = (name: string, v: string | string[]) =>
        setHousehold((h) => ({ ...h, [name]: v }));
    const updatePet = (key: number, patch: Partial<Pet>) =>
        setPets((ps) =>
            ps.map((p) => (p.key === key ? { ...p, ...patch } : p))
        );

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setStatus('sending');
        setError('');
        const honeypot = (
            e.currentTarget.elements.namedItem('website') as HTMLInputElement
        )?.value;
        try {
            const res = await fetch('/api/forms', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    household,
                    pets: pets.map((p) => ({
                        ...p.values,
                        species: p.species,
                    })),
                    agree,
                    signature,
                    website: honeypot,
                }),
            });
            const json = await res.json().catch(() => ({}));
            if (!res.ok || !json.ok)
                throw new Error(json.error || 'Could not save your forms.');
            setStatus('sent');
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } catch (err) {
            setError(
                `${(err as Error).message} If this keeps happening, please email pawblemsolved@gmail.com.`
            );
            setStatus('error');
        }
    };

    return (
        <div id="container">
            <Header selectedTab="forms"></Header>
            <div id="content">
                <div className="banner-wrapper">
                    <div className="banner" id="banner-forms"></div>
                    <div className="banner-text">
                        <h1>Client Forms</h1>
                    </div>
                </div>
                <div className="content-text">
                    {status === 'sent' ? (
                        <div className="statement">
                            <h1>
                                <strong>
                                    Thank you! Your forms have been received.
                                </strong>
                                <br />
                                We look forward to caring for your pet
                                {pets.length > 1 ? 's' : ''}!
                            </h1>
                        </div>
                    ) : (
                        <>
                            <div className="statement">
                                <h1>
                                    Tell us about your household and your pets
                                </h1>
                            </div>
                            <p>
                                Please fill this out once before your first
                                visit. If anything changes, just submit it again
                                with the same email address and we'll update
                                your information. Fields marked{' '}
                                <span className="required-mark">*</span> are
                                required.
                            </p>

                            <form
                                className="intake-form"
                                onSubmit={handleSubmit}
                            >
                                <input
                                    type="text"
                                    name="website"
                                    tabIndex={-1}
                                    autoComplete="off"
                                    aria-hidden="true"
                                    className="hp-field"
                                />

                                {HOUSEHOLD.map((section) => (
                                    <section
                                        key={section.id}
                                        className="intake-section"
                                    >
                                        <h2>{section.title}</h2>
                                        {section.intro && (
                                            <p>{section.intro}</p>
                                        )}
                                        <FieldGrid
                                            fields={section.fields}
                                            idPrefix="household"
                                            values={household}
                                            setValue={setHouseholdValue}
                                        />
                                    </section>
                                ))}

                                {pets.map((pet, i) => (
                                    <section
                                        key={pet.key}
                                        className="intake-section pet-card"
                                    >
                                        <div className="pet-card-header">
                                            <h2>
                                                Pet {i + 1}
                                                {typeof pet.values.petName ===
                                                    'string' &&
                                                pet.values.petName
                                                    ? `: ${pet.values.petName}`
                                                    : ''}
                                            </h2>
                                            {pets.length > 1 && (
                                                <button
                                                    type="button"
                                                    className="link-button"
                                                    onClick={() =>
                                                        setPets((ps) =>
                                                            ps.filter(
                                                                (p) =>
                                                                    p.key !==
                                                                    pet.key
                                                            )
                                                        )
                                                    }
                                                >
                                                    Remove
                                                </button>
                                            )}
                                        </div>
                                        <fieldset className="species-toggle">
                                            <legend>This pet is a</legend>
                                            {(['Dog', 'Cat'] as Species[]).map(
                                                (s) => (
                                                    <label
                                                        key={s}
                                                        className="inline"
                                                    >
                                                        <input
                                                            type="radio"
                                                            name={`species-${pet.key}`}
                                                            checked={
                                                                pet.species ===
                                                                s
                                                            }
                                                            onChange={() =>
                                                                updatePet(
                                                                    pet.key,
                                                                    {
                                                                        species:
                                                                            s,
                                                                    }
                                                                )
                                                            }
                                                        />{' '}
                                                        {s}
                                                    </label>
                                                )
                                            )}
                                        </fieldset>
                                        {PET_SECTIONS[pet.species].map(
                                            (section) => (
                                                <div key={section.id}>
                                                    <h3>{section.title}</h3>
                                                    <FieldGrid
                                                        fields={section.fields}
                                                        idPrefix={`pet${pet.key}`}
                                                        values={pet.values}
                                                        setValue={(name, v) =>
                                                            updatePet(pet.key, {
                                                                values: {
                                                                    ...pet.values,
                                                                    [name]: v,
                                                                },
                                                            })
                                                        }
                                                    />
                                                </div>
                                            )
                                        )}
                                        <FieldGrid
                                            fields={[PET_NOTES]}
                                            idPrefix={`pet${pet.key}`}
                                            values={pet.values}
                                            setValue={(name, v) =>
                                                updatePet(pet.key, {
                                                    values: {
                                                        ...pet.values,
                                                        [name]: v,
                                                    },
                                                })
                                            }
                                        />
                                    </section>
                                ))}

                                <div className="center">
                                    <button
                                        type="button"
                                        className="secondary-button"
                                        onClick={() =>
                                            setPets((ps) => [...ps, newPet()])
                                        }
                                        disabled={pets.length >= 8}
                                    >
                                        + Add another pet
                                    </button>
                                </div>

                                <section className="intake-section">
                                    <h2>Client Agreement</h2>
                                    {AGREEMENT_TEXT.map((t) => (
                                        <p key={t}>{t}</p>
                                    ))}
                                    <label className="inline agree">
                                        <input
                                            type="checkbox"
                                            required
                                            checked={agree}
                                            onChange={(e) =>
                                                setAgree(e.target.checked)
                                            }
                                        />{' '}
                                        {AGREEMENT_FIELDS.agree.label}
                                        <span className="required-mark">
                                            {' '}
                                            *
                                        </span>
                                    </label>
                                    <div className="intake-grid">
                                        <div className="intake-field">
                                            <label htmlFor="signature">
                                                {
                                                    AGREEMENT_FIELDS.signature
                                                        .label
                                                }
                                                <span className="required-mark">
                                                    {' '}
                                                    *
                                                </span>
                                            </label>
                                            <input
                                                id="signature"
                                                className="text"
                                                required
                                                value={signature}
                                                onChange={(e) =>
                                                    setSignature(e.target.value)
                                                }
                                            />
                                        </div>
                                    </div>
                                </section>

                                {status === 'error' && (
                                    <p className="form-error" role="alert">
                                        {error}
                                    </p>
                                )}
                                <div className="center">
                                    <input
                                        type="submit"
                                        className="button"
                                        value={
                                            status === 'sending'
                                                ? 'Sending…'
                                                : 'Submit Forms'
                                        }
                                        disabled={status === 'sending'}
                                    />
                                </div>
                            </form>

                            <hr />
                            <p className="center">
                                Prefer paper? Download the{' '}
                                <a
                                    href="/downloads/PawblemSolvedClientForms.pdf"
                                    target="_blank"
                                >
                                    client agreement
                                </a>
                                ,{' '}
                                <a
                                    href="/downloads/DogInformationSheet.pdf"
                                    target="_blank"
                                >
                                    dog sheet
                                </a>{' '}
                                or{' '}
                                <a
                                    href="/downloads/CatInformationSheet.pdf"
                                    target="_blank"
                                >
                                    cat sheet
                                </a>
                                .
                            </p>
                        </>
                    )}
                </div>
            </div>
            <Footer></Footer>
        </div>
    );
};

export default Forms;
