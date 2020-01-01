import Header from '../components/header';
import Footer from '../components/footer';
import '../styles/main.css';

const Faq = () => (
    <div id="container">
        <Header selectedTab="faq"></Header>
        <div id="content">
            
        <div className="banner-wrapper">
                <div className="banner" id="banner-faq">
                </div>
                <div className="banner-text">
                    <h1>Frequently Asked Questions</h1>
                </div>
            </div>
            <br/><br/>

            <div className="content-text">
                <div className="yui3-g-r">                  
                    <div className="yui3-u-2-3">
                        <div className="summary">

                            <h2>Pawblem Solved</h2>
                            <p>
                                <h3>Serving:</h3>
                                Redmond <i style={{display: 'none'}}>(English Hill, Education Hill, Trilogy, Redmond Ridge, Downtown)</i><br/>
                                Kirkland <i style={{display: 'none'}}>(Juanita, Moss Bay, Rose Hill, Totem Lake, Downtown)</i><br/>
                            </p>
                            <p>
                                <h3>Contact:</h3>
                                (425) 445-7247<br/>
                                <a href="mailto:info@pawblemsolved.com">info@pawblemsolved.com</a>
                            </p>

                            <p>
                                Office Hours: Monday - Friday, 9-6 <br/>
                                Working Hours: Monday - Sunday, 9-6 
                             </p>
                             <p>
                                <h3>Please Note:</h3>
                                Due to the nature of our work, we aren't always able to answer the phone, so please leave a message. If you call on a Friday, we will return your call the following business day. 
                                <br/><br/>Email is preferred for inquiries.
                            </p> 
       
                        </div>
                    </div>
                    <div className="yui3-u-1-3">
                        <div className="summary">
                            <h2>&nbsp;</h2>
                            <img src="images/tiles/cat18.jpg" alt="Cat Sitting in Redmond"/>
                            
                        </div>
                    </div>  
                </div>
                <hr/>
                <div className="yui3-g-r">
                    <div className="yui3-u-3-4">
                        <div className="grid-wrapper">
                            <h2>Frequently Asked Questions</h2>
                            <p>
                               <ul>
                                    <li><a href="#mission">What is your mission?</a></li>
                                    <li><a href="#professional">Why should I hire a professional pet sitter?</a></li>
                                    <li><a href="#bonded">Is Pawblem Solved Licensed, Bonded and Insured?</a></li>
                                    <li><a href="#time">How much time do you spend at each visit with my pet?</a></li>
                                    <li><a href="#group">Will my dog be walked individually or in a group?</a></li>
                                    <li><a href="#who">Who will be walking my dog or taking care of my pets?</a></li>
                                    <li><a href="#aggressive">If my pet has been / is aggressive, can I still use your service?</a></li>
                                    <li><a href="#weather">Do you walk in any weather, all year long?</a></li>
                                    <li><a href="#keys">When do I give you my keys?  How do I get them back from you?</a></li>
                                    <li><a href="#twokeys">Why do you need two (2) keys?</a></li>
                                    <li><a href="#payment">What type of payment do you accept?</a></li>
                                    <li><a href="#servicehours">What are your service hours?</a></li>
                                   <li><a href="#cancellationpolicy">What is your cancellation policy?</a></li>
                                   <li><a href="#servicearea">What areas do you service?</a></li>
                                </ul>
                            </p>
                            <br/>
                        
                            <h2 id="mission">What is your mission?</h2>
                            <p>Our pet nannies are here to solve your pawblems and provide peace of mind for pet parent and pet.</p>
                        
                            <h2 id="professional">Why should I hire a professional pet sitter?</h2>
                            <p>Professional pet sitters are just what the description implies - professional. While having friends, family, or neighbors care for your pets may seem like a logical choice, you will most likely run into a few areas of concern, including; trust - will they show up? What if they don't have experience working with animals? What happens if there's an emergency? Most professional pet sitters are licensed, bonded and insured. This ensures everyone's protection, including; the owners, the pets, and the sitters, and means you can trust us to act responsibly when we enter your home. Professional pet sitters care for pets for a living and take their jobs very seriously.</p>

                            <h2 id="bonded">Is Pawblem Solved Licensed, Bonded and Insured?</h2>
                            <p>Not only is Pawblem Solved Licensed, Bonded and Insured through the <a href="http://napps.petsitterinsurance.com/" target="_blank">Business Insurers of the Carolina</a>, but we are also a member of the <a href="http://www.petsitters.org/" target="_blank">National Association of Professional Pet Sitters</a>. This organization provides continuing education opportunities, and on-going updated resources to help better serve our clients and our four-legged friends. </p>

                            <h2 id="time">How much time do you spend at each visit with my pet?</h2>
                            <p>The standard visiting time is 30 minutes. We believe this gives your pet just the right amount of time to provide meals, exercise, play-time, human interaction, attention and lots of snuggles. As long as we have the availability, we are definitely open to spending more time with your pet; however, there will be an additional charge. Please note; 30 minutes is the minimum time we offer. </p>
                        
                            <h2 id="group">Will my dog be walked individually or in a group?</h2>
                            <p>We will walk up to three dogs in the same household. Some dogs do not behave well with others, so to ensure the safety of your dog(s) and our sitters, we only provide individual, private walks. </p>

                            <h2 id="who">Who will be walking my dog or taking care of my pets?</h2>
                            <p>All of our dog walkers and sitters go through history and criminal background checks. They are also given an in-depth, thorough training process to provide you, and your pets, the best care possible. They are all covered under Pawblem Solved's bond and insurance.</p>

                            <p>You will always meet the owner of Pawblem Solved and your dog walker or sitter prior to starting the service during your free consultation.</p>

                            <p>We do our absolute best to have one specific walker/sitter care for your pets. Occasionally, due to scheduling conflicts, illnesses or emergencies with your assigned sitter, your dog/pets may be walked, or cared for, by another walker/sitter. If this occurs, your dog walker/sitter will know your pet's health issues, habits, and important contact information. </p>

                            <h2 id="aggressive">If my pet has been / is aggressive, can I still use your service? </h2>
                            <p>We take the safety of your pets and our sitters very seriously. If our sitter feels uncomfortable about a particular situation, we reserve the right to discontinue or pass on the service.</p>


                            <h2 id="weather">Do you walk in any weather, all year long? </h2>
                            <p>We walk in rain, sleet, snow, hail, sunshine, holidays, weekends, mornings and evenings! We do ask that you leave a key with a neighbor and provide your walker/sitter with their contact information in case of extreme weather conditions. </p>

                            <h2 id="keys">When do I give you my keys?  How do I get them back from you? </h2>
                            <p>We ask that you provide two (2) sets of keys during the initial consultation. We will return keys once at no charge. For future pet sitting assignments a fee of $10 per trip will apply if you would like us to continue to pick-up and drop-off your keys. Clients who choose to keep a key on file with us enjoy the speed and convenience of booking their next reservation.</p>

                            <h2 id="twokeys">Why do you need two (2) keys?</h2>
                            <p>
                            1 key will be given to the primary dog walker/sitter.<br/>
                            1 key will be kept at the office with management to ensure your pet(s) will continue to be taken care of in case there is a scheduling conflict, illness or emergency with your assigned walker/sitter.</p>

                            <h2 id="payment">What type of payment do you accept? </h2>
                            <p>We accept cash and check. </p>

                            <h2 id="servicehours">What are your service hours?</h2>
                            <p>Pets are generally visited between the hours of 9:00am to 6:00pm and visits are divided into morning, midday and evening time periods. The actual time your pet is visited depends on a variety of logistical situations such as location, traffic, construction and proximity to other pet sitting clients.  We will try to get as close to a time that you request but cannot guarantee it.</p>

                            <h2 id="cancellationpolicy">What is your cancellation policy?</h2>
                            <p>Your visits are very important to the Pawblem Solved team and are reserved especially for you and your pets. We understand that sometimes schedule adjustments are necessary; therefore, we respectfully request at least 24 hours notice for cancellations.</p>
                            <p>Please understand that when you cancel your visit without giving enough notice, we miss the opportunity to fill that time.</p>
                            <p>Less than 24 hour notice will result in a charge equal to 50% of the reserved service amount.</p>

                            <h2 id="servicearea">What areas do you service?</h2>
                            <p>We cover all areas of Redmond and North Kirkland.</p>
                        </div>
                    </div>
                    <div className="yui3-u-1-4">
                        <div className="grid-wrapper">
                            <img src="images/tiles/cat12.jpg"/>
                            <br/><br/><br/><br/>
                            <img src="images/tiles/cat10.jpg"/>
                            <br/><br/><br/><br/>
                            <img src="images/tiles/dog7.jpg"/>
                            <br/><br/><br/>
                            <img src="images/tiles/cat8.jpg"/>
                            <br/><br/><br/>
                            <img src="images/tiles/dog14.jpg"/>
                            <br/><br/><br/>
                            <img src="images/tiles/cat11.jpg"/>
                            <br/><br/><br/>
                            <img src="images/tiles/dog19.jpg"/>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <Footer></Footer>
    </div>
);

export default Faq;
