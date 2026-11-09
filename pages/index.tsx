import Link from 'next/link';
import Header from '../components/header';
import Footer from '../components/footer';
import ReviewsCarousel from '../components/reviewscarousel';
import { InlineMarkdown, Lines, imageUrl } from '../lib/content';
import home from '../content/home.json';

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

const Index = () => (
    <>
        <div id="container">
            <Header selectedTab="home"></Header>
            <div id="content">
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
                            {home.accolades.map((a, i) => (
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
                        {rowsOf3(home.features).map((row, r) => (
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
                            {home.steps.map((s, i) => {
                                const card = (
                                    <>
                                        <img src={imageUrl(s.image, 800)} />
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
                        <ReviewsCarousel></ReviewsCarousel>
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
                                id="map"
                                alt="Image of all the Areas of Redmond and North Kirkland that we service."
                            />
                        </a>
                    </section>
                </div>
            </div>
            <Footer></Footer>
        </div>
    </>
);

export default Index;
