import Header from '../components/header';
import Footer from '../components/footer';
import { Markdown, imageUrl } from '../lib/content';
import services from '../content/services.json';

const Services = () => (
    <div id="container">
        <Header selectedTab="services"></Header>
        <div id="content">
            <div className="banner-wrapper">
                <div className="banner" id="banner-services"></div>
                <div className="banner-text">
                    <h1>{services.bannerTitle}</h1>
                </div>
            </div>
            <div className="content-text">
                <div className="statement">
                    <h1>{services.statement}</h1>
                </div>
                <hr />
                <br />

                <div className="yui3-g-r">
                    <div className="yui3-u-1-3">
                        <div className="grid-wrapper">
                            <img
                                src={imageUrl(services.image, 600)}
                                alt={services.imageAlt}
                            />
                        </div>
                    </div>
                    <div className="yui3-u-2-3">
                        <Markdown
                            className="grid-wrapper"
                            text={services.body}
                        />
                    </div>
                </div>

                <hr />

                <div style={{ textAlign: 'center' }}>
                    <br />
                    <Markdown text={services.footnote} />
                </div>
            </div>
        </div>
        <Footer></Footer>
    </div>
);

export default Services;
