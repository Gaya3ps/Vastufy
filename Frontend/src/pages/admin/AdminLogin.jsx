
import React from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { loginAdmin } from "../../features/admin/adminslice";
import { toast, Toaster } from "sonner";
import logo from '../../assets/logo3.jpg'

const AdminLogin = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const validationSchema = Yup.object().shape({
    email: Yup.string()
      .email("Invalid email format")
      .required("Email is required"),
    password: Yup.string().required("Password is required"),
  });

  return (
    <section
      className="flex items-center justify-center min-h-screen bg-cover bg-center"
      style={{
        backgroundImage: 'url("/adminLogo4.jpeg")', // Replace with your background image URL
      }}
    >
      {/* Semi-transparent overlay */}
      <div className="absolute inset-0 bg-black opacity-30"></div>

      {/* Content Container */}
      <div className="relative z-10 flex w-4/5 max-w-5xl p-6 bg-[#f9fafb] shadow-lg rounded-lg">
        {/* Left Side: Logo Section */}
        <div className="flex flex-col items-center justify-center w-2/5 p-8 bg-gray-100 rounded-l-lg">
          <img
            src={logo} // Replace with your logo URL
            alt="Logo"
            className="w-32 h-32 mb-4"
          />
          <h1 className="text-2xl font-bold text-gray-800">Welcome Back!</h1>
          <p className="mt-2 text-center text-gray-600">
          Exclusive access for effective platform administration.
          </p>
        </div>

        {/* Divider */}
        <div className="flex items-center justify-center px-2">
          <div className="h-32 w-0.5 bg-black"></div>
        </div>

        {/* Right Side: Form Section */}
        <div className="flex flex-col justify-center w-3/5 p-8">
          <h1 className="mb-4 text-2xl font-bold text-center text-gray-900">
            Admin Login
          </h1>
          <Formik
            initialValues={{ email: "", password: "" }}
            validationSchema={validationSchema}
            onSubmit={(values, { setSubmitting }) => {
              dispatch(loginAdmin(values))
                .then((response) => {
                  if (response.meta.requestStatus === "fulfilled") {
                    toast.success("Admin login success");
                    navigate("/admin/dashboard");
                  } else {
                    toast.error("Login failed");
                  }
                  setSubmitting(false);
                })
                .catch((err) => {
                  console.error("Error during dispatch:", err);
                  setSubmitting(false);
                });
            }}
          >
            {({ isSubmitting }) => (
              <Form className="space-y-6">
                <div>
                  <label
                    htmlFor="email"
                    className="block mb-2 text-sm font-medium text-gray-700"
                  >
                    Your email
                  </label>
                  <Field
                    type="email"
                    name="email"
                    id="email"
                    className="w-full p-3 bg-gray-50 border border-gray-300 rounded-lg focus:ring-primary-600 focus:border-primary-600"
                    placeholder="name@company.com"
                    required
                  />
                  <ErrorMessage
                    name="email"
                    component="div"
                    className="mt-1 text-sm text-red-500"
                  />
                </div>
                <div>
                  <label
                    htmlFor="password"
                    className="block mb-2 text-sm font-medium text-gray-700"
                  >
                    Password
                  </label>
                  <Field
                    type="password"
                    name="password"
                    id="password"
                    placeholder="••••••••"
                    className="w-full p-3 bg-gray-50 border border-gray-300 rounded-lg focus:ring-primary-600 focus:border-primary-600"
                    required
                  />
                  <ErrorMessage
                    name="password"
                    component="div"
                    className="mt-1 text-sm text-red-500"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-3 text-white transition-colors duration-300 bg-[#155e75] hover:bg-[#0891b2] focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm text-center"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Signing in..." : "Sign in"}
                </button>
              </Form>
            )}
          </Formik>
        </div>
      </div>
      <Toaster />
    </section>
  );
};

export default AdminLogin;
