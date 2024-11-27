import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axiosInstance from '../../services/axiosInstance';
import Sidebar from '../../components/Sidebar';
import { FaImage } from 'react-icons/fa'; // Icon for images

// Importing carousel components
import { Carousel } from 'react-responsive-carousel';
import "react-responsive-carousel/lib/styles/carousel.min.css"; // Carousel styles

function PropertyDetail() {
  const { propertyId } = useParams();
  const [property, setProperty] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAccepted, setIsAccepted] = useState(false);
  const [isRejected, setIsRejected] = useState(false);

  useEffect(() => {
    const fetchPropertyDetails = async () => {
      try {
        const response = await axiosInstance.get(`/property/${propertyId}`);
        setProperty(response.data);
        setIsAccepted(response.data.status === 'accepted');
        setIsRejected(response.data.status === 'rejected');
        setLoading(false);
      } catch (err) {
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

  if (loading) return <div className="text-center text-xl font-semibold">Loading property details...</div>;
  if (error) return <div className="text-center text-red-500 font-semibold">{error}</div>;

  return (
    <div className="flex h-screen bg-gray-100 ml-64">
      <Sidebar />
      <div className="flex-1 p-6 flex flex-col md:flex-row space-x-8">
        {/* Left Section: Image Carousel */}
        <div className="w-full md:w-1/3 mb-6 mt-12">
          <Carousel autoPlay infiniteLoop showThumbs={false} interval={3000}>
            {property.mediaUrls.map((url, index) => (
              <div key={index}>
                <img src={url} alt={`Property Image ${index + 1}`} className="w-full h-64 object-cover rounded-lg shadow-md" />
              </div>
            ))}
          </Carousel>
          <p className="text-lg mt-10"><strong className="font-semibold">Description:</strong> {property.description || 'N/A'}</p>
        </div>

        {/* Right Section: Property Details */}
        <div className="w-full md:w-2/3 space-y-6">
          <h1 className="text-3xl font-semibold text-[#155e75]">{property.title}</h1>

          {/* Additional Margin for Better Spacing */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <p className="text-lg"><strong className="font-semibold">Price :</strong> ₹{property.expectedPrice}</p>
              <p className="text-lg"><strong className="font-semibold">Location :</strong> {property.address}</p>
              <p className="text-lg"><strong className="font-semibold">Category :</strong> {property.category?.name || 'N/A'}</p>
              <p className="text-lg"><strong className="font-semibold">Vendor :</strong> {property.vendor?.name || 'N/A'}</p>
              <p className="text-lg"><strong className="font-semibold">Status :</strong> {property.availableStatus}</p>
           
            </div>

            <div>
              <p className="text-lg"><strong className="font-semibold">Property Type :</strong> {property.propertyType}</p>
              <p className="text-lg"><strong className="font-semibold">Ownership Status :</strong> {property.ownershipStatus}</p>
              <p className="text-lg"><strong className="font-semibold">Sale Type :</strong> {property.saleType}</p>
              <p className="text-lg"><strong className="font-semibold">Age of Property :</strong> {property.ageOfProperty}</p>
              <p className="text-lg"><strong className="font-semibold">Carpet Area :</strong> {property.carpetArea} sq. ft.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <p className="text-lg"><strong className="font-semibold">Built-Up Area :</strong> {property.builtUpArea} sq. ft.</p>
              <p className="text-lg"><strong className="font-semibold">Plot Area :</strong> {property.plotArea} sq. ft.</p>
              <p className="text-lg"><strong className="font-semibold">Washrooms :</strong> {property.washrooms}</p>
              <p className="text-lg"><strong className="font-semibold">Total Floors :</strong> {property.totalFloors}</p>
              <p className="text-lg"><strong className="font-semibold">Floor No :</strong> {property.floorNo || 'N/A'}</p>
            </div>

            <div>
              <p className="text-lg"><strong className="font-semibold">Parking :</strong> {property.parking}</p>
              <p className="text-lg"><strong className="font-semibold">District :</strong> {property.district}</p>
              <p className="text-lg"><strong className="font-semibold">City :</strong> {property.city}</p>
              <p className="text-lg"><strong className="font-semibold">Locality :</strong> {property.locality}</p>
              <p className="text-lg"><strong className="font-semibold">Landmark :</strong> {property.landmark}</p>
            </div>
          </div>

          {/* Location Advantages */}
          <div>
            <h3 className="font-semibold text-lg">Location Advantages 🏙️:</h3>
            <ul className="list-disc pl-5 space-y-2">
              {property.locationAdvantages.map((advantage, index) => (
                <li key={index}>{advantage}</li>
              ))}
            </ul>
          </div>

          {/* Amenities */}
          <div>
            <h3 className="font-semibold text-lg">Amenities 🏋️‍♂️:</h3>
            <ul className="list-disc pl-5 space-y-2">
              {property.amenities.map((amenity, index) => (
                <li key={index}>{amenity}</li>
              ))}
            </ul>
          </div>

          {/* Action Buttons */}
          <div className="mt-6 flex space-x-4">
            {isAccepted ? (
              <button className="px-6 py-2 bg-green-500 text-white rounded-md w-36" disabled>
                Accepted 
              </button>
            ) : isRejected ? (
              <button className="px-6 py-2 bg-red-500 text-white rounded-md w-36" disabled>
                Rejected 
              </button>
            ) : (
              <>
                <button
                  className="px-6 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 w-36 font-bold"
                  onClick={() => updatePropertyStatus('accepted')}
                >
                  Accept 
                </button>
                <button
                  className="px-6 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 w-36 font-bold"
                  onClick={() => updatePropertyStatus('rejected')}
                >
                  Reject 
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default PropertyDetail;
