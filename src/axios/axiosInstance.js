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

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });

  failedQueue = [];
};

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
  (error) => {
    const originalRequest = error.config;

    if (
      error.response &&
      error.response.status === 401 &&
      !originalRequest._retry
    ) {
      if (isRefreshing) {
        return new Promise(function (resolve, reject) {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = "Bearer " + token;
            return axiosInstance(originalRequest);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      const refreshToken = getRefreshToken();

      if (!refreshToken) {
        removeTokens();
        window.location.href = "/login";
        return Promise.reject(new Error("No refresh token available"));
      }

      return new Promise((resolve, reject) => {
        axios
          .post(`${process.env.REACT_APP_BASE_URL}/auths/refresh-token`, {
            refreshToken,
          })
          .then(({ data }) => {
            const { token, refreshToken: newRefreshToken, user } = data.data;
            setTokens(token, newRefreshToken, user);
            axiosInstance.defaults.headers.common[
              "Authorization"
            ] = `Bearer ${token}`;
            originalRequest.headers.Authorization = `Bearer ${token}`;
            processQueue(null, token);
            resolve(axiosInstance(originalRequest));
          })
          .catch((err) => {
            processQueue(err, null);
            removeTokens();
            window.location.href = "/login";
            reject(err);
          })
          .finally(() => {
            isRefreshing = false;
          });
      });
    } else if (error.response && error.response.status === 403) {
      message.error("You are not authorized to perform this action");
      removeTokens();
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
