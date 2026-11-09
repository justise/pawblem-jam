import { useState, type FormEvent } from 'react';
import Header from '../components/header';
import Footer from '../components/footer';
import { ClosedRequestNote } from '../components/closedNotice';

type Status = 'idle' | 'sending' | 'sent' | 'error';

const Request = () => {
    const [status, setStatus] = useState<Status>('idle');
    const [error, setError] = useState('');

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setStatus('sending');
        setError('');
        const data = Object.fromEntries(new FormData(e.currentTarget));
        try {
            const res = await fetch('/api/request', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });
            const json = await res.json().catch(() => ({}));
            if (!res.ok || !json.ok) {
                throw new Error(json.error || 'Could not send request.');
            }
            setStatus('sent');
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } catch (err) {
            setError(
                `${(err as Error).message} Please try again, or email pawblemsolved@gmail.com.`
            );
            setStatus('error');
        }
    };

    return (
        <div id="container">
            <Header selectedTab="request"></Header>
            <div id="content">
                <div className="banner-wrapper">
                    <div className="banner" id="banner-request"></div>
                    <div className="banner-text">
                        <h1>Request a Service</h1>
                    </div>
                </div>

                <div className="content-text">
                    {status === 'sent' && (
                        <div className="statement request-confirmation">
                            <h1>
                                <strong>
                                    Thank you so much for your request!
                                </strong>
                                <br />
                                We will get back to you shortly on the next
                                steps for caring for your pet(s)!
                            </h1>
                            <br />
                            <br />
                        </div>
                    )}

                    <div className="statement">
                        <h1>
                            Pawblem Solved offers mid-day dog walks while you're
                            at work and cat visits in Redmond and North
                            Kirkland.
                        </h1>
                    </div>

                    <ClosedRequestNote />

                    <div>
                        <br />
                        <p>
                            Thank you so much for your interest in Pawblem
                            Solved!
                        </p>
                        <p>Please check below for our current availability -</p>
                        <div className="paragraph">
                            <h3>Dog Walks</h3>
                        </div>
                        <p>
                            Location: All Service Areas
                            <br />
                            Walk Time-Frame: 9am - 2pm
                            <br />
                            Days: Monday, Tuesday, Wednesday, Thursday, Friday;
                            1-5 walks per week
                            <br />
                        </p>

                        <p>Thanks again!</p>
                        <p>
                            We look forward to meeting some new furry friends!
                        </p>
                        <p>Danielle, Pawblem Solved</p>
                    </div>

                    {status !== 'sent' && (
                        <form onSubmit={handleSubmit}>
                            {/* Honeypot for bots; hidden from people. */}
                            <input
                                type="text"
                                name="website"
                                tabIndex={-1}
                                autoComplete="off"
                                aria-hidden="true"
                                style={{
                                    position: 'absolute',
                                    left: '-9999px',
                                }}
                            />
                            <div className="yui3-g-r">
                                <div className="yui3-u-1-2">
                                    <div className="grid-wrapper">
                                        <label htmlFor="name">Human Name</label>
                                        <input
                                            id="name"
                                            type="text"
                                            className="text"
                                            name="name"
                                            autoComplete="name"
                                            required
                                        />

                                        <label htmlFor="email">Email</label>
                                        <input
                                            id="email"
                                            type="email"
                                            className="text"
                                            name="email"
                                            autoComplete="email"
                                            required
                                        />

                                        <label htmlFor="phone">Phone</label>
                                        <input
                                            id="phone"
                                            type="tel"
                                            className="text"
                                            name="phone"
                                            autoComplete="tel"
                                        />

                                        <div className="yui3-g-r">
                                            <div className="yui3-u-1-2">
                                                <label htmlFor="startDate">
                                                    Date Start
                                                </label>
                                                <input
                                                    id="startDate"
                                                    type="date"
                                                    className="date"
                                                    name="startDate"
                                                />
                                            </div>
                                            <div className="yui3-u-1-2">
                                                <label htmlFor="endDate">
                                                    Date End
                                                </label>
                                                <input
                                                    id="endDate"
                                                    type="date"
                                                    className="date"
                                                    name="endDate"
                                                />
                                            </div>
                                        </div>

                                        <label htmlFor="dogs">
                                            Number of Dogs
                                        </label>
                                        <select id="dogs" name="dogs">
                                            <option value="0">0</option>
                                            <option value="1">1</option>
                                            <option value="2">2</option>
                                            <option value="3">3</option>
                                            <option value="4+">4+</option>
                                        </select>

                                        <label htmlFor="cats">
                                            Number of Cats or Other
                                        </label>
                                        <select id="cats" name="cats">
                                            <option value="0">0</option>
                                            <option value="1">1</option>
                                            <option value="2">2</option>
                                            <option value="3">3</option>
                                            <option value="4+">4+</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="yui3-u-1-2">
                                    <div className="grid-wrapper">
                                        <label htmlFor="address">Address</label>
                                        <textarea
                                            id="address"
                                            className="shorttext"
                                            name="address"
                                            autoComplete="street-address"
                                        ></textarea>

                                        <label htmlFor="referral">
                                            How did you hear about us?
                                        </label>
                                        <input
                                            id="referral"
                                            name="referral"
                                            className="text"
                                        />

                                        <label htmlFor="comments">
                                            Comments
                                        </label>
                                        <textarea
                                            id="comments"
                                            name="comments"
                                        ></textarea>
                                    </div>
                                </div>
                            </div>
                            {status === 'error' && (
                                <p className="form-error" role="alert">
                                    {error}
                                </p>
                            )}
                            <br />
                            <div className="center">
                                <input
                                    type="submit"
                                    className="button"
                                    value={
                                        status === 'sending'
                                            ? 'Sending…'
                                            : 'Send'
                                    }
                                    disabled={status === 'sending'}
                                />
                            </div>
                        </form>
                    )}
                </div>
            </div>
            <Footer></Footer>
        </div>
    );
};

export default Request;
