/**
 * The editable part of each page (everything between the header and footer),
 * rendered from its content/*.json data. Used by the real pages and by the
 * live preview in the site editor (pages/edit-preview.tsx), so the preview
 * always matches the site.
 */
import { Fragment, type ReactNode } from 'react';
import Link from 'next/link';
import { InlineMarkdown, Lines, Markdown, imageUrl, slugify } from '../lib/content';
import type home from '../content/home.json';
import type services from '../content/services.json';
import type rates from '../content/rates.json';
import type about from '../content/about.json';
import type faq from '../content/faq.json';

export type HomeContent = typeof home;
export type ServicesContent = typeof services;
export type RatesContent = typeof rates;
export type AboutContent = typeof about;
export type FaqContent = typeof faq;

/** Rows of three, matching the original grid. */
function rowsOf3<T>(items: T[]): T[][] {
    const rows: T[][] = [];
    for (let i = 0; i < items.length; i += 3) rows.push(items.slice(i, i + 3));
    return rows;
}

function Paws({ src, count }: { src: string; count: number }) {
    return (
        <>
            {Array.from({ length: count }, (_, i) => (
                <img key={i} src={src} title="Paw icon" />
            ))}
        </>
    );
}

function ReviewBlock({
    href,
    title,
    icon,
    paw,
    count,
    site,
}: {
    href: string;
    title: string;
    icon: string;
    paw: string;
    count: number;
    site: string;
}) {
    return (
        <div className="review-block">
            <a rel="noopener" title={title} href={href} target="_blank">
                <img src={icon} title={`${site} icon`} />
            </a>
            <a rel="noopener" title={title} href={href} target="_blank">
                {count} <Paws src={paw} count={5} /> Reviews on {site}
            </a>
        </div>
    );
}

export function HomeBody({
    home,
    reviews,
}: {
    home: HomeContent;
    /** The reviews carousel (not editable, so the preview shows a stand-in). */
    reviews: ReactNode;
}) {
    return (
        <>
            <div className="banner-wrapper">
                <div className="banner" id="banner-home"></div>
                <div className="banner-text">
                    <h1>{home.hero.title}</h1>
                    <h2 style={{ whiteSpace: 'pre-wrap' }}>
                        {home.hero.subtitle}
                    </h2>
                </div>
                <div className="banner-footer">
                    <Link href="/request" className="request-button">
                        {home.hero.buttonText}
                    </Link>
                </div>
            </div>

            <div className="content-text">
                <section>
                    <br />
                    <ol className="yui3-g-r">
                        {(home.accolades || []).map((a, i) => (
                            <li className="yui3-u-1-3" key={i}>
                                <h3>
                                    <Lines text={a.title} />
                                </h3>
                                {a.image ? (
                                    <a href={a.link || undefined}>
                                        <img
                                            src={imageUrl(a.image, 400)}
                                            className="accolade"
                                        />
                                    </a>
                                ) : (
                                    <div className="large-icon walker"></div>
                                )}
                            </li>
                        ))}
                    </ol>
                </section>

                <hr />

                <section>
                    <h2>
                        <InlineMarkdown text={home.whyHeading} />
                    </h2>
                    {rowsOf3(home.features || []).map((row, r) => (
                        <ol className="yui3-g-r" key={r}>
                            {row.map((f, i) => (
                                <li className="yui3-u-1-3" key={i}>
                                    <img src={f.icon} />
                                    <br />
                                    <b>{f.title}</b>
                                    <h4>
                                        <Lines text={f.text} />
                                    </h4>
                                </li>
                            ))}
                        </ol>
                    ))}
                </section>

                <hr />

                <section className="getting-started">
                    <h2>
                        <InlineMarkdown text={home.stepsHeading} />
                    </h2>
                    <div className="yui3-g-r">
                        {(home.steps || []).map((s, i) => {
                            const card = (
                                <>
                                    <img src={imageUrl(s.image, 800)} loading="lazy" decoding="async" />
                                    <footer>
                                        <h4>{s.title}</h4>
                                        <p>{s.text}</p>
                                    </footer>
                                </>
                            );
                            return (
                                <div className="yui3-u-1-3" key={i}>
                                    <div className="getting-started-card">
                                        {s.link ? (
                                            <Link href={s.link}>{card}</Link>
                                        ) : (
                                            card
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </section>

                <hr />

                <section>
                    <h2>
                        <InlineMarkdown text={home.reviewsHeading} />
                    </h2>
                    {reviews}
                    <div className="yui3-g-r">
                        <div className="yui3-u-1-2">
                            <ReviewBlock
                                href="https://www.facebook.com/pg/pawblemsolved/reviews/"
                                title="Facebook reviews"
                                icon="/images/icons/facebook.png"
                                paw="/images/icons/facebook-paw.png"
                                count={home.facebookReviewCount}
                                site="Facebook"
                            />
                        </div>
                        <div className="yui3-u-1-2">
                            <ReviewBlock
                                href="https://www.yelp.com/biz/pawblem-solved-redmond"
                                title="Yelp Reviews"
                                icon="/images/icons/yelp.png"
                                paw="/images/icons/yelp-paw.png"
                                count={home.yelpReviewCount}
                                site="Yelp"
                            />
                        </div>
                    </div>
                </section>

                <hr />
                <section>
                    <h2>
                        <InlineMarkdown text={home.mapHeading} />
                    </h2>
                    <a href={home.mapLink} target="_blank">
                        <img
                            src={imageUrl(home.mapImage, 1200)}
                            loading="lazy"
                            decoding="async"
                            id="map"
                            alt="Image of all the Areas of Redmond and North Kirkland that we service."
                        />
                    </a>
                </section>
            </div>
        </>
    );
}

type PhotoSection = {
    show?: boolean;
    image: string;
    imageAlt: string;
    body: string;
};

/** Photo on the left, text on the right, one row per section that's switched on. */
function PhotoSections({ sections }: { sections?: PhotoSection[] }) {
    return (
        <>
            {(sections || [])
                .filter((s) => s.show !== false)
                .map((s, i) => (
                    <Fragment key={i}>
                        {i > 0 && (
                            <>
                                <hr />
                                <br />
                            </>
                        )}
                        <div className="yui3-g-r">
                            <div className="yui3-u-1-3">
                                <div className="grid-wrapper">
                                    <img
                                        src={imageUrl(s.image, 600)}
                                        loading="lazy"
                                        decoding="async"
                                        alt={s.imageAlt}
                                    />
                                </div>
                            </div>
                            <div className="yui3-u-2-3">
                                <Markdown
                                    className="grid-wrapper"
                                    text={s.body}
                                />
                            </div>
                        </div>
                    </Fragment>
                ))}
        </>
    );
}

export function ServicesBody({ services }: { services: ServicesContent }) {
    return (
        <>
            <div className="banner-wrapper">
                <div className="banner" id="banner-services"></div>
                <div className="banner-text">
                    <h1>{services.bannerTitle}</h1>
                </div>
            </div>
            <div className="content-text">
                <div className="statement">
                    <h1>{services.statement}</h1>
                </div>
                <hr />
                <br />

                <PhotoSections sections={services.sections} />

                <hr />

                <div style={{ textAlign: 'center' }}>
                    <br />
                    <Markdown text={services.footnote} />
                </div>
            </div>
        </>
    );
}

export function RatesBody({ rates }: { rates: RatesContent }) {
    return (
        <>
            <div className="banner-wrapper">
                <div className="banner" id="banner-rates"></div>
                <div className="banner-text">
                    <h1>{rates.bannerTitle}</h1>
                </div>
            </div>
            <div className="content-text">
                <div className="statement">
                    <h1>{rates.statement}</h1>
                </div>
                <hr />
                <br />

                <PhotoSections sections={rates.sections} />

                <hr />
                <Markdown className="center" text={rates.footnote} />
            </div>
        </>
    );
}

export function AboutBody({ about }: { about: AboutContent }) {
    return (
        <>
            <div className="banner-wrapper">
                <div className="banner" id="banner-team"></div>
                <div className="banner-text">
                    <h1>{about.bannerTitle}</h1>
                </div>
            </div>
            <div className="statement">
                <h1>{about.statement}</h1>
            </div>
            <hr />
            <br />
            <div className="content-text">
                {(about.people || []).map((person, i) => (
                    <Fragment key={i}>
                        {i > 0 && (
                            <>
                                <hr />
                                <br />
                            </>
                        )}
                        <div className="yui3-g-r">
                            <div className="yui3-u-1-3">
                                <div className="grid-wrapper">
                                    <img
                                        src={imageUrl(person.photo, 600)}
                                        loading="lazy"
                                        decoding="async"
                                        title={person.name}
                                    />
                                </div>
                            </div>
                            <div className="yui3-u-2-3">
                                <div className="grid-wrapper">
                                    <div className="names">
                                        <h2>{person.name}</h2>
                                        <h4>{person.role}</h4>
                                    </div>
                                    <Markdown text={person.bio} />
                                </div>
                            </div>
                        </div>
                    </Fragment>
                ))}
            </div>
        </>
    );
}

export function FaqBody({ faq }: { faq: FaqContent }) {
    const questions = faq.questions || [];
    return (
        <>
            <div className="banner-wrapper">
                <div className="banner" id="banner-faq"></div>
                <div className="banner-text">
                    <h1>{faq.bannerTitle}</h1>
                </div>
            </div>
            <br />
            <br />

            <div className="content-text">
                <div className="yui3-g-r">
                    <div className="yui3-u-2-3">
                        <div className="summary">
                            <h2>{faq.summaryTitle}</h2>
                            <Markdown text={faq.summary} />
                        </div>
                    </div>
                    <div className="yui3-u-1-3">
                        <div className="summary">
                            <h2>&nbsp;</h2>
                            <img
                                src={imageUrl(faq.summaryImage, 600)}
                                loading="lazy"
                                decoding="async"
                                alt="Cat Sitting in Redmond"
                            />
                        </div>
                    </div>
                </div>
                <hr />
                <div className="yui3-g-r">
                    <div className="yui3-u-3-4">
                        <div className="grid-wrapper">
                            <h2>{faq.questionsTitle}</h2>
                            <div className="paragraph">
                                <ul>
                                    {questions.map((q, i) => (
                                        <li key={i}>
                                            <a href={`#${slugify(q.question || '')}`}>
                                                {q.question}
                                            </a>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <br />

                            {questions.map((q, i) => (
                                <Fragment key={i}>
                                    <h2 id={slugify(q.question || '')}>
                                        {q.question}
                                    </h2>
                                    <Markdown text={q.answer} />
                                </Fragment>
                            ))}
                        </div>
                    </div>
                    <div className="yui3-u-1-4">
                        <div className="grid-wrapper">
                            {(faq.sideImages || []).map((src, i) => (
                                <Fragment key={i}>
                                    {i > 0 && (
                                        <>
                                            <br />
                                            <br />
                                            <br />
                                            <br />
                                        </>
                                    )}
                                    <img src={imageUrl(src, 400)} loading="lazy" decoding="async" />
                                </Fragment>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
