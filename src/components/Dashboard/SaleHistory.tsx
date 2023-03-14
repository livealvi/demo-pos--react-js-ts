import React from "react";
import { RiHistoryFill } from "react-icons/ri";
import { NavLink } from "react-router-dom";

const SaleHistory = ({ stock }: any) => {
  return (
    <>
      <NavLink to="/order/view/all">
        <div className="drop-shadow-md border bg-red-500 hover:bg-red-600 w-full h-full rounded-xl p-5">
          <div className="flex items-center font-open_sans font-extrabold text-white text-sm">
            <span className="pr-2">
              <RiHistoryFill className="" />
            </span>
            <span className="">Sale's History</span>
          </div>
          <div className="flex flex-col pt-2 pl-6 text-white text-xs">
            <div>
              <span className="font-black mr-1">Sold:</span>
              <span className="font">
                {Number(stock?.total_sold[0].sold_stock)}
              </span>
            </div>
            <div>
              <span className="font-black mr-1">Item:</span>
              <span className="">{Number(stock?.total_sold[0].item)}</span>
            </div>
          </div>
        </div>
      </NavLink>
    </>
  );
};

export default SaleHistory;
