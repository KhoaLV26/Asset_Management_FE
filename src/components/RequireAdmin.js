import { Navigate } from "react-router-dom";
import Cookies from "js-cookie";

const RequireAdmin = (props) => {
  const { children } = props;
  const user = Cookies.get("user");

  if (!user) {
    return <Navigate to="/login" />;
  }

  const parsedUser = JSON.parse(user);

  return parsedUser.roleName === "Admin" ? (
    children
  ) : (
    <Navigate to="/unauthorized" />
  );
};

export default RequireAdmin;
