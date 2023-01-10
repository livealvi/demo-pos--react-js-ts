import React from "react";
import { AiOutlineClose } from "react-icons/ai";
import { FaMinusSquare, FaPlusSquare } from "react-icons/fa";
import { TbCurrencyTaka } from "react-icons/tb";

const SaleCart = ({ product, handelRemove, setCart }: any) => {
  const { id, name, description, quantity, sale, mrp, selectedQuantity } =
    product;

  return (
    <>
      <tr className="hover:bg-[#f0f4f8] border-b border-gray-300 text-center hover:text-black last:border-b-0">
        <td className="py-2 px-3">
          <span className="flex flex-col">
            <span className="font-semibold">{name}</span>
            <span className="mb-1">{description}</span>
          </span>
        </td>
        <td className="py-2 px-3">
          <div className="flex items-center justify-center">
            {selectedQuantity < quantity ? (
              <button
                onClick={() => {
                  setCart((prev: any) =>
                    prev.map((p: any) =>
                      p.id === id
                        ? {
                            ...p,
                            selectedQuantity: p.selectedQuantity + 1,
                          }
                        : p
                    )
                  );
                }}
              >
                <FaPlusSquare className="text-[20px] text-green-600 hover:text-green-500" />
              </button>
            ) : (
              <button className="cursor-not-allowed ">
                <FaPlusSquare className="text-[20px] text-gray-00 hover:text-gray-500" />
              </button>
            )}
            <span className="mx-4 font-semibold">{selectedQuantity}</span>
            <button
              onClick={() => {
                setCart((prev: any) =>
                  prev.map((p: any) =>
                    p.id === id
                      ? {
                          ...p,
                          selectedQuantity: Math.max(p.selectedQuantity - 1, 1),
                        }
                      : p
                  )
                );
              }}
            >
              <FaMinusSquare className="text-[20px] text-red-600 hover:text-red-500" />
            </button>
          </div>
        </td>
        <td className="py-2 px-3">
          <span className="flex items-center flex-col">
            <span className="font-bold flex items-center">
              <TbCurrencyTaka className="text-[20px]" />
              {Number(mrp * selectedQuantity).toFixed(2)}
            </span>
            <span className="text-[15px] text-gray-500 font-normal flex items-center">
              <span className="mr-1 mt-1">each</span>
              <TbCurrencyTaka className="" />
              <span>{Number(mrp).toFixed(2)}</span>
            </span>
          </span>
        </td>
        <td className="py-2 px-3">
          <button
            onClick={() => handelRemove(id)}
            className="flex justify-center items-center font-[500]  text-red-600 hover:bg-red-500 hover:text-white bg-red-200 rounded-md py-2 px-2 whitespace-nowrap "
          >
            <span>
              <AiOutlineClose className="text-[20px]" />
            </span>
            <span className="ml-1">Remove</span>
          </button>
        </td>
      </tr>
    </>
  );
};

export default SaleCart;
