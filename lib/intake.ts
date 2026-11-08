/**
 * Single source of truth for the client intake forms (replaces the old
 * PDF client agreement, dog sheet and cat sheet).
 *
 * Each field's `column` is the Google Sheet header it is stored under. The
 * Apps Script back office creates any missing columns automatically, so
 * adding a question here is all that's needed.
 */

export type FieldType =
    | 'text'
    | 'email'
    | 'tel'
    | 'date'
    | 'number'
    | 'textarea'
    | 'select'
    | 'yesno'
    | 'checkboxes';

export type Field = {
    name: string;
    column: string;
    label: string;
    type: FieldType;
    required?: boolean;
    options?: string[];
    help?: string;
    /** Render on its own full-width row. */
    wide?: boolean;
};

export type Section = {
    id: string;
    title: string;
    intro?: string;
    fields: Field[];
};

export type Species = 'Dog' | 'Cat';

// ---------------------------------------------------------------------------
// Household (stored on the Clients tab)
// ---------------------------------------------------------------------------

export const HOUSEHOLD: Section[] = [
    {
        id: 'contact',
        title: 'Your Information',
        fields: [
            {
                name: 'name',
                column: 'Name',
                label: 'Name(s)',
                type: 'text',
                required: true,
            },
            {
                name: 'email',
                column: 'Email',
                label: 'Email',
                type: 'email',
                required: true,
            },
            {
                name: 'phone',
                column: 'Phone',
                label: 'Cell Phone',
                type: 'tel',
                required: true,
            },
            {
                name: 'altPhone',
                column: 'Alternate Phone',
                label: 'Home / Work Phone',
                type: 'tel',
            },
            {
                name: 'address',
                column: 'Address',
                label: 'Address',
                type: 'textarea',
                required: true,
            },
            {
                name: 'emergencyName',
                column: 'Emergency Contact',
                label: 'Emergency Contact Name',
                type: 'text',
                required: true,
            },
            {
                name: 'emergencyPhone',
                column: 'Emergency Contact Phone',
                label: 'Emergency Contact Phone',
                type: 'tel',
                required: true,
            },
        ],
    },
    {
        id: 'home',
        title: 'Home Access',
        fields: [
            {
                name: 'keyLocation',
                column: 'Extra Key Location',
                label: 'Location of Extra Key',
                type: 'text',
            },
            {
                name: 'alarmCompany',
                column: 'Alarm Company',
                label: 'Alarm Company Name',
                type: 'text',
            },
            {
                name: 'alarmPhone',
                column: 'Alarm Company Phone',
                label: 'Alarm Company Phone',
                type: 'tel',
            },
            {
                name: 'alarmCodes',
                column: 'Alarm Instructions',
                label: 'Alarm Codes / Instructions',
                type: 'textarea',
                help: 'Activation and deactivation codes, and anything else we need to know.',
            },
            {
                name: 'duties',
                column: 'Additional Duties',
                label: 'Additional duties (optional)',
                type: 'checkboxes',
                options: [
                    'Bring in mail/papers',
                    'Water plants',
                    'Put out trash/recycling',
                ],
                wide: true,
            },
            {
                name: 'contactPreference',
                column: 'Contact Preference',
                label: 'How and how often would you like updates during visits?',
                type: 'text',
                wide: true,
            },
            {
                name: 'householdNotes',
                column: 'Household Notes',
                label: 'Anything else about your home we should know?',
                type: 'textarea',
                wide: true,
            },
        ],
    },
    {
        id: 'vet',
        title: 'Veterinary Information',
        intro: 'If your pet becomes ill or is injured, we will take them to the veterinary office below.',
        fields: [
            {
                name: 'vetName',
                column: 'Vet Name',
                label: 'Veterinary Office Name',
                type: 'text',
                required: true,
            },
            {
                name: 'vetPhone',
                column: 'Vet Phone',
                label: 'Vet Phone',
                type: 'tel',
                required: true,
            },
            {
                name: 'vetAddress',
                column: 'Vet Address',
                label: 'Vet Address',
                type: 'textarea',
            },
            {
                name: 'altVetName',
                column: 'Alternate Vet Name',
                label: 'Alternate Veterinary Office',
                type: 'text',
            },
            {
                name: 'altVetPhone',
                column: 'Alternate Vet Phone',
                label: 'Alternate Vet Phone',
                type: 'tel',
            },
            {
                name: 'altVetAddress',
                column: 'Alternate Vet Address',
                label: 'Alternate Vet Address',
                type: 'textarea',
            },
            {
                name: 'vetLimit',
                column: 'Vet Approval Limit',
                label: 'Pawblem Solved may approve treatment up to ($)',
                type: 'number',
                required: true,
            },
        ],
    },
];

// TODO(Danielle): review wording. Adapted from the paper client agreement and
// veterinary release form.
export const AGREEMENT_TEXT = [
    'I request that Pawblem Solved take care of my pet(s) and agree to pay the charges for the services provided. I understand that payment is due upon completion of services.',
    'If any of my pets becomes ill or is injured, I authorize Pawblem Solved to take them to the veterinary office listed above, or to another veterinary office if neither listed office is available, and to approve treatment up to the amount stated. I will assume full responsibility for payment and/or reimbursement for veterinary services rendered up to that amount.',
    'I understand that Pawblem Solved cannot be held responsible for the results of veterinary treatment or the loss of my pet.',
    'This agreement is valid from the date below whenever Pawblem Solved cares for my pets.',
];

export const AGREEMENT_FIELDS = {
    agree: { name: 'agree', label: 'I have read and agree to the above.' },
    signature: {
        name: 'signature',
        column: 'Agreement Signed By',
        label: 'Type your full name as your signature',
    },
    dateColumn: 'Agreement Date',
};

// ---------------------------------------------------------------------------
// Pets (one row per pet on the Pets tab)
// ---------------------------------------------------------------------------

const PET_BASICS: Field[] = [
    {
        name: 'petName',
        column: 'Pet Name',
        label: 'Name',
        type: 'text',
        required: true,
    },
    { name: 'age', column: 'Age', label: 'Age', type: 'text' },
    { name: 'breed', column: 'Breed', label: 'Breed', type: 'text' },
    {
        name: 'color',
        column: 'Color / Markings',
        label: 'Color / Markings',
        type: 'text',
    },
    {
        name: 'sex',
        column: 'Sex',
        label: 'Sex',
        type: 'select',
        options: ['Male', 'Female'],
    },
    {
        name: 'fixed',
        column: 'Spayed / Neutered',
        label: 'Spayed / Neutered',
        type: 'yesno',
    },
    {
        name: 'rabiesTag',
        column: 'Rabies Tag #',
        label: 'Rabies Tag #',
        type: 'text',
    },
    {
        name: 'rabiesExpires',
        column: 'Rabies Expires',
        label: 'Rabies Shot Expires',
        type: 'date',
    },
];

const feeding = (pet: string): Field[] => [
    {
        name: 'food',
        column: 'Food',
        label: `What food does your ${pet} eat?`,
        type: 'text',
        wide: true,
    },
    {
        name: 'feedingTimes',
        column: 'Feeding Times',
        label: `When does your ${pet} eat?`,
        type: 'text',
        wide: true,
    },
    {
        name: 'feedingNotes',
        column: 'Feeding Instructions',
        label: 'Special feeding instructions',
        type: 'textarea',
        wide: true,
    },
];

const health: Field[] = [
    {
        name: 'medicalConditions',
        column: 'Medical Conditions',
        label: 'Medical conditions',
        type: 'textarea',
        wide: true,
    },
    {
        name: 'medications',
        column: 'Medications',
        label: 'Medications',
        type: 'textarea',
        help: 'Name, dosage, how and when to give it, and where it is kept.',
        wide: true,
    },
];

export const PET_SECTIONS: Record<Species, Section[]> = {
    Dog: [
        { id: 'basics', title: 'About Your Dog', fields: PET_BASICS },
        { id: 'feeding', title: 'Feeding', fields: feeding('dog') },
        { id: 'health', title: 'Health', fields: health },
        {
            id: 'other',
            title: 'Walks & Play',
            fields: [
                {
                    name: 'leashLocation',
                    column: 'Collar & Leash Location',
                    label: 'Where do you keep the collar and leash?',
                    type: 'text',
                    wide: true,
                },
                {
                    name: 'harness',
                    column: 'Walking Gear',
                    label: 'Special harness or collar for walks?',
                    type: 'text',
                    wide: true,
                },
                {
                    name: 'favoriteGame',
                    column: 'Favorite Games / Toys',
                    label: 'Favorite game?',
                    type: 'text',
                    wide: true,
                },
                {
                    name: 'hiding',
                    column: 'Hiding Places',
                    label: 'Favorite hiding places?',
                    type: 'text',
                    wide: true,
                },
            ],
        },
        {
            id: 'traits',
            title: 'Traits',
            fields: [
                [
                    'friendlyDogs',
                    'Friendly With Other Dogs',
                    'Is friendly with other dogs',
                ],
                ['likesAdults', 'Likes New Adults', 'Likes new adults'],
                ['likesKids', 'Likes Children', 'Likes children'],
                [
                    'onLeash',
                    'Must Stay On Leash',
                    'Must stay on leash during walks',
                ],
                [
                    'allowedInside',
                    'Allowed In House',
                    'Is allowed in the house',
                ],
                ['treats', 'Allowed Treats', 'Is allowed to have treats'],
                ['digging', 'Prone To Digging', 'Is prone to digging'],
                ['chewing', 'Prone To Chewing', 'Is prone to chewing'],
                [
                    'fearful',
                    'Fearful Of Noises',
                    'Is fearful of noises or other things',
                ],
                ['commands', 'Obeys Basic Commands', 'Obeys basic commands'],
                ['bitten', 'Has Bitten', 'Has bitten people or other dogs'],
                [
                    'aggression',
                    'Other Aggression',
                    'Has shown other aggression',
                ],
            ].map(([name, column, label]) => ({
                name,
                column,
                label,
                type: 'yesno' as const,
            })),
        },
    ],
    Cat: [
        { id: 'basics', title: 'About Your Cat', fields: PET_BASICS },
        { id: 'feeding', title: 'Feeding', fields: feeding('cat') },
        { id: 'health', title: 'Health', fields: health },
        {
            id: 'other',
            title: 'Home & Play',
            fields: [
                {
                    name: 'outdoors',
                    column: 'Allowed Outdoors',
                    label: 'Is your cat allowed outdoors?',
                    type: 'yesno',
                },
                {
                    name: 'favoriteToys',
                    column: 'Favorite Games / Toys',
                    label: 'Favorite toys?',
                    type: 'text',
                    wide: true,
                },
                {
                    name: 'hiding',
                    column: 'Hiding Places',
                    label: 'Favorite hiding places?',
                    type: 'text',
                    wide: true,
                },
                {
                    name: 'comeOut',
                    column: 'Brings Out Of Hiding',
                    label: 'What brings your cat out of hiding?',
                    type: 'text',
                    help: 'e.g. the can opener or treat jar',
                    wide: true,
                },
            ],
        },
        {
            id: 'traits',
            title: 'Traits',
            fields: [
                ['declawed', 'Declawed', 'Declawed'],
                ['escapes', 'Tries To Escape', 'Tries to escape'],
                [
                    'stressEating',
                    'Stops Eating When Stressed',
                    'Will not eat when stressed',
                ],
                ['hairballs', 'Prone To Hairballs', 'Prone to hairballs'],
                [
                    'skittish',
                    'Skittish With Strangers',
                    'Skittish with strangers',
                ],
                [
                    'litter',
                    'Uses Litter Box Reliably',
                    'Uses the litter box reliably',
                ],
                ['fearful', 'Fearful Of Noises', 'Fearful of loud noises'],
                ['petting', 'Likes Petting', 'Likes to be petted'],
                ['held', 'Likes Being Held', 'Likes to be held'],
                ['bitten', 'Has Bitten', 'Has bitten anyone'],
                ['aggression', 'Other Aggression', 'Other signs of aggression'],
            ].map(([name, column, label]) => ({
                name,
                column,
                label,
                type: 'yesno' as const,
            })),
        },
    ],
};

export const PET_NOTES: Field = {
    name: 'petNotes',
    column: 'Behavior Notes',
    label: 'Anything else about their habits or behavior that would help us care for them?',
    type: 'textarea',
    wide: true,
};

export function petFields(species: Species): Field[] {
    return [...PET_SECTIONS[species].flatMap((s) => s.fields), PET_NOTES];
}

export function householdFields(): Field[] {
    return HOUSEHOLD.flatMap((s) => s.fields);
}

/** Print layout sent to the back office so the pet sheet mirrors the form. */
export function printLayout() {
    const layout = (sections: Section[]) =>
        sections.map((s) => ({
            title: s.title,
            columns: s.fields.map((f) => f.column),
        }));
    return {
        household: layout(HOUSEHOLD),
        pet: {
            Dog: [
                ...layout(PET_SECTIONS.Dog),
                { title: 'Notes', columns: [PET_NOTES.column] },
            ],
            Cat: [
                ...layout(PET_SECTIONS.Cat),
                { title: 'Notes', columns: [PET_NOTES.column] },
            ],
        },
    };
}
