import React, { useEffect, useState } from "react";
import VendorSidebar from "../../components/VendorSidebar";
import VendorHeader from "../../components/VendorHeader";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCheckCircle,
  faCloudUploadAlt,
  faExclamationTriangle,
} from "@fortawesome/free-solid-svg-icons";
import axiosInstanceVendor from "../../services/axiosInstanceVendor";
import { useDispatch, useSelector } from "react-redux";
import {
  addVendorProperty,
  selectVendor,
} from "../../features/vendor/vendorSlice";
import { useNavigate } from "react-router-dom";

// Validation Schemas for each form
const BasicSchema = Yup.object().shape({
  propertyType: Yup.string().required("Property Type is required"),
  expectedPrice: Yup.number()
    .required("Expected Price is required")
    .positive("Price must be a positive number"),
  title: Yup.string().required("Title is required"),
  description: Yup.string().required("Description is required"),
  category: Yup.string().required("Category is required"),
  subcategory: Yup.string().required("Subcategory is required"),
  ownershipStatus: Yup.string().required("Ownership status is required"),
  availableStatus: Yup.string().required("Available status is required"),
  saletype: Yup.string().required("Sale Type is required"), // Validation for Sale Type
  ageofproperty: Yup.string().required("Age of property is required"), // Validation for Age of Property
});

const LocationSchema = Yup.object().shape({
  country: Yup.string().notRequired(), // Not required but validated for structure
  state: Yup.string().notRequired(),
  district: Yup.string().required("District is required"),
  city: Yup.string().required("City is required"),
  locality: Yup.string().required("Locality is required"),
  zip: Yup.string()
    .required("Zip code is required")
    .matches(/^\d{6}$/, "Zip code must be exactly 6 digits"),
  address: Yup.string().required("Address is required"),
  landmark: Yup.string().required("Landmark is required"),
});

const MediaSchema = Yup.object().shape({
  media: Yup.mixed().required("Media is required"),
});

const DetailSchema = Yup.object().shape({
  carpetArea: Yup.number()
    .required("Carpet Area is required")
    .positive("Carpet Area must be a positive number")
    .integer("Carpet Area must be an integer"),
  builtUpArea: Yup.number()
    .required("Built Up Area is required")
    .positive("Built Up Area must be a positive number")
    .integer("Built Up Area must be an integer"),
  plotArea: Yup.number()
    .required("Plot Area is required")
    .positive("Plot Area must be a positive number")
    .integer("Plot Area must be an integer"),
  washrooms: Yup.string().required("Please select the number of washrooms"),
  bedrooms: Yup.number().required("No. of Bedrooms is required"),
  balconies: Yup.number().required("No. of Balconies is required"),
  furnishingStatus: Yup.string().required("Furnishing Status is required"),
  powerBackup: Yup.string().required("Power Backup is required"),
  roadAccessibility: Yup.string().required("Road Accessibility is required"),
  totalFloors: Yup.number()
    .required("Total Floors is required")
    .positive("Total Floors must be a positive number")
    .integer("Total Floors must be an integer"),
  floorNo: Yup.number()
    .required() // Optional field
    .positive("Floor No must be a positive number")
    .integer("Floor No must be an integer"),
  parking: Yup.string().required("Parking status is required"),
});

const AmenitiesSchema = Yup.object().shape({
  amenities: Yup.array()
    .min(1, "Select at least one location advantage")
    .required("Location advantages are required"),
});

function UpgradeModal({ onClose, onUpgrade }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 transition-opacity duration-300 ease-in-out">
      <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md mx-4 text-center transform transition-transform duration-500 ease-out scale-105 hover:scale-100">
        <div className="flex flex-col items-center">
          <div className="bg-yellow-100 p-4 rounded-full shadow-md mb-4">
            <FontAwesomeIcon
              icon={faExclamationTriangle}
              className="text-yellow-600 text-4xl"
            />
          </div>
          <h2 className="text-2xl font-bold mb-4 text-gray-800">
            Upgrade Required
          </h2>
          <p className="text-gray-600 mb-6 text-sm leading-relaxed">
            You have reached your maximum property listings. Upgrade your plan
            to add more properties and unlock new features.
          </p>
          <div className="flex justify-between gap-4 mt-6 w-full">
            <button
              onClick={onClose}
              className="flex-1 bg-gray-200 text-gray-700 py-2 rounded-lg shadow-md hover:bg-gray-300 transition-colors duration-200"
            >
              Cancel
            </button>
            <button
              onClick={onUpgrade}
              className="flex-1 bg-blue-600 text-white py-2 rounded-lg shadow-md hover:bg-blue-700 transition-colors duration-200"
            >
              Upgrade
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function AddProperty() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const vendor = useSelector(selectVendor);
  const vendorId = vendor.id;

  const [step, setStep] = useState(1); // Tracks the current step
  const [formData, setFormData] = useState({}); // Stores all form data
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false); // Tracks modal visibility
  const [categories, setCategories] = useState([]); // Store categories
  const [subcategories, setSubcategories] = useState([]); // Store subcategories
  const [mediaPreviews, setMediaPreviews] = useState([]);
  const [subscriptionData, setSubscriptionData] = useState(null);
  const [isLimitReached, setIsLimitReached] = useState(false);
  const [loading, setLoading] = useState(false);
 

  useEffect(() => {
    const fetchVendorSubscription = async () => {
      try {
        // Fetch the vendor's subscription data on page load
        const response = await axiosInstanceVendor.get(
          `/getVendorSubscription/${vendorId}`
        );
        const { maxListings, listingsUsed } = response.data;
        console.log(response.data, "Fetched subscription data");

        setSubscriptionData(response.data);

        // Check if the vendor has reached their listing limit
        if (listingsUsed >= maxListings) {
          setIsLimitReached(true);
          // alert("You have reached your maximum property listings. Please upgrade your plan to add more properties.");
          // Optional: Redirect to upgrade page if limit is reached
          // navigate("/vendor/upgrade");
        }
      } catch (error) {
        console.error("Error fetching subscription data:", error);
      }
    };

    fetchVendorSubscription();
  }, [vendorId, navigate]);

  // Handlers for the upgrade modal buttons
  const handleCancel = () => navigate("/vendor/home");
  const handleUpgrade = () => navigate("/vendor/subscriptions");

  // if (isLimitReached) {
  //   return <UpgradeModal onClose={handleCancel} onUpgrade={handleUpgrade} />;
  // }

  //   fetch categories
  const fetchCategories = async () => {
    try {
      const response = await axiosInstanceVendor.get(`/categories`);
      setCategories(response.data.categories);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const fetchSubCategories = async () => {
    try {
      const response = await axiosInstanceVendor.get("/subcategories");
      setSubcategories(response.data.subCategories);
    } catch (error) {
      console.error("Error fetching subcategories:", error);
    }
  };

  useEffect(() => {
    fetchCategories();
    fetchSubCategories();
  }, []);

  // Function to move to the next step
  const nextStep = (values) => {
    setFormData({ ...formData, ...values });
    setStep(step + 1);
  };

  // Function to move to the previous step
  const previousStep = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  // Final submit function with FormData handling
  const handleFinalSubmit = async (values) => {
    if (!subscriptionData) {
      console.error("Subscription data not available");
      return;
    }

    // Combine form data and selected vendorId
    const finalFormData = { ...formData, ...values };
    console.log("Its final dataaaaaaa:", finalFormData);

    // Initialize FormData for media and other fields
    const formDataToSend = new FormData();
    Object.keys(finalFormData).forEach((key) => {
      if (Array.isArray(finalFormData[key])) {
        finalFormData[key].forEach((item) => formDataToSend.append(key, item));
      } else {
        formDataToSend.append(key, finalFormData[key]);
      }
    });

    // Handle media files if present
    if (values.media && values.media.length > 0) {
      values.media.forEach((file) => {
        formDataToSend.append("media", file);
      });
    }
    setLoading(true);
    setIsSuccessModalOpen(true); 

    try {
      // Dispatch the form data and vendorId separately
      await dispatch(addVendorProperty({ formDataToSend, vendorId }));
      setIsSuccessModalOpen(true); // Open success modal
    } catch (error) {
      console.error("Error submitting property:", error);
    }
  };

  const handleFileChange = (event, setFieldValue) => {
    const files = Array.from(event.currentTarget.files);
    setFieldValue("media", files);
    const previews = files.map((file) => URL.createObjectURL(file));
    setMediaPreviews(previews);
  };

  // Function to render the current form based on step
  const renderForm = () => {
    switch (step) {
      case 1:
        return (
          <Formik
            initialValues={{
              propertyType: "",
              expectedPrice: "",
              title: "",
              description: "",
              category: "",
              subcategory: "",
              ownershipStatus: "",
              availableStatus: "",
              saletype: "", // New field for Sale Type
              ageofproperty: "", // New field for Age of Property
            }}
            validationSchema={BasicSchema}
            onSubmit={(values, { setSubmitting }) => {
              nextStep(values);
              setSubmitting(false);
            }}
          >
            {({ isSubmitting, values, setFieldValue }) => (
              <Form className="space-y-8">
                {/* Two-column grid layout */}
                <div className="grid grid-cols-2 gap-6">
                  {/* Left column */}
                  <div className="space-y-6">
                    {/* Property Info Section */}
                    <div className="bg-white shadow-md p-6 rounded-lg">
                      <h2 className="text-xl font-semibold mb-4">
                        Property Info
                      </h2>
                      <div>
                        <label className="block text-sm font-medium mb-1">
                          Rent or Sell
                        </label>
                        <Field
                          as="select"
                          name="propertyType"
                          className="w-full border p-2 text-sm"
                        >
                          <option value="">Select Property Type</option>
                          <option value="sell">Sell</option>
                          <option value="rent">Rent</option>
                        </Field>
                        <ErrorMessage
                          name="propertyType"
                          component="div"
                          className="text-red-500 text-xs"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-1">
                          What kind of property do you have?
                        </label>
                        <Field
                          as="select"
                          name="category"
                          className="w-full border p-2 text-sm"
                          onChange={(e) => {
                            setFieldValue("category", e.target.value);
                            setFieldValue("subcategory", ""); // Reset subcategory when category changes
                          }}
                        >
                          <option value="">Select Category</option>
                          {categories.map((category) => (
                            <option key={category._id} value={category._id}>
                              {category.name}
                            </option>
                          ))}
                        </Field>
                        <ErrorMessage
                          name="category"
                          component="div"
                          className="text-red-500 text-xs"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-1">
                          Property Type
                        </label>
                        <Field
                          as="select"
                          name="subcategory"
                          className="w-full border p-2 text-sm"
                        >
                          <option value="">Select Subcategory</option>
                          {subcategories
                            .filter(
                              (subcat) => subcat.categoryId === values.category
                            )
                            .map((subcategory) => (
                              <option
                                key={subcategory._id}
                                value={subcategory.name}
                              >
                                {subcategory.name}
                              </option>
                            ))}
                        </Field>
                        <ErrorMessage
                          name="subcategory"
                          component="div"
                          className="text-red-500 text-xs"
                        />
                      </div>
                    </div>

                    {/* Property Description Section */}
                    <div className="bg-white shadow-md p-6 rounded-lg">
                      <h2 className="text-xl font-semibold mb-4">
                        Property Description
                      </h2>
                      <div>
                        <label className="block text-sm font-medium mb-1">
                          Title
                        </label>
                        <Field
                          type="text"
                          name="title"
                          className="w-full border p-2 text-sm"
                        />
                        <ErrorMessage
                          name="title"
                          component="div"
                          className="text-red-500 text-xs"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">
                          Description
                        </label>
                        <Field
                          as="textarea"
                          name="description"
                          className="w-full border p-2 text-sm"
                        />
                        <ErrorMessage
                          name="description"
                          component="div"
                          className="text-red-500 text-xs"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Right column */}
                  <div className="space-y-6">
                    {/* Property Price Section */}
                    <div className="bg-white shadow-md p-6 rounded-lg">
                      <h2 className="text-xl font-semibold mb-4">
                        Property Price
                      </h2>
                      <div>
                        <label className="block text-sm font-medium mb-1">
                          Expected Price
                        </label>
                        <Field
                          type="number"
                          name="expectedPrice"
                          className="w-full border p-2 text-sm"
                        />
                        <ErrorMessage
                          name="expectedPrice"
                          component="div"
                          className="text-red-500 text-xs"
                        />
                      </div>
                    </div>

                    {/* Property Status Section */}
                    <div className="bg-white shadow-md p-6 rounded-lg">
                      <h2 className="text-xl font-semibold mb-4">
                        Select Property Status
                      </h2>
                      <div>
                        <label className="block text-sm font-medium mb-1">
                          Ownership Status
                        </label>
                        <Field
                          as="select"
                          name="ownershipStatus"
                          className="w-full border p-2 text-sm"
                        >
                          <option value="">Select Ownership Status</option>
                          <option value="single">Single</option>
                          <option value="joint">Joint</option>
                        </Field>
                        <ErrorMessage
                          name="ownershipStatus"
                          component="div"
                          className="text-red-500 text-xs"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-1">
                          Sale Type
                        </label>
                        <Field
                          as="select"
                          name="saletype"
                          className="w-full border p-2 text-sm"
                        >
                          <option value="">Select Sale Type</option>
                          <option value="new">New</option>
                          <option value="resale">Resale</option>
                        </Field>
                        <ErrorMessage
                          name="Sale type"
                          component="div"
                          className="text-red-500 text-xs"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-1">
                          Available Status
                        </label>
                        <Field
                          as="select"
                          name="availableStatus"
                          className="w-full border p-2 text-sm"
                        >
                          <option value="">Select Availability</option>
                          <option value="Ready to move">Ready to move</option>
                          <option value="Under construction">
                            Under construction
                          </option>
                        </Field>
                        <ErrorMessage
                          name="availableStatus"
                          component="div"
                          className="text-red-500 text-xs"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-1">
                          Age of property
                        </label>
                        <Field
                          as="select"
                          name="ageofproperty"
                          className="w-full border p-2 text-sm"
                        >
                          <option value="">Select Age of Property</option>
                          <option value="0-1 year">0-1 year</option>
                          <option value="1-5 years">1-5 years</option>
                          <option value="5-10 years">5-10 years</option>
                          <option value="10+ years">10+ years</option>
                        </Field>
                        <ErrorMessage
                          name="ageofproperty"
                          component="div"
                          className="text-red-500 text-xs"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end mt-4">
                  <button
                    type="submit"
                    className="bg-blue-500 text-white py-2 px-4 rounded"
                    disabled={isSubmitting}
                  >
                    Next →
                  </button>
                </div>
              </Form>
            )}
          </Formik>
        );

      case 2:
        return (
          <Formik
            initialValues={{
              country: "India",
              state: "Kerala",
              district: "",
              city: "",
              locality: "",
              zip: "",
              address: "",
              landmark: "",
            }}
            validationSchema={LocationSchema}
            onSubmit={(values, { setSubmitting }) => {
              nextStep(values); // Move to the next step
              setSubmitting(false); // Stop submission spinner
            }}
          >
            {({ isSubmitting, setFieldValue }) => (
              <Form className="space-y-6">
                <div className="bg-white shadow-md p-6 rounded-lg">
                  <h2 className="text-xl font-semibold mb-4">
                    Listing Location
                  </h2>
                  <p className="text-sm text-gray-600 mb-4">
                    Add the location of your property here. Select your country,
                    state, district, locality, etc.
                  </p>

                  {/* Two-column layout for country and state */}
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Country
                      </label>
                      <Field
                        type="text"
                        name="country"
                        className="w-full border p-2 text-sm"
                        value="India"
                        readOnly
                      />
                      <ErrorMessage
                        name="country"
                        component="div"
                        className="text-red-500 text-xs"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-1">
                        State
                      </label>
                      <Field
                        type="text"
                        name="state"
                        className="w-full border p-2 text-sm"
                        value="Kerala"
                        readOnly
                      />
                      <ErrorMessage
                        name="state"
                        component="div"
                        className="text-red-500 text-xs"
                      />
                    </div>
                  </div>

                  {/* District field as a dropdown */}
                  <div className="mt-4">
                    <label className="block text-sm font-medium mb-1">
                      District
                    </label>
                    <Field
                      as="select"
                      name="district"
                      className="w-full border p-2 text-sm"
                      onChange={(e) =>
                        setFieldValue("district", e.target.value)
                      }
                    >
                      <option value="">Select District</option>
                      <option value="Thiruvananthapuram">
                        Thiruvananthapuram
                      </option>
                      <option value="Kollam">Kollam</option>
                      <option value="Pathanamthitta">Pathanamthitta</option>
                      <option value="Alappuzha">Alappuzha</option>
                      <option value="Kottayam">Kottayam</option>
                      <option value="Idukki">Idukki</option>
                      <option value="Ernakulam">Ernakulam</option>
                      <option value="Thrissur">Thrissur</option>
                      <option value="Palakkad">Palakkad</option>
                      <option value="Malappuram">Malappuram</option>
                      <option value="Kozhikode">Kozhikode</option>
                      <option value="Wayanad">Wayanad</option>
                      <option value="Kannur">Kannur</option>
                      <option value="Kasaragod">Kasaragod</option>
                    </Field>
                    <ErrorMessage
                      name="district"
                      component="div"
                      className="text-red-500 text-xs"
                    />
                  </div>

                  {/* City field */}
                  <div className="mt-4">
                    <label className="block text-sm font-medium mb-1">
                      City
                    </label>
                    <Field
                      type="text"
                      name="city"
                      className="w-full border p-2 text-sm"
                      placeholder="Enter your city"
                    />
                    <ErrorMessage
                      name="city"
                      component="div"
                      className="text-red-500 text-xs"
                    />
                  </div>

                  {/* Locality field */}
                  <div className="mt-4">
                    <label className="block text-sm font-medium mb-1">
                      Locality
                    </label>
                    <Field
                      type="text"
                      name="locality"
                      className="w-full border p-2 text-sm"
                      placeholder="Enter your locality"
                    />
                    <ErrorMessage
                      name="locality"
                      component="div"
                      className="text-red-500 text-xs"
                    />
                  </div>

                  {/* Zip/Postal Code field */}
                  <div className="mt-4">
                    <label className="block text-sm font-medium mb-1">
                      Zip / Postal Code
                    </label>
                    <Field
                      type="text"
                      name="zip"
                      className="w-full border p-2 text-sm"
                      placeholder="Enter postal code"
                    />
                    <ErrorMessage
                      name="zip"
                      component="div"
                      className="text-red-500 text-xs"
                    />
                  </div>

                  {/* Address field */}
                  <div className="mt-4">
                    <label className="block text-sm font-medium mb-1">
                      Address
                    </label>
                    <Field
                      as="textarea"
                      name="address"
                      className="w-full border p-2 text-sm"
                      rows="3"
                      placeholder="Enter full address"
                    />
                    <ErrorMessage
                      name="address"
                      component="div"
                      className="text-red-500 text-xs"
                    />
                  </div>

                  {/* Landmark field */}
                  <div className="mt-4">
                    <label className="block text-sm font-medium mb-1">
                      Landmark
                    </label>
                    <Field
                      type="text"
                      name="landmark"
                      className="w-full border p-2 text-sm"
                      placeholder="Enter landmark"
                    />
                    <ErrorMessage
                      name="landmark"
                      component="div"
                      className="text-red-500 text-xs"
                    />
                  </div>

                  {/* Navigation buttons */}
                  <div className="flex justify-between mt-6">
                    <button
                      type="button"
                      onClick={previousStep}
                      className="bg-gray-500 text-white py-2 px-4 rounded"
                    >
                      ← Back
                    </button>
                    <button
                      type="submit"
                      className="bg-blue-500 text-white py-2 px-4 rounded"
                      disabled={isSubmitting}
                    >
                      Next →
                    </button>
                  </div>
                </div>
              </Form>
            )}
          </Formik>
        );
      case 3:
        return (
          <Formik
            initialValues={{ media: [] }}
            validationSchema={MediaSchema}
            onSubmit={(values, { setSubmitting }) => {
              nextStep(values);
              setSubmitting(false);
            }}
          >
            {({ isSubmitting, setFieldValue }) => (
              <Form className="space-y-8">
                <div className="grid grid-cols-2 gap-8">
                  <div className="bg-white shadow-md p-6 rounded-lg">
                    <h2 className="text-xl font-semibold text-gray-700 mb-4">
                      Upload photos of your property
                    </h2>
                    <p className="text-sm text-gray-600 mb-4">
                      Upload photos of max size 2MB in format png, jpg, jpeg
                    </p>
                    <div className="border-dashed border-2 border-gray-300 p-6 text-center rounded-lg">
                      <div className="text-gray-500 mb-4">
                        <FontAwesomeIcon
                          icon={faCloudUploadAlt}
                          className="text-2xl"
                        />
                      </div>
                      <input
                        type="file"
                        name="media"
                        multiple
                        className="w-full border border-gray-300 p-2 mt-2 rounded-lg text-sm text-gray-600"
                        onChange={(event) =>
                          handleFileChange(event, setFieldValue)
                        }
                      />
                      <ErrorMessage
                        name="media"
                        component="div"
                        className="text-red-500 text-xs mt-2"
                      />
                    </div>
                    {mediaPreviews.length > 0 && (
                      <div className="mt-4 grid grid-cols-4 gap-4">
                        {mediaPreviews.map((preview, index) => (
                          <div key={index} className="border p-2 rounded">
                            <img
                              src={preview}
                              alt={`Preview ${index + 1}`}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex justify-between mt-8">
                  <button
                    type="button"
                    onClick={previousStep}
                    className="bg-gray-500 text-white py-2 px-4 rounded"
                  >
                    ← Back
                  </button>
                  <button
                    type="submit"
                    className={`${
                      isSubmitting
                        ? "bg-blue-400"
                        : "bg-blue-500 hover:bg-blue-600"
                    } text-white py-2 px-6 rounded-lg`}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Submitting..." : "Next →"}
                  </button>
                </div>
              </Form>
            )}
          </Formik>
        );
      case 4:
        return (
          <Formik
            initialValues={{
              carpetArea: "",
              builtUpArea: "",
              plotArea: "",
              washrooms: "",
              bedrooms: "",
              balconies: "",
              furnishingStatus: "",
              powerBackup: "",
              roadAccessibility: "",
              totalFloors: "",
              floorNo: "",
              parking: "",
            }}
            validationSchema={DetailSchema} // Adjust validation schema accordingly
            onSubmit={(values, { setSubmitting }) => {
              nextStep(values);
              setSubmitting(false);
            }}
          >
            {({ isSubmitting }) => (
              <Form className="space-y-6">
                <div className="bg-white shadow-md p-6 rounded-lg">
                  <h2 className="text-xl font-semibold mb-4">Listing Detail</h2>
                  <p className="text-sm text-gray-600 mb-4">
                    Specify the information of your property listing in detail
                    according to the type of your property (Flat/Apartment,
                    House/Villa, Land, Office etc.)
                  </p>

                  {/* Three-column grid layout for Carpet, Built Up, Plot Area */}
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Carpet Area (only numbers)
                      </label>
                      <div className="flex">
                        <Field
                          type="number"
                          name="carpetArea"
                          className="w-full border p-2"
                          placeholder="1000"
                        />
                        <span className="ml-2 p-2">sq.ft.</span>
                      </div>
                      <ErrorMessage
                        name="carpetArea"
                        component="div"
                        className="text-red-500 text-xs"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Built Up Area (only numbers)
                      </label>
                      <div className="flex">
                        <Field
                          type="number"
                          name="builtUpArea"
                          className="w-full border p-2"
                          placeholder="1000"
                        />
                        <span className="ml-2 p-2">sq.ft.</span>
                      </div>
                      <ErrorMessage
                        name="builtUpArea"
                        component="div"
                        className="text-red-500 text-xs"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Plot Area (only numbers)
                      </label>
                      <div className="flex">
                        <Field
                          type="number"
                          name="plotArea"
                          className="w-full border p-2"
                          placeholder="1000"
                        />
                        <span className="ml-2 p-2">cents</span>
                      </div>
                      <ErrorMessage
                        name="plotArea"
                        component="div"
                        className="text-red-500 text-xs"
                      />
                    </div>
                  </div>

                  {/* Additional fields for Bedrooms, Bathrooms, Balconies */}
                  <div className="grid grid-cols-3 gap-4 mt-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        No. of Bedrooms
                      </label>
                      <Field
                        type="number"
                        name="bedrooms"
                        className="w-full border p-2"
                        placeholder="3"
                      />
                      <ErrorMessage
                        name="bedrooms"
                        component="div"
                        className="text-red-500 text-xs"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-1">
                        No. of Washrooms
                      </label>
                      <Field
                        type="number"
                        name="washrooms"
                        className="w-full border p-2"
                        placeholder="2"
                      />
                      <ErrorMessage
                        name="washrooms"
                        component="div"
                        className="text-red-500 text-xs"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Balconies
                      </label>
                      <Field
                        type="number"
                        name="balconies"
                        className="w-full border p-2"
                        placeholder="2"
                      />
                      <ErrorMessage
                        name="balconies"
                        component="div"
                        className="text-red-500 text-xs"
                      />
                    </div>
                  </div>

                  {/* Furnishing, Power Backup, Road Accessibility */}
                  <div className="grid grid-cols-3 gap-4 mt-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Furnishing Status
                      </label>
                      <Field
                        as="select"
                        name="furnishingStatus"
                        className="w-full border p-2"
                      >
                        <option value="">Select Furnishing Status</option>
                        <option value="unfurnished">Unfurnished</option>
                        <option value="semifurnished">Semi Furnished</option>
                        <option value="furnished">Furnished</option>
                      </Field>
                      <ErrorMessage
                        name="furnishingStatus"
                        component="div"
                        className="text-red-500 text-xs"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Power Backup
                      </label>
                      <Field
                        as="select"
                        name="powerBackup"
                        className="w-full border p-2"
                      >
                        <option value="">Select Power Backup</option>
                        <option value="none">None</option>
                        <option value="partial">Partial</option>
                        <option value="full">Full</option>
                      </Field>
                      <ErrorMessage
                        name="powerBackup"
                        component="div"
                        className="text-red-500 text-xs"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Road Accessibility
                      </label>
                      <Field
                        as="select"
                        name="roadAccessibility"
                        className="w-full border p-2"
                      >
                        <option value="">Select Road Accessibility</option>
                        <option value="car">Car</option>
                        <option value="two wheeler">Two Wheeler</option>
                        <option value="heavy vehicle">Heavy Vehicle</option>
                        <option value="none">None</option>
                      </Field>
                      <ErrorMessage
                        name="roadAccessibility"
                        component="div"
                        className="text-red-500 text-xs"
                      />
                    </div>
                  </div>

                  {/* Two-column grid layout for Washrooms, Total Floors */}
                  <div className="grid grid-cols-2 gap-4 mt-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Total Floors
                      </label>
                      <Field
                        type="number"
                        name="totalFloors"
                        className="w-full border p-2"
                        placeholder="1"
                      />
                      <ErrorMessage
                        name="totalFloors"
                        component="div"
                        className="text-red-500 text-xs"
                      />
                    </div>
                  </div>

                  {/* Two-column grid layout for Floor No, Parking */}
                  <div className="grid grid-cols-2 gap-4 mt-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Your Floor No{" "}
                      </label>
                      <Field
                        type="number"
                        name="floorNo"
                        className="w-full border p-2"
                        placeholder="3"
                      />
                      <ErrorMessage
                        name="floorNo"
                        component="div"
                        className="text-red-500 text-xs"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Parking
                      </label>
                      <Field
                        as="select"
                        name="parking"
                        className="w-full border p-2"
                      >
                        <option value="">Select Parking Status</option>
                        <option value="notavailable">Not Available</option>
                        <option value="available">Available</option>
                      </Field>
                      <ErrorMessage
                        name="parking"
                        component="div"
                        className="text-red-500 text-xs"
                      />
                    </div>
                  </div>

                  {/* Navigation buttons */}
                  <div className="flex justify-between mt-6">
                    <button
                      type="button"
                      onClick={previousStep}
                      className="bg-gray-500 text-white py-2 px-4 rounded"
                    >
                      ← Back
                    </button>
                    <button
                      type="submit"
                      className="bg-blue-500 text-white py-2 px-4 rounded"
                      disabled={isSubmitting}
                    >
                      Next →
                    </button>
                  </div>
                </div>
              </Form>
            )}
          </Formik>
        );
      case 5:
        return (
          <Formik
            initialValues={{
              amenities: [], // Initialize as an empty array
              locationAdvantages: [], // Initialize as an empty array
            }}
            validationSchema={AmenitiesSchema}
            onSubmit={(values) => handleFinalSubmit(values)}
          >
            {({ isSubmitting, setFieldValue, values }) => (
              <Form className="space-y-6">
                {/* Amenities Section */}
                <div className="bg-white shadow-md p-6 rounded-lg">
                  <h2 className="text-xl font-semibold mb-4">Amenities</h2>
                  <p className="text-sm text-gray-600 mb-4">
                    Select the amenities of the property that you want to add,
                    from below.
                  </p>

                  <div className="grid grid-cols-2 gap-4">
                    {/* Left Column */}
                    <div>
                      <div className="flex items-center mb-2">
                        <Field
                          type="checkbox"
                          name="amenities"
                          value="Security"
                          className="mr-2"
                          checked={values.amenities?.includes("Security")} // Safe navigation operator
                          onChange={(e) => {
                            const newAmenities = e.target.checked
                              ? [...(values.amenities || []), e.target.value]
                              : (values.amenities || []).filter(
                                  (item) => item !== e.target.value
                                );
                            setFieldValue("amenities", newAmenities);
                          }}
                        />
                        <label>Security</label>
                      </div>

                      <div className="flex items-center mb-2">
                        <Field
                          type="checkbox"
                          name="amenities"
                          value="Reserved Parking"
                          className="mr-2"
                          checked={values.amenities?.includes(
                            "Reserved Parking"
                          )} // Safe navigation operator
                          onChange={(e) => {
                            const newAmenities = e.target.checked
                              ? [...(values.amenities || []), e.target.value]
                              : (values.amenities || []).filter(
                                  (item) => item !== e.target.value
                                );
                            setFieldValue("amenities", newAmenities);
                          }}
                        />
                        <label>Reserved Parking</label>
                      </div>

                      <div className="flex items-center mb-2">
                        <Field
                          type="checkbox"
                          name="amenities"
                          value="Visitor Parking"
                          className="mr-2"
                          checked={values.amenities?.includes(
                            "Visitor Parking"
                          )} // Safe navigation operator
                          onChange={(e) => {
                            const newAmenities = e.target.checked
                              ? [...(values.amenities || []), e.target.value]
                              : (values.amenities || []).filter(
                                  (item) => item !== e.target.value
                                );
                            setFieldValue("amenities", newAmenities);
                          }}
                        />
                        <label>Visitor Parking</label>
                      </div>

                      <div className="flex items-center mb-2">
                        <Field
                          type="checkbox"
                          name="amenities"
                          value="WiFi"
                          className="mr-2"
                          checked={values.amenities?.includes("WiFi")} // Safe navigation operator
                          onChange={(e) => {
                            const newAmenities = e.target.checked
                              ? [...(values.amenities || []), e.target.value]
                              : (values.amenities || []).filter(
                                  (item) => item !== e.target.value
                                );
                            setFieldValue("amenities", newAmenities);
                          }}
                        />
                        <label>WiFi</label>
                      </div>
                    </div>

                    {/* Right Column */}
                    <div>
                      <div className="flex items-center mb-2">
                        <Field
                          type="checkbox"
                          name="amenities"
                          value="R O Water System"
                          className="mr-2"
                          checked={values.amenities?.includes(
                            "R O Water System"
                          )} // Safe navigation operator
                          onChange={(e) => {
                            const newAmenities = e.target.checked
                              ? [...(values.amenities || []), e.target.value]
                              : (values.amenities || []).filter(
                                  (item) => item !== e.target.value
                                );
                            setFieldValue("amenities", newAmenities);
                          }}
                        />
                        <label>R O Water System</label>
                      </div>

                      <div className="flex items-center mb-2">
                        <Field
                          type="checkbox"
                          name="amenities"
                          value="Vastu Compliance"
                          className="mr-2"
                          checked={values.amenities?.includes(
                            "Vastu Compliance"
                          )} // Safe navigation operator
                          onChange={(e) => {
                            const newAmenities = e.target.checked
                              ? [...(values.amenities || []), e.target.value]
                              : (values.amenities || []).filter(
                                  (item) => item !== e.target.value
                                );
                            setFieldValue("amenities", newAmenities);
                          }}
                        />
                        <label>Vastu Compliance</label>
                      </div>

                      <div className="flex items-center mb-2">
                        <Field
                          type="checkbox"
                          name="amenities"
                          value="Intercom"
                          className="mr-2"
                          checked={values.amenities?.includes("Intercom")} // Safe navigation operator
                          onChange={(e) => {
                            const newAmenities = e.target.checked
                              ? [...(values.amenities || []), e.target.value]
                              : (values.amenities || []).filter(
                                  (item) => item !== e.target.value
                                );
                            setFieldValue("amenities", newAmenities);
                          }}
                        />
                        <label>Intercom</label>
                      </div>

                      <div className="flex items-center mb-2">
                        <Field
                          type="checkbox"
                          name="amenities"
                          value="Gas Pipe Line"
                          className="mr-2"
                          checked={values.amenities?.includes("Gas Pipe Line")} // Safe navigation operator
                          onChange={(e) => {
                            const newAmenities = e.target.checked
                              ? [...(values.amenities || []), e.target.value]
                              : (values.amenities || []).filter(
                                  (item) => item !== e.target.value
                                );
                            setFieldValue("amenities", newAmenities);
                          }}
                        />
                        <label>Gas Pipe Line</label>
                      </div>

                      <div className="flex items-center mb-2">
                        <Field
                          type="checkbox"
                          name="amenities"
                          value="Centralized AC"
                          className="mr-2"
                          checked={values.amenities?.includes("Centralized AC")} // Safe navigation operator
                          onChange={(e) => {
                            const newAmenities = e.target.checked
                              ? [...(values.amenities || []), e.target.value]
                              : (values.amenities || []).filter(
                                  (item) => item !== e.target.value
                                );
                            setFieldValue("amenities", newAmenities);
                          }}
                        />
                        <label>Centralized AC</label>
                      </div>
                    </div>
                  </div>

                  <ErrorMessage
                    name="amenities"
                    component="div"
                    className="text-red-500 text-xs"
                  />
                </div>

                {/* Location Advantages Section */}
                <div className="bg-white shadow-md p-6 rounded-lg">
                  <h2 className="text-xl font-semibold mb-4">
                    Location Advantages
                  </h2>
                  <p className="text-sm text-gray-600 mb-4">
                    Select the major landmarks within 5 km surroundings of the
                    property that you want to add, from below.
                  </p>

                  <div className="grid grid-cols-2 gap-4">
                    {/* Left Column */}
                    <div>
                      <div className="flex items-center mb-2">
                        <Field
                          type="checkbox"
                          name="locationAdvantages"
                          value="School"
                          className="mr-2"
                          checked={values.locationAdvantages?.includes(
                            "School"
                          )} // Safe navigation operator
                          onChange={(e) => {
                            const newLocationAdvantages = e.target.checked
                              ? [
                                  ...(values.locationAdvantages || []),
                                  e.target.value,
                                ]
                              : (values.locationAdvantages || []).filter(
                                  (item) => item !== e.target.value
                                );
                            setFieldValue(
                              "locationAdvantages",
                              newLocationAdvantages
                            );
                          }}
                        />
                        <label>School</label>
                      </div>

                      <div className="flex items-center mb-2">
                        <Field
                          type="checkbox"
                          name="locationAdvantages"
                          value="Hospital"
                          className="mr-2"
                          checked={values.locationAdvantages?.includes(
                            "Hospital"
                          )} // Safe navigation operator
                          onChange={(e) => {
                            const newLocationAdvantages = e.target.checked
                              ? [
                                  ...(values.locationAdvantages || []),
                                  e.target.value,
                                ]
                              : (values.locationAdvantages || []).filter(
                                  (item) => item !== e.target.value
                                );
                            setFieldValue(
                              "locationAdvantages",
                              newLocationAdvantages
                            );
                          }}
                        />
                        <label>Hospital</label>
                      </div>

                      <div className="flex items-center mb-2">
                        <Field
                          type="checkbox"
                          name="locationAdvantages"
                          value="Air Port"
                          className="mr-2"
                          checked={values.locationAdvantages?.includes(
                            "Air Port"
                          )} // Safe navigation operator
                          onChange={(e) => {
                            const newLocationAdvantages = e.target.checked
                              ? [
                                  ...(values.locationAdvantages || []),
                                  e.target.value,
                                ]
                              : (values.locationAdvantages || []).filter(
                                  (item) => item !== e.target.value
                                );
                            setFieldValue(
                              "locationAdvantages",
                              newLocationAdvantages
                            );
                          }}
                        />
                        <label>Air Port</label>
                      </div>
                    </div>

                    {/* Right Column */}
                    <div>
                      <div className="flex items-center mb-2">
                        <Field
                          type="checkbox"
                          name="locationAdvantages"
                          value="Shopping Mall"
                          className="mr-2"
                          checked={values.locationAdvantages?.includes(
                            "Shopping Mall"
                          )} // Safe navigation operator
                          onChange={(e) => {
                            const newLocationAdvantages = e.target.checked
                              ? [
                                  ...(values.locationAdvantages || []),
                                  e.target.value,
                                ]
                              : (values.locationAdvantages || []).filter(
                                  (item) => item !== e.target.value
                                );
                            setFieldValue(
                              "locationAdvantages",
                              newLocationAdvantages
                            );
                          }}
                        />
                        <label>Shopping Mall</label>
                      </div>

                      <div className="flex items-center mb-2">
                        <Field
                          type="checkbox"
                          name="locationAdvantages"
                          value="Railway Station"
                          className="mr-2"
                          checked={values.locationAdvantages?.includes(
                            "Railway Station"
                          )} // Safe navigation operator
                          onChange={(e) => {
                            const newLocationAdvantages = e.target.checked
                              ? [
                                  ...(values.locationAdvantages || []),
                                  e.target.value,
                                ]
                              : (values.locationAdvantages || []).filter(
                                  (item) => item !== e.target.value
                                );
                            setFieldValue(
                              "locationAdvantages",
                              newLocationAdvantages
                            );
                          }}
                        />
                        <label>Railway Station</label>
                      </div>
                    </div>
                  </div>

                  <ErrorMessage
                    name="locationAdvantages"
                    component="div"
                    className="text-red-500 text-xs"
                  />
                </div>

                <div className="flex justify-between mt-6">
                  <button
                    type="button"
                    onClick={previousStep}
                    className="bg-gray-500 text-white py-2 px-4 rounded"
                  >
                    ← Back
                  </button>
                  <button
                    type="submit"
                    className="bg-blue-500 text-white py-2 px-4 rounded"
                    disabled={loading}
                  >

                   {loading ? "Submitting..." : "Submit Property"}
                  </button>
                </div>
              </Form>
            )}
          </Formik>
        );
      default:
        return null;
    }
  };
  // here

  // Progress header to indicate current step
  const progressHeaders = [
    { label: "1. Basic", step: 1 },
    { label: "2. Location", step: 2 },
    { label: "3. Media", step: 3 },
    { label: "4. Detail", step: 4 },
    { label: "5. Amenities", step: 5 },
  ];

  return (
    <div className="min-h-screen flex ">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-md min-h-screen">
        <VendorSidebar />
      </div>

      {/* Main Content */}
      <div className="ml-8 p-6 flex-1 bg-gray-100">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Add Property</h1>
          <VendorHeader />
        </div>

        {/* Render UpgradeModal if limit is reached */}
        {isLimitReached && (
          <UpgradeModal onClose={handleCancel} onUpgrade={handleUpgrade} />
        )}

        {/* Progress Header */}
        <div className="flex justify-between mb-8">
          {progressHeaders.map((header) => (
            <div
              key={header.step}
              className={`py-2 px-4 rounded-lg font-semibold cursor-pointer ${
                step === header.step
                  ? "bg-[#B85042] text-white"
                  : "bg-gray-200 text-gray-600"
              }`}
            >
              {header.label}
            </div>
          ))}
        </div>

        {/* Dynamic Form Based on Step */}
        <div className="bg-white shadow-lg rounded-lg p-8">{renderForm()}</div>

        {/* Success Modal */}
        {isSuccessModalOpen && (
          <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg flex items-center flex-col">
              <FontAwesomeIcon
                icon={faCheckCircle}
                className="text-green-500 text-4xl mb-4"
              />
              <h2 className="text-2xl font-bold mb-4">
                Property Added Successfully!
              </h2>
              <p>Your property has been added.</p>
              <button
                onClick={() => {
                  setIsSuccessModalOpen(false);
                  navigate("/vendor/propertylist");
                }}
                className="mt-4 px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default AddProperty;
