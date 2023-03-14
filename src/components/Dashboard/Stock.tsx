import React from "react";
import { FiPackage } from "react-icons/fi";
import { NavLink } from "react-router-dom";

const Stock = ({ stock }: any) => {
  return (
    <>
      <NavLink to="/stock/view/all">
        <div className="drop-shadow-md border bg-violet-500 hover:bg-violet-600 w-full h-full rounded-xl p-5">
          <div className="flex items-center font-open_sans font-extrabold text-white text-sm">
            <span className="pr-2">
              <FiPackage />
            </span>
            <span className="">Stock</span>
          </div>
          <div className="flex flex-col pt-2 pl-6 text-white text-xs">
            <div>
              <span className="font-black mr-1">Item:</span>
              <span className="">{Number(stock?.total_stock[0]?.item)}</span>
            </div>
            <div>
              <span className="font-black mr-1">Product:</span>
              <span className="">{Number(stock?.total_stock[0]?.stock)}</span>
            </div>
          </div>
        </div>
      </NavLink>
    </>
  );
};

export default Stock;
