import React, { useContext } from "react";
import { IdContext } from "../../App";

const LevelTable = ({ level, count, handleGetId, toggleModalDelete }: any) => {
  let [idData, setIdData] = useContext(IdContext);
  const { id, name, description } = level;

  return (
    <>
      <tr className="bg-white hover:bg-[#f0f4f8] border-b border-gray-300 text-center  hover:text-black">
        <th scope="row" className="py-4 px-6 font-[700] whitespace-nowrap">
          {1 + count}
        </th>
        <td className="py-4 px-6">{name}</td>
        <td className="py-4 px-6">{description}</td>

        <td className="py-4 px-6 font-black">
          <button
            onClick={() => handleGetId(id)}
            className="text-sky-500 hover:bg-sky-400 hover:text-white rounded-md py-1 px-2 ml-2"
          >
            Edit
          </button>
          <button
            id="delete_level"
            onClick={() => (
              toggleModalDelete(), setIdData({ id: id, data: name })
            )}
            className="text-red-500 hover:bg-red-500 hover:text-white rounded-md py-1 px-2"
          >
            Delete
          </button>
        </td>
      </tr>
    </>
  );
};

export default LevelTable;
