import React, { useContext } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Layout, Menu } from "antd";
import { AuthContext } from "../contexts/AuthContext";
import "../styles/LayoutPage.css";

const navBar = [
  { key: "1", label: "Home", link: "/home" },
  { key: "2", label: "Manage Location", link: "/manage-location" },
  { key: "3", label: "Manage User", link: "/manage-user" },
  { key: "4", label: "Manage Asset", link: "/manage-asset" },
  { key: "5", label: "Manage Assignment", link: "/manage-assignment" },
  { key: "6", label: "Request for Returning", link: "/request-for-returning" },
  { key: "7", label: "Report", link: "/report" },
];

const navBarUser = [{ key: "1", label: "Home", link: "/home" }];

const { Sider } = Layout;

const Navbar = () => {
  const location = useLocation();
  const { auth } = useContext(AuthContext);
  const role = auth?.user?.roleName;
  const navigate = useNavigate();

  const getSelectedKey = () => {
    const currentPath = location.pathname;
    const currentNavItem = navBar.find((item) =>
      currentPath.startsWith(item.link)
    );
    return currentNavItem ? currentNavItem.key : "1";
  };
  return (
    <Sider className="Sider ml-4 container h-screen text-lg bg-white w-2/5 flex">
      <div className="ant-layout-sider-children bg-white w-full h-full min-w-[250px]">
        <div className="flex items-center bg-white">
          <img
            src={
              "https://thanhnien.mediacdn.vn/Uploaded/quochung.qc/2020_01_16/nashtech/nash_tech_primary_pos_srgb_OYCJ.png?width=500"
            }
            alt="Nash Tech logo"
            className="hover:cursor-pointer"
            onClick={() => navigate("/")}
            width={150}
            height={150}
          />
        </div>
        <span className="flex items-center pt-0 pl-1 pr-1 bg-white text-[#d6001c] font-extrabold mb-6">
          Online Asset Management
        </span>
        {(role === "Admin" || role === "Staff") && (
          <Menu
            theme="dark"
            mode="inline"
            defaultSelectedKeys={[getSelectedKey()]}
            className="border-r-0 font-extrabold bg-[#aaa7a7] w-full"
          >
            {role === "Admin"
              ? navBar.map((item) => (
                  <Menu.Item key={item.key}>
                    <Link to={item.link} className="hover-red">
                      {item.label}
                    </Link>
                  </Menu.Item>
                ))
              : role === "Staff"
              ? navBarUser.map((item) => (
                  <Menu.Item key={item.key}>
                    <Link to={item.link}>{item.label}</Link>
                  </Menu.Item>
                ))
              : null}
          </Menu>
        )}
      </div>
    </Sider>
  );
};

export default Navbar;
