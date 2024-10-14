import React from 'react';
import { useNavigate } from 'react-router-dom';

const SuccessPage = () => {
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate('/vendor/login'); 
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md text-center">
        <h1 className="text-2xl font-bold text-blue-500 mb-4">Success!</h1>
        <p className="text-gray-700 mb-6">Your license is under verification. Please wait for approval. Thank you for your patience.</p>
        <button
          onClick={handleGoBack}
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-400"
        >
          Back to login
        </button>
      </div>
    </div>
  );
};

export default SuccessPage;
