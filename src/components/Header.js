import { Layout, Button } from "antd";
import { UserOutlined } from "@ant-design/icons";
import React, { useState } from "react";

const direction = ["Home", " > Status 1", " > Status 2"];

const Header = ()  => {
  const [stringLogin, setStringLogin] = useState(true);
    return (
        <Layout.Header className="bg-d6001c px-10 flex items-center justify-between w-full">
            <div className="flex items-center text-white font-extrabold ml-8">
                {direction.map((item, index) => (
                    <span key={index} className="pl-2">{item}</span>
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
        </Layout.Header>
    )
}

export default Header