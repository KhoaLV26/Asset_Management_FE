import React from "react";
import { Navigate } from "react-router-dom";
import Cookies from "js-cookie";

const RequireStaff = (props) => {
  const { children } = props;
  const user = Cookies.get("user");

  if (!user) {
    return <Navigate to="/login" />;
  }

  const parsedUser = JSON.parse(user);

  return parsedUser.roleName === "Staff" ? (
    children
  ) : (
    <Navigate to="/unauthorized" />
  );
};

export default RequireStaff;
