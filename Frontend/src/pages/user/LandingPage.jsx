
import React, { useState, useEffect } from 'react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMobileAlt, faHeadset, faHome, faSyncAlt, faCheckCircle,faTrophy} from '@fortawesome/free-solid-svg-icons';

function LandingPage() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isHeaderVisible, setIsHeaderVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  // Slide content: images and text
  const slides = [
    {
      image: '/RE10.jpg',
      text: 'Explore the Best Properties Across Kerala',
    },
    {
      image: '/RE9.jpg',
      text: 'A Home for Every Dream – Where Your Family’s Future Begins!',
    },
    {
      image: '/RE5.avif',
      text: 'Find Your Dream Home Today!',
    },
  ];


 // Property listings
 const properties = [
  { id: 1, name: 'Property 1', price: '₹ 50 Lakh', location: 'Kerala', image: 'https://via.placeholder.com/400x300?text=Property+1' },
  { id: 2, name: 'Property 2', price: '₹ 60 Lakh', location: 'Kerala', image: 'https://via.placeholder.com/400x300?text=Property+2' },
  { id: 3, name: 'Property 3', price: '₹ 70 Lakh', location: 'Kerala', image: 'https://via.placeholder.com/400x300?text=Property+3' },
  { id: 4, name: 'Property 4', price: '₹ 80 Lakh', location: 'Kerala', image: 'https://via.placeholder.com/400x300?text=Property+4' },
  { id: 5, name: 'Property 5', price: '₹ 90 Lakh', location: 'Kerala', image: 'https://via.placeholder.com/400x300?text=Property+5' },
  { id: 6, name: 'Property 6', price: '₹ 1 Crore', location: 'Kerala', image: 'https://via.placeholder.com/400x300?text=Property+6' },
];




  // Slide navigation
  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % slides.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);

   // Auto slide effect
   useEffect(() => {
    const slideInterval = setInterval(() => {
      nextSlide();
    }, 5000); // Change slide every 5 seconds

    return () => clearInterval(slideInterval); // Clean up on unmount
  }, []);



  // Handle scroll event
  const handleScroll = () => {
    const currentScrollY = window.scrollY;

    if (currentScrollY > lastScrollY && currentScrollY > 50) {
      setIsHeaderVisible(false); // Hide header on scroll down
    } else {
      setIsHeaderVisible(true); // Show header on scroll up
    }

    setLastScrollY(currentScrollY);
  };

  useEffect(() => {
    // Add event listener for scroll
    window.addEventListener('scroll', handleScroll);

    return () => {
      // Clean up the event listener on unmount
      window.removeEventListener('scroll', handleScroll);
    };
  }, [lastScrollY]);

  return (
    <div className="bg-gray-50 min-h-screen flex flex-col">
      {/* Conditionally render the header based on isHeaderVisible */}
      {isHeaderVisible && <Header />}

      {/* Slideshow */}
      <section className="relative h-screen overflow-hidden">
        {slides.map((slide, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              currentSlide === index ? 'opacity-100' : 'opacity-0'
            }`}
            style={{
              backgroundImage: `url(${slide.image})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              height: '100%',
            }}
          >

   <div className="absolute inset-0 bg-black opacity-20"></div>

            <div className="flex items-center justify-center h-full relative z-10">
              <h2 className="text-4xl text-white font-bold shadow-md">{slide.text}</h2>
            </div>
          </div>
        ))}

        {/* Navigation Buttons */}
        <button
          className="absolute top-1/2 left-4 transform -translate-y-1/2 text-white text-2xl bg-black bg-opacity-50 p-2 rounded-full"
          onClick={prevSlide}
        >
          &#10094;
        </button>
        <button
          className="absolute top-1/2 right-4 transform -translate-y-1/2 text-white text-2xl bg-black bg-opacity-50 p-2 rounded-full"
          onClick={nextSlide}
        >
          &#10095;
        </button>
      </section>

      {/* Search Bar */}
      <section className="flex justify-center py-8">
        <input
          type="text"
          className="w-2/3 px-4 py-2 border border-gray-300 rounded-lg"
          placeholder="Search for properties, districts..."
        />
        <button className="bg-blue-500 text-white px-4 py-2 rounded-lg ml-2">
          Search
        </button>
      </section>

      {/* Property Listings */}
      {/* <section className="max-w-6xl mx-auto py-8">
        <h3 className="text-2xl font-bold text-gray-800 mb-4 text-center">Featured Properties</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((property) => (
            <div key={property} className="border rounded-lg overflow-hidden shadow-lg">
              <img src={`https://via.placeholder.com/400x300?text=Property+${property}`} alt={`Property ${property}`} />
              <div className="p-4">
                <h4 className="text-lg font-bold">Property {property}</h4>
                <p className="text-gray-600">Location: Kerala</p>
                <p className="text-gray-600">Price: ₹ 50 Lakh</p>
              </div>
            </div>
          ))}
        </div>
      </section> */}


 {/* Property Sliding Show */}
 <section className="max-w-6xl mx-auto py-8 relative overflow-hidden">
        <h3 className="text-2xl font-bold text-gray-800 mb-4 text-center">Featured Properties</h3>
        <div className="flex transition-transform duration-500" style={{ transform: `translateX(-${currentSlide * 100}%)` }}>
          {properties.map((property) => (
            <div key={property.id} className="flex-shrink-0 w-full md:w-1/3 lg:w-1/4 p-4">
              <div className="border rounded-lg overflow-hidden shadow-lg">
                <img src={property.image} alt={property.name} className="w-full h-48 object-cover" />
                <div className="p-4">
                  <h4 className="text-lg font-bold">{property.name}</h4>
                  <p className="text-gray-600">Location: {property.location}</p>
                  <p className="text-gray-600">Price: {property.price}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
  

                {/* Navigation Buttons for Property Slides */}
                <button className="absolute top-1/2 left-0 transform -translate-y-1/2 text-white text-2xl bg-black bg-opacity-50 p-2 rounded-full" onClick={prevSlide}>
          &#10094;
        </button>
        <button className="absolute top-1/2 right-0 transform -translate-y-1/2 text-white text-2xl bg-black bg-opacity-50 p-2 rounded-full" onClick={nextSlide}>
          &#10095;
        </button>
      </section>




      {/* Banner */}
      <section className="bg-[#f5d0fe] py-12 text-center text-white">
        <h2 className="text-3xl font-bold">Special Offers on Premium Properties!</h2>
        <p className="mt-4">Get discounts and special offers on premium listings. Limited time only!</p>
        <a href="/properties" className="mt-6 inline-block bg-white text-blue-500 px-6 py-3 rounded-lg shadow-md hover:bg-gray-100">
          Explore Offers
        </a>
      </section>


      

      {/* Key Elements */}
      <section className="bg-[#075985] py-12">
  <h3 className="text-2xl font-bold text-white mb-4 text-center">OUR KEY ELEMENTS</h3>
  <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
    {/* Easy Access */}
    <div className="bg-white p-6 rounded-lg shadow-md transform transition duration-300 hover:bg-blue-100 hover:scale-105 hover:shadow-lg">
      <FontAwesomeIcon icon={faMobileAlt} className="text-blue-500 text-3xl mb-4" />
      <h4 className="text-lg font-bold text-blue-500 mb-2">Easy Access</h4>
      <p className="text-gray-600">Our platform is accessible anytime, anywhere, and on any device for your convenience.</p>
    </div>

    {/* Client Support */}
    <div className="bg-white p-6 rounded-lg shadow-md transform transition duration-300 hover:bg-blue-100 hover:scale-105 hover:shadow-lg">
      <FontAwesomeIcon icon={faHeadset} className="text-blue-500 text-3xl mb-4" />
      <h4 className="text-lg font-bold text-blue-500 mb-2">Client Support</h4>
      <p className="text-gray-600">Our dedicated support team is available 24/7 to assist you with any inquiries or issues.</p>
    </div>

    {/* Property Management */}
    <div className="bg-white p-6 rounded-lg shadow-md transform transition duration-300 hover:bg-blue-100 hover:scale-105 hover:shadow-lg">
      <FontAwesomeIcon icon={faHome} className="text-blue-500 text-3xl mb-4" />
      <h4 className="text-lg font-bold text-blue-500 mb-2">Property Management</h4>
      <p className="text-gray-600">Easily manage your property listings, inquiries, and visits with our comprehensive tools.</p>
    </div>

    {/* Regular Updates */}
    <div className="bg-white p-6 rounded-lg shadow-md transform transition duration-300 hover:bg-blue-100 hover:scale-105 hover:shadow-lg">
      <FontAwesomeIcon icon={faSyncAlt} className="text-blue-500 text-3xl mb-4" />
      <h4 className="text-lg font-bold text-blue-500 mb-2">Regular Updates</h4>
      <p className="text-gray-600">Stay updated with the latest property listings and market trends, curated regularly for you.</p>
    </div>

    {/* Quality Assurance */}
    <div className="bg-white p-6 rounded-lg shadow-md transform transition duration-300 hover:bg-blue-100 hover:scale-105 hover:shadow-lg">
      <FontAwesomeIcon icon={faCheckCircle} className="text-blue-500 text-3xl mb-4" />
      <h4 className="text-lg font-bold text-blue-500 mb-2">Quality Assurance</h4>
      <p className="text-gray-600">We ensure that all listed properties meet high-quality standards for your peace of mind.</p>
    </div>

 {/* Consistency in Services */}
 <div className="bg-white p-6 rounded-lg shadow-md transform transition duration-300 hover:bg-blue-100 hover:scale-105 hover:shadow-lg">
      <FontAwesomeIcon
        icon={faTrophy}  // Use an icon that signifies consistency, such as a trophy
        className="text-blue-500 text-3xl mb-4 transition duration-300 transform hover:text-white hover:text-4xl"
      />
      <h4 className="text-lg font-bold text-blue-500 mb-2">Consistency in Services</h4>
      <p className="text-gray-600">We maintain a high level of service consistency, ensuring that your experience is seamless every time.</p>
    </div>


  </div>
</section>



{/* Explore by District */}
<section className="max-w-6xl mx-auto py-8">
        <h3 className="text-2xl font-bold text-gray-800 mb-4 text-center">Explore by District</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {['Ernakulam', 'Kollam', 'Trivandrum', 'Thrissur', 'Kottayam'].map((district) => (
            <div
              key={district}
              className="p-4 border border-gray-300 rounded-lg text-center bg-white hover:bg-gray-100 cursor-pointer"
            >
              {district}
            </div>
          ))}
        </div>
      </section>


    <Footer/>
    </div>
  );
}

export default LandingPage;

