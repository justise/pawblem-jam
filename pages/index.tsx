import Link from 'next/link';
import Header from '../components/header';
import Footer from '../components/footer';
import '../styles/main.css';
import ReviewsCarousel from '../components/reviewscarousel';
import { Fragment } from 'react';

const Index = () => (
    <Fragment>
        <div id="container">
            <Header selectedTab="home"></Header>
            <div id="content">
                <div className="banner-wrapper">
                    <div className="banner" id="banner-home"></div>
                    <div className="banner-text">
                        <h1>Dog Walkers &amp; Cat Sitters</h1>
                        <h2>Redmond &nbsp; North Kirkland</h2>
                    </div>
                    <div className="banner-footer">
                        <Link href="/request">
                            <a className="request-button">
                                Request a Pet Nanny
                            </a>
                        </Link>
                    </div>
                </div>

                <div className="content-text">
                    <section>
                        <br />
                        <ol className="yui3-g-r">
                            <li className="yui3-u-1-3">
                                <h3>
                                    Expertise 2018 Best Dog
                                    <br /> Walkers in Redmond
                                </h3>
                                <a href="https://www.expertise.com/wa/redmond/dog-walkers#provider1">
                                    <img
                                        src="/images/accolades/Expertise.png"
                                        className="accolade"
                                    />
                                    <br />
                                </a>
                            </li>
                            <li className="yui3-u-1-3">
                                <h3>
                                    Over 25,000 Pawblems
                                    <br /> Solved Since 2010
                                </h3>
                                <div className="large-icon walker"></div>
                            </li>
                            <li className="yui3-u-1-3">
                                <h3>
                                    Purrfect 5 Star Rating by <br />
                                    Our Furry Friends and Pet Parents
                                </h3>
                                <a href="https://www.yelp.com/biz/pawblem-solved-redmond">
                                    <img src="/images/accolades/yelp5star.png" />
                                </a>
                            </li>
                        </ol>
                    </section>

                    <hr />

                    <section>
                        <h2>
                            <b>Why Pawblem Solved</b> for your pets?
                        </h2>
                        <ol className="yui3-g-r">
                            <li className="yui3-u-1-3">
                                <img src="/images/icons/dog.png" />
                                <br />
                                <b>Responsible</b>
                                <h4>No Overloaded Schedules</h4>
                            </li>
                            <li className="yui3-u-1-3">
                                <img src="/images/icons/cat.png" />
                                <br />
                                <b>Trusted</b>
                                <h4>Licensed, Bonded, Insured</h4>
                            </li>
                            <li className="yui3-u-1-3">
                                <img src="/images/icons/bulldog.png" />
                                <br />
                                <b>Convienence</b>
                                <h4>
                                    In Home Care &amp; Private Walks
                                    <br /> in Your Neighboorhood
                                </h4>
                            </li>
                        </ol>
                        <ol className="yui3-g-r">
                            <li className="yui3-u-1-3">
                                <img src="/images/icons/cat2.png" />
                                <br />
                                <b>Dependable</b>
                                <h4>
                                    Same Walker &amp; Backup <br />
                                    Coverage for Every Visit.
                                </h4>
                            </li>
                            <li className="yui3-u-1-3">
                                <img src="/images/icons/dog2.png" />
                                <br />
                                <b>Confidence</b>
                                <h4>
                                    Free Meet &amp; Greets to Make Sure <br />
                                    it's a Great Fit for Pet &amp; Parent.
                                </h4>
                            </li>
                            <li className="yui3-u-1-3">
                                <img src="/images/icons/cat3.png" />
                                <br />
                                <b>Quality</b>
                                <h4>
                                    Founded in 2010 with
                                    <br /> Consistent 5-Star Reviews
                                </h4>
                            </li>
                        </ol>
                    </section>

                    <hr />

                    <section className="getting-started">
                        <h2>
                            <b>3 simple steps to get started</b> with Pawblem
                            Solved
                        </h2>
                        <div className="yui3-g-r">
                            <div className="yui3-u-1-3">
                                <div className="getting-started-card">
                                    <Link href="/request">
                                        <a>
                                            <img src="/images/sophie.jpg" />
                                            <footer>
                                                <h4>Request Service</h4>
                                                <p style={{ color: '#ddd' }}>
                                                    Tell Us About Your Needs
                                                </p>
                                            </footer>
                                        </a>
                                    </Link>
                                </div>
                            </div>

                            <div className="yui3-u-1-3">
                                <div className="getting-started-card">
                                    <Link href="/petsitters">
                                        <a>
                                            <img src="/images/consultation2.jpg" />
                                            <footer>
                                                <h4>Meet Your Nanny</h4>
                                                <p>
                                                    Book Your Free Consultation
                                                </p>
                                            </footer>
                                        </a>
                                    </Link>
                                </div>
                            </div>

                            <div className="yui3-u-1-3">
                                <div className="getting-started-card">
                                    <img src="/images/dancingdog.jpg" />
                                    <footer>
                                        <h4>Happy Pets</h4>
                                        <p>Begin Operation Tippy Taps</p>
                                    </footer>
                                </div>
                            </div>
                        </div>
                    </section>

                    <hr />

                    <section>
                        <h2>
                            Our customers <b>love us!</b>
                        </h2>
                        <ReviewsCarousel></ReviewsCarousel>
                        <div className="yui3-g-r">
                            <div className="yui3-u-1-2">
                                <div className="review-block">
                                    <a
                                        href="https://www.facebook.com/pg/pawblemsolved/reviews/"
                                        target="_blank"
                                    >
                                        <img src="/images/icons/facebook.png" />
                                    </a>
                                    <a
                                        href="https://www.facebook.com/pg/pawblemsolved/reviews/"
                                        target="_blank"
                                    >
                                        14{' '}
                                        <img src="/images/icons/facebook-paw.png" />
                                        <img src="/images/icons/facebook-paw.png" />
                                        <img src="/images/icons/facebook-paw.png" />
                                        <img src="/images/icons/facebook-paw.png" />
                                        <img src="/images/icons/facebook-paw.png" />{' '}
                                        Reviews on Facebook
                                    </a>
                                </div>
                            </div>
                            <div className="yui3-u-1-2">
                                <div className="review-block">
                                    <a
                                        href="https://www.yelp.com/biz/pawblem-solved-redmond"
                                        target="_blank"
                                    >
                                        <img src="/images/icons/yelp.png" />
                                    </a>
                                    <a
                                        href="https://www.yelp.com/biz/pawblem-solved-redmond"
                                        target="_blank"
                                    >
                                        18{' '}
                                        <img src="/images/icons/yelp-paw.png" />
                                        <img src="/images/icons/yelp-paw.png" />
                                        <img src="/images/icons/yelp-paw.png" />
                                        <img src="/images/icons/yelp-paw.png" />
                                        <img src="/images/icons/yelp-paw.png" />{' '}
                                        Reviews on Yelp
                                    </a>
                                </div>
                            </div>
                        </div>
                    </section>

                    <hr />
                    <section>
                        <h2>
                            Servicing <b>Redmond and North Kirkland</b>
                        </h2>
                        <a
                            href="https://drive.google.com/open?id=1wnVC8kB15O56IOYh7gMVej28eEeJFlrD&usp=sharing"
                            target="_blank"
                        >
                            <img
                                src="/images/map4.png"
                                id="map"
                                alt="Image of all the Areas of Redmond and North Kirkland that we service."
                            />
                        </a>
                    </section>
                </div>
            </div>
            <Footer></Footer>
        </div>
    </Fragment>
);

export default Index;
