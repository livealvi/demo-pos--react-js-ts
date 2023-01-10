import React, { useContext } from "react";
import { IdContext } from "../../App";
import CheckRole from "../../hooks/CheckRole";

const UserTable = ({
  users,
  count,
  handleDelete,
  handleGetId,
  toggleModalDelete,
}: any) => {
  let [idData, setIdData] = useContext(IdContext);
  const { id, name, email, roleId } = users;

  const role = users?.role?.name;
  const { userInfo, checkRole } = CheckRole();

  return (
    <>
      <tr className="bg-white hover:bg-[#f0f4f8] border-b border-gray-300 text-center  hover:text-black">
        <th scope="row" className="py-2 px-6 font-[700] whitespace-nowrap">
          {1 + count}
        </th>
        <td className="py-2 px-6">{name}</td>
        <td className="py-2 px-6">{email}</td>
        <td className="py-2 px-6">{role}</td>
        <td className="py-2 px-6 ">
          <div className="font-black">
            <button
              onClick={() => handleGetId(id)}
              className="text-sky-600 hover:bg-sky-500 hover:text-white rounded-sm mr-2 px-2 py-1"
            >
              Edit
            </button>
            {userInfo?.name === name ? (
              <button className="text-gray-400 rounded-md py-1 px-2 cursor-not-allowed">
                Delete
              </button>
            ) : (
              <button
                id="delete_user"
                onClick={() => (
                  toggleModalDelete(), setIdData({ id: id, data: name })
                )}
                className="text-red-500 hover:bg-red-500 hover:text-white rounded-md py-1 px-2"
              >
                Delete
              </button>
            )}
          </div>
        </td>
      </tr>
    </>
  );
};

export default UserTable;
