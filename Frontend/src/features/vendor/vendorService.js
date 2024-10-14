import axios from 'axios';

const API_URL = 'http://localhost:5000/api/vendor';

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


  const vendorService = {
    loginVendor,
    uploadLicense,
    getLicense,
    addVendorProperty
  };

  export default vendorService;