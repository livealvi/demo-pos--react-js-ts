import React from "react";

const FilterSaleItemTable = ({ count, orderItem }: any) => {
  const { id, name, quantity, description, subtotal } = orderItem;

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
      </tr>
    </>
  );
};

export default FilterSaleItemTable;
