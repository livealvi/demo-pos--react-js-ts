import React, { useContext, useEffect, useState } from "react";
import { FaMinusSquare, FaPlusSquare } from "react-icons/fa";
import Moment from "react-moment";
import { IdContext } from "../../App";

const ReturnItemTable = ({
  count,
  product,
  setCart,
  setReturnedProducts,
  setDisable,
  setDisable2,
}: any) => {
  let [idData, setIdData] = useContext(IdContext);
  const { id, name, description, quantity, updatedAt, subtotal, barcode } =
    product;

  const [selectedQuantity, setSelectedQuantity] = useState(
    product.return[0]?.quantity as any
  );

  const [remark, setRemark] = useState("" as any);

  const handleChange = (e: any) => {
    setRemark(e.target.value);
    setDisable(true);
  };

  useEffect(() => {
    setReturnedProducts((prev: any) => [
      ...prev.filter((d: any) => d.id !== id),
      { ...product, selectedQuantity, remark },
    ]);
  }, [id, product, selectedQuantity, setReturnedProducts, remark]);

  return (
    <>
      <tr className="bg-white hover:bg-[#f0f4f8] border-b border-gray-300 text-center hover:text-black last:border-b-0">
        <th scope="row" className="py-4 px-6 font-[700] whitespace-nowrap">
          {1 + count}
        </th>
        <td className="py-4 px-6">
          <span className="flex flex-col">
            <span className="font-semibold mb-1">{name}</span>
            <span className="">
              {description.length >= 20 ? (
                <span>{description.substring(0, 33)}...</span>
              ) : (
                <span className="whitespace-nowrap">{description}</span>
              )}
            </span>
          </span>
        </td>
        <td className="py-4 px-6">
          <span className="flex flex-col">
            <span className="font-bold">
              <span className="text-slate-800">{quantity}</span>
              {product.return[0]?.quantity == 0 ? (
                ""
              ) : (
                <span className="text-red-500">
                  &nbsp;-&nbsp;{product.return[0]?.quantity}
                </span>
              )}
            </span>
            {product.return[0]?.quantity == 0 ? (
              ""
            ) : (
              <span className="">
                <span className="lowercase">remain&nbsp;:&nbsp;</span>
                <span className="text-orange-500 font-bold">
                  {quantity - product.return[0]?.quantity}
                </span>
              </span>
            )}
          </span>
        </td>
        <td className="py-4 px-6">{product.return[0]?.quantity}</td>
        <td>
          {product.return[0]?.quantity === quantity ? (
            product.return[0]?.remark
          ) : (
            <input
              type="text"
              id=""
              name=""
              className="name w-full remarks block py-1 pl-3 text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-400  focus:border-blue-500  placeholder-gray-400  focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="enter remarks"
              onChange={handleChange}
              defaultValue={product.return[0]?.remark}
            />
          )}
        </td>
        <td className="py-4 px-6">
          {product.return[0]?.updatedAt === null ? (
            <span className="whitespace-nowrap">Not Return</span>
          ) : (
            <span className="flex flex-col">
              <span className="whitespace-nowrap">
                <Moment
                  tz="Asia/Dhaka"
                  format="YYYY-MM:DD"
                  date={product.return[0]?.updatedAt}
                />
              </span>
              <span className="whitespace-nowrap">
                <Moment
                  tz="Asia/Dhaka"
                  format="hh:mm:ss A"
                  date={product.return[0]?.updatedAt}
                />
              </span>
            </span>
          )}
        </td>

        <td className=" py-4 px-6">
          {product.return[0]?.quantity === quantity ? (
            <span className="text-orange-500 font-bold">Full Return</span>
          ) : (
            <span className="flex items-center">
              {selectedQuantity <= 0 ? (
                <button className="cursor-not-allowed ">
                  <FaMinusSquare className="text-[20px] text-gray-00 hover:text-gray-500" />
                </button>
              ) : (
                <button
                  onClick={() =>
                    setSelectedQuantity((q: number) =>
                      Math.max(product.return[0]?.quantity as any, q - 1)
                    )
                  }
                >
                  <FaMinusSquare className="text-[20px] text-red-600 hover:text-red-500" />
                </button>
              )}
              <span className="mx-4 font-bold">{selectedQuantity}</span>
              {selectedQuantity < quantity ? (
                <button
                  onClick={() =>
                    setSelectedQuantity((q: number) =>
                      q === quantity ? q : q + 1
                    )
                  }
                >
                  <FaPlusSquare className="text-[20px] text-green-600 hover:text-green-500" />
                </button>
              ) : (
                <button className="cursor-not-allowed ">
                  <FaPlusSquare className="text-[20px] text-gray-00 hover:text-gray-500" />
                </button>
              )}
            </span>
          )}
        </td>
      </tr>
    </>
  );
};

export default ReturnItemTable;
