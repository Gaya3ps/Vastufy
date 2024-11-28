// services/authService.js
import axios from 'axios';

const API_URL = 'https://vastufy.onrender.com/api/users';


export const login = async (credentials) => {
  const response = await axios.post(`${API_URL}/login`, credentials);
  console.log("login service response",response.data);
  return response;
};



const authService = {
  login
};

export default authService;

