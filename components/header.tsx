import Link from 'next/link';
import Navigation from './navigation';
import Head from 'next/head';
import PropTypes, { InferProps } from 'prop-types';

export default function Header({
    selectedTab,
}: InferProps<typeof Navigation.propTypes>) {
    return (
        <header>
            <Head>
                <title>Pawblem Solved: Dog Walkers and Pet Sitters</title>
                <link
                    href="https://fonts.googleapis.com/css?family=Roboto:100,300,500,700"
                    rel="stylesheet"
                    type="text/css"
                />
                <link
                    rel="stylesheet"
                    href="https://maxcdn.bootstrapcdn.com/font-awesome/4.5.0/css/font-awesome.min.css"
                />
                <link
                    rel="stylesheet"
                    type="text/css"
                    href="https://cdn.jsdelivr.net/npm/slick-carousel@1.8.1/slick/slick.css"
                />
                <link
                    rel="stylesheet"
                    type="text/css"
                    href="//cdn.jsdelivr.net/gh/kenwheeler/slick@1.8.1/slick/slick-theme.css"
                />
                <link rel="icon" type="img/ico" href="/images/favicon.ico" />
                <meta
                    name="google-site-verification"
                    content="Usmu6yAcz6VKluDFlY8muuovktEPRq8P1Htfh9dbLrs"
                />
                <meta
                    name="keywords"
                    content="Kirkland Pet Setting, Kirkland Cat Sitting, Kirkland Dog Sitting, Kirkland Dog Walking, Kirkland Pet Walking, Redmond Pet Setting, Redmond Cat Sitting, Redmond Dog Sitting, Redmond Dog Walking, Redmond Pet Walking, Pet Care, Dogs, Cats, House Sitting, Danielle Jaffy, Washington, Redmond, North Kirkland, Kirkland, Juanita, Moss Bay, Seattle, 98052, 98053, 98073, 98033, 98034, 98083, 98004, 98005, 98006, 98007, 98008, 98009, 98015"
                />
                <meta
                    name="viewport"
                    content="width=device-width, initial-scale=1"
                />
                <link rel="prefetch" href="/images/banners/cat2.jpg" />
                <link rel="prefetch" href="/images/banners/cat3.jpg" />
                <link rel="prefetch" href="/images/banners/dog25.jpg" />
                <link rel="prefetch" href="/images/banners/dog2.jpg" />
                <link rel="prefetch" href="/images/banners/dog13.jpg" />
                <link rel="prefetch" href="/images/banners/dog5.jpg" />
                <link rel="prefetch" href="/images/banners/cat5.jpg" />
                <link rel="prefetch" href="/images/banners/dog10.jpg" />
                <link rel="prefetch" href="/images/banners/dog24.jpg" />

                <meta property="fb:app_id" content="1710284432544466" />
                <meta property="og:type" content="business.business" />
                <meta
                    property="og:site_name"
                    content="Pawblem Solved Pet Sitting and Dog Walking"
                />
                <meta property="og:locale" content="en_US" />
                <meta
                    property="og:image"
                    content="http://www.pawblemsolveed.com//images/site-logo.jpg"
                />

                <meta
                    property="business:contact_data:street_address"
                    content="17220 NE 137th CT"
                />
                <meta
                    property="business:contact_data:locality"
                    content="Redmond"
                />
                <meta property="business:contact_data:region" content="WA" />
                <meta
                    property="business:contact_data:postal_code"
                    content="98052"
                />
                <meta
                    property="business:contact_data:country_name"
                    content="USA"
                />
                <meta
                    property="business:contact_data:email"
                    content="info@pawblemsolved.com"
                />
                <meta
                    property="business:contact_data:phone_number"
                    content="425-445-7247"
                />
                <meta
                    property="business:contact_data:website"
                    content="https://www.pawblemsolved.com/"
                />
                <meta property="place:location:latitude" content="47.723269" />
                <meta
                    property="place:location:longitude"
                    content="-122.109560"
                />
                <meta property="fb:admins" content="1663352948" />

                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:site" content="@PawblemSolved" />
                <meta name="twitter:creator" content="@PawblemSolved" />
                <meta
                    name="twitter:image:src"
                    content="https://www.pawblemsolved.com//images/site-logo.jpg"
                />
                <link
                    rel="stylesheet"
                    type="text/css"
                    href="https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.6.0/slick.min.css"
                />
                <link
                    rel="stylesheet"
                    type="text/css"
                    href="https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.6.0/slick-theme.min.css"
                />
                <script src="/scripts/google-analytics.js"></script>
                <meta
                    name="Description"
                    content="Premier Pet Sitting and Dog Walking in the Redmond and North Kirkland areas. Specializing in in-home pet care for your cats and mid-day Mon-Fri dog walks."
                />
                <meta
                    property="og:title"
                    content="Pawblem Solved: Dog Walkers and Pet Sitters"
                />
                <meta
                    name="twitter:title"
                    content="Pawblem Solved: Dog Walkers and Pet Sitters"
                />
                <meta
                    property="og:description"
                    content="Premier Pet Sitting and Dog Walking in the Redmond and North Kirkland areas. Specializing in in-home pet care for your cats and mid-day Mon-Fri dog walks."
                />
                <meta
                    name="twitter:description"
                    content="Premier Pet Sitting and Dog Walking in the Redmond and North Kirkland areas. Specializing in in-home pet care for your cats and mid-day Mon-Fri dog walks."
                />
                <meta
                    property="og:url"
                    content="https://www.pawblemsolved.com/"
                />
            </Head>
            <div className="header-container">
                <Link href="/index">
                    <a className="header-logo">
                        <h1>
                            <span>
                                Pawblem
                                <img
                                    src="/images/paw-icon.png"
                                    className="paw-icon"
                                    style={{ padding: '3px' }}
                                />
                                Solved
                            </span>
                        </h1>
                        <h2>
                            <span>Pet Sitting Service</span>
                        </h2>
                    </a>
                </Link>
            </div>
            <Navigation selectedTab={selectedTab}></Navigation>
            <ul className="social">
                <li className="yelp">
                    <a
                        href="http://www.yelp.com/biz/pawblem-solved-redmond"
                        target="_blank"
                        title="People love us on Yelp!"
                    >
                        <i className="fa fa-yelp"></i>
                    </a>
                </li>
                <li className="blog">
                    <a
                        href="http://www.gracieslittleworld.com"
                        target="_blank"
                        title="Visit my Blog"
                    >
                        <i className="fa fa-rss"></i>
                    </a>
                </li>
                <li className="twitter">
                    <a
                        href="http://twitter.com/pawblemsolved"
                        target="_blank"
                        title="Keep up to date with Twitter"
                    >
                        <i className="fa fa-twitter"></i>
                    </a>
                </li>
                <li className="facebook">
                    <a
                        href="https://www.facebook.com/pawblemsolved"
                        target="_blank"
                        title="See our Facebook Page"
                    >
                        <i className="fa fa-facebook"></i>
                    </a>
                </li>
            </ul>
        </header>
    );
}

Header.propTypes = {
    selectedTab: PropTypes.string.isRequired,
};
