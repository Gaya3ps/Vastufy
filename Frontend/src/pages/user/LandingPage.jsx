import React, { useState, useEffect } from 'react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight, faMobileAlt, faHeadset, faHome, faSyncAlt, faCheckCircle, faTrophy } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import {FaPhoneAlt} from "react-icons/fa";
import { motion } from "framer-motion";

function LandingPage() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isHeaderVisible, setIsHeaderVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [verifiedProperties, setVerifiedProperties] = useState([]);
  const propertiesPerPage = 3; // Number of properties to show per slide
  const navigate = useNavigate();
  // Slide content: images and text
  const slides = [
    { image: '/RE10.jpg', text: 'Explore the Best Properties Across Kerala' },
    { image: '/RE9.jpg', text: 'A Home for Every Dream – Where Your Family’s Future Begins!' },
    { image: '/RE5.avif', text: 'Find Your Dream Home Today!' },
  ];

  // Fetch verified properties on component mount
  useEffect(() => {
    const fetchVerifiedProperties = async () => {
      try {
        const response = await axios.get('http://vastufy.site/api/users/properties');
        const verifiedProps = response.data.properties;
        setVerifiedProperties(verifiedProps);
      } catch (error) {
        console.error('Error fetching properties:', error);
      }
    };

    fetchVerifiedProperties();
  }, []);

  // Auto slide effect (slower speed)
  useEffect(() => {
    const slideInterval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % Math.ceil(verifiedProperties.length / propertiesPerPage));
    }, 8000); // Slower auto-slide (8 seconds)

    return () => clearInterval(slideInterval); // Clean up on unmount
  }, [verifiedProperties]);

  // Handle scroll event
  const handleScroll = () => {
    const currentScrollY = window.scrollY;
    setIsHeaderVisible(currentScrollY < lastScrollY || currentScrollY <= 50);
    setLastScrollY(currentScrollY);
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  // Calculate the total number of slides
  const totalSlides = Math.ceil(verifiedProperties.length / propertiesPerPage);

  // Handle manual navigation
  const handlePrev = () => {
    setCurrentSlide((prev) => (prev === 0 ? totalSlides - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentSlide((prev) => (prev + 1) % totalSlides);
  };

  const handleClick = (propertyId) => {
    navigate(`/propertydetails/${propertyId}`);
  }

  return (
    <div className="bg-gray-50 min-h-screen flex flex-col">
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
      </section>

      {/* Search Bar */}
      {/* <section className="flex justify-center py-8">
        <input
          type="text"
          className="w-2/3 px-4 py-2 border border-gray-300 rounded-lg"
          placeholder="Search for properties, districts..."
        />
        <button className="bg-blue-500 text-white px-4 py-2 rounded-lg ml-2">Search</button>
      </section> */}

      {/* Property Sliding Show */}
      <section className="max-w-6xl mx-auto py-12 px-4 relative overflow-hidden bg-gray-50">
        <h3 className="text-3xl font-bold text-blue-800 mb-8 text-center">Featured Properties</h3>

        {/* Slider container with arrows */}
        <div className="relative">
          {/* Left Arrow */}
          <button
            className="absolute left-2 top-1/2 transform -translate-y-1/2 z-10 bg-blue-300 text-white p-2 rounded-full shadow-lg hover:bg-blue-700 focus:outline-none"
            style={{ zIndex: 20 }}
            onClick={handlePrev}
          >
            <FontAwesomeIcon icon={faChevronLeft} />
          </button>

          {/* Slider content */}
          <div className="overflow-hidden relative">
            <div
              className="flex transition-transform duration-500"
              style={{
                transform: `translateX(-${currentSlide * (100 / totalSlides)}%)`,
                width: `${totalSlides * 100}%`,
              }}
            >
              {Array.from({ length: totalSlides }).map((_, slideIndex) => (
                <div
                  key={slideIndex}
                  className="flex-shrink-0 w-full flex justify-around"
                  style={{ width: `${100 / totalSlides}%` }}
                >
                  {verifiedProperties
                    .slice(slideIndex * propertiesPerPage, slideIndex * propertiesPerPage + propertiesPerPage)
                    .map((property) => (
                      <div
                        key={property._id}
                        className="w-1/3 p-4 hover:scale-105 transform transition duration-300 ease-in-out"
                      >
                        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition duration-300 ease-in-out">
                          <img
                            src={property.mediaUrls[0]}
                            alt={property.title}
                            className="w-full h-56 object-cover transition-transform duration-300 transform hover:scale-110"
                          />
                          <div className="p-5">
                            <h4 className="text-xl font-semibold text-blue-700">{property.title}</h4>
                            <p className="text-gray-500 text-sm mt-1">
                              {property.city}, {property.district}
                            </p>
                            <p className="text-lg font-semibold text-blue-600 mt-2">
                              ₹ {property.expectedPrice.toLocaleString()}
                            </p>
                            <button 
                             onClick={() => handleClick(property._id)}
                            className="mt-4 w-full py-2 text-center text-white font-semibold bg-blue-600 hover:bg-blue-700 transition duration-200 ease-in-out rounded-md">
                              View Details
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              ))}
            </div>
          </div>

          {/* Right Arrow */}
          <button
            className="absolute right-2 top-1/2 transform -translate-y-1/2 z-10 bg-blue-300 text-white p-2 rounded-full shadow-lg hover:bg-blue-700 focus:outline-none"
            style={{ zIndex: 20 }}
            onClick={handleNext}
          >
            <FontAwesomeIcon icon={faChevronRight} />
          </button>
        </div>

        {/* Dots */}
        <div className="flex justify-center mt-4">
          {Array.from({ length: totalSlides }).map((_, index) => (
            <div
              key={index}
              className={`w-3 h-3 rounded-full mx-2 ${
                index === currentSlide ? 'bg-blue-600' : 'bg-gray-300'
              }`}
            ></div>
          ))}
        </div>
      </section>

      {/* Banner */}
      <section
  className="relative flex items-center justify-center h-[400px] mx-12 rounded-lg overflow-hidden  my-12"
  style={{
    backgroundImage: `url('/banner2.jpg')`,
    backgroundSize: 'contain',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
  }}
>
  <div className="relative z-10 text-center text-white px-8">
    <a
      href="/properties"
      className="mt-8 inline-block bg-white text-blue-600 px-8 py-3 text-lg font-semibold rounded-lg shadow-md hover:bg-gray-100 transition-transform transform hover:scale-105"
    >
      Explore Offers
    </a>
  </div>
</section>

{/* Key Elements */}
<section className="bg-[#075985] py-12 mt-12">
  <h3 className="text-2xl font-bold text-white mb-4 text-center">OUR KEY ELEMENTS</h3>
  <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
    {[
      { icon: faMobileAlt, title: 'Easy Access', text: 'Our platform is accessible anytime, anywhere, and on any device for your convenience.' },
      { icon: faHeadset, title: 'Client Support', text: 'Our dedicated support team is available 24/7 to assist you with any inquiries or issues.' },
      { icon: faHome, title: 'Property Management', text: 'Easily manage your property listings, inquiries, and visits with our comprehensive tools.' },
      { icon: faSyncAlt, title: 'Regular Updates', text: 'Stay updated with the latest property listings and market trends, curated regularly for you.' },
      { icon: faCheckCircle, title: 'Quality Assurance', text: 'We ensure that all listed properties meet high-quality standards for your peace of mind.' },
      { icon: faTrophy, title: 'Consistency in Services', text: 'We maintain a high level of service consistency, ensuring that your experience is seamless every time.' },
    ].map((element, index) => (
      <div 
        key={index} 
        className="bg-white p-6 rounded-lg shadow-lg transform transition duration-300 hover:shadow-xl hover:scale-105"
        style={{ backgroundColor: index % 2 === 0 ? '#f0f7ff' : '#ffffff' }}
      >
        <div 
          className="bg-blue-100 p-4 rounded-full inline-flex items-center justify-center mb-4 shadow-md"
          style={{ backgroundColor: index % 2 === 0 ? '#e2e8f0' : '#cfe3fc' }}
        >
          <FontAwesomeIcon icon={element.icon} className="text-blue-500 text-3xl" />
        </div>
        <h4 className="text-lg font-bold text-blue-600 mb-2">{element.title}</h4>
        <p className="text-gray-600">{element.text}</p>
      </div>
    ))}
  </div>
</section>

     {/* Contact Us Section */}
     <section className="py-16 bg-gray-100 text-gray-800">
        <div className="flex justify-between items-center max-w-7xl mx-auto px-6 lg:px-16">
          {/* Left Section - Text Content */}
          <div className="w-full lg:w-1/2">
            <motion.h2
              className="text-4xl text-left font-semibold text-blue-800"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.5, ease: "easeOut" }}
            >
              For more information about our services,{" "}
              <span className="text-teal-500">get in touch</span> with our expert
              consultants
            </motion.h2>
            <p className="mt-4 text-lg text-left max-w-2xl mx-auto">
              Our friendly team is on hand to provide advice, guidance, and
              support throughout every step of your journey in finding and buying
              a new house.
            </p>
          </div>

          {/* Right Section - Contact Details */}
          <div className="w-full lg:w-1/2 mt-8 lg:mt-0 ml-auto flex justify-end">
            <div className="flex flex-col items-start space-y-6">
              <div className="flex items-center space-x-4">
                <div className="text-4xl text-teal-500">
                  <FaPhoneAlt />
                </div>
                <div className="text-lg text-gray-800 font-semibold">
                  <p>Call for help now!</p>
                  <p className="text-2xl text-blue-800">+91 9000 3700 44</p>
                </div>
              </div>

              <div>
                <a
                  href="mailto:info@vastufy.com"
                  className="inline-block bg-yellow-400 text-blue-800 px-8 py-3 rounded-full font-semibold text-lg hover:bg-blue-800 hover:text-white transition-all ml-5"
                >
                  Contact us
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>


      <Footer />
    </div>
  );
}

export default LandingPage;
