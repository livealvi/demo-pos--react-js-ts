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
    change,
    fullPaidDate,
    collection,
    customerId,
    paid,
  } = due;
  const { name } = due?.customer;

  console.log("collection", collection);
  console.log("amount", amount);

  if (collection <= amount) {
    console.log("true");
  } else {
    console.log("false");
  }

  return (
    <>
      <tr className="bg-white hover:bg-[#f0f4f8] border-b border-gray-300 text-center hover:text-black uppercase">
        <th scope="row" className="py-2 px-6 font-[700] whitespace-nowrap">
          {1 + count}
        </th>
        <td className="py-2 px-6">{dueId}</td>
        <td
          className={`${
            collection >= amount ? "text-green-600" : "text-red-600"
          } font-semibold py-2 px-6 whitespace-nowrap`}
        >
          {name}
        </td>
        <td className="py-2 px-6 whitespace-nowrap">{title}</td>
        <td className="py-2 px-6 whitespace-nowrap">{date}</td>
        <td className="py-2 px-6 whitespace-nowrap">
          <Moment tz="Asia/Dhaka" format="hh:mm:ss A" date={createdAt} />
        </td>
        <td
          className={`${
            collection === amount || collection > amount
              ? "text-green-600"
              : "text-red-600"
          } font-semibold py-2 px-6 whitespace-nowrap`}
        >
          {amount}
        </td>
        <td
          className={`${
            collection >= amount && amount === collection
              ? "text-green-600"
              : "text-red-600"
          } font-semibold py-2 px-6 whitespace-nowrap`}
        >
          {collection >= amount && amount === collection ? (
            <span>Full Paid</span>
          ) : (
            <div>
              {collection <= 0 ? (
                <span className="whitespace-nowrap">Full Due</span>
              ) : (
                <span>
                  {collection <= amount ? (
                    collection
                  ) : (
                    <span className="text-green-600">{collection}</span>
                  )}
                </span>
              )}
            </div>
          )}
        </td>
        <td
          className={`${
            collection >= amount && amount === collection
              ? "text-green-600"
              : "text-red-600"
          } font-semibold py-2 px-6 whitespace-nowrap`}
        >
          {collection >= amount && amount === collection ? (
            "Full Paid"
          ) : (
            <div>
              {collection == 0.0 ? (
                <span className="whitespace-nowrap">Full Due</span>
              ) : (
                <span className="text-orange-500">{remain}</span>
              )}
            </div>
          )}
        </td>
        <td
          className={`${
            updatedAt === null ? "text-gray-400" : "text-black-900"
          } py-2 px-6`}
        >
          {updatedAt === null || undefined ? (
            "No Yet"
          ) : (
            <span className="flex flex-col">
              <Moment
                className="font-bold whitespace-nowrap"
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
            description === null ? " text-gray-400" : "text-black-900"
          } py-2 px-6 `}
        >
          {description === null || undefined ? (
            <span className="whitespace-nowrap">No Desc.</span>
          ) : (
            description
          )}
        </td>
        <td className="py-2 px-1 font-black">
          <button
            onClick={() => (handleGetId(id), toggleModal())}
            className="font-black text-sky-500 hover:text-white hover:font-black hover:bg-sky-500 rounded-sm px-2 py-1"
          >
            Details
          </button>

          {collection === amount ? (
            <button className="text-gray-400 rounded-md px-2 py-1 ml-2 cursor-not-allowed">
              Deposit
            </button>
          ) : (
            <button
              onClick={() => (handleGetId(id), toggleEditModal())}
              className="text-green-500 hover:text-white hover:font-black hover:bg-green-500 rounded-sm px-2 py-1 ml-2"
            >
              Deposit
            </button>
          )}
        </td>
      </tr>
    </>
  );
};

export default FilterDueTable;
