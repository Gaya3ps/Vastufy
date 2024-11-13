// import axios from "axios";
// import Cookies from "js-cookie";
// import { jwtDecode } from "jwt-decode";
// const baseURL = "http://localhost:5000/api/users";
// const axiosInstanceUser = axios.create({
//   baseURL,
//   headers: {
//     "Content-Type": "application/json",
//   },
//   withCredentials: true,
// });

// axiosInstanceUser.interceptors.request.use(
//   (config) => {
//     const token = Cookies.get("token");
//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }
//     config.withCredentials = true;
//     console.log("Token added to request:", config.headers.Authorization);
//     return config;
//   },
//   (error) => {
//     return Promise.reject(error);
//   }
// );

// const checkTokenExpiry = (refreshTokenFunc) => {
//   const token = Cookies.get("token");
//   console.log("Token fetched from cookies:", token);

//   if (!token) {
//     console.log("No token found.");
//     return;
//   }

//   console.log("Checking token expiry...");
//   try {
//     const decoded = jwtDecode(token);
//     const currentTime = Math.floor(Date.now() / 1000);
//     console.log("Token expires in:", decoded.exp - currentTime, "seconds");

//     if (decoded.exp - currentTime < 300) {
//       console.log("Token about to expire. Refreshing token...");
//       refreshTokenFunc();
//     }
//   } catch (error) {
//     console.error("Error decoding token:", error);
//     refreshTokenFunc();
//   }
// };

// export const startTokenExpiryCheck = (refreshTokenFunc) => {
//   console.log("Starting token expiry check every 60 seconds...");
//   setInterval(() => {
//     console.log("Interval check running...");
//     checkTokenExpiry(refreshTokenFunc);
//   }, 60000);
// };

// export const setupInterceptors = (navigate, dispatch, logoutAction, toast) => {
//   const refreshToken = async () => {
//     try {
//       console.log("Refreshing token...");
//       const response = await axios.post(
//         `${baseURL}/refreshtoken`,
//         {},
//         { withCredentials: true }
//       );
//       console.log("Response from refresh token:", response);
//       const newAccessToken = response.data.accessToken;
//       Cookies.set("token", newAccessToken);
//       axiosInstanceUser.defaults.headers.Authorization = `Bearer ${newAccessToken}`;
//       console.log("New access token generated and saved:", newAccessToken);
//     } catch (refreshError) {
//       console.error("Token refresh failed", refreshError);
//       dispatch(logoutAction());
//       toast.error("Session expired. Please log in again.");
//       navigate("/login");
//     }
//   };

//   startTokenExpiryCheck(refreshToken);

//   axiosInstanceUser.interceptors.response.use(
//     (response) => {
//       return response;
//     },
//     async (error) => {
//       const originalRequest = error.config;
//       console.log("Response error:", error.response);
//       if (error.response) {
//         if (
//           error.response.status === 401 &&
//           error.response.data.message === "Token expired" &&
//           !originalRequest._retry
//         ) {
//           console.log("Token expired, attempting refresh...");
//           originalRequest._retry = true;
//           await refreshToken();
//           originalRequest.headers.Authorization = `Bearer ${Cookies.get(
//             "token"
//           )}`;
//           return axiosInstanceUser(originalRequest);
//         }
//         if (error.response.status === 403) {
//           console.log("403 error - Account blocked. Logging out.");
//           dispatch(logoutAction());
//           toast.error("Your account is blocked. Please contact support.");
//           navigate("/login");
//         }
//       }

//       return Promise.reject(error);
//     }
//   );
// };

// export default axiosInstanceUser;

import axios from "axios";
import Cookies from "js-cookie";

const baseURL = "http://localhost:5000/api/users";
const axiosInstanceUser = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

axiosInstanceUser.interceptors.request.use(
  (config) => {
    const token = Cookies.get("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    config.withCredentials = true;

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const setupInterceptors = (navigate, dispatch, logoutAction, toast) => {
  axiosInstanceUser.interceptors.response.use(
    (response) => {
      return response;
    },
    async (error) => {
      console.log(error);
      const originalRequest = error.config;
      if (error.response) {
        console.error("Response Error:", error.response.data);
        console.error("Status Code:", error.response.status);
        console.error("Headers:", error.response.headers);

        if (
          error.response &&
          error.response.status === 401 &&
          error.response.data.message === "Token expired" &&
          !originalRequest._retry
        ) {
          originalRequest._retry = true;

          try {
            console.log("inside try", baseURL);
            const response = await axios.post(
              `${baseURL}/refreshtoken`,
              {},
              { withCredentials: true }
            );

            const accessToken = response.data.accessToken;

            Cookies.set("token", accessToken);

            axiosInstanceUser.defaults.headers.Authorization = `Bearer ${accessToken}`;
            originalRequest.headers.Authorization = `Bearer ${accessToken}`;

            return axiosInstanceUser(originalRequest);
          } catch (refreshError) {
            console.log(refreshError);
            dispatch(logoutAction());
            toast.error("Session expired. Please log in again.");
            navigate("/login");
          }
        }
      }
      return Promise.reject(error);
    }
  );
};

export default axiosInstanceUser;
