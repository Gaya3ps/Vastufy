import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ExclamationCircleIcon } from '@heroicons/react/24/solid';

function SubscriptionFailure() {
  const navigate = useNavigate();

  const handleGoToDashboard = () => {
    navigate('/vendor/home'); // Redirects to the dashboard
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-10 rounded-lg shadow-lg text-center max-w-md w-full">
        <ExclamationCircleIcon className="h-16 w-16 text-red-500 mx-auto mb-4" />
        
        <h1 className="text-3xl font-bold text-gray-800 mb-4">Subscription Failed</h1>
        <p className="text-gray-600 mb-6">
          Unfortunately, your payment attempt was not successful. Please contact support if you need further assistance.
        </p>

        <button
          onClick={handleGoToDashboard}
          className="bg-blue-500 text-white font-semibold py-2 px-6 rounded-lg hover:bg-blue-600 transition-colors duration-200"
        >
          Go to Dashboard
        </button>
      </div>
    </div>
  );
}

export default SubscriptionFailure;
