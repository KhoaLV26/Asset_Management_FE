import { createContext, useEffect, useState } from "react";
import Cookies from "js-cookie";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({
    token: null,
    refreshToken: null,
    user: null,
  });
  const [isAuthen, setIsAuthen] = useState(!!getToken());

  useEffect(() => {
    const token = getToken();
    const refreshToken = getRefreshToken();
    const user = getUser();
    if (token && refreshToken && user) {
      setAuth({ token, refreshToken, user });
    }
  }, []);

  const login = (data) => {
    setAuth(data);
    setIsAuthen(true);
    setTokens(data.token, data.refreshToken, data.user);
    localStorage.setItem("logout-event", Date.now());
  };

  const logout = async () => {
    setIsAuthen(false);
    removeTokens();
    setAuth({
      token: null,
      refreshToken: null,
      user: null,
    });
    localStorage.setItem("logout-event", Date.now());
  };

  useEffect(() => {
    const syncLogout = (event) => {
      if (event.key === "logout-event") {
        setIsAuthen(false);
        setAuth({
          token: null,
          refreshToken: null,
          user: null,
        });
        window.location.href = "/login"; // Redirect to login page
      }
    };

    window.addEventListener("storage", syncLogout);
    return () => {
      window.removeEventListener("storage", syncLogout);
    };
  }, []);

  return (
    <AuthContext.Provider value={{ isAuthen, auth, login, logout, setAuth }}>
      {children}
    </AuthContext.Provider>
  );
};

export const getToken = () => {
  return Cookies.get("token");
};

export const getRefreshToken = () => {
  return Cookies.get("refreshToken");
};

export const getUser = () => {
  return Cookies.get("user") ? JSON.parse(Cookies.get("user")) : null;
};

export const setTokens = (token, refreshToken, user) => {
  Cookies.set("token", token, { expires: 7 });
  Cookies.set("refreshToken", refreshToken, { expires: 7 }); // 7 days
  Cookies.set("user", JSON.stringify(user), { expires: 7 }); // 7 days
};

export const removeTokens = () => {
  Cookies.remove("token");
  Cookies.remove("refreshToken");
  Cookies.remove("user");
};
