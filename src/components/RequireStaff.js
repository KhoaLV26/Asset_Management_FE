import React from "react";
import { Navigate } from "react-router-dom";

const RequireStaff = (props) => {
  const { children } = props;
  const user = JSON.parse(localStorage.getItem("user"));
  return user?.roleName === `Staff` ? (
    children
  ) : (
    <Navigate to="/unauthorized" />
  );
};

export default RequireStaff;
