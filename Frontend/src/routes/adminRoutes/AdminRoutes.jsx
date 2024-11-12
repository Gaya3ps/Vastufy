import AdminPrivateRoutes from "./AdminPrivateRoutes";
import { Route, Routes } from "react-router";
import AdminLogin from "../../pages/admin/AdminLogin";
import Dashboard from "../../pages/admin/Dashboard";
import UserList from "../../pages/admin/UserList";
import VendorList from "../../pages/admin/VendorList";
import VendorVerify from "../../pages/admin/VendorVerify";
import VendorDetail from "../../pages/admin/VendorDetail";
import Category from "../../pages/admin/Category";
import Properties from "../../pages/admin/Properties";
import PropertyVerify from "../../pages/admin/PropertyVerify";
import PropertyDetail from "../../pages/admin/PropertyDetail";
import SubscriptionPlans from "../../pages/admin/SubscriptionPlans";
const AdminRoutes = () => {
  return (
    <>
      <Routes>
        <Route path="/login" element={<AdminLogin />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/userlist" element={<UserList />} />
        <Route path="/vendorlist" element={<VendorList />} />
        <Route path="/vendorverify" element={<VendorVerify />} />
        <Route path="/vendor/:vendorId" element={<VendorDetail />} />
        <Route path="/category" element={<Category />} />
        <Route path="/properties" element={<Properties />} />
        <Route path ="/propertyverify" element={<PropertyVerify/>} />
        <Route path ="/property/:propertyId" element ={<PropertyDetail/>} />
        <Route path ="/subscriptionplans" element ={<SubscriptionPlans/>} />
      </Routes>
    </>
  );
};

export default AdminRoutes;
