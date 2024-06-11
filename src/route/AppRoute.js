const { useRoutes } = require("react-router-dom")
const { default: ManageUser } = require("../pages/ManageUser")

const AppRoutes = () => {
    const elements = useRoutes(
        [
            {
                path: '', element: <ManageUser />
            },
        ]
    )
    return elements
}
export default AppRoutes