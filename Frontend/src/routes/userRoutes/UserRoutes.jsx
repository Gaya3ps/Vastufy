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

const UserRoutes = () => {
  return (
    <>
      <Routes>
        <Route path="/landingpage" element={<LandingPage />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/otp-verification" element={<UserOtp />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="" element={<UserPrivateRoutes />}>
          {/* <Route path="/home" element={<Home />} /> */}
          <Route path="/profile" element={<UserProfile />} />
        </Route>
      </Routes>
    </>
  );
};

export default UserRoutes;
