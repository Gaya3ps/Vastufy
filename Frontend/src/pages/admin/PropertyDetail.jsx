import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axiosInstance from '../../services/axiosInstance';
import Sidebar from '../../components/Sidebar';

function PropertyDetail() {
  const { propertyId } = useParams(); // Get the property ID from the URL
  const [property, setProperty] = useState(null); // State to hold the property data
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true); // Loading state
  const navigate = useNavigate(); // For programmatic navigation after actions

  // Fetch property details by ID
  useEffect(() => {
    const fetchPropertyDetails = async () => {
      try {
        const response = await axiosInstance.get(`/property/${propertyId}`); // Pass propertyId in URL
        setProperty(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching property details:', err);
        setError('Error fetching property details');
        setLoading(false);
      }
    };
  
    fetchPropertyDetails();
  }, []);
  

  const handleAccept = async () => {
    try {
      await axiosInstance.patch(`/property/verify/${propertyId}`, { status: 'accepted' });
      navigate('/admin/propertyverify'); // Redirect to property verification list after accepting
    } catch (err) {
      console.error('Error accepting property:', err);
    }
  };

  const handleReject = async () => {
    try {
      await axiosInstance.patch(`/property/verify/${propertyId}`, { status: 'rejected' });
      navigate('/admin/propertyverify'); // Redirect to property verification list after rejecting
    } catch (err) {
      console.error('Error rejecting property:', err);
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
            <p><strong>Price:</strong> {property.expectedPrice}</p>
            <p><strong>Location:</strong> {property.address}</p>
            <p><strong>Category:</strong> {property.category?.name}</p>
            <p><strong>Vendor:</strong> {property.vendor?.name}</p>
            <p><strong>Status:</strong> {property.availableStatus}</p>

            <div className="mt-6">
              <button
                className="px-4 py-2 bg-green-500 text-white rounded-md mr-4 hover:bg-green-600"
                onClick={handleAccept}
              >
                Accept
              </button>
              <button
                className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
                onClick={handleReject}
              >
                Reject
              </button>
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
