import React, { useEffect, useState } from 'react';
import Header from '../../components/Header'; // Import Header component
import SearchSidebar from '../../components/SearchSidebar'; // Import Search Sidebar component
import PropertyCard from '../../components/PropertyCard'; // Import PropertyCard component
import axiosInstanceUser from '../../services/axiosInstanceUser'; // Import axios instance for API calls

function Properties() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showHeader, setShowHeader] = useState(true); // State to control header visibility
  const [lastScrollY, setLastScrollY] = useState(0); // State to track last scroll position

  // Fetch properties from the backend
  const fetchProperties = async () => {
    try {
      const response = await axiosInstanceUser.get('/properties'); // Fetch properties
      setProperties(response.data.properties); // Assuming 'properties' is an array
      setLoading(false); // Set loading to false after data is fetched
    } catch (error) {
      setError('Error fetching properties');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProperties(); // Call the fetch function when the component mounts
  }, []);

  // Handle scroll event to show/hide header
  const handleScroll = () => {
    if (window.scrollY > lastScrollY) {
      // If scrolling down, hide the header
      setShowHeader(false);
    } else {
      // If scrolling up, show the header
      setShowHeader(true);
    }
    setLastScrollY(window.scrollY);
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll); // Add scroll event listener
    return () => {
      window.removeEventListener('scroll', handleScroll); // Clean up the listener on unmount
    };
  }, [lastScrollY]);

  // Render the loading state
  if (loading) {
    return (
      <div>
        <Header /> {/* Add Header */}
        <div className="flex justify-center items-center min-h-screen bg-gray-100">
          <p className="text-lg font-semibold text-gray-700">Loading properties...</p>
        </div>
      </div>
    );
  }

  // Render error if any
  if (error) {
    return (
      <div>
        <Header /> {/* Add Header */}
        <div className="flex justify-center items-center min-h-screen bg-gray-100">
          <p className="text-red-500 text-lg font-semibold">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header with conditional rendering based on scroll position */}
      {showHeader && <Header />} {/* Show header based on scroll */}

      {/* Add more top margin to create additional space between the header and content */}
      <div className={`flex flex-grow ${showHeader ? 'mt-28' : 'mt-8'} max-w-7xl mx-auto px-4`}>
        {/* Sidebar */}
        <div className="w-64 mr-6">
          <SearchSidebar />
        </div>

        {/* Main content */}
        <div className="flex-grow">
          <h1 className="text-4xl font-bold mb-8 text-gray-800">Available Properties</h1>
          {properties.length === 0 ? (
            <p className="text-center text-gray-600">No properties available.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {properties.map((property) => (
                <PropertyCard key={property._id} property={property} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Properties;
