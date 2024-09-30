import Header from '../components/header';
import Footer from '../components/footer';

const Request = () => (
    <div id="container">
        <Header selectedTab="request"></Header>
        <div id="content">
            <div className="banner-wrapper">
                <div className="banner" id="banner-request"></div>
                <div className="banner-text">
                    <h1>Request Service</h1>
                </div>
            </div>

            <div className="content-text">
                <div id="emailconfirmation" className="statement">
                    <h1>
                        <strong>Thank you so much for your request!</strong>
                        <br />
                        We will get back to you shortly on the next steps for
                        caring for your pet(s)!
                    </h1>
                    <br />
                    <br />
                </div>

                <div className="statement">
                    <h1>
                        Pawblem Solved offers mid-day dog walks while you're at
                        work and cat visits in Redmond.
                    </h1>
                </div>

                <div>
                    <br />
                    <p>
                        Thank you so much for your interest in Pawblem Solved!
                    </p>
                    <p>Please check below for our current availability -</p>
                    <p>
                        <h3>Dog Walks</h3>
                    </p>
                    <p>
                        Location: All Service Areas
                        <br />
                        Walk Time-Frame: 10am - 1pm
                        <br />
                        Days: Monday, Tuesday, Wednesday, Thursday, Friday; 1-5
                        walks per week
                        <br />
                    </p>

                    <p>Thanks again!</p>
                    <p>We look forward to meeting some new furry friends!</p>
                    <p>The Pawblem Solved Team</p>
                </div>

                <form action="emailform.php" method="POST">
                    <div className="yui3-g-r">
                        <div className="yui3-u-1-2">
                            <div className="grid-wrapper">
                                <label>Human Name</label>
                                <input
                                    type="text"
                                    className="text required"
                                    name="client_name"
                                />

                                <label>Email</label>
                                <input
                                    type="text"
                                    className="text"
                                    name="client_email"
                                />

                                <label>Phone</label>
                                <input
                                    type="text"
                                    className="text"
                                    name="phone"
                                />

                                <div className="yui3-g-r">
                                    <div className="yui3-u-1-2">
                                        <label>Date Start</label>
                                        <input
                                            type="text"
                                            className="date"
                                            name="startdate"
                                        />
                                    </div>
                                    <div className="yui3-u-1-2">
                                        <label>Date End</label>
                                        <input
                                            type="text"
                                            className="date"
                                            name="enddate"
                                        />
                                    </div>
                                </div>

                                <label>Number of Dogs</label>

                                <select name="dogcount">
                                    <option value="0">0</option>
                                    <option value="1">1</option>
                                    <option value="2">2</option>
                                    <option value="3">3</option>
                                    <option value="4+">4+</option>
                                </select>

                                <label>Number of Cats or Other</label>
                                <select name="catcount">
                                    <option value="0">0</option>
                                    <option value="1">1</option>
                                    <option value="2">2</option>
                                    <option value="3">3</option>
                                    <option value="4+">4+</option>
                                </select>
                            </div>
                        </div>
                        <div className="yui3-u-1-2">
                            <div className="grid-wrapper">
                                <label>Address</label>
                                <textarea
                                    className="shorttext"
                                    name="address"
                                ></textarea>

                                <label>How did you hear about us?</label>
                                <input
                                    name="whorefer"
                                    name="whorefer"
                                    className="text"
                                />

                                <label>Comments</label>
                                <textarea name="comments"></textarea>
                            </div>
                        </div>
                    </div>
                    <br />
                    <center>
                        <input type="submit" className="button" value="Send" />
                    </center>
                </form>
            </div>
        </div>
        <Footer></Footer>
    </div>
);

export default Request;
