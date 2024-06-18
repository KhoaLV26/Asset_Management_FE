import { useContext } from "react";
import LayoutPage from "../layout/LayoutPage";
import { AuthContext } from "../contexts/AuthContext";

const Home = () => {
  const { auth } = useContext(AuthContext);
  const role = auth?.user?.roleName;
  return (
    <LayoutPage>
      {role === "Admin" ? (
        <div className="mx-auto my-[9rem] text-center">
          <h1 className="text-[#d6001c] font-bold text-4xl">
            Online Asset Management
          </h1>
          <span className="text-[#d6001c] font-bold text-2xl">
            Welcome to Admin Page !
          </span>
        </div>
      ) : role === "Staff" ? (
        <div className="mx-auto my-[9rem] text-center">
          <h1 className="text-[#d6001c] font-bold text-4xl">
            Online Asset Management
          </h1>
          <span className="text-[#d6001c] font-bold text-2xl">
            Welcome to Staff Page !
          </span>
        </div>
      ) : (
        <div className="mx-auto my-[9rem] text-center">
          <h1 className="text-[#d6001c] font-bold text-4xl">
            Online Asset Management
          </h1>
          <span className="text-[#d6001c] font-bold text-2xl">
            Please login to continue !
          </span>
        </div>
      )}
    </LayoutPage>
  );
};

export default Home;
