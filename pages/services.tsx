import Link from 'next/link';
import Header from '../components/header';
import Footer from '../components/footer';
import '../styles/main.css';
import { Fragment } from 'react';

const Services = () => (
    <Fragment>
        <div id="container">
            <Header selectedTab="services"></Header>
            <div id="content">
                <div className="banner-wrapper">
                    <div className="banner" id="banner-services"></div>
                    <div className="banner-text">
                        <h1>Services</h1>
                    </div>
                </div>
                <div className="content-text">
                    <div className="statement">
                        <h1>
                            Offering the best in on-leash walks right in your
                            neighborhood, and loving in-home pet care.
                        </h1>
                    </div>
                    <hr />
                    <br />

                    <div className="yui3-g-r">
                        <div className="yui3-u-1-3">
                            <div className="grid-wrapper">
                                <img
                                    src="images/tiles/dog13.jpg"
                                    alt="Cute Dog Pose"
                                />
                            </div>
                        </div>
                        <div className="yui3-u-2-3">
                            <div className="grid-wrapper">
                                <h2>Monday Through Friday Mid-Day Dog Walks</h2>

                                <p>
                                    This service is for those pets that need a
                                    little TLC, fresh air and time to stretch
                                    their legs during the work week.
                                </p>
                                <p>
                                    Walks are typically 30 minutes in duration
                                    and can vary from 1 to 5 times per week
                                    depending upon the owners work schedule and
                                    the dogs needs.
                                </p>
                                <p>
                                    Free daily updates available via Paw Logs,
                                    text message, or email.
                                </p>

                                <h2>All Services Include</h2>
                                <ul>
                                    <li>
                                        Private and personalized dog walks for
                                        up to 3 dogs in the same household
                                    </li>
                                    <li>
                                        Your dog(s) will be walked on-leash
                                        around its own neighborhood to ensure
                                        its safety and comfort
                                    </li>
                                    <li>
                                        Reinforced training (if applicable){' '}
                                    </li>
                                    <li>Fresh water &amp; treats</li>
                                    <li>
                                        Food refill &amp; brushing (upon
                                        request)
                                    </li>
                                    <li>
                                        We provide poop bags and discard of all
                                        waste
                                    </li>
                                    <li>
                                        We have some fabulous photographers on
                                        the team that love taking pictures of
                                        your furry family!
                                    </li>
                                    <li>
                                        And of course, tons of love, attention
                                        and playtime!
                                    </li>
                                </ul>
                                <br />
                                <p>
                                    <em>
                                        Please Note: Pawblem Solved does not
                                        currently offer boarding, day care,
                                        overnight stays or group park visits.
                                    </em>
                                </p>
                            </div>
                        </div>
                    </div>
                    <hr />
                    <div className="yui3-g-r">
                        <div className="yui3-u-1-3">
                            <div className="grid-wrapper">
                                <img
                                    src="images/tiles/cat3.jpg"
                                    alt="Cute Cat Pose"
                                />
                            </div>
                        </div>
                        <div className="yui3-u-2-3">
                            <div className="grid-wrapper">
                                <h2>
                                    In-Home Pet Sitting for Cats and Other Small
                                    Animals
                                </h2>
                                <p>
                                    This is a great option for pet parents that
                                    prefer to keep their furry family in the
                                    comforts of their own home while on vacation
                                    or business.
                                </p>
                                <p>
                                    Visits are typically 30 minutes and can
                                    range from 1 to 3 times per day depending
                                    upon the needs of the owner and pet.
                                </p>
                                <p>
                                    We are happy to water plants, pickup mail,
                                    alternate house lights and collect
                                    newspapers at no additional charge.
                                </p>
                                <p>
                                    Free daily updates available via Paw Logs,
                                    text message, or email.
                                </p>

                                <h2>All Services Include</h2>
                                <ul>
                                    <li>
                                        Private and personalized in-home care
                                        for up to 5 cats in the same household
                                    </li>
                                    <li>Daily cleaning of the litter box(s)</li>
                                    <li>Fresh water &amp; treats</li>
                                    <li>Food refill</li>
                                    <li>Brushing (upon request)</li>
                                    <li>
                                        We have some fabulous photographers on
                                        the team that love taking pictures of
                                        your furry family!
                                    </li>
                                    <li>
                                        And of course, tons of love, attention
                                        and playtime!
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    <hr />

                    <div style={{ textAlign: 'center' }}>
                        <br />
                        <em>
                            Please inquire for sitting services regarding any
                            other pet or additional visiting times.
                        </em>
                    </div>
                </div>
            </div>
            <Footer></Footer>
        </div>
    </Fragment>
);

export default Services;
