import React from 'react';
import { useDispatch } from 'react-redux';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { uploadLicense} from '../../features/vendor/vendorSlice';
import { useLocation, useNavigate } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import '../../components/styles/License.scss'

const License = () => {
  const location = useLocation();
  const email = location.state?.email;
  console.log(email);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      licenseNumber: '',
      email: email || '',
      issueDate: null,
      expiryDate: null,
      licenseDocument: null
    },
    validationSchema: Yup.object({
      licenseNumber: Yup.string().required('License number is required'),
      email: Yup.string().email('Invalid email address').required('Email is required'),
      issueDate: Yup.date().required('Issue date is required'),
      expiryDate: Yup.date().required('Expiry date is required'),
      licenseDocument: Yup.mixed().required('License document is required'),
      logo: Yup.mixed(), 
    }),
    onSubmit: async (values) => {
      const formData = new FormData();
      formData.append('licenseNumber', values.licenseNumber);
      formData.append('email', values.email);
      formData.append('issueDate', values.issueDate.toISOString());
      formData.append('expiryDate', values.expiryDate.toISOString());
      formData.append('licenseDocument', values.licenseDocument);


      try {
      await dispatch(uploadLicense(formData));
        navigate('/vendor/success');
      } catch (error) {
        console.error('Error uploading license:', error);
      }
    },
  });

  


  const inputClassNames = "mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:border-[#a39f74d6] sm:text-sm";

  return (
    <div className="max-w-3xl mx-auto mt-10 p-6 border rounded shadow">
      <h1 className="text-2xl font-bold mb-6">Upload Your Business License</h1>
      <form onSubmit={formik.handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="licenseNumber" className="block text-sm font-medium text-gray-700">
              License Number:
            </label>
            <input
              type="text"
              id="licenseNumber"
              name="licenseNumber"
              value={formik.values.licenseNumber}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              required
              className={inputClassNames}
            />
            {formik.touched.licenseNumber && formik.errors.licenseNumber ? (
              <div className="text-red-600">{formik.errors.licenseNumber}</div>
            ) : null}
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="text"
              id="email"
              name="email"
              value={email}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              readOnly 
              className={`${inputClassNames} bg-gray-100`}
            />
            {formik.touched.email && formik.errors.email ? (
              <div className="text-red-600">{formik.errors.email}</div>
            ) : null}
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="issueDate" className="block text-sm font-medium text-gray-700 ">
              Issue Date:
            </label>
            <DatePicker
              id="issueDate"
              selected={formik.values.issueDate}
              onChange={date => formik.setFieldValue('issueDate', date)}
              onBlur={formik.handleBlur}
              dateFormat="yyyy-MM-dd"
              className={`${inputClassNames} bg-white`}
            />
            {formik.touched.issueDate && formik.errors.issueDate ? (
              <div className="text-red-600">{formik.errors.issueDate}</div>
            ) : null}
          </div>
          <div>
            <label htmlFor="expiryDate" className="block text-sm font-medium text-gray-700">
              Expiry Date:
            </label>
            <DatePicker
              id="expiryDate"
              selected={formik.values.expiryDate}
              onChange={date => formik.setFieldValue('expiryDate', date)}
              onBlur={formik.handleBlur}
              dateFormat="yyyy-MM-dd"
              className={`${inputClassNames} bg-white`}
            />
            {formik.touched.expiryDate && formik.errors.expiryDate ? (
              <div className="text-red-600">{formik.errors.expiryDate}</div>
            ) : null}
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="licenseDocument" className="block text-sm font-medium text-gray-700">
              License Document:
            </label>
            <input
              type="file"
              id="licenseDocument"
              name="licenseDocument"
              accept=".pdf, .jpg, .png"
              onChange={(event) => {
                formik.setFieldValue('licenseDocument', event.currentTarget.files[0]);
              }}
              onBlur={formik.handleBlur}
              required
              className={inputClassNames}
            />
            {formik.touched.licenseDocument && formik.errors.licenseDocument ? (
              <div className="text-red-600">{formik.errors.licenseDocument}</div>
            ) : null}
          </div>
        </div>
        <div className="flex justify-center mt-4">
          <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-500">
            Upload License
          </button>
          {/* <button onClick={() => navigate('/vendor/success')}>Upload License</button> */}

        </div>
      </form>
    </div>
  );
};

export default License;
