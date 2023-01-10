import React, { FC, useContext, useState } from "react";
import Moment from "react-moment";
import "moment-timezone";
import { IdContext } from "../../App";

const StockTable = ({
  stocks,
  count,
  handleDelete,
  handleGetId,
  toggleModalDelete,
}: any) => {
  let [idData, setIdData] = useContext(IdContext);
  const {
    id,
    name,
    description,
    mrp,
    costing,
    wholesale,
    retail,
    sale,
    quantity,
    date,
    reminder,
    userId,
    subCategoryId,
  } = stocks;

  let make = quantity > reminder ? true : false;
  const categoryName = stocks?.category?.name;

  return (
    <>
      <tr
        className={`${
          make
            ? "bg-white hover:bg-[#f0f4f8]"
            : "bg-[#c3c4f460] hover:bg-[#c3c4f4c4] font-medium  text-black  border-gray-500"
        }  border-b border-gray-300 text-center  hover:text-black`}
      >
        <th scope="row" className="py-2 px-6 font-[700] whitespace-nowrap">
          {1 + count}
        </th>
        {/* <td className="py-2 px-6">{1 + count}</td> */}
        <td className="py-2 px-6 whitespace-nowrap">{name}</td>
        <td className="py-2 px-6">
          {description.length >= 20 ? (
            <span>{description.substring(0, 33)}...</span>
          ) : (
            <span className="whitespace-nowrap">{description}</span>
          )}
        </td>
        <td className="py-2 px-6">{mrp}</td>
        <td className="py-2 px-6">{costing}</td>
        <td className="py-2 px-6">{wholesale}</td>
        <td className="py-2 px-6">{retail}</td>
        {/* <td className="py-2 px-6">{sale}</td> */}
        <td
          className={`${
            make ? "" : "text-red-500 font-black border-gray-500"
          }  border-b border-gray-300 text-center hover:text-black py-2 px-6`}
        >
          {quantity}
        </td>
        <td>{reminder === 0 ? "NOT SET" : `${reminder}`} </td>
        {/* <td className="py-2 px-6">
          <Moment tz="Asia/Dhaka" format="DD/MM/YYYY - hh:mm A" date={date} />
        </td> */}
        <td className="py-2 px-6">{categoryName}</td>
        <td className="py-2 px-6">{stocks?.barcode?.number}</td>
        {/* <td className="py-2 px-6">""</td>
        <td className="py-2 px-6">""</td> */}
        <td className="py-2 px-6 ">
          <div className="flex font-black">
            <button
              onClick={() => handleGetId(id)}
              className="text-sky-400 hover:bg-sky-400 hover:text-white rounded-sm mr-2 px-2 py-1"
            >
              Edit
            </button>
            <button
              onClick={() => (
                toggleModalDelete(), setIdData({ id: id, data: name })
              )}
              className="text-red-400 hover:bg-red-500 hover:text-white rounded-sm px-2 py-1"
            >
              Delete
            </button>
          </div>
        </td>
      </tr>
    </>
  );
};
export default StockTable;
