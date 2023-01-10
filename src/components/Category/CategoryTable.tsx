import React, { useContext } from "react";
import { IdContext } from "../../App";

const UserTable = ({
  category,
  count,
  handleGetId,
  toggleModalDelete,
  handelGetCategory,
}: any) => {
  let [idData, setIdData] = useContext(IdContext);
  const { id, name } = category;
  const items = category?.stocks;

  return (
    <>
      <tr className="bg-white hover:bg-[#f0f4f8] border-b border-gray-300 text-center  hover:text-black">
        <th scope="row" className="py-2 px-6 font-[700] whitespace-nowrap">
          {1 + count}
        </th>
        <td className="py-2 px-6">{name}</td>
        <td className="py-2 px-6">
          {items?.length === 0 ? "No Items" : items?.length}
        </td>

        <td className="py-2 px-0 font-black">
          <button
            onClick={() => handelGetCategory(id, name)}
            className="text-green-500 hover:bg-green-400 hover:text-white rounded-md py-1 px-2"
          >
            Show All
          </button>
          <button
            onClick={() => handleGetId(id)}
            className="text-sky-500 hover:bg-sky-400 hover:text-white rounded-md py-1 px-2 mx-4"
          >
            Edit
          </button>

          {name === "NOT SET" ? (
            <button className="text-gray-400 rounded-md py-1 px-2 cursor-not-allowed">
              Delete
            </button>
          ) : (
            <button
              id="delete_user"
              onClick={() => (
                toggleModalDelete(), setIdData({ id: id, data: name })
              )}
              className="text-red-500 hover:bg-red-400 hover:text-white rounded-md py-1 px-2"
            >
              Delete
            </button>
          )}
        </td>
      </tr>
    </>
  );
};

export default UserTable;
