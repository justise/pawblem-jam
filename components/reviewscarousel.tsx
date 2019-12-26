import React from 'react';
import Slider from 'react-slick';

export default class SimpleSlider extends React.Component {
    render() {
        const settings = {
            autoplay: true,
            dots: false,
        };
        return (
            <Slider {...settings}>
                <div>
                    <a
                        target="_blank"
                        href="https://www.yelp.com/biz/pawblem-solved-redmond?hrid=6C7kRXpUvT527BKdXqGYHQ"
                    >
                        <img src="/images/reviews/yelp1.png" />
                    </a>
                </div>
                <div>
                    <a
                        target="_blank"
                        href="https://www.facebook.com/cami.p.baker/posts/10214303303924620:0"
                    >
                        <img src="/images/reviews/facebook1.png" />
                    </a>
                </div>
                <div>
                    <a
                        target="_blank"
                        href="https://www.yelp.com/biz/pawblem-solved-redmond?hrid=gYcFypNzyPDAuQEcTEncEA"
                    >
                        <img src="/images/reviews/yelp2.png" />
                    </a>
                </div>
                <div>
                    <a
                        target="_blank"
                        href="https://www.facebook.com/ellen.moyer.7/posts/1879023325458836:0"
                    >
                        <img src="/images/reviews/facebook2.png" />
                    </a>
                </div>
                <div>
                    <a
                        target="_blank"
                        href="https://www.yelp.com/biz/pawblem-solved-redmond?hrid=S3-wQKKkWIkHn5yWpTF7FA"
                    >
                        <img src="/images/reviews/yelp3.png" />
                    </a>
                </div>
            </Slider>
        );
    }
}

/*

        <div id="review-slides-mobile">
            <div>
                <a
                    target="_blank"
                    href="https://www.yelp.com/biz/pawblem-solved-redmond?hrid=6C7kRXpUvT527BKdXqGYHQ"
                >
                    <img src="/images/reviews/yelp1.png" />
                </a>
            </div>
            <div>
                <a
                    target="_blank"
                    href="https://www.facebook.com/cami.p.baker/posts/10214303303924620:0"
                >
                    <img src="/images/reviews/facebook1.png" />
                </a>
            </div>
            <div>
                <a
                    target="_blank"
                    href="https://www.yelp.com/biz/pawblem-solved-redmond?hrid=gYcFypNzyPDAuQEcTEncEA"
                >
                    <img src="/images/reviews/yelp2.png" />
                </a>
            </div>
            <div>
                <a
                    target="_blank"
                    href="https://www.facebook.com/ellen.moyer.7/posts/1879023325458836:0"
                >
                    <img src="/images/reviews/facebook2.png" />
                </a>
            </div>
            <div>
                <a
                    target="_blank"
                    href="https://www.yelp.com/biz/pawblem-solved-redmond?hrid=S3-wQKKkWIkHn5yWpTF7FA"
                >
                    <img src="/images/reviews/yelp3.png" />
                </a>
            </div>
        </div>
        */
