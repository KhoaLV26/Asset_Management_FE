import React from "react";
import { Button } from "antd";
import { useNavigate } from "react-router-dom";
import LayoutPage from "../layout/LayoutPage";

export const UnAuthor = () => {
  const navigate = useNavigate();

  const login = () => {
    navigate("/login");
  };

  return (
    <LayoutPage>
      <div className="flex justify-center items-center h-screen">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4">Not Authorized</h1>
          <p className="text-lg mb-4">
            Sorry, you do not have permission to access this page.
          </p>
          <Button
            onClick={login}
            className="bg-d6001c text-white font-bold py-2 px-4 rounded"
          >
            Login to access
          </Button>
        </div>
        <div className="ml-8">
          <img
            src="https://d37iyw84027v1q.cloudfront.net/bradyemea/BradyEMEA_Large/STEN-PIC209-P.jpg"
            alt="Not Authorized"
            className="max-w-xs max-h-full"
          />
        </div>
      </div>
    </LayoutPage>
  );
};

export default UnAuthor;
