import React, { useState, useEffect } from "react";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { FaHome, FaUsers, FaShieldAlt, FaPhoneAlt } from "react-icons/fa";
import { motion } from "framer-motion";

function AboutUs() {
  const [showHeader, setShowHeader] = useState(true);

  // Handle the scroll event to hide the header
  const handleScroll = () => {
    if (window.scrollY > 100) {
      setShowHeader(false);
    } else {
      setShowHeader(true);
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <div className="bg-gray-50">
      {/* Conditionally render header based on scroll position */}
      {showHeader && <Header />}

      {/* Website Name */}
      <section className="text-center py-12 px-6">
        <motion.h1
          className="text-4xl font-extrabold text-blue-800 mt-32"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, ease: "easeOut" }}
        >
          Welcome to Vastufy!!
        </motion.h1>
        <p className="mt-4 text-lg text-gray-700">
          Your trusted partner in finding the perfect property.
        </p>
      </section>

      {/* About Content */}
      <section className="flex items-center justify-center py-16 px-6 max-w-6xl mx-auto ">
        <div className="text-center md:text-left">
          <motion.h2
            className="text-3xl font-semibold text-gray-800"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
          >
            Something About Us
          </motion.h2>
          <p className="mt-4 text-lg text-gray-700 max-w-2xl mx-auto md:mx-0">
            We are an experienced team of people who wish to see happy faces of
            clients, through our expertise in real estate industry. Either you
            are new to the real estate world or an experienced one, we can help!
            Vastufy has been in the business for years and we have seen it all.
            We know what works and what doesn’t. When selling or buying real
            estate, people tend to have specific needs and wishes. We can help
            you to find the right one by helping you to navigate through the
            world of real estate. We put your needs first at every step of your
            real estate journey. It all begins with offering exceptional service
            and being responsive. We’ve served many satisfied customers for
            years now, and we plan on continuing to do so in years to come.
          </p>
        </div>
        <motion.img
          src="/RE11.gif"
          alt="Real Estate"
          className="hidden md:block ml-12 rounded-lg shadow-xl max-w-md"
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
        />
      </section>

      {/* Our Super Powers Section */}
      <section className="py-16 bg-white px-6 md:px-12 lg:px-24">
        <motion.h2
          className="text-4xl text-center font-bold text-blue-800"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
        >
          Our Super Powers
        </motion.h2>

        <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-12">
          <motion.div
            className="text-center p-8 bg-white rounded-lg shadow-xl hover:shadow-2xl transform hover:scale-105 hover:translate-y-4 transition-all duration-300"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.5, delay: 0.3, ease: "easeOut" }}
          >
            <FaHome className="text-5xl text-blue-800 mb-6 animate__animated animate__fadeIn" />
            <h3 className="text-2xl font-semibold text-gray-900">Find Your Dream Home</h3>
            <p className="mt-4 text-gray-600 text-lg">
              Browse through our extensive list of properties to find your perfect home, whether you're buying or renting.
            </p>
          </motion.div>

          <motion.div
            className="text-center p-8 bg-white rounded-lg shadow-xl hover:shadow-2xl transform hover:scale-105 hover:translate-y-4 transition-all duration-300"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.5, delay: 0.5, ease: "easeOut" }}
          >
            <FaUsers className="text-5xl text-blue-800 mb-6 animate__animated animate__fadeIn" />
            <h3 className="text-2xl font-semibold text-gray-900">Expert Team</h3>
            <p className="mt-4 text-gray-600 text-lg">
              Our team of real estate experts is dedicated to helping you find the best property deals and guiding you through every step of the process.
            </p>
          </motion.div>

          <motion.div
            className="text-center p-8 bg-white rounded-lg shadow-xl hover:shadow-2xl transform hover:scale-105 hover:translate-y-4 transition-all duration-300"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.5, delay: 0.7, ease: "easeOut" }}
          >
            <FaShieldAlt className="text-5xl text-blue-800 mb-6 animate__animated animate__fadeIn" />
            <h3 className="text-2xl font-semibold text-gray-900">Secure Transactions</h3>
            <p className="mt-4 text-gray-600 text-lg">
              We ensure that your transactions are smooth, transparent, and secure with our verified property listings and legal support.
            </p>
          </motion.div>
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

      {/* Footer Section */}
      <Footer />
    </div>
  );
}

export default AboutUs;
