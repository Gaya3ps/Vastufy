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

const VendorProfile = () => {
  const dispatch = useDispatch();
  

  // Get vendor and license from state
  const { vendor } = useSelector((state) => ({
    vendor: state.vendor.vendor,
  }));

  console.log(vendor,"heyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyy");

  
  // Fetch license on component mount
  useEffect(() => {
    dispatch(fetchLicense(vendor.id));
  }, [dispatch, vendor.id]); // Add vendor.id to the dependency array

  // Form validation schema
  const validationSchema = Yup.object({
    name: Yup.string().required("Required"),
    mobileNumber: Yup.string().required("Required"),
    address: Yup.string().required("Required"),
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
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <VendorSidebar />

      {/* Main content */}
      <div className="flex-1 p-6 bg-gray-100">
        <div className="flex justify-end mb-6">
          <VendorHeader />
        </div>

        <h2 className="text-2xl font-bold mb-4">My Profile</h2>
        <p className="mb-6">
          Fill in the details that are accurate and up-to-date.
        </p>

        <div className="flex space-x-8">
          {/* Profile Details Display */}
          <div className="flex-1 bg-white p-6 rounded-lg shadow mb-4">
            <h3 className="text-xl font-semibold mb-4">Profile Details</h3>
            <p>
              <strong>Name:</strong> {vendor?.name}
            </p>
            <p>
              <strong>Email:</strong> {vendor?.email}
            </p>
            <p>
              <strong>Mobile Number:</strong> {vendor?.mobileNumber}
            </p>
            <p>
              <strong>License Number:</strong>{" "}
              {vendor?.license ? vendor.license.licenseNumber : "N/A"}
            </p>
            <p>
              <strong>Address:</strong> {vendor?.address}
            </p>
          </div>

          {/* Contact Information Form */}
          <div className="flex-1 bg-white p-6 rounded-lg shadow">
            <form onSubmit={formik.handleSubmit}>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block mb-1 font-medium">Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formik.values.name}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className={`w-full border ${
                      formik.touched.name && formik.errors.name
                        ? "border-red-500"
                        : "border-gray-300"
                    } p-2 rounded`}
                  />
                  {formik.touched.name && formik.errors.name && (
                    <div className="text-red-500">{formik.errors.name}</div>
                  )}
                </div>

                <div>
                  <label className="block mb-1 font-medium">
                    Mobile Number
                  </label>
                  <input
                    type="text"
                    name="mobileNumber"
                    value={formik.values.mobileNumber}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className={`w-full border ${
                      formik.touched.mobileNumber && formik.errors.mobileNumber
                        ? "border-red-500"
                        : "border-gray-300"
                    } p-2 rounded`}
                  />
                  {formik.touched.mobileNumber &&
                    formik.errors.mobileNumber && (
                      <div className="text-red-500">
                        {formik.errors.mobileNumber}
                      </div>
                    )}
                </div>
              </div>

              <div className="mb-4">
                <label className="block mb-1 font-medium">Address</label>
                <textarea
                  name="address"
                  value={formik.values.address}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className={`w-full border ${
                    formik.touched.address && formik.errors.address
                      ? "border-red-500"
                      : "border-gray-300"
                  } p-2 rounded`}
                  rows="3"
                />
                {formik.touched.address && formik.errors.address && (
                  <div className="text-red-500">{formik.errors.address}</div>
                )}
              </div>

              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  className="bg-gray-500 text-white px-4 py-2 rounded"
                >
                  Change Password
                </button>
                <button
                  type="submit"
                  className="bg-blue-500 text-white px-4 py-2 rounded"
                >
                  Update Profile
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
