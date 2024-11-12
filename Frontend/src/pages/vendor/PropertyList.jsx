import React, { useEffect, useState } from "react";
import VendorSidebar from "../../components/VendorSidebar";
import axiosInstanceVendor from "../../services/axiosInstanceVendor";
import { useNavigate } from "react-router-dom"; 
import { useSelector } from "react-redux";
import { selectVendor } from "../../features/vendor/vendorSlice";

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
        console.log(response.data, "Fetched properties");

        // Assuming the 'properties' field is in the response and reverse to show newest first
        setProperties(response.data.properties.properties.reverse());
        setLoading(false);
      } catch (error) {
        setError("Error fetching properties");
        setLoading(false);
      }
    };
    if (vendorId) {
      fetchProperties(); // Fetch properties when the vendorId is available
    }
  }, [vendorId]);

  const handleEdit = (id) => {
    console.log(`Edit property with ID: ${id}`);
    navigate(`/vendor/edit-property/${id}`); // Navigate to EditProperty page with property ID
  };

  const handleSoldOut = (id) => {
    console.log(`Unlist property with ID: ${id}`);
    // Add logic to handle unlisting the property
  };

  // Conditionally render the loading, error, and properties
  if (loading) {
    return (
      <div>
        <VendorSidebar />
        <div className="flex justify-center items-center min-h-screen">
          <div className="text-lg font-semibold">Loading properties...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <VendorSidebar />
        <div className="text-red-500 text-center mt-10">{error}</div>
      </div>
    );
  }

  return (
    <div className="flex">
      <VendorSidebar />
      <div className="flex-1 p-8">
        <h1 className="text-3xl font-bold mb-8 text-gray-800">Property List</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {properties.length > 0 ? (
            properties.map((property) => (
              <div
                key={property._id}
                className="bg-white p-6 shadow-lg rounded-xl transform transition duration-300 ease-in-out hover:shadow-2xl hover:-translate-y-2"
              >
                <div className="relative">
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
                <div className="mt-4">
                  <h2 className="text-2xl font-semibold text-gray-800 mb-2">
                    {property.title}
                  </h2>
                  <p className="text-lg text-gray-600 mb-1">
                    Price:{" "}
                    <span className="font-bold">₹{property.expectedPrice}</span>
                  </p>

                  <p className="text-md text-gray-500 mb-1">
                    Category:{" "}
                    <span className="font-medium">
                      {property.category.name}
                    </span>
                  </p>
                  <p className="text-md text-gray-500 mb-1">
                    Location:{" "}
                    <span className="font-medium">{property.address}</span>
                  </p>
                  <p className="text-md text-gray-500 mb-1">
                    Owner:{" "}
                    <span className="font-medium capitalize">
                      {property.ownershipStatus}
                    </span>
                  </p>
                </div>
                <div className="flex justify-between space-x-2 mt-6">
                  <button
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition duration-300 ease-in-out text-sm"
                    onClick={() => handleEdit(property._id)}
                  >
                    Edit
                  </button>
                  <button
                    className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-lg transition duration-300 ease-in-out text-sm"
                    onClick={() => handleSoldOut(property._id)}
                  >
                    Mark as soldout
                  </button>
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
