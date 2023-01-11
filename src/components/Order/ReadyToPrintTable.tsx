import React from "react";

const ReadyToPrintTable = ({ count, orderItem, orderItems }: any) => {
  const { id, name, quantity, description, subtotal } = orderItem;
  return (
    <>
      <tr className="last:border-b-0">
        <td className="border border-black px-2">{1 + count}</td>
        <td className="border border-black px-2">
          <span className="flex">
            <span>{name}</span>
            <span className="mx-2">|</span>
            <span>{description}</span>
          </span>
        </td>
        <td className="border border-black px-2">{quantity}</td>
        <td className="border border-black px-2">
          {Number(subtotal / quantity).toFixed(2)}
        </td>
        <td className="border border-black px-2">{subtotal}</td>
      </tr>
    </>
  );
};

export default ReadyToPrintTable;
