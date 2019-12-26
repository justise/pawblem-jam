import Link from 'next/link';

/**
 * Allow the Loading attribute on iframe
 */
declare module 'react' {
    interface HTMLAttributes<T> extends AriaAttributes, DOMAttributes<T> {
        // extends React's HTMLAttributes
        loading?: string;
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
                            allowTransparency={true}
                            loading="lazy"
                        ></iframe>
                    </div>
                    <div className="yui3-u-1-3">
                        <h3>More Information</h3>
                        <ul className="bullet-list">
                            <li>
                                <Link href="/">
                                    <a>Home</a>
                                </Link>
                            </li>
                            <li>
                                <Link href="/services">
                                    <a>Services</a>
                                </Link>
                            </li>
                            <li>
                                <Link href="/rates">
                                    <a>Rates</a>
                                </Link>
                            </li>
                            <li>
                                <Link href="/forms">
                                    <a>Forms</a>
                                </Link>
                            </li>
                            <li>
                                <Link href="/petsitters">
                                    <a>Team</a>
                                </Link>
                            </li>
                            <li>
                                <Link href="/far">
                                    <a>FAQs</a>
                                </Link>
                            </li>
                        </ul>

                        <br />
                        <br />

                        <h3>Our Blog</h3>
                        <a href="https://gracieslittleworld.com/">
                            <img src="/images/blog.png" />
                        </a>
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

                        <br />
                        <br />
                        <a href="/request.php" className="request-button">
                            Ready to Request a Pet Nanny?
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
}
