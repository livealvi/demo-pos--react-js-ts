import React, { useContext } from "react";
import Moment from "react-moment";

const OrderTable = ({
  order,
  count,
  handleGetId,
  toggleModal,
  toggleReturnModal,
  toggleModalPrint,
}: any) => {
  const { id, orderId, date, createdAt } = order;
  const employeeName = order?.sale[0]?.user?.name;
  const customer = order?.sale[0]?.customer?.name;

  let check = order?.sale[0]?.status === "due" ? true : false;

  return (
    <>
      <tr className="bg-white hover:bg-[#f0f4f8] border-b border-gray-300 text-center  hover:text-black uppercase">
        <th scope="row" className="py-2 px-6 font-[700] whitespace-nowrap">
          {1 + count}
        </th>
        <td className="py-2 px-6 ">{orderId}</td>
        <td
          className={`${
            customer === null ? "font-[400] text-gray-300" : "text-sky-700"
          } font-medium `}
        >
          {customer === null || undefined
            ? "No Name"
            : order?.sale[0]?.customer?.name}
        </td>
        <td className="py-2 px-6">{order?.sale?.length}</td>
        <td className="py-2 px-6">{date}</td>
        <td className="py-2 px-6">
          <Moment tz="Asia/Dhaka" format="hh:mm:ss A" date={createdAt} />
        </td>
        <td
          className={`${check ? "text-red-500" : "text-green-500"} font-medium`}
        >
          {order?.sale[0]?.status}
        </td>
        <td
          className={`${
            employeeName === undefined ? "font-[400] text-gray-300" : ""
          } `}
        >
          {employeeName === undefined || null
            ? "No Name"
            : order?.sale[0]?.user?.name}
        </td>
        <td className="py-2 px-6">
          <button
            onClick={() => (handleGetId(id), toggleModalPrint()) as any}
            className="font-black text-red-500 hover:text-white hover:font-black hover:bg-red-500 rounded-sm px-2 py-1"
          >
            Print
          </button>
          <button
            onClick={() => (handleGetId(id), toggleModal()) as any}
            className="font-black text-sky-500 hover:text-white hover:font-black hover:bg-sky-500 rounded-sm px-2 py-1 mx-2"
          >
            Details
          </button>
          {/* <button
            onClick={() => handleGetId(id)}
            className="font-black text-green-500 hover:text-white hover:font-black hover:bg-green-500 rounded-sm px-2 py-1 mr-1"
          >
            Edit
          </button> */}
          <button
            onClick={() => (handleGetId(id), toggleReturnModal()) as any}
            className="font-black text-orange-500 hover:text-white hover:font-black hover:bg-orange-500 rounded-sm px-2 py-1"
          >
            Return
          </button>
        </td>
      </tr>
    </>
  );
};

export default OrderTable;
