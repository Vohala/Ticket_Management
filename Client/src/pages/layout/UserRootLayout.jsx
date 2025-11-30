import { Outlet } from "react-router-dom";
import Navbar from "../../components/Navbar";

const UserRootLayout = () => {
  return (
    <>
      <Navbar />
      <Outlet />
    </>
  );
};

export default UserRootLayout;
