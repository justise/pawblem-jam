import Header from '../components/header';
import Footer from '../components/footer';
import { RatesBody } from '../components/pageBodies';
import rates from '../content/rates.json';

const Rates = () => (
    <div id="container">
        <Header selectedTab="rates"></Header>
        <div id="content">
            <RatesBody rates={rates} />
        </div>
        <Footer></Footer>
    </div>
);

export default Rates;
