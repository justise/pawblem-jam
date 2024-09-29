import Link from 'next/link';

/**
 * Allow the Loading attribute on iframe
 */
declare module 'react' {
    interface HTMLAttributes<T> extends AriaAttributes, DOMAttributes<T> {
        // extends React's HTMLAttributes
        loading?: string;
        allowtransparency?: string;
    }
}

export default function Footer() {
    return (
        <footer>
            <div className="footer-content">
                <div className="yui3-g-r">
                    <div className="yui3-u-1-3">
                        <iframe
                            src="https://www.facebook.com/plugins/page.php?href=https%3A%2F%2Fwww.facebook.com%2Fpawblemsolved%2F&tabs=timeline&width=300&height=400&small_header=true&adapt_container_width=true&hide_cover=true&show_facepile=false&appId=1710284432544466"
                            width="300"
                            height="400"
                            style={{ border: 'none', overflow: 'hidden' }}
                            scrolling="no"
                            allowtransparency="true"
                            loading="lazy"
                        ></iframe>
                    </div>
                    <div className="yui3-u-1-3">
                        <h3>More Information</h3>
                        <ul className="bullet-list">
                            <li>
                                <Link href="/">Home</Link>
                            </li>
                            <li>
                                <Link href="/services">Services</Link>
                            </li>
                            <li>
                                <Link href="/rates">Rates</Link>
                            </li>
                            <li>
                                <Link href="/forms">Forms</Link>
                            </li>
                            <li>
                                <Link href="/petsitters">Team</Link>
                            </li>
                            <li>
                                <Link href="/faq">FAQs</Link>
                            </li>
                        </ul>
                    </div>
                    <div className="yui3-u-1-3">
                        <h3>Contact</h3>
                        <ul className="icon-list">
                            <li className="dog">425-445-7247</li>
                            <li className="cat">
                                <a href="mailto:info@pawblemsolved.com">
                                    info@pawblemsolved.com
                                </a>
                            </li>
                        </ul>

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

                        <br />
                        <br />
                        <Link href="/request" className="request-button">
                            Ready to Request a Pet Nanny?
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
