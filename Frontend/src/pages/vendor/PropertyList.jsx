import React, { useEffect, useState } from "react";
import VendorSidebar from "../../components/VendorSidebar";
import axiosInstanceVendor from "../../services/axiosInstanceVendor";
import { useNavigate } from "react-router-dom"; 
import { useSelector } from "react-redux";
import { selectVendor } from "../../features/vendor/vendorSlice";
import { FaBed, FaBath, FaCar } from "react-icons/fa"; // Add icons

function PropertyList() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch vendorId from Redux
  const vendor = useSelector(selectVendor);
  const vendorId = vendor.id;
  const navigate = useNavigate(); 

  // Fetch properties when the component mounts
  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const response = await axiosInstanceVendor.get(
          `/properties/${vendorId}`
        );
        setProperties(response.data.properties.properties.reverse());
        setLoading(false);
      } catch (error) {
        setError("Error fetching properties");
        setLoading(false);
      }
    };
    if (vendorId) {
      fetchProperties();
    }
  }, [vendorId]);

  const handleEdit = (id) => {
    navigate(`/vendor/edit-property/${id}`);
  };

  // const handleSoldOut = (id) => {
  //   console.log(`Unlist property with ID: ${id}`);
  //   // Add logic to handle unlisting the property
  // };

  // Conditionally render loading, error, and properties
  if (loading) {
    return (
      <div className="flex min-h-screen">
        <VendorSidebar />
        <div className="flex-1 flex justify-center items-center">
          <div className="text-xl font-semibold text-gray-700">Loading properties...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen">
        <VendorSidebar />
        <div className="flex-1 flex justify-center items-center">
          <div className="text-red-500 text-lg">{error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen">
      <VendorSidebar />
      <div className="ml-64 flex-1 p-8">
        <h1 className="text-4xl font-semibold mb-10 text-gray-900">My Properties</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {properties.length > 0 ? (
            properties.map((property) => (
              <div
                key={property._id}
                className="bg-white p-6 shadow-lg rounded-xl transform transition duration-300 ease-in-out hover:shadow-2xl hover:-translate-y-2 flex flex-col justify-between min-h-[450px]"
              >
                <div className="relative flex-grow">
                  {property.mediaUrls && property.mediaUrls.length > 0 && (
                    <img
                      src={property.mediaUrls[0]}
                      alt={property.title}
                      className="w-full h-64 object-cover rounded-lg"
                    />
                  )}
                  <div className="absolute top-4 left-4 bg-blue-500 text-white px-3 py-1 rounded-full text-xs uppercase">
                    {property.availableStatus}
                  </div>
                </div>

                <div className="mt-4 flex-grow">
                  <h2 className="text-2xl font-semibold text-gray-800 mb-2">
                    {property.title}
                  </h2>

                  {/* Price */}
                  <p className="text-lg font-bold text-gray-800 mb-1">
                    Price: <span className="font-extrabold text-gray-900">₹{property.expectedPrice}</span>
                  </p>

                  {/* Features */}
                  <div className="flex items-center space-x-4 text-md text-gray-600 mb-2">
                    <div className="flex items-center space-x-1">
                      <FaBed className="text-blue-800" />
                      <span>{property.bedrooms} Beds</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <FaBath className="text-blue-800" />
                      <span>{property.washrooms} Baths</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <FaCar className="text-blue-800" />
                      <span>{property.parking === 'available' ? "Parking Available" : "No Parking"}</span>
                    </div>
                  </div>

                  {/* Category */}
                  <p className="text-md font-semibold text-gray-700 mb-1">
                    Category: <span className="font-bold text-gray-900">{property.category.name}</span>
                  </p>

                  {/* Location */}
                  <p className="text-md font-semibold text-gray-700 mb-1">
                    Location: <span className="font-bold text-gray-900">{property.address}</span>
                  </p>

                  {/* Owner */}
                  <p className="text-md font-semibold text-gray-700 mb-1">
                    Owner: <span className="font-bold capitalize text-gray-900">{property.ownershipStatus}</span>
                  </p>
                </div>

                <div className="flex justify-between space-x-2 mt-6">
                  <button
                    className="flex-1 bg-blue-800 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition duration-300 ease-in-out text-sm"
                    onClick={() => handleEdit(property._id)}
                  >
                    Edit
                  </button>
                  {/* <button
                    className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-lg transition duration-300 ease-in-out text-sm"
                    onClick={() => handleSoldOut(property._id)}
                  >
                    Mark as Sold
                  </button> */}
                </div>
              </div>
            ))
          ) : (
            <p className="text-lg text-gray-500">No properties found</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default PropertyList;
