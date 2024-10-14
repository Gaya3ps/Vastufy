import React, { useEffect, useState } from "react";
import Sidebar from "../../components/Sidebar"; // Import Sidebar
import axios from "axios"; // Import axios for API requests
import axiosInstance from "../../services/axiosInstance";

function Properties() {
  // State to manage properties, loading, and error
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Function to fetch properties from the backend
  const fetchProperties = async () => {
    try {
      const response = await axiosInstance.get("/properties");
      console.log(response.data,"heyyyyyyyyyyyyyyyy");
      
      setProperties(response.data); // Assuming 'properties' field in response
    //   setProperties(Array.isArray(response.data) ? response.data : []); 
      setLoading(false); // Set loading to false after data is fetched
    } catch (error) {
      setError("Error fetching properties");
      setLoading(false);
    }
  };

  // Fetch properties when the component mounts
  useEffect(() => {
    fetchProperties(); // Call the fetch function when the component mounts
  }, []); // Empty dependency array ensures it only runs once

  // Display loading message
  if (loading) {
    return (
      <div className="flex">
        <Sidebar />
        <div className="flex-grow p-6">
          <div>Loading properties...</div>
        </div>
      </div>
    );
  }

  // Display error message if any error occurs
  if (error) {
    return (
      <div className="flex">
        <Sidebar />
        <div className="flex-grow p-6">
          <div>{error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex">
      <Sidebar /> {/* Sidebar Component */}
      <div className="flex-grow p-6">
        <h1 className="text-2xl font-bold mb-6">Property Listings</h1>
        {properties.length === 0 ? (
          <p>No properties available.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {properties.map((property) => (
              <div
                key={property._id}
                className="bg-white p-4 shadow-md rounded-lg"
              >
                {property.mediaUrls && property.mediaUrls.length > 0 && (
                  <img
                    src={property.mediaUrls[0]}
                    alt={property.title}
                    className="w-full h-48 object-cover mb-4"
                  />
                )}
                <h2 className="text-xl font-semibold mb-2">{property.title}</h2>
                <p>Price: {property.expectedPrice}</p>
                <p>Category: {property.category?.name}</p>
                <p>Location: {property.address}</p>
                <p>Status: {property.availableStatus}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Properties;
