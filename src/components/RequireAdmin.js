import { Navigate } from "react-router-dom";

const RequireAdmin = (props) => {
  const { children } = props;
  const user = JSON.parse(localStorage.getItem("user"));
  return !user ? (
    <Navigate to="/login" />
  ) : user.roleName === `Admin` ? (
    children
  ) : (
    <Navigate to="/unauthorized" />
  );
};

export default RequireAdmin;
