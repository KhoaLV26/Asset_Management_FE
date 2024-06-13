import { createContext, useEffect, useState } from "react";
import axiosInstance from "../axios/axiosInstance";


export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({
    token: null,
    refreshToken: null,
    role: null,
    userId: null,
  });
  const [isAuthen, setIsAuthen] = useState(!!getToken());

  useEffect(() => {
    const token = getToken();
    const refreshToken = getRefreshToken();
    const role = getRole();
    const userId = getUserId();
    if (token && refreshToken && role && userId) {
      setAuth({ token, refreshToken, role, userId });
    }
  }, []);

  const login = (data) => {
    setAuth(data);
    setIsAuthen(true);
    setTokens(data.token, data.refreshToken, data.role, data.userId);
  };

  const logout = async () => {
    await axiosInstance.get("/auths/logout");
    setAuth({
      token: null,
      refreshToken: null,
      role: null,
      userId: null,
    });
    setIsAuthen(false);
    removeTokens();
  };

  return (
    <AuthContext.Provider value={{ isAuthen, auth, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const getToken = () => {
  return localStorage.getItem("token");
};

export const getRefreshToken = () => {
  return localStorage.getItem("refreshToken");
};

export const getRole = () => {
  return localStorage.getItem("role");
};

export const getUserId = () => {
  return localStorage.getItem("userId");
};

export const setTokens = (token, refreshToken, role, userId) => {
  localStorage.setItem("token", token);
  localStorage.setItem("refreshToken", refreshToken);
  localStorage.setItem("role", role);
  localStorage.setItem("userId", userId);
};

export const removeTokens = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("refreshToken");
  localStorage.removeItem("role");
  localStorage.removeItem("userId");
};
