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
                            Due to COVID-19, we will remain closed until
                            further notice.
                        </p>
                        <p className="red">
                            Take care, stay safe &amp; please check back-in down
                            the road for an updated opening date.
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
