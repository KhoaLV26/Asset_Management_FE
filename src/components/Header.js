import { Layout, Button } from "antd";
import { UserOutlined } from "@ant-design/icons";
import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { capitalizeWords } from "../utils/helpers/HandleString";

const Header = ()  => {
  const [stringLogin, setStringLogin] = useState(true);
    const location = useLocation();
    const pathNames = location.pathname.split('/').filter(x => x);

    const pathStrings = pathNames.map((name) => name.replace(/-/g, ' ')).map((name) => capitalizeWords(name)).join(' > ');

    return (
        <Layout.Header className="bg-d6001c px-10 flex items-center justify-between w-full">
            <div className="flex items-center text-white font-extrabold">
                <span className="text-lg">{pathStrings}</span>
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