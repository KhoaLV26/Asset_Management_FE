import React, { useState } from "react";
import "../styles/LayoutPage.css";
import { UserOutlined } from "@ant-design/icons";
import { Layout, Menu, Button } from "antd";
import { useNavigate } from "react-router-dom";
import ManageUser from "./ManageUser";

const { Header, Content, Sider } = Layout;

const navBar = [
  { key: 1, label: "Home", link: "/" },
  { key: 2, label: "Manage User", link: "/manager-user" },
  { key: 3, label: "Manage Asset", link: "/manage-asset" },
  { key: 4, label: "Manage Assigment", link: "/manage-assignment" },
  { key: 5, label: "Request for Returning", link: "/request-for-returning" },
  { key: 6, label: "Report", link: "/report" },
];

const direction = ["Home", " > Status 1", " > Status 2"];

const LayoutPage = () => {
  const [stringLogin, setStringLogin] = useState(true);
  const history = useNavigate(); 
  return (
    <Layout className="bg-white w-full flex">
      <Header className="bg-d6001c px-10 flex items-center justify-between w-full">
        <div className="flex items-center text-white font-extrabold ml-8">
          {direction.map((item) => (
            <span className="pl-2">{item}</span>
          ))}
        </div>
        <Button
          icon={React.createElement(UserOutlined)}
          className="flex items-center w-[100px] font-bold bg-d6001c"
          type="primary"
          size="large"
          onClick={() => setStringLogin(!stringLogin)}
        >
          {stringLogin ? "Login" : "Logout"}
        </Button>
      </Header>
      <Layout className="bg-white mx-5 w-full">
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
        <Layout className="bg-white pt-0 pr-5 pb-2.5 pl-12 h-full">
          <Content className="flex p-6 m-5 min-h-[280px] h-screen rounded-lg bg-white">
            <ManageUser/>
          </Content>
        </Layout>
      </Layout>
    </Layout>
  );
};
export default LayoutPage;
