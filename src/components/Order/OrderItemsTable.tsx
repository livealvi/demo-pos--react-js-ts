import React from "react";

const OrderItemsTable = ({ count, orderItem, orderItems }: any) => {
  const { id, name, quantity, description, subtotal } = orderItem;
  // console.log(orderItem);
  // console.log(orderItems.length);

  return (
    <>
      <tr className="bg-white hover:bg-[#f0f4f8] border-b border-gray-300 text-center hover:text-black last:border-b-0">
        <th scope="row" className="py-2 px-6 font-[700] whitespace-nowrap">
          {1 + count}
        </th>

        <td className="py-2 px-6">
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
        <td className="py-2 px-6">{quantity}</td>
        <td className="py-2 px-6">{Number(subtotal / quantity).toFixed(2)}</td>
        <td className="py-2 px-6">{subtotal}</td>

        {/* <td className="py-4 px-6 ">
          <button
            onClick={() => handleGetId(id)}
            className="font-[500] text-sky-600 hover:bg-sky-500 hover:text-white bg-sky-200 rounded-md py-2 px-5 mx-1 my-1"
          >
            Details
          </button>
        </td> */}
      </tr>
    </>
  );
};

export default OrderItemsTable;
