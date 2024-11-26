import React, { useState, useEffect } from "react";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { motion } from "framer-motion";

function Services() {
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

  const services = [
    {
      image: "/Property-Management.jpg",
      title: "Property Management",
      description:
        "We provide transparent, ideal and reliable property management solutions, including rental property management services.",
    },
    {
      image: "/Mortgage-Service.jpg",
      title: "Mortgage Service",
      description:
        "We provide mortgage services for more consumer and commercial loan products than any other loan service provider in Kerala.",
    },
    {
      image: "/Consulting-Service.jpg",
      title: "Consulting Service",
      description:
        "Our management consulting services focus on the most critical issues and opportunities of our clients.",
    },
    {
      image: "/Legal-Support.jpg",
      title: "Legal Support",
      description:
        "We provide legal aids for customers and help with registration, agreement drafting, verification, and related procedures.",
    },
    {
      image: "/Home-Buying.jpg",
      title: "Home Buying",
      description:
        "Vastufy provides home buying services that are reliable and budget-friendly. We will guide you through the whole process.",
    },
    {
      image: "/Home-Selling.jpg",
      title: "Home Selling",
      description:
        "We work with trusted partners and developers to bring you the best real estate deals. We also offer home selling services.",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Conditionally render header based on scroll position */}
      {showHeader && <Header />}

      <div className="flex-grow mt-20 px-4">
        <motion.h2
          className="text-4xl font-semibold text-center text-blue-800 mb-10 mt-16"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
        >
          Our Services
        </motion.h2>

        {/* Service Grid with hover effects */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <motion.div
              key={index}
              className="flex flex-col md:flex-row items-center text-center p-4 bg-white shadow-lg rounded-lg hover:shadow-2xl transition-all transform hover:scale-105"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.2 * index, ease: "easeOut" }}
            >
              {/* Image Section */}
              <div className="w-full md:w-1/2 mb-4 md:mb-0">
                <img
                  src={service.image}
                  alt={service.title}
                  className="w-full h-64 object-cover rounded-lg transform transition duration-500 hover:scale-105"
                />
              </div>

              {/* Text Section */}
              <div className="w-full md:w-1/2 md:pl-4">
                <h3 className="text-xl font-semibold text-blue-800 mb-2">
                  {service.title}
                </h3>
                <p className="text-gray-600 text-sm">{service.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
      <Footer /> {/* Import and use the Footer component */}
    </div>
  );
}

export default Services;
