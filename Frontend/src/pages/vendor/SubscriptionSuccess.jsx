import React, { useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { CheckCircleIcon } from "@heroicons/react/24/solid";
import axiosInstanceVendor from "../../services/axiosInstanceVendor";

function SubscriptionSuccess() {
  const navigate = useNavigate();
  const location = useLocation();
  const isSubscriptionConfirmed = useRef(false); // Ref to prevent double processing

  // Extract query parameters
  const queryParams = new URLSearchParams(location.search);
  const sessionId = queryParams.get("session_id");
  const subscriptionId = queryParams.get("subscriptionId");
  const vendorId = queryParams.get("vendorId");

  useEffect(() => {
    const confirmSubscription = async () => {
      try {
        // Call the backend to confirm the subscription
        const response = await axiosInstanceVendor.post(
          "/add-vendor-to-subscription",
          {
            sessionId,
            subscriptionId,
            vendorId,
          }
        );

        if (response.data.success) {
          console.log("Vendor successfully added to the subscription");
        } else {
          console.error("Failed to add vendor to subscription");
        }
      } catch (error) {
        console.error("Error confirming subscription:", error);
      }
    };

    // Only confirm subscription if it hasn't been done yet
    if (sessionId && !isSubscriptionConfirmed.current) {
      confirmSubscription();
      isSubscriptionConfirmed.current = true; // Mark as processed
    }
  }, [sessionId, subscriptionId, vendorId]);

  const handleGoToDashboard = () => {
    navigate("/vendor/home");
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-10 rounded-lg shadow-lg text-center max-w-md w-full">
        <CheckCircleIcon className="h-16 w-16 text-green-500 mx-auto mb-4" />
        <h1 className="text-3xl font-bold text-gray-800 mb-4">
          Subscription Successful!
        </h1>
        <p className="text-gray-600 mb-6">
          Thank you for subscribing! Your plan is now active, and you can enjoy
          all the features included in your chosen subscription.
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

export default SubscriptionSuccess;
