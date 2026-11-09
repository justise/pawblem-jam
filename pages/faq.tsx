import { Fragment } from 'react';
import Header from '../components/header';
import Footer from '../components/footer';
import { Markdown, imageUrl, slugify } from '../lib/content';
import faq from '../content/faq.json';

const Faq = () => (
    <div id="container">
        <Header selectedTab="faq"></Header>
        <div id="content">
            <div className="banner-wrapper">
                <div className="banner" id="banner-faq"></div>
                <div className="banner-text">
                    <h1>{faq.bannerTitle}</h1>
                </div>
            </div>
            <br />
            <br />

            <div className="content-text">
                <div className="yui3-g-r">
                    <div className="yui3-u-2-3">
                        <div className="summary">
                            <h2>{faq.summaryTitle}</h2>
                            <Markdown text={faq.summary} />
                        </div>
                    </div>
                    <div className="yui3-u-1-3">
                        <div className="summary">
                            <h2>&nbsp;</h2>
                            <img
                                src={imageUrl(faq.summaryImage, 600)}
                                alt="Cat Sitting in Redmond"
                            />
                        </div>
                    </div>
                </div>
                <hr />
                <div className="yui3-g-r">
                    <div className="yui3-u-3-4">
                        <div className="grid-wrapper">
                            <h2>{faq.questionsTitle}</h2>
                            <div className="paragraph">
                                <ul>
                                    {faq.questions.map((q) => (
                                        <li key={q.question}>
                                            <a href={`#${slugify(q.question)}`}>
                                                {q.question}
                                            </a>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <br />

                            {faq.questions.map((q) => (
                                <Fragment key={q.question}>
                                    <h2 id={slugify(q.question)}>
                                        {q.question}
                                    </h2>
                                    <Markdown text={q.answer} />
                                </Fragment>
                            ))}
                        </div>
                    </div>
                    <div className="yui3-u-1-4">
                        <div className="grid-wrapper">
                            {faq.sideImages.map((src, i) => (
                                <Fragment key={i}>
                                    {i > 0 && (
                                        <>
                                            <br />
                                            <br />
                                            <br />
                                            <br />
                                        </>
                                    )}
                                    <img src={imageUrl(src, 400)} />
                                </Fragment>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <Footer></Footer>
    </div>
);

export default Faq;
