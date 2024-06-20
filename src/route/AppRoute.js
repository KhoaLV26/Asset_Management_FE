import NotFound from "../components/NotFound";
import RequireAdmin from "../components/RequireAdmin";
import UnAuthor from "../components/UnAuthor";
import CreateAsset from "../pages/CreateAsset";
import Home from "../pages/Home";
import Login from "../pages/Login";
import ManageAssignment from "../pages/ManageAssignment";

const { useRoutes } = require("react-router-dom");
const { default: ManageUser } = require("../pages/ManageUser");
const { default: CreateUser } = require("../pages/CreateUser");
const { default: ManageAsset } = require("../pages/ManageAsset");
const { default: CreateAssignment } = require("../pages/CreateAssignment");

const AppRoutes = () => {
  const elements = useRoutes([
    {
      path: "/login",
      element: <Login />,
    },
    {
      path: "/manage-user/create-user",
      element: (
        <RequireAdmin>
          <CreateUser />
        </RequireAdmin>
      ),
    },
    {
      path: "/manage-user",
      element: (
        <RequireAdmin>
          <ManageUser />
        </RequireAdmin>
      ),
    },
    {
      path: "/",
      element: <Home />,
    },
    {
      path: "/home",
      element: <Home />,
    },
    {
      path: "/manage-asset",
      element: (
        <RequireAdmin>
          <ManageAsset />
        </RequireAdmin>
      ),
    },
    {
      path: "/manage-asset/create-asset",
      element: (
        <RequireAdmin>
          <CreateAsset />
        </RequireAdmin>
      ),
    },
    {
      path: "unauthorized",
      element: <UnAuthor />,
    },
    {
      path: "/manage-assignment",
      element: (
        <RequireAdmin>
          <ManageAssignment />
        </RequireAdmin>
      ),
    },
    {
      path: "/manage-assignment/create-assignment",
      element: <CreateAssignment />,
    },
    { path: "*", element: <NotFound /> },
  ]);
  return elements;
};
export default AppRoutes;
