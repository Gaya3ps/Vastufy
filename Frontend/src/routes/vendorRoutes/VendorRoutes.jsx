import { Route, Routes, Navigate } from "react-router";
import VendorSignup from "../../pages/vendor/VendorSignup";
import VendorOtp from "../../pages/vendor/VendorOtp";
import Login from "../../pages/vendor/Login";
import License from "../../pages/vendor/License";
import SuccessPage from "../../components/SuccessPage";
import VendorHome from "../../pages/vendor/VendorHome";
import VendorProfile from "../../pages/vendor/VendorProfile";
import AddProperty from "../../pages/vendor/AddProperty";
import PropertyList from "../../pages/vendor/PropertyList";
import Bookings from "../../pages/vendor/Bookings";
import EditProperty from "../../pages/vendor/EditProperty";
import Chats from "../../pages/vendor/Chats";
import Chat from "../../pages/vendor/Chat";
import Subscriptions from "../../pages/vendor/Subscriptions";
import SubscriptionSuccess from "../../pages/vendor/SubscriptionSuccess";
import SubscriptionFailure from "../../pages/vendor/SubscriptionFailure";

const VendorRoutes = () => {
  return (
    <>
      <Routes>
        <Route path="/signup" element={<VendorSignup />} />
        <Route path="/otp-verification" element={<VendorOtp />} />
        <Route path="/login" element={<Login />} />
        <Route path="/uploadlicense" element={<License />} />
        <Route path="/success" element={<SuccessPage />} />
        <Route path="/home" element={<VendorHome />} />
        <Route path="/profile" element={<VendorProfile />} />
        <Route path="/add-property" element={<AddProperty />} />
        <Route path="/propertylist" element={<PropertyList />} />
        <Route path="/bookings" element={<Bookings />} />
        <Route path="/edit-property/:id" element={<EditProperty />} />
        <Route path="/chats" element={<Chats />} />
        <Route path="/chat" element={<Chat />} />
        <Route path ="/subscriptions" element={<Subscriptions />} /> 
        <Route path = "/subscription-success" element ={<SubscriptionSuccess/>} />
        <Route path = "/subscription-failed" element ={<SubscriptionFailure/>} />

      </Routes>
    </>
  );
};

export default VendorRoutes;
