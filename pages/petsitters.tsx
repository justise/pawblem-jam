import Header from '../components/header';
import Footer from '../components/footer';
import '../styles/main.css';

const Petsitters = () => (
    <div id="container">
        <Header selectedTab="team"></Header>
        <div id="content">
            <div className="banner-wrapper">
                <div className="banner" id="banner-team"></div>
                <div className="banner-text">
                    <h1>The Pawblem Solvers</h1>
                </div>
            </div>
            <div className="statement">
                <h1>The best of the best.</h1>
            </div>
            <hr />
            <br />
            <div className="content-text">
                <div className="yui3-g-r">
                    <div className="yui3-u-1-3">
                        <div className="grid-wrapper">
                            <img
                                src="/images/tiles/human3.jpg"
                                title="Danielle Jaffy"
                            />
                        </div>
                    </div>
                    <div className="yui3-u-2-3">
                        <div className="grid-wrapper">
                            <div className="names">
                                <h2>Danielle Jaffy</h2>
                                <h4>
                                    Founder &amp; Full-Time Pet Nanny and Dog
                                    Walker
                                </h4>
                            </div>
                            <p>
                                My name is Danielle and I am the founder of
                                Pawblem Solved.
                            </p>
                            <p>
                            Animals are my passion; I have a bucket list full of animal-related activities, events & goals.
I grew up with dogs; Golden Retrievers, Old English Sheepdogs, Shibas, Shih Tzus, mixed breeds...
I love dogs of all temperaments, shapes and sizes!
We raised Casper, an Umbrella Cockatoo, who had the voice of an opera singer!
When I was 14, I began cleaning horse stalls in exchange for riding lessons.
I joined 4-H when I turned 15 and became highly involved with that.
To help put myself through college, I got a job at a veterinary hospital.
10 years ago, I adopted a ragdoll rescue kitty that I named Gracie, who quickly became my best friend.
Since losing Gracie, I adopted two more little furballs; Kona & Riley, who make me smile every day.
I raised a significant amount of money doing a charity run for Old Dog Haven.
My husband and I volunteered with the Seattle Pug Rescue for many years & I currently volunteer with SAFE (Save A Forgotten Equine) rescue. 
We also donate a portion of our income each year to animal shelters & sponsoring final refuge pets.

I truly believe in this quote:
"We can judge the heart of a man by his treatment of animals.
                            </p>
                            <h5>Service Area: Redmond</h5>
                        </div>
                    </div>
                </div>

                <hr />
                <br />

                <div className="yui3-g-r">
                    <div className="yui3-u-1-3">
                        <div className="grid-wrapper">
                            <img
                                src="/images/tiles/human4.jpg"
                                title="Kris Gray"
                            />
                        </div>
                    </div>
                    <div className="yui3-u-2-3">
                        <div className="grid-wrapper">
                            <div className="names">
                                <h2>Kris Gray</h2>
                                <h4>
                                    Head of IT &amp; Part-Time Pet Nanny and Dog
                                    Walker
                                </h4>
                            </div>
                            <p>
                                Kris's true love for animals began as a young
                                child, when his parents brought him home a
                                little Lhasa Apso he named Jester. Jester moved
                                to Kirkland from Alaska with him in April, 2000,
                                where they kept each other company during the
                                transition to a new city.
                            </p>
                            <p>
                                He currently volunteers with Danielle at events
                                for the Seattle Pug Rescue, and is a part-time
                                pet sitter and dog walker for Pawblem Solved.
                                Though he is a full-time computer programmer, he
                                truly enjoys his time working with the pets.
                                Jester sadly passed away a few years ago, so it
                                gives him the opportunity to still have animals
                                in his life. "There is nothing more rewarding
                                than happy, healthy pets!"
                            </p>
                        </div>
                    </div>
                </div>

                <hr />

        <Footer></Footer>
    </div>
);

export default Petsitters;
