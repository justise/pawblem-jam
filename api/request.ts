import type { NextApiRequest, NextApiResponse } from 'next';
import { Resend } from 'resend';

type ResponseData = {
    message: string;
};

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<ResponseData>
) {
    const resend = new Resend(process.env.RESEND_KEY);

    await resend.emails.send({
        to: 'admin@pawblemsolved.com',
        subject: 'testing from website',
        text: `Testing ${req.body}`,
        from: 'no-reply@pawblemsolved.com',
    });

    console.log(`Testing ${req.body}`);

    res.status(200).json({ message: 'Hello from Next.js!' });
}
