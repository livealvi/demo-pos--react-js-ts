import React from "react";
import Moment from "react-moment";

const FilterDueTable = ({
  count,
  due,
  dueItem,
  handleGetId,
  toggleEditModal,
  toggleModal,
}: any) => {
  const {
    id,
    dueId,
    title,
    description,
    date,
    createdAt,
    updatedAt,
    amount,
    remain,
    fullPaidDate,
    collection,
    customerId,
    paid,
  } = due;
  const { name } = due?.customer;
  return (
    <>
      <tr className="bg-white hover:bg-[#f0f4f8] border-b border-gray-300 text-center hover:text-black uppercase">
        <th scope="row" className="py-2 px-6 font-[700] whitespace-nowrap">
          {1 + count}
        </th>
        <td className="py-2 px-6">{dueId}</td>
        <td className="py-2 px-6">{name}</td>
        <td className="py-2 px-6 whitespace-nowrap">{title}</td>
        <td className="py-2 px-6 whitespace-nowrap">{date}</td>
        <td className="py-2 px-6 whitespace-nowrap">
          <Moment tz="Asia/Dhaka" format="hh:mm:ss A" date={createdAt} />
        </td>
        <td className="py-2 px-6">{amount}</td>
        <td className="py-2 px-6">{collection}</td>
        <td
          className={`${
            collection >= amount ? "text-green-600" : "text-red-600"
          } font-semibold py-2 px-6`}
        >
          {collection >= amount ? (
            <span>
              {collection >= amount ? (
                <span className="whitespace-nowrap">Full Paid</span>
              ) : (
                ""
              )}
            </span>
          ) : (
            <span>
              {collection <= 0 ? (
                <span className="whitespace-nowrap">Full Due</span>
              ) : (
                remain
              )}
            </span>
          )}
        </td>
        <td
          className={`${
            updatedAt === null ? "text-gray-400" : "text-sky-700"
          } py-2 px-6 `}
        >
          {updatedAt === null || undefined ? (
            "No Yet"
          ) : (
            <span className="flex flex-col">
              <Moment
                className=" whitespace-nowrap"
                tz="Asia/Dhaka"
                format="YYYY-MM-DD"
                date={updatedAt}
              />
              <Moment
                className=" whitespace-nowrap"
                tz="Asia/Dhaka"
                format="hh:mm:ss A"
                date={updatedAt}
              />
            </span>
          )}
        </td>

        <td
          className={`${
            fullPaidDate === null ? " text-gray-400" : "text-sky-700"
          } py-2 px-6`}
        >
          {description === null || undefined ? (
            <span className="whitespace-nowrap">Not yet</span>
          ) : (
            fullPaidDate
          )}
        </td>
        <td
          className={`${
            description === null ? " text-gray-400" : "text-sky-700"
          } py-2 px-6 `}
        >
          {description === null || undefined ? (
            <span className="whitespace-nowrap">No Desc.</span>
          ) : (
            description
          )}
        </td>
        {/* <td
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
        </td> */}
        <td className="py-2 px-1 whitespace-nowrap">
          <button
            onClick={() => (handleGetId(id), toggleModal())}
            className="font-black text-sky-500 hover:text-white hover:font-black hover:bg-sky-500 rounded-sm px-2 py-1"
          >
            Details
          </button>
          <button
            onClick={() => (handleGetId(id), toggleEditModal())}
            className="font-black text-green-500 hover:text-white hover:font-black hover:bg-green-500 rounded-sm px-2 py-1 mx-2"
          >
            Edit
          </button>
        </td>
      </tr>
    </>
  );
};

export default FilterDueTable;
