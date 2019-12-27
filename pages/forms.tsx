import Link from 'next/link';
import Header from '../components/header';
import Footer from '../components/footer';
import '../styles/main.css';

const Forms = () => (
    <div id="container">
        <Header selectedTab="forms"></Header>
        <div id="content">
            <div className="banner-wrapper">
                <div className="banner" id="banner-forms"></div>
                <div className="banner-text">
                    <h1>Information Forms</h1>
                </div>
            </div>
            <div className="content-text">
                <div className="statement">
                    <h1>Caring, Reliable and Trustworthy Service</h1>
                </div>
                <hr />

                <div className="yui3-g-r">
                    <div className="yui3-u-1-3">
                        <div className="grid-wrapper">
                            <h2>Form for Humans</h2>
                            <a
                                href="downloads/Pawblem Solved Client Forms.pdf"
                                target="_blank"
                            >
                                <img
                                    src="images/tiles/human14.jpg"
                                    alt="Danielle With Dog in Redmond"
                                />
                            </a>
                            <p>
                                Basic contact and address form, emergency
                                veterinary information, and requested services.
                            </p>
                            <p>
                                <a
                                    href="downloads/Pawblem Solved Client Forms.pdf"
                                    target="_blank"
                                    title="Download PDF"
                                >
                                    New Client Form &gt;
                                </a>
                            </p>
                        </div>
                    </div>
                    <div className="yui3-u-1-3">
                        <div className="grid-wrapper">
                            <h2>Form for Cats</h2>
                            <a
                                href="downloads/Cat Information Sheet.pdf"
                                target="_blank"
                            >
                                <img
                                    src="images/tiles/cat7.jpg"
                                    alt="Cute Cat in Kirkland"
                                />
                            </a>
                            <p>
                                Cats cannot be bothered to fill out any forms,
                                so you'll probably have to do it for them.
                            </p>
                            <br />
                            <p>
                                <a
                                    href="downloads/Cat Information Sheet.pdf"
                                    target="_blank"
                                    title="Download PDF"
                                >
                                    Cat Information Sheet &gt;
                                </a>
                            </p>
                        </div>
                    </div>
                    <div className="yui3-u-1-3">
                        <div className="grid-wrapper">
                            <h2>Form for Dogs</h2>
                            <a
                                href="downloads/Dog Information Sheet.pdf"
                                target="_blank"
                            >
                                <img
                                    src="images/tiles/dog22.jpg"
                                    alt="Dog at Attention in Redmond"
                                />
                            </a>
                            <p>
                                Dogs I'm sure would love to complete these
                                forms, but don't have thumbs to hold a pen.
                                Thank you for helping them.
                            </p>
                            <p>
                                <a
                                    href="downloads/Dog Information Sheet.pdf"
                                    target="_blank"
                                    title="Download PDF"
                                >
                                    Dog Information Sheet &gt;
                                </a>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <Footer></Footer>
    </div>
);

export default Forms;
