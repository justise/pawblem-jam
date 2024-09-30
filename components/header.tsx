import Link from 'next/link';
import Navigation from './navigation';
import Head from 'next/head';
import PropTypes, { InferProps } from 'prop-types';

export default function Header({
    selectedTab,
}: InferProps<typeof Navigation.propTypes>) {
    return (
        <header>
            <div className="header-container">
                <Link href="/" className="header-logo">
                    <h1>
                        <span>
                            Pawblem
                            <img
                                title="Paw Icon"
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
                </Link>
            </div>
            <Navigation selectedTab={selectedTab}></Navigation>
            <ul className="social">
                <li className="yelp">
                    <a
                        rel="noopener"
                        href="http://www.yelp.com/biz/pawblem-solved-redmond"
                        target="_blank"
                        title="People love us on Yelp!"
                    >
                        <i className="fa fa-yelp"></i>
                    </a>
                </li>
                <li className="facebook">
                    <a
                        rel="noopener"
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
