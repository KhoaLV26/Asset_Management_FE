import React from "react";
import "../styles/LayoutPage.css";
import { Layout } from "antd";
import { Header, Navbar, ScrollToTop } from "../components";

const { Content } = Layout;

const LayoutPage = (props) => { 
  return (
    <Layout className="bg-white w-full flex">
      <Header/>
      <ScrollToTop/>
      <Layout className="bg-white w-full">
        <Navbar/>
        <Layout style={{
          marginTop: '60px',
          marginLeft: '220px'
        }}
        className="bg-white pt-0 pr-5 pb-2.5 pl-12 h-full">
          <Content className="flex p-6 m-5 min-h-[280px] h-screen max-w-screen rounded-lg bg-white">
            {props.children}
          </Content>
        </Layout>
      </Layout>
    </Layout>
  );
};
export default LayoutPage;
