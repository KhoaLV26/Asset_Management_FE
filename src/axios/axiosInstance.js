import axios from "axios";
import {
  getToken,
  getRefreshToken,
  setTokens,
  removeTokens,
} from "../contexts/AuthContext";
import { message } from "antd";

const axiosInstance = axios.create({
  baseURL: process.env.REACT_APP_BASE_URL,
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
          `${process.env.REACT_APP_BASE_URL}/auths/refresh-token`,
          { refreshToken: refreshTokenCookie }
        );
        const { token, refreshToken, user } = response.data.data;
        setTokens(token, refreshToken, user);
        axiosInstance.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${token}`;
        originalRequest.headers["Authorization"] = `Bearer ${token}`;
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
