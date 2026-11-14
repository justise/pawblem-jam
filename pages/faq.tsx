import Header from '../components/header';
import Footer from '../components/footer';
import { FaqBody } from '../components/pageBodies';
import faq from '../content/faq.json';

const Faq = () => (
    <div id="container">
        <Header selectedTab="faq"></Header>
        <div id="content">
            <FaqBody faq={faq} />
        </div>
        <Footer></Footer>
    </div>
);

export default Faq;
