import Header from '../components/header';
import Footer from '../components/footer';
import ReviewsCarousel from '../components/reviewscarousel';
import { HomeBody } from '../components/pageBodies';
import home from '../content/home.json';

const Index = () => (
    <div id="container">
        <Header selectedTab="home"></Header>
        <div id="content">
            <HomeBody home={home} reviews={<ReviewsCarousel />} />
        </div>
        <Footer></Footer>
    </div>
);

export default Index;
