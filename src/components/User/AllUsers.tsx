import React, { useContext, useEffect, useState } from "react";
import { MdArrowForwardIos } from "react-icons/md";
import { NavLink, useNavigate } from "react-router-dom";
import UserTable from "./UserTable";
import axios, { AxiosError } from "axios";
import { getToken } from "../../service/getToken";
import useAuth from "../../hooks/useAuth";
import { IdContext, StockContext } from "../../App";
import { url } from "../../service/getAllUrl";
import toast from "react-hot-toast";
import service from "../../hooks/service";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { schemaUser } from "../../utils/yupSchema";
import { ProgressBar } from "react-loader-spinner";
import { VscChromeClose } from "react-icons/vsc";
import CheckRole from "../../hooks/CheckRole";
import { FiUsers } from "react-icons/fi";

type IUser = {
  name: string;
  email: string;
  password: string;
  oldPassword: string;
  roleId: number;
};

const AllUsers = () => {
  let [updateData, setUpdateData] = useContext(StockContext);
  let [idData, setIdData] = useContext(IdContext);
  const [users, setUsers] = useState([] as any);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const [search, setSearch] = useState("" as any);
  const [modal, setModal] = useState<boolean>(false);
  const [modalDelete, setModalDelete] = useState<boolean>(false);
  const [role, setRole] = useState([] as any);
  const [disable, setDisable] = useState<boolean>(false);

  const toggleModal = () => setModal(!modal);
  const toggleModalDelete = () => {
    setModalDelete(!modalDelete);
  };

  const buttonDisable = () => {
    reset();
    setDisable(false);
  };

  const [editUser, setEditUser] = useState({
    id: "",
    name: "",
    email: "",
    password: "",
    roleId: "",
    roleName: "",
  });

  let navigate = useNavigate();
  const { user } = useAuth();
  const { checkRole } = CheckRole();

  useEffect(() => {
    axios
      .get(`${url}/api/role/all`, {
        headers: { Authorization: "Bearer " + getToken()?.toString() || "" },
      })
      .then((res: any) => {
        setRole(() => res?.data?.roles);
      })
      .catch((err) => {
        //console.log(err);
        if (err.response.status === 401) {
          navigate("/login");
        }
      });
  }, []);

  useEffect(() => {
    axios
      .get(`${url}/api/user/all`, {
        headers: { Authorization: "Bearer " + getToken()?.toString() || "" },
      })
      .then((res: any) => {
        setUsers(() => res.data);
        setIsLoaded(true);
      })
      .catch((err) => {
        //console.log(err);
        if (err.response.status === 401) {
          navigate("/login");
        }
      });
  }, [updateData]);

  //modal - data
  const {
    register,
    handleSubmit,
    setError,
    getValues,
    formState: { errors },
    reset,
  } = useForm<IUser>({
    mode: "onSubmit",
    reValidateMode: "onChange",
    resolver: yupResolver(schemaUser),
    context: undefined,
    criteriaMode: "firstError",
    shouldFocusError: true,
    shouldUnregister: false,
    shouldUseNativeValidation: false,
    delayError: undefined,
  });

  const handleGetId = async (id: number) => {
    reset();
    toast
      .promise(
        service.get(`user/${id}`, {
          headers: {
            Authorization: "Bearer " + getToken()?.toString() || "",
          },
        }),
        {
          loading: "Loading",
          success: "successfully!",
          error: "Error, no stock found",
        }
      )
      .then((res: any) => {
        reset();
        const response = res?.data?.user;
        const status = res?.data?.success;
        setEditUser({
          id: response.id,
          name: response.name,
          email: response.email,
          password: response.password,
          roleId: response.roleId,
          roleName: response.role?.name,
        });

        if (status === 1) {
          toggleModal();
        }
      })
      .catch((error) => {
        const err = error as AxiosError;
        //console.log("err:", err);
      });
  };

  const handleChange = (e: any) => {
    setEditUser({
      ...editUser,
      [e.target.id]: e.target.value,
    });
    setDisable(true);
  };

  const handleSearch = (e: any) => {
    setSearch(e.target.value);
  };

  //for delete
  const handleDelete = async (id: number) => {
    toast
      .promise(
        service.delete(`user/remove/${id}`, {
          headers: {
            Authorization: "Bearer " + getToken()?.toString() || "",
          },
        }),
        {
          loading: "Loading",
          success: "Delete User successfully!",
          error: "Error Delete user",
        }
      )
      .then((res: any) => {
        const status = res?.data?.success;
        if (status === 1) {
          setUpdateData((v: number) => v + 1);
          toggleModalDelete();
        }
      })
      .catch((error) => {
        const err = error as AxiosError;
        //console.log("err:", err);
      });
  };

  const handleFormSubmit = async (e: any) => {
    reset();
    toast
      .promise(
        service.put(`user/update/${editUser.id}`, editUser, {
          headers: { Authorization: "Bearer " + getToken()?.toString() || "" },
        }),
        {
          loading: "Loading",
          success: "Updated Stock successfully!",
          error: "Error : value not change",
        }
      )
      .then((res: any) => {
        const status = res?.data?.success;

        if (status === 1) {
          setUpdateData((v: number) => v + 1);
          setDisable(false);
          toggleModal();
        }
      })
      .catch((error) => {
        const err = error as AxiosError;
        //console.log("err:", err);
      });
  };

  if (!isLoaded)
    return (
      <div className="flex justify-center items-center h-screen w-screen">
        <ProgressBar
          height="80"
          width="80"
          ariaLabel="progress-bar-loading"
          wrapperStyle={{}}
          wrapperClass="progress-bar-wrapper"
          borderColor="#F4442E"
          barColor="#51E5FF"
        />
      </div>
    );

  if (user === null) navigate(`/login`);
  if (checkRole === "User" || checkRole === "user") {
    navigate(`/sale/product`);
  }
  if (!users) return <h1>Loading....</h1>;

  return (
    <>
      {modalDelete && (
        <div className="modal h-full w-full fixed bg-gray-400 bg-opacity-50 flex justify-center items-center z-10">
          <div className="overlay">
            <div className="modal-content h-full w-full bg-white rounded-md shadow-lg">
              <div className="modal_head flex items-center justify-between px-10 py-5 border-b-2 border-b-gray-200 hover">
                <span className="font-[600] text-[20px] text-gray-500">
                  Delete this User?
                </span>
                <VscChromeClose
                  onClick={toggleModalDelete}
                  className="close_modal text-[20px] text-black hover:cursor-pointer"
                />
              </div>
              <div className="modal_body ">
                <div className="flex items-center justify-center py-5 px-10">
                  {idData.data}
                </div>
                <div className=" w-full">
                  <div className="flex items-center justify-end py-5 px-10 border-t-2 border-b-gray-200">
                    <button
                      className="font-[500]  text-red-600 hover:bg-red-500 hover:text-white bg-red-200  rounded-md py-2 px-10 mx-1"
                      onClick={() => handleDelete(idData.id)}
                    >
                      Yes
                    </button>
                    <button
                      onClick={toggleModalDelete}
                      className="font-[500] text-sky-600 hover:bg-sky-500 hover:text-white bg-sky-200 rounded-md py-2 px-10 mx-1"
                    >
                      No
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {modal && (
        <div className="modal h-full w-full fixed bg-gray-400 bg-opacity-50 flex justify-center items-center z-10 ">
          <div className="overlay ">
            <div className="modal-content h-full w-full bg-white  rounded-md shadow-lg">
              <div className="modal_head flex items-center justify-between px-10 py-5 border-b-2 border-b-gray-200 hover">
                <span className="font-[600] text-[20px] text-gray-500">
                  Edit Stock
                </span>
                <VscChromeClose
                  onClick={toggleModal}
                  className="close_modal text-[20px] text-black hover:cursor-pointer"
                />
              </div>
              <div className="modal_body">
                <div className="w-full">
                  <form onSubmit={handleSubmit(handleFormSubmit) as any}>
                    <div className="flex justify-around items-center">
                      <div className="w-[40%]">
                        <input
                          type="hidden"
                          id="id"
                          defaultValue={editUser?.id}
                          className=""
                        />

                        <div className="py-3">
                          <div className="categoryId flex justify-center items-center">
                            <label className="font-[300] pr-[10px] w-[200px]">
                              Category Name
                            </label>
                            <div className="w-full">
                              <select
                                id="roleId"
                                {...register("roleId")}
                                className="w-full  block p-2  text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-400  focus:border-blue-500  placeholder-gray-400  focus:ring-blue-500 dark:focus:border-blue-500"
                                onChange={handleChange}
                                value={
                                  editUser.roleId === ""
                                    ? role.id
                                    : editUser.roleId
                                }
                              >
                                {!!role &&
                                  role
                                    .filter((r: any) => r.name != "masterAdmin")
                                    .map((c: any, i: any) => (
                                      <option value={c.id} key={i}>
                                        {c.name}
                                      </option>
                                    ))}
                              </select>
                              <span className="text-red-500 whitespace-nowrap">
                                {errors.roleId?.message}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="py-3">
                          <div className="name flex justify-center items-center">
                            <label className="font-[300] pr-[10px] w-[200px]">
                              Name
                            </label>
                            <div className="w-full">
                              <input
                                type="text"
                                id="name"
                                {...register("name")}
                                defaultValue={editUser?.name}
                                className=" w-full block p-2 pl-3 text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-400  focus:border-blue-500  placeholder-gray-400  focus:ring-blue-500 dark:focus:border-blue-500"
                                placeholder="enter name"
                                onChange={handleChange}
                              />
                              <span className="text-red-500 whitespace-nowrap">
                                {errors.name?.message}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="w-[40%]">
                        <div className="py-3">
                          <div className="email flex justify-center items-center">
                            <label className="font-[300] pr-[10px] w-[200px]">
                              Email
                            </label>
                            <div className="w-full">
                              <input
                                type="text"
                                id="email"
                                {...register("email")}
                                defaultValue={editUser?.email}
                                className=" w-full block p-2 pl-3 text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-400  focus:border-blue-500  placeholder-gray-400  focus:ring-blue-500 dark:focus:border-blue-500"
                                placeholder="enter email no"
                                onChange={handleChange}
                              />
                              <span className="text-red-500 whitespace-nowrap">
                                {errors.email?.message}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="py-3">
                          <div className="newPassword flex justify-center items-center whitespace-nowrap">
                            <label className="font-[300] pr-[10px] w-[200px]">
                              New Password
                            </label>
                            <div className="w-full">
                              <input
                                {...register("password")}
                                type="password"
                                id="password"
                                defaultValue={editUser?.password}
                                className="w-full justify-center block p-2 pl-3 text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-400  focus:border-blue-500  placeholder-gray-400  focus:ring-blue-500 dark:focus:border-blue-500"
                                placeholder="enter reminder"
                                onChange={handleChange}
                              />
                              <span className="text-red-500 whitespace-nowrap">
                                {errors.password?.message}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center justify-end py-5 px-10 border-t-2 border-b-gray-200">
                      {disable ? (
                        <button
                          className={`font-[500] text-green-600 hover:bg-green-500 hover:text-white bg-green-200 rounded-md py-2 px-10 mx-1 `}
                          type="submit"
                        >
                          Save
                        </button>
                      ) : (
                        <input
                          readOnly
                          disabled
                          value={"Disable"}
                          className={`font-[500] text-gray-400  bg-gray-200 rounded-md py-2 px-8 mx-1 cursor-not-allowed text-center w-[130px]`}
                        />
                      )}

                      <button
                        onClick={() => (toggleModal(), buttonDisable()) as any}
                        className="font-[500] text-red-600 hover:bg-red-500 hover:text-white bg-red-200 rounded-md py-2 px-10 mx-1"
                      >
                        Close
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="all_user text-slate-900 px-5 py-6 w-full bg-[#f4f7fa]">
        <span className="flex items-center gap-2 font-[900]">
          <NavLink to="/dashboard">
            <span className="underline hover:text-blue-500 ">Dashboard</span>
          </NavLink>
          <MdArrowForwardIos className="font-[900]" />
          <span>User</span>
          <MdArrowForwardIos className="font-[900]" />
          <span>View All</span>
        </span>
        <div className="mt-5">
          <div className="px-5 py-5  h-[85vh] bg-white rounded-md">
            <div className="rounded-sm ">
              <div className="search_box pb-4 bg-white">
                <label className="sr-only">Search</label>
                <div className="relative mt-1">
                  <div className="flex absolute inset-y-0 left-0  items-center px-3 pointer-events-none">
                    <span className="">
                      <svg
                        className="w-5 h-5 text-gray-500 dark:text-gray-400"
                        aria-hidden="true"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          fillRule="evenodd"
                          d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                          clipRule="evenodd"
                        ></path>
                      </svg>
                    </span>
                  </div>
                  <input
                    type="text"
                    id="search"
                    name="search"
                    onChange={handleSearch}
                    className="w-full block p-2 px-10 text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-400 focus:ring-blue-500 focus:border-blue-500  placeholder-gray-400 "
                    placeholder="Search for users"
                  />
                </div>
              </div>
              <div className="table_box overflow-y-scroll overflow-x-scroll scroll-smooth h-[75vh]">
                {users?.users?.length === 0 ? (
                  <div className="h-[60vh] flex justify-center items-center text-gray-400">
                    <span className="mr-5">
                      <FiUsers className="text-[40px]" />
                    </span>
                    <span className=" font-open_sans text-[25px] uppercase">
                      No Customers Found
                    </span>
                  </div>
                ) : (
                  <table className="table w-full text-sm text-gray-500 ">
                    <thead className="text-xs text-gray-700 uppercase bg-[#f5f8fb] sticky top-[-1px] -z-0">
                      <tr className="">
                        <th scope="col" className="py-3 px-6 ">
                          S/L
                        </th>
                        <th scope="col" className="py-3 px-6">
                          Name
                        </th>
                        <th scope="col" className="py-3 px-6">
                          <div className="flex items-center justify-center">
                            Email
                            <a href="#">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="ml-1 w-3 h-3"
                                aria-hidden="true"
                                fill="currentColor"
                                viewBox="0 0 320 512"
                              >
                                <path d="M27.66 224h264.7c24.6 0 36.89-29.78 19.54-47.12l-132.3-136.8c-5.406-5.406-12.47-8.107-19.53-8.107c-7.055 0-14.09 2.701-19.45 8.107L8.119 176.9C-9.229 194.2 3.055 224 27.66 224zM292.3 288H27.66c-24.6 0-36.89 29.77-19.54 47.12l132.5 136.8C145.9 477.3 152.1 480 160 480c7.053 0 14.12-2.703 19.53-8.109l132.3-136.8C329.2 317.8 316.9 288 292.3 288z"></path>
                              </svg>
                            </a>
                          </div>
                        </th>
                        <th scope="col" className="py-3 px-6">
                          <div className="flex items-center justify-center">
                            Role
                            <a href="#">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="ml-1 w-3 h-3"
                                aria-hidden="true"
                                fill="currentColor"
                                viewBox="0 0 320 512"
                              >
                                <path d="M27.66 224h264.7c24.6 0 36.89-29.78 19.54-47.12l-132.3-136.8c-5.406-5.406-12.47-8.107-19.53-8.107c-7.055 0-14.09 2.701-19.45 8.107L8.119 176.9C-9.229 194.2 3.055 224 27.66 224zM292.3 288H27.66c-24.6 0-36.89 29.77-19.54 47.12l132.5 136.8C145.9 477.3 152.1 480 160 480c7.053 0 14.12-2.703 19.53-8.109l132.3-136.8C329.2 317.8 316.9 288 292.3 288z"></path>
                              </svg>
                            </a>
                          </div>
                        </th>

                        <th scope="col" className="py-3 px-6">
                          Action
                        </th>
                      </tr>
                    </thead>
                    <tbody className="">
                      {users?.users
                        ?.filter((user: any) => {
                          if (user === "") {
                            return user;
                          } else if (
                            user?.name
                              .toLowerCase()
                              .includes(search.toLowerCase()) ||
                            user?.email
                              .toLowerCase()
                              .includes(search.toLowerCase()) ||
                            user?.role?.name
                              .toLowerCase()
                              .includes(search.toLowerCase())
                          ) {
                            return user;
                          }
                        })
                        .filter((user: any) => user.role?.name != "masterAdmin")
                        .map((user: any, index: number) => (
                          <UserTable
                            key={index}
                            count={index}
                            users={user}
                            handleDelete={handleDelete}
                            handleGetId={handleGetId}
                            toggleModalDelete={toggleModalDelete}
                          ></UserTable>
                        ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AllUsers;
