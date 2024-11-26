import Signup from "../../pages/user/Signup";
import { Route, Routes, useNavigate } from "react-router";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
// import Home from "../../pages/user/Home";
import UserOtp from "../../pages/user/UserOtp";
import LoginPage from "../../pages/user/LoginPage";
import ForgotPassword from "../../pages/user/ForgotPassword";
import ResetPassword from "../../pages/user/ResetPassword";
import UserPrivateRoutes from "./UserPrivateRoutes";
import UserProfile from "../../pages/user/UserProfile";
import LandingPage from "../../pages/user/LandingPage";
import Properties from "../../pages/user/Properties";
import PropertyDetails from "../../pages/user/PropertyDetails";
import BookingDetails from "../../pages/user/BookingDetails";
import ChatPage from "../../pages/user/ChatPage";
import ChatsList from "../../pages/user/ChatsList";
import UserChat from "../../pages/user/UserChat";
import AboutUs from "../../pages/user/AboutUs";
import Services from "../../pages/user/Services";

const UserRoutes = () => {
  return (
    <>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/otp-verification" element={<UserOtp />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="" element={<UserPrivateRoutes />}>
          {/* <Route path="/home" element={<Home />} /> */}
          <Route path="/profile" element={<UserProfile />} />
          <Route path ="/properties" element = {<Properties/>} />
          <Route path ="/propertydetails/:propertyId" element = {<PropertyDetails/>} />
          <Route path ="/bookingdetails" element = {<BookingDetails/>} />
          <Route path ="/chat/:chatId" element ={<ChatPage/>} />
          <Route path ="/chatList" element ={<ChatsList/>} />
          <Route path ="/userChat/:chatId" element ={<UserChat/>} />
          <Route path ="/aboutus" element ={<AboutUs/>} />
          <Route path ="/services" element ={<Services/>} />






        </Route>
      </Routes>
    </>
  );
};

export default UserRoutes;
