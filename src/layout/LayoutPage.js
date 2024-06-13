import React from "react";
import "../styles/LayoutPage.css";
import { Layout } from "antd";
import Header from "../components/Header";
import Navbar from "../components/Navbar";

const { Content } = Layout;
const LayoutPage = (props) => { 
  return (
    <Layout className="bg-white w-full flex">
      <Header/>
      <Layout className="bg-white w-full">
        <Navbar/>
        <Layout className="bg-white pt-0 pb-2.5 pl-12 h-full">
          <Content className="flex p-6 m-5 min-h-[280px] h-screen rounded-lg bg-white">
            {props.children}
          </Content>
        </Layout>
      </Layout>
    </Layout>
  );
};
export default LayoutPage;
