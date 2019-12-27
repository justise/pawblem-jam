import Header from '../components/header';
import Footer from '../components/footer';
import '../styles/main.css';

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
                        <strong>Thank you so much for your email!</strong>
                        <br />
                        We will get back to you shortly on the next steps for
                        caring for your pet(s)!
                    </h1>
                    <br />
                    <br />
                </div>

                <div className="busy-message">
                    <div className="center">
                        <br />
                        <br />
                        <br />
                        <br />
                        <p className="red">
                            Thank you so much for your interest in Pawblem
                            Solved!
                        </p>
                        <p className="red">
                            At this time, we are not able to accept new clients,
                            but please do check back in the future.
                        </p>
                        <p className="red">
                            For current clients, you can email your inquiries
                            to:
                        </p>
                        <p>
                            <a href="mailto:info@pawblemsolved.com">
                                info@pawblemsolved.com
                            </a>
                        </p>
                        <p>Thank you - The Pawblem Solved Team</p>
                        <br />
                        <br />
                    </div>
                </div>
            </div>
        </div>
        <Footer></Footer>
    </div>
);

export default Request;
