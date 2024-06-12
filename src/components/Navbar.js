import { useNavigate } from "react-router-dom";
import { Layout, Menu } from "antd";

const navBar = [
    { key: 1, label: "Home", link: "/" },
    { key: 2, label: "Manage User", link: "/manager-user" },
    { key: 3, label: "Manage Asset", link: "/manage-asset" },
    { key: 4, label: "Manage Assigment", link: "/manage-assignment" },
    { key: 5, label: "Request for Returning", link: "/request-for-returning" },
    { key: 6, label: "Report", link: "/report" },
  ];


const { Sider } = Layout;


const Navbar = () => {
    const history = useNavigate(); 
    return (
        <Sider
            className="Sider container h-[110vh] text-lg bg-white w-2/5 flex">
            <div className="ant-layout-sider-children bg-white w-full">
                <div className="flex items-center bg-white">
                    <img
                        src={
                            "https://thanhnien.mediacdn.vn/Uploaded/quochung.qc/2020_01_16/nashtech/nash_tech_primary_pos_srgb_OYCJ.png?width=500"
                        }
                        alt="../logo.svg"
                        width={150}
                        height={150}
                    />
                </div>
                <span className="flex items-center pt-0 pl-1 pr-1 bg-white text-[#d6001c] font-extrabold mb-6">
                    Online Asset Management
                </span>
                <Menu
                    theme="dark"
                    mode="inline"
                    defaultSelectedKeys={["1"]}
                    className="border-r-0 font-extrabold bg-[#aaa7a7] w-full"
                >
                    {navBar.map((menuItem) => (
                        <Menu.Item
                            key={menuItem.key}
                            onClick={() => history(menuItem.link)}
                        >
                            {menuItem.label}
                        </Menu.Item>
                    ))}
                </Menu>
            </div>
        </Sider>
    )
}

export default Navbar