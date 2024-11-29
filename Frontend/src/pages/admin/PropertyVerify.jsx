import React, { useEffect, useState } from "react";
import Sidebar from "../../components/Sidebar";
import axiosInstance from "../../services/axiosInstance"; // Import your Axios instance
import { Link } from "react-router-dom"; // For linking to details
import { BuildingOfficeIcon } from '@heroicons/react/24/solid'; // Icon for property
import { FaSearch } from "react-icons/fa";


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
      <h1 className="text-3xl font-semibold mb-6 text-[#2D2926FF]">
      Property Verification Requests
        </h1>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center bg-white rounded shadow-md">
            <input
              type="text"
              placeholder="Search properties"
              className="w-full px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#155e75] text-lg"
              value={searchTerm}
              onChange={handleSearchChange}
            />
            <button className="ml-2 p-2 rounded-lg bg-[#155e75] text-white">
              <FaSearch className="w-5 h-5 text-white" />
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
                    <BuildingOfficeIcon className="w-16 h-16 text-white" />
                    <div>
                      <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
                        {property.title}
                      </h2>
                      <p className="text-white font-semibold">
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
