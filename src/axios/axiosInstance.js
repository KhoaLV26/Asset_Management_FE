import axios from "axios";
import {
  getToken,
  getRefreshToken,
  setTokens,
  removeTokens,
} from "../contexts/AuthContext";
import { message } from "antd";

const axiosInstance = axios.create({
  baseURL: "http://localhost:5012/api",
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => {
    console.log(response);
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    console.log(
      error.response +
        "\n" +
        error.response.status +
        "\n" +
        !originalRequest._retry
    );
    if (
      error.response &&
      error.response.status === 401 &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;
      try {
        const refreshTokenCookie = getRefreshToken();
        if (!refreshTokenCookie) {
          throw new Error("No refresh token available");
        }
        const response = await axios.post(
          "http://localhost:5012/api/auths/refresh-token",
          { refreshToken: refreshTokenCookie }
        );
        const { newToken, newRefreshToken, role, userId } = response.data.data;
        setTokens(newToken, newRefreshToken, role, userId);
        axiosInstance.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${newToken}`;
        originalRequest.headers["Authorization"] = `Bearer ${newToken}`;
        return axiosInstance(originalRequest);
      } catch (err) {
        message.error("Session expired. Please log in again.");
        removeTokens();
        window.location.href = "/login";
        return Promise.reject(err);
      }
    } else if (error.response && error.response.status === 403) {
      message.error("You are not authorized to perform this action");
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
