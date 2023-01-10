import React from "react";
import { Outlet } from "react-router";
import Navbar from "../Navbar/Navbar";
import Sidebar from "../Sidebar/Sidebar";

const WithNav = () => {
  return (
    <>
      <div className="flex">
        <div className="flex">
          <Sidebar />
        </div>
        <Outlet />
      </div>
    </>
  );
};

export default WithNav;
