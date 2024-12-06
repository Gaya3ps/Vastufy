// import React from 'react';

// function Subscriptions() {
//   const subscriptions = [
//     {
//       name: "Free",
//       price: "$0",
//       platformFee: "10% Platform Fee",
//       features: [
//         "Admin/Instructors",
//         "Sell Live Courses",
//         "Sell Live Workshops",
//         "Accept All Credit Cards",
//         "Unlimited Live Courses",
//         "Unlimited Members",
//         "Zoom Integration",
//         "Slack Integration",
//         "Waitlist/Application Support",
//       ],
//       isAvailable: [true, true, true, true, true, true, true, true, false, false],
//     },
//     {
//       name: "Pro",
//       price: "$75",
//       platformFee: "0% Platform Fee",
//       features: [
//         "Admin/Instructors ($25/month additional)",
//         "Sell Live Courses",
//         "Sell Live Workshops",
//         "Accept All Credit Cards",
//         "Unlimited Live Courses",
//         "Unlimited Members",
//         "Zoom Integration",
//         "Slack Integration",
//         "Zapier Integration",
//         "Waitlist/Application Support",
//       ],
//       isAvailable: [true, true, true, true, true, true, true, true, true, true],
//     },
//     {
//       name: "Enterprise",
//       price: "$499",
//       platformFee: "0% Platform Fee",
//       features: [
//         "Admin/Instructors ($25/month additional)",
//         "Sell Live Courses",
//         "Sell Live Workshops",
//         "Accept All Credit Cards",
//         "Unlimited Live Courses",
//         "Unlimited Members",
//         "Zoom Integration",
//         "Slack Integration",
//         "Zapier Integration",
//         "Waitlist/Application Support",
//       ],
//       isAvailable: [true, true, true, true, true, true, true, true, true, true],
//     },
//   ];

//   return (
//     <div className="flex flex-col md:flex-row justify-center items-center space-y-6 md:space-y-0 md:space-x-6 py-10">
//       {subscriptions.map((plan, index) => (
//         <div
//           key={index}
//           className={`w-full max-w-sm bg-white rounded-lg shadow-lg p-6 text-center border ${index === 1 ? 'border-blue-500' : 'border-gray-300'} transform transition-transform duration-300 hover:scale-105`}
//         >
//           <h3 className={`text-2xl font-semibold mb-2 ${index === 1 ? 'text-blue-600' : 'text-gray-700'}`}>
//             {plan.name}
//           </h3>
//           <div className="text-4xl font-bold mb-2">{plan.price}</div>
//           <div className="text-sm text-gray-500 mb-4">{plan.platformFee}</div>
//           <button className="bg-blue-500 text-white font-semibold py-2 px-4 rounded-lg mb-6 hover:bg-blue-600 transition-colors duration-200">
//             Get Early Access
//           </button>
//           <ul className="space-y-2 text-left">
//             {plan.features.map((feature, i) => (
//               <li key={i} className="flex items-center">
//                 <span className={`inline-block w-4 h-4 mr-2 rounded-full ${plan.isAvailable[i] ? 'bg-blue-500' : 'bg-gray-300'}`}></span>
//                 <span className={`${plan.isAvailable[i] ? 'text-gray-700' : 'text-gray-400 line-through'}`}>
//                   {feature}
//                 </span>
//               </li>
//             ))}
//           </ul>
//         </div>
//       ))}
//     </div>
//   );
// }

// export default Subscriptions;

import React, { useEffect, useState } from "react";
import VendorSidebar from "../../components/VendorSidebar";
import axiosInstanceVendor from "../../services/axiosInstanceVendor";
import { useSelector } from "react-redux";
import { selectVendor } from "../../features/vendor/vendorSlice";
import { loadStripe } from "@stripe/stripe-js";

const stripePromise = loadStripe(
  "pk_test_51QKKwmHFsAGtjjxLeGzy4wKu9FMcRj4czM3xAos2DHD7QDuLkjdHbt883mopCbuGbWzQezi3DXWzEKILL8QAExcV00ZD0GtqJV"
);

function Subscriptions() {
  const [subscriptions, setSubscriptions] = useState([]);
  const [subscribedPlan, setSubscribedPlan] = useState(null);
  const vendor = useSelector(selectVendor);
  const vendorId = vendor.id;

  useEffect(() => {
    // Fetch listed subscription plans
    const fetchSubscriptions = async () => {
      try {
        const response = await axiosInstanceVendor.get(
          "/listed-subscription-plans"
        );
        console.log(response.data, "Subscription Plans Retrieved");
        setSubscriptions(response.data);
      } catch (error) {
        console.error("Failed to fetch subscription plans:", error);
      }
    };

    // Fetch the vendor's subscribed plan
    const fetchSubscribedPlan = async () => {
      try {
        const response = await axiosInstanceVendor.get(
          `/subscribed-plan/${vendorId}`
        );
        console.log(response.data, "1111111111111111111");

        setSubscribedPlan(response.data); // Set subscribed plan data
      } catch (error) {
        console.error("Failed to fetch subscribed plan:", error);
      }
    };

    fetchSubscriptions();
    fetchSubscribedPlan(); // Fetch the subscribed plan after loading subscriptions
  }, [vendorId]);

  // Function to handle the 'BUY' button click
  const handleBuy = async (plan) => {
    try {
      const response = await axiosInstanceVendor.post(
        "/create-stripe-session",
        {
          subscriptionId: plan._id, // Subscription ID
          planName: plan.planName, // Subscription Plan Name
          price: plan.price, // Subscription Price
          vendorId: vendorId, // Vendor ID
        }
      );
      const stripe = await stripePromise;
      if (stripe) {
        await stripe.redirectToCheckout({ sessionId: response.data.sessionId });
      } else {
        console.error("Stripe.js failed to load.");
      }
    } catch (error) {
      console.error("Failed to create Stripe session:", error);
    }
  };

  return (
    <div className="flex">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-md">
        <VendorSidebar />
      </div>

      {/* Main Content */}
      <div className="flex-1 p-10">
        <h1 className="text-3xl font-bold text-[#B85042] mb-8 text-center">
          Subscription Plans
        </h1>


        <div className="flex flex-col md:flex-row justify-center items-center space-y-6 md:space-y-0 md:space-x-6">
          {subscriptions.map((plan, index) => (
            <div
              key={index}
              className="w-full max-w-sm bg-white rounded-lg shadow-lg p-6 text-center border border-gray-300 transform transition-transform duration-300 hover:scale-105 h-[500px] flex flex-col"
            >
              <h3 className="text-2xl font-semibold mb-2 text-gray-700">
                {plan.planName}
              </h3>
              <div className="text-4xl font-bold mb-2">₹{plan.price}</div>
              <div className="text-sm text-gray-500 mb-4">
                {plan.platformFee || "0% Platform Fee"}
              </div>
              <div className="text-center">
                <button
                  onClick={() => handleBuy(plan)}
                  className="bg-blue-800 text-white font-semibold py-2 px-4 rounded-lg mb-6 hover:bg-blue-600 transition-colors duration-200 w-24 "
                >
                  BUY
                </button>
              </div>
              <ul className="space-y-3 text-left">
                {plan.features[0]
                  .split("\n")
                  .map((feature) => feature.trim()) // Trim each feature
                  .filter((feature) => feature !== "") // Remove empty features
                  .map((feature, i) => (
                    <li key={i} className="flex items-start">
                      <span className="inline-block w-3 h-3 mr-3 mt-1.5 rounded-full bg-blue-800 flex-shrink-0"></span>
                      <span className="text-gray-700 leading-relaxed">
                        {feature.trim()}
                      </span>
                    </li>
                  ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Subscribed Plan */}
        {subscribedPlan ? (
  <div className="mt-10 text-center">
    <h2 className="text-2xl font-semibold text-gray-800 mb-4">
      Your Subscribed Plan
    </h2>
    <div className="w-full max-w-md mx-auto bg-green-100 rounded-lg shadow-lg p-6 text-center border border-green-300">
      <h3 className="text-xl font-semibold text-gray-700">
        {subscribedPlan.subscription.planName}
      </h3>
      <div className="text-2xl font-bold text-green-700 mt-2">
        ₹{subscribedPlan.subscription.price}
      </div>
      <div className="text-sm text-gray-600 mt-4">
        <strong>Subscription ID:</strong> {subscribedPlan._id}
      </div>
      <div className="text-sm text-gray-600 mt-2">
        <strong>Purchase Date:</strong>{" "}
        {new Date(subscribedPlan.purchaseDate).toLocaleDateString()}
      </div>
    </div>
  </div>
) : (
  // Show Free Trial Card if no subscription
<div className="flex justify-center mt-10"> {/* This centers the card */}
  <div className="w-full max-w-sm bg-white rounded-lg shadow-lg p-6 mb-8 text-center border border-gray-300">
    <h3 className="text-2xl font-semibold mb-2 text-gray-700">Free Trial</h3>
    <div className="text-4xl font-bold mb-2">₹0</div>
    <div className="text-sm text-gray-500 mb-4">No platform fee</div>
    <div className="text-center mb-4">
      <button className="bg-green-600 text-white font-semibold py-2 px-4 rounded-lg mb-6 hover:bg-green-500 transition-colors duration-200 w-32">
      You're on a Free Trial!
      </button>
    </div>
    <ul className="space-y-3 text-left">
      <li className="flex items-start">
        <span className="inline-block w-3 h-3 mr-3 mt-1.5 rounded-full bg-blue-800 flex-shrink-0"></span>
        <span className="text-gray-700 leading-relaxed">
          Vendors can list 2 properties for free!!
        </span>
      </li>
      <li className="flex items-start">
        <span className="inline-block w-3 h-3 mr-3 mt-1.5 rounded-full bg-blue-800 flex-shrink-0"></span>
        <span className="text-gray-700 leading-relaxed">
          Full access to all features
        </span>
      </li>
      <li className="flex items-start">
        <span className="inline-block w-3 h-3 mr-3 mt-1.5 rounded-full bg-blue-800 flex-shrink-0"></span>
        <span className="text-gray-700 leading-relaxed">
          No credit card required
        </span>
      </li>
    </ul>
  </div>
</div>
)}
      </div>
    </div>
  );
}

export default Subscriptions;
