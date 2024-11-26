import React, { useEffect, useState } from "react";
import Sidebar from "../../components/Sidebar";
import axiosInstance from "../../services/axiosInstance"; // Import your Axios instance
import { Link } from "react-router-dom"; // For linking to details
import { BuildingOfficeIcon } from '@heroicons/react/24/solid'; // Icon for property

function PropertyVerify() {
  const [properties, setProperties] = useState([]);
  const [status, setStatus] = useState('idle');
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Function to fetch properties from backend
  const fetchProperties = async () => {
    setStatus('loading');
    try {
      const response = await axiosInstance.get("/propertyverify");
      console.log(response.data,"dsffffffffffffffffffffff");
       // Adjust the endpoint
      if (Array.isArray(response.data)) {
        setProperties(response.data); // Assuming the response has 'properties'
      } else {
        setProperties([]); // Fallback to empty array if the response is not what we expect
      }
      setStatus('succeeded');
    } catch (err) {
      console.error("Failed to fetch properties:", err);
      setError(err.message);
      setStatus('failed');
    }
  };

  useEffect(() => {
    fetchProperties();
  }, []);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  return (
    <div className="flex h-screen bg-['#155e75'] overflow-hidden ml-64">
      <Sidebar />
      <div className="flex-1 p-6 overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center bg-white rounded shadow-md">
            <input
              type="text"
              placeholder="Search properties"
              className="px-4 py-2 w-64 border-none focus:outline-none"
              value={searchTerm}
              onChange={handleSearchChange}
            />
            <button className="px-4 py-2 bg-gray-200 border-l border-gray-300">
              <svg
                className="w-5 h-5 text-gray-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M21 21l-4.35-4.35M9 14a5 5 0 1 1 10 0 5 5 0 0 1-10 0zm0 0v1a1 1 0 0 0 1 1h3m-4-6h4"
                />
              </svg>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {status === 'loading' ? (
            <p className="text-center">Loading...</p>
          ) : status === 'failed' ? (
            <p className="text-center text-red-500">{error}</p>
          ) : properties.length > 0 ? (
            properties
              .filter((property) =>
                property.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                property.vendor.name.toLowerCase().includes(searchTerm.toLowerCase())
              )
              .map((property) => (
                <Link to={`/admin/property/${property._id}`} key={property._id}>

                  <div className="bg-[#0e7490] shadow-md rounded-lg p-6 flex items-center space-x-4 transition-transform duration-200 ease-in-out transform hover:scale-105 hover:shadow-lg">
                    <BuildingOfficeIcon className="w-12 h-12 text-white" />
                    <div>
                      <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
                        {property.title}
                      </h2>
                      <p className="text-gray-600 dark:text-gray-300">
                        Vendor: {property.vendor.name}
                      </p>
                    </div>
                  </div>
                </Link>
              ))
          ) : (
            <p className="text-center text-red-500">No properties found.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default PropertyVerify;
