import React, { FC, useContext } from "react";
import { IdContext } from "../../App";
import { FaCartPlus } from "react-icons/fa";
import { TbCurrencyTaka } from "react-icons/tb";

const SaleTable = ({
  stocks,
  count,
  handleDelete,
  handleGetProduct,
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

  let addCart = quantity === 0 ? true : false;

  return (
    <>
      <tr
        className={`${
          make
            ? "bg-white hover:bg-[#f0f4f8]"
            : "bg-[#c3c4f460] hover:bg-[#c3c4f4c4] font-medium  text-black  border-gray-500"
        }  border-b border-gray-300 text-center hover:text-black`}
      >
        <th scope="row" className="py-2 px-3 font-[700] whitespace-nowrap">
          {1 + count}
        </th>
        <td className="py-2 px-5">{name}</td>
        <td className="py-2 px-3">
          <td className="py-2 px-6">
            {description.length >= 20 ? (
              <span>{description.substring(0, 33)}...</span>
            ) : (
              <span className="whitespace-nowrap">{description}</span>
            )}
          </td>
        </td>
        <td className="py-2 px-3">{categoryName}</td>
        <td className="py-2 px-4">{costing}</td>
        <td className="py-2 px-4">{wholesale}</td>
        <td className="py-2 px-3">{mrp}</td>
        <td
          className={`${
            make ? "" : "text-red-500 font-black border-gray-500"
          }  border-b border-gray-300 text-center hover:text-red py-2 px-3`}
        >
          <span>{quantity}</span>
        </td>
        <td>{stocks.barcode?.number}</td>
        <td className="py-2 px-6 w-[40px]">
          {addCart ? (
            <button className="flex justify-center items-stretch font-[500]  text-gray-600 rounded-md py-1 px-1 whitespace-nowrap cursor-not-allowed ">
              <span>
                <FaCartPlus className="text-[16px]" />
              </span>{" "}
              <span className="ml-2">Add</span>
            </button>
          ) : (
            <button
              onClick={() => handleGetProduct(stocks, id)}
              className="flex justify-center items-stretch font-[500]  text-green-600 hover:bg-green-500 hover:text-white rounded-md py-1 px-1 whitespace-nowrap"
            >
              <span>
                <FaCartPlus className="text-[16px]" />
              </span>{" "}
              <span className="ml-2">Add</span>
            </button>
          )}
        </td>
      </tr>
    </>
  );
};

export default SaleTable;
