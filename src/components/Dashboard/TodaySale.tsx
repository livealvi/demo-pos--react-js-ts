import React from "react";
import { Tb24Hours } from "react-icons/tb";
import { NavLink } from "react-router-dom";

const TodaySale = ({ stock }: any) => {
  return (
    <>
      <NavLink to="/sale/0">
        <div className="drop-shadow-md border bg-green-500 rounded-xl p-5 hover:bg-green-600 w-full h-full group-hover:text-white">
          <div className="flex items-center font-open_sans font-extrabold text-white text-sm">
            <span className="pr-2">
              <Tb24Hours className="" />
            </span>{" "}
            <span className="">Today Sale</span>
          </div>
          <div className="flex flex-col pt-2 pl-6 text-white text-xs">
            <div>
              <span className="font-black mr-1"> Sold:</span>
              <span className="">{Number(stock?.today_sold[0]?.sold)}</span>
            </div>
            <div>
              <span className="font-black mr-1">Item:</span>
              <span className="">{Number(stock?.today_sold[0]?.item)}</span>
            </div>
          </div>
        </div>
      </NavLink>
    </>
  );
};

export default TodaySale;
