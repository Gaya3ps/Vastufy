import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axiosInstance from '../../services/axiosInstance';
import Sidebar from '../../components/Sidebar';
import { UserIcon } from '@heroicons/react/24/solid';
import { MdClose } from 'react-icons/md';

function VendorDetail() {
  const { vendorId } = useParams();
  const [vendor, setVendor] = useState(null);
  const [license, setLicense] = useState(null);
  const [status, setStatus] = useState('idle');
  const [error, setError] = useState(null);
  const [isDocumentOpen, setIsDocumentOpen] = useState(false); // State for controlling enlarged document view
  const [isAccepted, setIsAccepted] = useState(false);
  const [isRejected, setIsRejected] = useState(false);

  const fetchVendor = async () => {
    setStatus('loading');
    try {
      const vendorResponse = await axiosInstance.get(`/vendor/${vendorId}`);
      setVendor(vendorResponse.data);
      setIsAccepted(vendorResponse.data.status === 'accepted');
      setIsRejected(vendorResponse.data.status === 'rejected');
      setStatus('succeeded');
    } catch (err) {
      setError(err.message);
      setStatus('failed');
    }
  };

  const fetchLicense = async (email) => {
    try {
      const licenseResponse = await axiosInstance.get(`/license/${email}`);
      setLicense(licenseResponse.data);
    } catch (err) {
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
        setIsRejected(true);
      } else if (newStatus === 'accepted') {
        setVendor({ ...vendor, status: newStatus });
        setIsAccepted(true);
      }
    } catch (err) {
      console.error('Failed to update status:', err);
    }
  };

  // Functions to handle opening and closing modal
  const handleClick = () => setIsDocumentOpen(true); // Open enlarged document
  const handleCloseModal = () => setIsDocumentOpen(false); // Close enlarged document

  const renderLicenseDocument = () => {
    if (!license?.licenseDocumentUrl) return null;
    const isPdf = license.licenseDocumentUrl.toLowerCase().endsWith('.pdf');
    if (isPdf) {
      return (
        <iframe
          src={license.licenseDocumentUrl}
          title="License Document"
          className="w-32 h-32 object-cover rounded-lg mr-4 cursor-pointer"
          onClick={handleClick} // Open document on click
        />
      );
    }
    return (
      <img
        src={license.licenseDocumentUrl}
        alt="License Document"
        className="w-32 h-32 object-cover rounded-lg mr-4 cursor-pointer"
        onClick={handleClick} // Open document on click
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


    // Format date
    const formatDate = (dateString) => {
      const date = new Date(dateString);
      return date.toLocaleDateString(); // You can adjust the format here if needed
    };

  return (
    <div className="flex h-screen bg-gray-100 ml-64">
      <Sidebar />
      <div className="flex-1 p-8 overflow-y-auto">
        {status === 'loading' ? (
          <div className="text-center text-xl font-semibold">Loading...</div>
        ) : status === 'failed' ? (
          <div className="text-center text-red-500 font-semibold">{error}</div>
        ) : vendor ? (
          <div className="bg-[#155e75] text-white shadow-md rounded-lg p-8">
            {/* Top Section */}
            <div className="flex justify-between items-center mb-8">
              <div className="flex items-center space-x-4">
                <UserIcon className="w-16 h-16 text-white" />
                <div>
                  <h1 className="text-2xl font-semibold">{vendor.name}</h1>
                  <p className="text-lg">{vendor.email}</p>
                  <p className="text-lg">Ph:{vendor.mobileNumber}</p>

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
                      className="px-4 py-2 bg-green-500 text-white rounded-md mr-2"
                      onClick={() => updateStatus('accepted')}
                    >
                      Accept
                    </button>
                    <button
                      className="px-4 py-2 bg-red-500 text-white rounded-md"
                      onClick={() => updateStatus('rejected')}
                    >
                      Reject
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* License Details Section */}
            <hr className="my-6 border-gray-300" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h2 className="text-xl font-semibold">License Details</h2>
                <div className="space-y-4 mt-4">
                  <p><span className="font-semibold">License Number:</span> {license?.licenseNumber || 'N/A'}</p>
                  <p><span className="font-semibold">Issue Date:</span> {license?.issueDate ? formatDate(license.issueDate) : 'N/A'}</p>
                  <p><span className="font-semibold">Expiry Date:</span> {license?.expiryDate ? formatDate(license.expiryDate) : 'N/A'}</p>
                </div>
              </div>
              <div>
                <h2 className="text-xl font-semibold">License Document</h2>
                <div className="flex items-center cursor-pointer">
                  {renderLicenseDocument()}
                  {isDocumentOpen && (
                    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                      <div className="relative w-full max-w-3xl max-h-3xl bg-white p-4 rounded-lg">
                      <button
                className="absolute top-2 right-2 text-gray-800 bg-transparent p-2 rounded-full hover:bg-gray-300"
                  onClick={handleCloseModal}
              >
                <MdClose className="w-6 h-6 text-black" />
              </button>
                        <div>{renderEnlargedLicenseDocument()}</div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center text-gray-500">No vendor found</div>
        )}
      </div>
    </div>
  );
}

export default VendorDetail;
