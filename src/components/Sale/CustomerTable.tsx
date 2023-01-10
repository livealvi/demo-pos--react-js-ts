import React, { useContext } from "react";
import { IdContext } from "../../App";

const CustomerTable = ({ customer, count, handelCustomer }: any) => {
  let [idData, setIdData] = useContext(IdContext);
  const { id, name, phone, email } = customer;

  return (
    <>
      <tr
        onClick={() => handelCustomer(customer)}
        className="bg-white hover:bg-[#dce3ea] hover:cursor-pointer border-b border-gray-300 text-center  hover:text-black"
      >
        <th scope="row" className="py-2 px-6 font-[700] whitespace-nowrap">
          {1 + count}
        </th>
        <td className="py-2 px-6 whitespace-nowrap">{name}</td>
        <td className="py-2 px-6">{phone}</td>
        <td className="py-2 px-6">{email}</td>
      </tr>
    </>
  );
};

export default CustomerTable;
