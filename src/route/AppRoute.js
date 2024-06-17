import CreateAsset from "../pages/CreateAsset";
import Home from "../pages/Home";

const { useRoutes } = require("react-router-dom");
const { default: ManageUser } = require("../pages/ManageUser");
const { default: CreateUser } = require("../pages/CreateUser");
const { default: ManageAsset } = require("../pages/ManageAsset");
const { default: CreateAssignment } = require("../pages/CreateAssignment");

const AppRoutes = () => {
  const elements = useRoutes([
    {
      path: "/manage-user/create-user",
      element: <CreateUser />,
    },
    {
      path: "/manage-user",
      element: <ManageUser />,
    },
    {
      path: "/*",
      element: <Home />,
    },
    {
      path: "/manage-asset",
      element: <ManageAsset />,
    },
    {
      path: "/manage-asset/create-asset",
      element: <CreateAsset />,
    },
    {
      path: "/manage-assignment/create-assignment",
      element: <CreateAssignment />,
    }
  ]);
  return elements;
};
export default AppRoutes;
