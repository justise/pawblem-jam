import Header from '../components/header';
import Footer from '../components/footer';
import { AboutBody } from '../components/pageBodies';
import about from '../content/about.json';

const About = () => (
    <div id="container">
        <Header selectedTab="about"></Header>
        <div id="content">
            <AboutBody about={about} />
        </div>
        <Footer></Footer>
    </div>
);

export default About;
