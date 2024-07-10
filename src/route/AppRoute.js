import { NotFound, UnAuthor, Home } from "../pages";
import { RequireAdmin } from "../components";
import { useRoutes } from "react-router-dom";
import { lazy, Suspense } from "react";

const CreateAsset = lazy(() => import("../pages/CreateAsset"));
const CreateAssignment = lazy(() => import("../pages/CreateAssignment"));
const CreateLocation = lazy(() => import("../pages/CreateLocation"));
const CreateUser = lazy(() => import("../pages/CreateUser"));
const EditAsset = lazy(() => import("../pages/EditAsset"));
const EditAssignment = lazy(() => import("../pages/EditAssignment"));
const EditLocation = lazy(() => import("../pages/EditLocation"));
const EditUser = lazy(() => import("../pages/EditUser"));
const ManageAsset = lazy(() => import("../pages/ManageAsset"));
const ManageAssignment = lazy(() => import("../pages/ManageAssignment"));
const ManageLocation = lazy(() => import("../pages/ManageLocation"));
const ManageRequestReturn = lazy(() => import("../pages/ManageRequestReturn"));
const ManageUser = lazy(() => import("../pages/ManageUser"));
const Report = lazy(() => import("../pages/Report"));
const Login = lazy(() => import("../pages/Login"));

const AppRoutes = () => {
  const elements = useRoutes([
    {
      path: "/login",
      element: (
        <Suspense>
          <Login />
        </Suspense>
      ),
    },
    {
      path: "/manage-user/create-user",
      element: (
        <Suspense>
          <RequireAdmin>
            <CreateUser />
          </RequireAdmin>
        </Suspense>
      ),
    },
    {
      path: "/manage-user",
      element: (
        <Suspense>
          <RequireAdmin>
            <ManageUser />
          </RequireAdmin>
        </Suspense>
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
        <Suspense>
          <RequireAdmin>
            <ManageAsset />
          </RequireAdmin>
        </Suspense>
      ),
    },
    {
      path: "/manage-asset/create-asset",
      element: (
        <Suspense>
          <RequireAdmin>
            <CreateAsset />
          </RequireAdmin>
        </Suspense>
      ),
    },
    {
      path: "/manage-asset/edit-asset/:id",
      element: (
        <Suspense>
          <RequireAdmin>
            <EditAsset />
          </RequireAdmin>
        </Suspense>
      ),
    },
    {
      path: "/manage-user/edit-user/:id",
      element: (
        <Suspense>
          <RequireAdmin>
            <EditUser />
          </RequireAdmin>
        </Suspense>
      ),
    },
    {
      path: "unauthorized",
      element: <UnAuthor />,
    },
    {
      path: "/manage-assignment",
      element: (
        <Suspense>
          <RequireAdmin>
            <ManageAssignment />
          </RequireAdmin>
        </Suspense>
      ),
    },
    {
      path: "/manage-assignment/create-assignment",
      element: (
        <Suspense>
          <RequireAdmin>
            <CreateAssignment />
          </RequireAdmin>
        </Suspense>
      ),
    },
    {
      path: "/report",
      element: (
        <Suspense>
          <RequireAdmin>
            <Report />
          </RequireAdmin>
        </Suspense>
      ),
    },
    {
      path: "/manage-assignment/edit-assignment/:id",
      element: (
        <Suspense>
          <RequireAdmin>
            <EditAssignment />
          </RequireAdmin>
        </Suspense>
      ),
    },
    {
      path: "/request-for-returning",
      element: (
        <Suspense>
          <RequireAdmin>
            <ManageRequestReturn />
          </RequireAdmin>
        </Suspense>
      ),
    },
    {
      path: "/manage-location",
      element: (
        <Suspense>
          <RequireAdmin>
            <ManageLocation />
          </RequireAdmin>
        </Suspense>
      ),
    },
    {
      path: "/manage-location/create-location",
      element: (
        <Suspense>
          <RequireAdmin>
            <CreateLocation />
          </RequireAdmin>
        </Suspense>
      ),
    },
    {
      path: "/manage-location/edit-location/:id",
      element: (
        <Suspense>
          <RequireAdmin>
            <EditLocation />
          </RequireAdmin>
        </Suspense>
      ),
    },
    { path: "*", element: <NotFound /> },
  ]);
  return elements;
};
export default AppRoutes;
