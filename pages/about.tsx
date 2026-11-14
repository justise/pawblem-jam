import { Fragment } from 'react';
import Header from '../components/header';
import Footer from '../components/footer';
import { Markdown, imageUrl } from '../lib/content';
import about from '../content/about.json';

const About = () => (
    <div id="container">
        <Header selectedTab="about"></Header>
        <div id="content">
            <div className="banner-wrapper">
                <div className="banner" id="banner-team"></div>
                <div className="banner-text">
                    <h1>{about.bannerTitle}</h1>
                </div>
            </div>
            <div className="statement">
                <h1>{about.statement}</h1>
            </div>
            <hr />
            <br />
            <div className="content-text">
                {about.people.map((person, i) => (
                    <Fragment key={i}>
                        {i > 0 && (
                            <>
                                <hr />
                                <br />
                            </>
                        )}
                        <div className="yui3-g-r">
                            <div className="yui3-u-1-3">
                                <div className="grid-wrapper">
                                    <img
                                        src={imageUrl(person.photo, 600)}
                                        title={person.name}
                                    />
                                </div>
                            </div>
                            <div className="yui3-u-2-3">
                                <div className="grid-wrapper">
                                    <div className="names">
                                        <h2>{person.name}</h2>
                                        <h4>{person.role}</h4>
                                    </div>
                                    <Markdown text={person.bio} />
                                </div>
                            </div>
                        </div>
                    </Fragment>
                ))}
            </div>
        </div>
        <Footer></Footer>
    </div>
);

export default About;
