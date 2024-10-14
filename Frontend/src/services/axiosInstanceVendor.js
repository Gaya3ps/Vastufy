import axios from 'axios';
import Cookies from 'js-cookie';

const axiosInstanceVendor = axios.create({
    baseURL: 'http://localhost:5000/api/vendor',
    headers: {
      'Content-Type': 'application/json',
    },
    withCredentials: true, 

  });


axiosInstanceVendor.interceptors.request.use(
  (config) => {
    const token = Cookies.get('tokenvendor');
    console.log("tokenvendor",token);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log('Token in request:', config.headers.Authorization);

    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);


axiosInstanceVendor.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      console.error('Unauthorized access:', error);
    }
    return Promise.reject(error);
  }
);

export default axiosInstanceVendor;
