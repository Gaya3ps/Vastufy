import React, { useEffect, useState } from "react";
import Sidebar from "../../components/Sidebar";
import axiosInstance from "../../services/axiosInstance";
import { FaEye, FaPhoneAlt } from "react-icons/fa"; // Added icons for the buttons
import { useNavigate } from "react-router-dom";

function Properties() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const fetchProperties = async () => {
    try {
      const response = await axiosInstance.get("/properties");
      setProperties(response.data); // Assuming 'properties' field in response
      setLoading(false); // Set loading to false after data is fetched
    } catch (error) {
      setError("Error fetching properties");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProperties();
  }, []);

  const handleViewDetails = (propertyId) => {
    navigate(`/admin/propertydetail/${propertyId}`); // Navigate to property detail page using the property ID
  };


  if (loading) {
    return (
      <div className="flex">
        <Sidebar />
        <div className="flex-grow p-6 flex justify-center items-center">
          <div className="text-lg font-semibold text-gray-700">Loading properties...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex">
        <Sidebar />
        <div className="flex-grow p-6">
          <div className="text-red-500 font-semibold">{error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex bg-gray-50 min-h-screen ml-64">
      <Sidebar />
      <div className="flex-grow p-6">
        <h1 className="text-3xl font-bold text-[#2D2926FF] mb-8">Property Listings</h1>
        {properties.length === 0 ? (
          <p className="text-gray-600 text-lg">No properties available.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {properties.map((property) => (
              <div
                key={property._id}
                className="bg-white p-6 shadow-lg rounded-lg hover:shadow-2xl transition duration-300 ease-in-out transform hover:scale-105 cursor-pointer flex flex-col h-full"
              >
                {property.mediaUrls && property.mediaUrls.length > 0 && (
                  <img
                    src={property.mediaUrls[0]}
                    alt={property.title}
                    className="w-full h-48 object-cover rounded-lg mb-4 shadow-md"
                  />
                )}
                <h2 className="text-2xl font-semibold text-[#155e75] mb-2">{property.title}</h2>
                <p className="text-gray-600 mb-2">
                  <span className="font-semibold">Price:</span> ₹{property.expectedPrice.toLocaleString()}
                </p>
                <p className="text-gray-600 mb-2">
                  <span className="font-semibold">Category:</span> {property.category?.name}
                </p>
                <p className="text-gray-600 mb-2">
                  <span className="font-semibold">Location:</span> {property.address}
                </p>
                <p className="text-gray-600 mb-4">
                  <span className="font-semibold">Status:</span> {property.availableStatus}
                </p>

                {/* Bottom Buttons - Aligned */}
                <div className="mt-auto flex justify-between items-center space-x-2">
                  <button onClick={() => handleViewDetails(property._id)}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition duration-300 flex items-center justify-center">
                    <FaEye className="inline-block mr-2" /> View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Properties;
