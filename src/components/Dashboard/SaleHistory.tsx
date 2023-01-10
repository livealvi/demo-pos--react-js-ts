import React from "react";
import { RiHistoryFill } from "react-icons/ri";
import { NavLink } from "react-router-dom";

const SaleHistory = ({ stock }: any) => {
  return (
    <>
      <NavLink to="/order/view/all">
        <div className="drop-shadow-md border bg-red-500 hover:bg-red-600 rounded-xl h-full w-full p-5">
          <div className="flex items-center font-open_sans font-extrabold text-white text-[25px]">
            <span className="pr-4">
              <RiHistoryFill className="text-white" />
            </span>{" "}
            <span>Sale's History</span>
          </div>
          <div className="flex flex-col pt-5 text-white">
            <div>
              <span className="font-medium">Total Sold:</span>{" "}
              <span className="font-[900]">
                {Number(stock?.total_sold[0].sold_stock)}
              </span>
            </div>
            <div>
              <span className="font-medium">Total Sold Item:</span>{" "}
              <span className="font-[900]">
                {Number(stock?.total_sold[0].item)}
              </span>
            </div>
          </div>
        </div>
      </NavLink>
    </>
  );
};

export default SaleHistory;
