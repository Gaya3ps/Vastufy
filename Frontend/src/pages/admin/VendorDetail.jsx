import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axiosInstance from '../../services/axiosInstance';
import Sidebar from '../../components/Sidebar';
import { UserIcon } from '@heroicons/react/24/solid';


function VendorDetail() {
  const { vendorId } = useParams();
  const [vendor, setVendor] = useState(null);
  const [license, setLicense] = useState(null);
  const [status, setStatus] = useState('idle');
  const [error, setError] = useState(null);
  const [isHovered, setIsHovered] = useState(false);
  const [isAccepted, setIsAccepted] = useState(false); // Track if accepted
  const [isRejected, setIsRejected] = useState(false); // Track if rejected

  const fetchVendor = async () => {
    setStatus('loading');
    try {
      const vendorResponse = await axiosInstance.get(`/vendor/${vendorId}`);
      setVendor(vendorResponse.data);
      setIsAccepted(vendorResponse.data.status === 'accepted'); // Set initial status
      setIsRejected(vendorResponse.data.status === 'rejected'); // Set initial status
      setStatus('succeeded');
    } catch (err) {
      console.error('Failed to fetch vendor:', err);
      setError(err.message);
      setStatus('failed');
    }
  };

  const fetchLicense = async (email) => {
    try {
      const licenseResponse = await axiosInstance.get(`/license/${email}`);
      setLicense(licenseResponse.data);
    } catch (err) {
      console.error('Failed to fetch license:', err);
      setError(err.message);
    }
  };

  useEffect(() => {
    fetchVendor();
  }, [vendorId]);

  useEffect(() => {
    if (vendor && vendor.email) {
      fetchLicense(vendor.email);
    }
  }, [vendor]);

  const updateStatus = async (newStatus) => {
    try {
      await axiosInstance.patch(`/updatestatus/${vendorId}`, { status: newStatus });

      if (newStatus === 'rejected') {
        await axiosInstance.patch(`/updateisverified/${vendorId}`, { is_verified: false });
        setVendor({ ...vendor, status: newStatus, is_verified: false });
        setIsRejected(true); // Mark as rejected
      } else if (newStatus === 'accepted') {
        setVendor({ ...vendor, status: newStatus });
        setIsAccepted(true); // Mark as accepted
      }
    } catch (err) {
      console.error('Failed to update status:', err);
    }
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  const handleCloseModal = () => {
    setIsHovered(false);
  };

  const renderLicenseDocument = () => {
    if (!license?.licenseDocumentUrl) return null;

    const isPdf = license.licenseDocumentUrl.toLowerCase().endsWith('.pdf');

    if (isPdf) {
      return (
        <iframe
          src={license.licenseDocumentUrl}
          title="License Document"
          className="w-32 h-32 object-cover rounded-lg mr-4 transition-transform duration-300 transform hover:scale-105"
        />
      );
    }

    return (
      <img
        src={license.licenseDocumentUrl}
        alt="License Document"
        className="w-32 h-32 object-cover rounded-lg mr-4 transition-transform duration-300 transform hover:scale-105"
      />
    );
  };

  const renderEnlargedLicenseDocument = () => {
    if (!license?.licenseDocumentUrl) return null;

    const isPdf = license.licenseDocumentUrl.toLowerCase().endsWith('.pdf');

    if (isPdf) {
      return (
        <iframe
          src={license.licenseDocumentUrl}
          title="License Document"
          className="max-w-full max-h-full"
        />
      );
    }

    return (
      <img
        src={license.licenseDocumentUrl}
        alt="License Document"
        className="max-w-full max-h-full"
      />
    );
  };

  return (
    <div className="flex h-screen bg-gray-100 ml-64">
      <Sidebar />
      <div className="flex-1 p-6">
        {status === 'loading' ? (
          <p className="text-center">Loading...</p>
        ) : status === 'failed' ? (
          <p className="text-center text-red-500">{error}</p>
        ) : vendor ? (
          <div className="bg-[#155e75]  shadow-md rounded-lg p-6">
            {/* Top Section */}
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center">
                 <UserIcon className="w-12 h-12 text-white"/>
                <div>
                  <h1 className="text-xl font-semibold text-gray-800 dark:text-white">
                    {vendor.name}
                  </h1>
                  <p className="text-gray-600 dark:text-gray-300">{vendor.email}</p>
                </div>
              </div>
              <div>
                {isAccepted ? (
                  <button
                    className="px-4 py-2 bg-green-500 text-white rounded-md"
                    disabled
                  >
                    Accepted
                  </button>
                ) : isRejected ? (
                  <button
                    className="px-4 py-2 bg-red-500 text-white rounded-md"
                    disabled
                  >
                    Rejected
                  </button>
                ) : (
                  <>
                    <button
                      className="px-4 py-2 bg-green-500 text-white rounded-md mr-2 hover:bg-green-600 focus:outline-none"
                      onClick={() => updateStatus('accepted')}
                    >
                      Accept
                    </button>
                    <button
                      className="px-4 py-2 bg-[#E72929] text-white rounded-md hover:bg-[#9e0f0f] focus:outline-none focus:bg-red-600"
                      onClick={() => updateStatus('rejected')}
                    >
                      Reject
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* Thin Line */}
            <hr className="my-6 border-gray-300 dark:border-gray-600" />

            {/* License Details Section */}
            <div className="mb-6">
              <div className="grid grid-cols-2">
                <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
                  License Details
                </h2>
                <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
                  License Document
                </h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                <div>
                  <div className="grid grid-row-2">
                    <p className="text-gray-600 dark:text-gray-300 w-32">License Number:</p>
                    <p className="text-gray-800 dark:text-white">{license?.licenseNumber || 'N/A'}</p>
                  </div>
                  <div className="grid grid-row-2">
                    <p className="text-gray-600 dark:text-gray-300 flex-shrink-0 w-32">Issue Date:</p>
                    <p className="text-gray-800 dark:text-white">{license?.issueDate || 'N/A'}</p>
                  </div>
                </div>
                <div>
                  <div className="grid grid-row-2">
                    <p className="text-gray-600 dark:text-gray-300 flex-shrink-0 w-32">Expiry Date:</p>
                    <p className="text-gray-800 dark:text-white">{license?.expiryDate || 'N/A'}</p>
                  </div>
                  <div className="grid grid-row-2">
                    <p className="text-gray-600 dark:text-gray-300 flex-shrink-0 w-32">Status:</p>
                    <p className="text-gray-800 dark:text-white">{vendor.status || 'N/A'}</p>
                  </div>
                </div>
                {/* License Image Section */}
                <div className="relative col-start-3">
                  <div
                    className="flex items-center"
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                  >
                    {renderLicenseDocument()}
                    {isHovered && (
                      <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
                        <div className="max-w-4xl max-h-4xl relative">
                          <button
                            className="absolute top-2 right-2 px-2 py-1 bg-gray-800 text-white rounded-md hover:bg-gray-700 focus:outline-none"
                            onClick={handleCloseModal}
                          >
                            Close
                          </button>
                          <div>{renderEnlargedLicenseDocument()}</div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <p className="text-center">No vendor found</p>
        )}
      </div>
    </div>
  );
}

export default VendorDetail;
