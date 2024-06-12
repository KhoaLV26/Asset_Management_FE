const { useRoutes } = require("react-router-dom");
const { default: ManageUser } = require("../pages/ManageUser");
const { default: CreateUser } = require("../pages/CreateUser");

const AppRoutes = () => {
  const elements = useRoutes([
    {
      path: "/manager-user/create-user",
      element: <CreateUser />,
    },
    {
      path: "/",
      element: <ManageUser />,
    },
  ]);
  return elements;
};
export default AppRoutes;

