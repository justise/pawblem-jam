import Link from 'next/link';
import Header from '../components/header';
import Footer from '../components/footer';
import '../styles/main.css';

const Rates = () => (
    <div id="container">
        <Header selectedTab="rates"></Header>
        <div id="content">
            <div className="banner-wrapper">
                <div className="banner" id="banner-rates"></div>
                <div className="banner-text">
                    <h1>Rates</h1>
                </div>
            </div>
            <div className="content-text">
                <div className="statement">
                    <h1>
                        100% of our time and attention devoted to your pets
                        during every visit.
                    </h1>
                </div>
                <hr />
                <br />

                <div className="yui3-g-r">
                    <div className="yui3-u-1-2">
                        <div className="grid-wrapper">
                            <h2>Dog Walking</h2>
                            <img src="/images/tiles/dog15.jpg" />
                            <p>
                                <ul>
                                    <li>$33 per 30 minute walk</li>
                                    <li>$5 for each additional dog</li>
                                </ul>
                            </p>
                        </div>
                    </div>
                    <div className="yui3-u-1-2">
                        <div className="grid-wrapper">
                            <h2>Cat Sitting</h2>
                            <img src="/images/tiles/cat14.jpg" />
                            <p>
                                <ul>
                                    <li>$33 per 30 minute visit for 2 cats</li>
                                    <li>$5 for each additional cat</li>
                                </ul>
                            </p>
                        </div>
                    </div>
                </div>

                <hr />

                <div className="yui3-g-r">
                    <div className="yui3-u-1-3">
                        <div className="grid-wrapper">
                            <img src="/images/tiles/cat13.jpg" />
                        </div>
                    </div>
                    <div className="yui3-u-2-3">
                        <div className="grid-wrapper">
                            <h2>Consultations</h2>
                            <p>
                                Free: We offer a free in-home consultation, to
                                make sure it's a good fit. This also gives us a
                                chance to meet your pets in their own
                                environment, and view where everything is
                                located; (i.e. leashes, food & water dishes,
                                toys, brushes, etc.).
                            </p>
                            <em>
                                Additional Consultations are $10.00 if required;
                                (i.e. you have moved to a new location,
                                situation has changed, additional services are
                                requested, etc.).
                            </em>
                        </div>
                    </div>
                </div>

                <hr />

                <div className="yui3-g-r">
                    <div className="yui3-u-1-3">
                        <div className="grid-wrapper">
                            <img src="/images/tiles/dog23.jpg" />
                        </div>
                    </div>
                    <div className="yui3-u-2-3">
                        <div className="grid-wrapper">
                            <h2>Key Pick-up and Drop-off Information:</h2>
                            <ul>
                                <li>
                                    Two (2) keys are requested at the time of
                                    the consultation.
                                </li>
                                <li>
                                    If you choose to leave the keys with us,
                                    they are kept in a safe and secure area.
                                    There is no charge for this service.
                                </li>
                                <li>
                                    If you would prefer we pick the keys up and
                                    drop them off, the following charges apply:
                                </li>
                                <li className="sub">
                                    <ul>
                                        <li>$10.00 Key pick-up</li>
                                        <li>$10.00 Key drop-off</li>
                                    </ul>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>

                <hr />

                <div className="yui3-g-r">
                    <div className="yui3-u-1-3">
                        <div className="grid-wrapper">
                            <img src="/images/tiles/cat15.jpg" />
                        </div>
                    </div>
                    <div className="yui3-u-2-3">
                        <div className="grid-wrapper">
                            <h2>Holiday Surcharge</h2>
                            <p>
                                Additional $10 per visit, for each of the
                                following holidays.
                            </p>
                            <p>
                                <ul>
                                    <li>New Years Day, </li>
                                    <li>Presidents Day,</li>
                                    <li>Easter Sunday,</li>
                                    <li>Memorial Day,</li>
                                    <li>4th of July,</li>
                                    <li>Labor Day,</li>
                                    <li>Veterans Day,</li>
                                    <li>Thanksgiving Day,</li>
                                    <li>Christmas Eve,</li>
                                    <li>Christmas Day,</li>
                                    <li>New Years Eve</li>
                                </ul>
                            </p>
                        </div>
                    </div>
                </div>
                <hr />
                <p>
                    <div className="center">
                        Less than 24 hour notice will result in a charge equal
                        to 50% of the reserved service amount. See more on our{' '}
                        <Link href="/faq#cancellationpolicy">
                            <a>FAQ page.</a>
                        </Link>
                    </div>
                </p>
            </div>
        </div>
        <Footer></Footer>
    </div>
);

export default Rates;
