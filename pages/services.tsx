import Header from '../components/header';
import Footer from '../components/footer';
import { ServicesBody } from '../components/pageBodies';
import services from '../content/services.json';

const Services = () => (
    <div id="container">
        <Header selectedTab="services"></Header>
        <div id="content">
            <ServicesBody services={services} />
        </div>
        <Footer></Footer>
    </div>
);

export default Services;
