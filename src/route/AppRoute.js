import LayoutPage from "../layout/LayoutPage"

const { useRoutes } = require("react-router-dom")
const { default: ManageUser } = require("../pages/ManageUser")

const AppRoutes = () => {
    const elements = useRoutes(
        [
            {
                path: '/manage-user', element: <ManageUser />
            },
            {
                path: '/*', element: <LayoutPage />
            },
        ]
    )
    return elements
}
export default AppRoutes