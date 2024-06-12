import ManageAsset from "../pages/ManageAsset"

const { useRoutes } = require("react-router-dom")
const { default: ManageUser } = require("../pages/ManageUser")

const AppRoutes = () => {
    const elements = useRoutes(
        [
            {
                path: '', element: <ManageUser />
            },
            {
                path: '/manage-asset', element: <ManageAsset />
            }
        ]
    )
    return elements
}
export default AppRoutes