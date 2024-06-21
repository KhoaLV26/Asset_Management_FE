import React from "react";
import LayoutPage from "../layout/LayoutPage";
import { useNavigate } from "react-router-dom";

const NotFound = () => {
  const navigate = useNavigate();

  const goBack = () => {
    navigate(-1);
  };

  return (
    <LayoutPage>
      <div className="flex justify-center items-center h-[80vh] w-full mt-10">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4">Opppss!!!</h1>
          <button
            onClick={goBack}
            className="bg-d6001c hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
          >
            Back
          </button>
        </div>
        <div className="ml-8">
          <img
            src="https://img.freepik.com/premium-vector/modern-minimal-found-error-icon-oops-page-found-404-error-page-found-with-concept_599740-716.jpg"
            alt="Not Found"
            className="max-w-xs max-h-full"
          />
        </div>
      </div>
    </LayoutPage>
  );
};

export default NotFound;
