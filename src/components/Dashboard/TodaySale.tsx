import React from "react";
import { BsCartCheck } from "react-icons/bs";
import { NavLink } from "react-router-dom";

const TodaySale = ({ stock }: any) => {
  return (
    <>
      <NavLink to="/sale/0">
        <div className="drop-shadow-md border bg-green-500 rounded-xl  w-full h-full p-5 hover:bg-green-600 group-hover:text-white">
          <div className="text-white flex items-center font-open_sans font-extrabold text-[25px] ">
            <span className="pr-4">
              <BsCartCheck className="" />
            </span>{" "}
            <span>Today's Sale</span>
          </div>
          <div className="text-white flex flex-col pt-5">
            <div>
              <span className="font-medium">Today Sold:</span>{" "}
              <span className="font-[900]">
                {Number(stock?.today_sold[0]?.sold)}
              </span>
            </div>
            <div>
              <span className="font-medium">Today Sold Item:</span>{" "}
              <span className="font-[900]">
                {Number(stock?.today_sold[0]?.item)}
              </span>
            </div>
          </div>
        </div>
      </NavLink>
    </>
  );
};

export default TodaySale;
