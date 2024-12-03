import axios from "axios";
import Cookies from "js-cookie";

const baseURL = "https://vastufy.site/api/users";
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
