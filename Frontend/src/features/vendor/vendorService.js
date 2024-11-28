import axios from 'axios';

const API_URL = 'https://vastufy.site/api/vendor';

export const loginVendor = async (credentials) => {
    const response = await axios.post(`${API_URL}/login`, credentials);
    return response;
  };

export const uploadLicense = async (licenseData) => {
  console.log(licenseData,"🤣");
  const response = await axios.post(`${API_URL}/uploadlicense`, licenseData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response;
};

export const getLicense = async(id)=>{
  console.log(id,"this is my vendor id");
  const response = await axios.get(`${API_URL}/license/${id}`);
  return response;
}


export const addVendorProperty = async (formDataToSend, vendorId) => {
  try {
    const response = await axios.post(`${API_URL}/addproperty?vendorId=${vendorId}`, formDataToSend, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response;
  } catch (error) {
    console.error("Error in addVendorProperty:", error);
    throw error;
  }
};

export const updateVendorProperty = async (propertyId, vendorId, formDataToSend) => {
  console.log("Sending FormData:", propertyId, vendorId, formDataToSend);
  try {
    const response = await axios.put(
      `${API_URL}/edit-property/${propertyId}?vendorId=${vendorId}`, // Include vendorId as a query parameter
      formDataToSend,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return response;
  } catch (error) {
    console.error("Error in updateVendorProperty:", error);
    throw error;
  }
};



  const vendorService = {
    loginVendor,
    uploadLicense,
    getLicense,
    addVendorProperty,
    updateVendorProperty
  };

  export default vendorService;