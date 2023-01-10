import React, { useContext } from "react";
import { IdContext } from "../../App";

const CustomerTable = ({ customer, count, item, handleGetId }: any) => {
  let [idData, setIdData] = useContext(IdContext);
  const { id, name, phone, email, address } = customer;

  return (
    <>
      <tr className="bg-white hover:bg-[#f0f4f8] border-b border-gray-300 text-center  hover:text-black">
        <th scope="row" className="py-2 px-6 font-[700] whitespace-nowrap">
          {1 + count}
        </th>
        <td className="py-2 px-6">{name}</td>
        <td className="py-2 px-6">{phone}</td>
        <td className="py-2 px-6">{email}</td>
        <td className="py-2 px-6">{address}</td>
        <td className="py-2 px-6">{item.length} Items</td>

        <td className="py-2 px-6 font-black">
          <button
            onClick={() => handleGetId(id)}
            className="text-sky-500 hover:bg-sky-400 hover:text-white rounded-md py-1 px-2"
          >
            Edit
          </button>
        </td>
      </tr>
    </>
  );
};

export default CustomerTable;
