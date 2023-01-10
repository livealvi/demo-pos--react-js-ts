import React from "react";
import { NavLink } from "react-router-dom";

import notFound from "../../assets/gif/notFound.gif";

const NotFound = () => {
  return (
    <>
      <div className="flex flex-col text-center bg-white w-full h-[100vh]">
        <span className="absolute text-center left-[45.5%] top-[13%] font-black text-[80px]">
          <span>404</span>
        </span>
        <div
          className="w-full h-[90vh]  bg-auto bg-no-repeat bg-center "
          style={{ backgroundImage: `url(${notFound})` }}
        ></div>
        <span className="absolute text-center left-[40.5%] bottom-[16%] font-open_sans">
          <span className="flex flex-col">
            <span className="capitalize text-[35px] font-semibold">
              I think you're lost
            </span>
            <span className="lowercase text-[19px] font-normal">
              this page is not available
            </span>
            <span className="pt-[12%]">
              <NavLink
                className="px-5 py-2 text-white font-medium bg-[#43be3c] hover:cursor-pointer hover:bg-[#2d8f28] hover:font-bold hover:ease-in-out"
                to="/"
              >
                Go Home
              </NavLink>
            </span>
          </span>
        </span>
      </div>
    </>
  );
};

export default NotFound;
