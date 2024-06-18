import React from "react";
import { useNavigate } from "react-router-dom";

const UnAuthor = () => {
  const navigate = useNavigate();

  const login = () => {
    navigate("/login");
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-4">Not Authorized</h1>
        <p className="text-lg mb-4">
          Sorry, you do not have permission to access this page.
        </p>
        <button
          onClick={login}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Login to access
        </button>
      </div>
      <div className="ml-8">
        <img
          src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRNl5I7pehpC7N4-_1oxjQ33IjQzRAIM9FVRuuwyUfHc9yCD0lkr_TI-w7yLWbRlhqF1Dc&usqp=CAU"
          alt="Not Authorized"
          className="max-w-xs max-h-full"
        />
      </div>
    </div>
  );
};

export default UnAuthor;
