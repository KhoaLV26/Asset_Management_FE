import NotFound from "../components/NotFound";
import RequireAdmin from "../components/RequireAdmin";
import UnAuthor from "../components/UnAuthor";
import CreateAsset from "../pages/CreateAsset";
import EditAsset from "../pages/EditAsset";
import EditAssignment from "../pages/EditAssignment";
import EditUser from "../pages/EditUser";
import Home from "../pages/Home";
import Login from "../pages/Login";
import ManageAssignment from "../pages/ManageAssignment";
import Report from "../pages/Report";

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
      path: "/manage-asset/edit-asset/:id",
      element: (
        <RequireAdmin>
          <EditAsset />
        </RequireAdmin>
      ),
    },
    {
      path: "/manage-user/edit-user/:id",
      element: (
        <RequireAdmin>
          <EditUser />
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
        // <RequireAdmin>
          <ManageAssignment />
        // </RequireAdmin>
      ),
    },
    {
      path: "/manage-assignment/create-assignment",
      element: <CreateAssignment />,
    },
    {
      path: "/report",
      element: (
        <RequireAdmin>
          <Report />
        </RequireAdmin>
      ),
    },
    {
      path: "/manage-assignment/edit-assignment/:id",
      element: <EditAssignment />,
    },
    {
      path: "/report",
      element: (
        <RequireAdmin>
          <Report />
        </RequireAdmin>
      ),
    },
    { path: "*", element: <NotFound /> },
  ]);
  return elements;
};
export default AppRoutes;
