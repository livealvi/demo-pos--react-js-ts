import React from "react";
import { FiPackage } from "react-icons/fi";
import { NavLink } from "react-router-dom";

const Stock = ({ stock }: any) => {
  return (
    <>
      <NavLink to="/stock/view/all">
        <div className="drop-shadow-md border bg-violet-500 hover:bg-violet-600 rounded-xl h-auto w-full p-5">
          <div className="flex items-center font-open_sans font-extrabold text-slate-700 text-[25px]">
            <span className="pr-4 text-white">
              <FiPackage />
            </span>{" "}
            <span className="text-white">Stock</span>
          </div>
          <div className="flex flex-col pt-5 text-white">
            <div>
              <span className="font-medium">Total left:</span>{" "}
              <span className="font-[900]">
                {Number(
                  stock?.total_stock[0]?.item - stock?.total_sold[0]?.item
                )}
              </span>
            </div>
            <div>
              <span className="font-medium">Total Item:</span>{" "}
              <span className="font-[900]">
                {Number(stock?.total_stock[0]?.item)}
              </span>
            </div>
            <div>
              <span className="font-medium">Total Stock:</span>{" "}
              <span className="font-[900]">
                {Number(stock?.total_stock[0]?.stock)}
              </span>
            </div>
          </div>
        </div>
      </NavLink>
    </>
  );
};

export default Stock;
