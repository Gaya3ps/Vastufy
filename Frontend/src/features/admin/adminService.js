import axios from "axios";

const API_URL = 'https://vastufy.onrender.com/api/admin';

const adminLogin = async (credentials) => {
    try {
      const response = await axios.post(`${API_URL}/login`, credentials);
      console.log('iiiiiiiiiiiiiiiiiiiiii',response.data)
      return response.data;
    } catch (error) {
      console.error('Error during login:', error);
      throw error.response ? error.response.data : new Error('Server Error');
    }
  };


export default {adminLogin}