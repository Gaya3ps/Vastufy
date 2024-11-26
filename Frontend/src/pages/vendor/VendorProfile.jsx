import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useFormik } from "formik";
import * as Yup from "yup";
import VendorSidebar from "../../components/VendorSidebar";
import VendorHeader from "../../components/VendorHeader";
import {
  selectVendor,
  fetchLicense,
  updateVendorProfile,
} from "../../features/vendor/vendorSlice";
import { FiEdit, FiLock, FiCheckCircle, FiUser, FiMail, FiPhone, FiAward, FiMapPin } from "react-icons/fi";

const VendorProfile = () => {
  const dispatch = useDispatch();

  // Get vendor and license from state
  const { vendor } = useSelector((state) => ({
    vendor: state.vendor.vendor,
  }));

  // Fetch license on component mount
  useEffect(() => {
    dispatch(fetchLicense(vendor.id));
  }, [dispatch, vendor.id]);

  // Form validation schema
  const validationSchema = Yup.object({
    name: Yup.string().required("Name is required"),
    mobileNumber: Yup.string()
      .matches(/^[1-9]{1}[0-9]{9}$/, "Mobile number must be a valid 10-digit number starting with a non-zero digit.")
      .required("Mobile number is required"),
    address: Yup.string().required("Address is required"),
  });

  // Initialize Formik
  const formik = useFormik({
    initialValues: {
      name: vendor?.name || "",
      mobileNumber: vendor?.mobileNumber || "",
      address: vendor?.address || "",
    },
    validationSchema,
    onSubmit: async (values) => {
      const updatedVendor = {
        id: vendor._id,
        name: values.name,
        mobileNumber: values.mobileNumber,
        address: values.address,
      };

      dispatch(updateVendorProfile(updatedVendor));
    },
  });

  // Set form values when vendor data changes
  useEffect(() => {
    if (vendor) {
      formik.setValues({
        name: vendor.name,
        mobileNumber: vendor.mobileNumber,
        address: vendor.address,
      });
    }
  }, [vendor]);

  return (
    <div className="flex min-h-screen ">
      {/* Sidebar */}
      <VendorSidebar />

      {/* Main content */}
      <div className=" ml-64 flex-1 p-8 bg-gray-100">
        <div className="flex justify-end mb-6">
          <VendorHeader />
        </div>

        <h2 className="text-3xl font-bold mb-4 text-gray-800">My Profile</h2>
        <p className="mb-6 text-lg text-gray-600">
          Fill in the details that are accurate and up-to-date.
        </p>

        <div className="flex space-x-8">
          {/* Profile Details Display */}
          <div className="flex-1 bg-white p-6 rounded-lg shadow-lg mb-4 transition-all duration-300 ease-in-out transform hover:scale-105 min-h-[400px]">
            <h3 className="text-2xl font-semibold mb-4 text-gray-800">Profile Details</h3>
            <p className="mb-2 text-gray-600">
            <FiUser className="inline mr-2 text-gray-500" />
            <strong>Name:</strong> {vendor?.name}
            </p>
            <p className="mb-2 text-gray-600">
            <FiMail className="inline mr-2 text-gray-500" />
              <strong>Email:</strong> {vendor?.email}
            </p>
            <p className="mb-2 text-gray-600">
            <FiPhone className="inline mr-2 text-gray-500" />
              <strong>Mobile Number:</strong> {vendor?.mobileNumber}
            </p>
          <p className="mb-2 text-gray-600">
          <FiAward className="inline mr-2 text-gray-500" />
              <strong>License Number:</strong>{" "}
              {vendor?.license ? vendor.license.licenseNumber : "N/A"}
            </p>
            <p className="mb-2 text-gray-600">
            <FiMapPin className="inline mr-2 text-gray-500" />
              <strong>Address:</strong> {vendor?.address}
            </p>
          </div>

          {/* Contact Information Form */}
          <div className="flex-1 bg-white p-6 rounded-lg shadow-lg mb-4  transition-all duration-300 ease-in-out transform hover:scale-105 min-h-[400px]">
            <form onSubmit={formik.handleSubmit}>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  
                  <label className="block mb-1 font-medium text-gray-700">   <FiUser className="inline mr-2 text-gray-500" /> Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formik.values.name}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className={`w-full border-2 ${
                      formik.touched.name && formik.errors.name
                        ? "border-red-500"
                        : "border-gray-300"
                    } p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300`}
                  />
                  {formik.touched.name && formik.errors.name && (
                    <div className="text-red-500 text-sm mt-1">{formik.errors.name}</div>
                  )}
                </div>

                <div>
                  <label className="block mb-1 font-medium text-gray-700">
                  <FiPhone className="inline mr-2 text-gray-500" />
                    Mobile Number
                  </label>
                  <input
                    type="text"
                    name="mobileNumber"
                    value={formik.values.mobileNumber}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className={`w-full border-2 ${
                      formik.touched.mobileNumber && formik.errors.mobileNumber
                        ? "border-red-500"
                        : "border-gray-300"
                    } p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300`}
                  />
                  {formik.touched.mobileNumber &&
                    formik.errors.mobileNumber && (
                      <div className="text-red-500 text-sm mt-1">
                        {formik.errors.mobileNumber}
                      </div>
                    )}
                </div>
              </div>

              <div className="mb-4">
                <label className="block mb-1 font-medium text-gray-700">  <FiMapPin className="inline mr-2 text-gray-500" /> Address</label>
                <textarea
                  name="address"
                  value={formik.values.address}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className={`w-full border-2 ${
                    formik.touched.address && formik.errors.address
                      ? "border-red-500"
                      : "border-gray-300"
                  } p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300`}
                  rows="4"
                />
                {formik.touched.address && formik.errors.address && (
                  <div className="text-red-500 text-sm mt-1">{formik.errors.address}</div>
                )}
              </div>

              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  className="bg-gray-500 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-gray-600 transition-colors duration-200" >
                 <FiLock className="text-xl" />
                 <span>Change Password</span>
                </button>
                <button
                  type="submit"
                  className="bg-blue-500 text-white px-6 py-3 rounded-lg flex items-center space-x-2 hover:bg-blue-600 transition-colors duration-200"
                >
                 <FiCheckCircle className="text-xl" />
                 <span>Update Profile</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VendorProfile;
