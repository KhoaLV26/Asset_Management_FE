import {
  NotFound,
  UnAuthor,
  CreateAsset,
  CreateAssignment,
  CreateLocation,
  CreateUser,
  EditAsset,
  EditAssignment,
  EditLocation,
  EditUser,
  Home,
  Login,
  Report,
  ManageAsset,
  ManageAssignment,
  ManageLocation,
  ManageRequestReturn,
  ManageUser,
} from "../pages";
import { RequireAdmin } from "../components";

const { useRoutes } = require("react-router-dom");

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
        <RequireAdmin>
          <ManageAssignment />
        </RequireAdmin>
      ),
    },
    {
      path: "/manage-assignment/create-assignment",
      element: (
        <RequireAdmin>
          <CreateAssignment />
        </RequireAdmin>
      ),
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
      element: (
        <RequireAdmin>
          <EditAssignment />
        </RequireAdmin>
      ),
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
      path: "/request-for-returning",
      element: (
        <RequireAdmin>
          <ManageRequestReturn />
        </RequireAdmin>
      ),
    },
    {
      path: "/manage-location",
      element: (
        <RequireAdmin>
          <ManageLocation />
        </RequireAdmin>
      ),
    },
    {
      path: "/manage-location/create-location",
      element: (
        <RequireAdmin>
          <CreateLocation />
        </RequireAdmin>
      ),
    },
    {
      path: "/manage-location/edit-location/:id",
      element: (
        <RequireAdmin>
          <EditLocation />
        </RequireAdmin>
      ),
    },
    { path: "*", element: <NotFound /> },
  ]);
  return elements;
};
export default AppRoutes;
