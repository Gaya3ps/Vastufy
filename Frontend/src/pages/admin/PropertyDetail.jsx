import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axiosInstance from '../../services/axiosInstance';
import Sidebar from '../../components/Sidebar';

function PropertyDetail() {
  const { propertyId } = useParams(); // Get the property ID from the URL
  const [property, setProperty] = useState(null); // State to hold the property data
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true); // Loading state
  const [isAccepted, setIsAccepted] = useState(false); // Track if accepted
  const [isRejected, setIsRejected] = useState(false); // Track if rejected
  const navigate = useNavigate(); // For programmatic navigation after actions

  // Fetch property details by ID
  useEffect(() => {
    const fetchPropertyDetails = async () => {
      try {
        const response = await axiosInstance.get(`/property/${propertyId}`); // Pass propertyId in URL
        console.log(response.data, 'Property details fetched successfully');
        setProperty(response.data);
        setIsAccepted(response.data.status === 'accepted'); // Set initial status
        setIsRejected(response.data.status === 'rejected'); // Set initial status
        setLoading(false);
      } catch (err) {
        console.error('Error fetching property details:', err);
        setError('Error fetching property details');
        setLoading(false);
      }
    };

    fetchPropertyDetails();
  }, [propertyId]);

  const updatePropertyStatus = async (newStatus) => {
    try {
      await axiosInstance.patch(`/updatepropertystatus/${propertyId}`, { status: newStatus });

      if (newStatus === 'rejected') {
        setIsRejected(true);
        setIsAccepted(false);
      } else if (newStatus === 'accepted') {
        setIsAccepted(true);
        setIsRejected(false);
      }

      setProperty((prevProperty) => ({ ...prevProperty, status: newStatus }));
    } catch (err) {
      console.error('Failed to update status:', err);
    }
  };

  // Display loading or error messages
  if (loading) return <div>Loading property details...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 p-6">
        {property ? (
          <div className="bg-white shadow-md rounded-lg p-6">
            <h1 className="text-2xl font-bold mb-4">{property.title}</h1>
            <p><strong>Price:</strong> ₹{property.expectedPrice}</p>
            <p><strong>Location:</strong> {property.address}</p>
            <p><strong>Category:</strong> {property.category?.name || 'N/A'}</p>
            <p><strong>Vendor:</strong> {property.vendor?.name || 'N/A'}</p>
            <p><strong>Status:</strong> {property.availableStatus}</p>

            <div className="mt-6">
              {isAccepted ? (
                <button className="px-4 py-2 bg-green-500 text-white rounded-md" disabled>
                  Accepted
                </button>
              ) : isRejected ? (
                <button className="px-4 py-2 bg-red-500 text-white rounded-md" disabled>
                  Rejected
                </button>
              ) : (
                <>
                  <button
                    className="px-4 py-2 bg-green-500 text-white rounded-md mr-2 hover:bg-green-600 focus:outline-none"
                    onClick={() => updatePropertyStatus('accepted')}
                  >
                    Accept
                  </button>
                  <button
                    className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 focus:outline-none"
                    onClick={() => updatePropertyStatus('rejected')}
                  >
                    Reject
                  </button>
                </>
              )}
            </div>
          </div>
        ) : (
          <p>Property not found</p>
        )}
      </div>
    </div>
  );
}

export default PropertyDetail;
