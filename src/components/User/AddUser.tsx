import React, { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import axios, { AxiosError } from "axios";
import useAuth from "../../hooks/useAuth";
import { schemaAddUser } from "../../utils/yupSchema";
import service from "../../hooks/service";
import { getToken } from "../../service/getToken";
import { ProgressBar } from "react-loader-spinner";
import { MdArrowForwardIos } from "react-icons/md";
import { url } from "../../service/getAllUrl";
import CheckRole from "../../hooks/CheckRole";

type IUser = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  roleId: number;
};

const AddUser = () => {
  const [users, setUsers] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    roleId: "",
  });
  const [role, setRole] = useState([] as any);
  const [emailExist, setEmailExist] = useState([] as any);

  let navigate = useNavigate();
  const { user } = useAuth();
  const { checkRole } = CheckRole();

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
    resolver: yupResolver(schemaAddUser),
    context: undefined,
    criteriaMode: "firstError",
    shouldFocusError: true,
    shouldUnregister: false,
    shouldUseNativeValidation: false,
    delayError: undefined,
  });

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

  const handleChange = (e: any) => {
    setUsers({
      ...users,
      [e.target.name]: e.target.value,
    });
  };

  const handleClear = (e: any) => {
    reset();
    e.preventDefault();
  };

  const handleFormSubmit = async (e: any) => {
    toast
      .promise(
        service.post(`user/signup`, users, {
          headers: { Authorization: "Bearer " + getToken()?.toString() || "" },
        }),
        {
          loading: "Loading",
          success: "Add User successfully!",
          error: "Error adding user",
        }
      )
      .then((res: any) => {
        const status = res?.data?.success;
        if (status === 1) {
          setEmailExist("");
          reset();
        }
      })
      .catch((error) => {
        const err = error as AxiosError;
        setEmailExist((err?.response?.data as any).message);
      });
  };
  if (user === null) navigate(`/login`);
  if (checkRole === "User" || checkRole === "user") {
    navigate(`/sale/product`);
  }

  if (!user)
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

  return (
    <>
      <div
        id="add_user"
        className="text-slate-900 px-5 py-6 w-full bg-[#f4f7fa] "
      >
        <span className="flex items-center gap-2 font-[900]">
          <NavLink to="/dashboard">
            <span className="underline hover:text-blue-500 ">Dashboard</span>
          </NavLink>
          <MdArrowForwardIos className="font-[900]" />
          <NavLink to="/user/view/all">
            <span className="underline hover:text-blue-500 ">User</span>
          </NavLink>
          <MdArrowForwardIos className="font-[900]" />
          <span className="">Add User</span>
        </span>
        <div className="mt-5 ">
          <div className="px-5 py-5 bg-white rounded-md">
            <div className=" w-full">
              <form onSubmit={handleSubmit(handleFormSubmit) as any}>
                <div className="flex justify-around items-center">
                  <div className="w-[40%]">
                    <div className="py-3">
                      <div className="flex justify-center items-center">
                        <label className="font-[300] pr-[10px] w-[170px]">
                          Select Role
                        </label>
                        <div className="w-full">
                          <select
                            id="roleId"
                            {...register("roleId")}
                            className="roleId w-full block p-2  text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-400  focus:border-blue-500  placeholder-gray-400  focus:ring-blue-500 dark:focus:border-blue-500"
                            onChange={handleChange}
                            value={
                              role?.roleId === "" ? role?.roleId : role?.roleId
                            }
                          >
                            <option defaultValue="">Choose From List</option>
                            {!!role &&
                              role
                                .filter((r: any) => r.name != "masterAdmin")
                                .map((c: any, i: any) => (
                                  <option value={c.id} key={i}>
                                    {c.name}
                                  </option>
                                ))}
                          </select>
                          <span className="text-red-500">
                            {errors.roleId?.message}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="py-3">
                      <div className="flex justify-center items-center">
                        <label className="font-[300] pr-[10px] w-[170px]">
                          Name
                        </label>
                        <div className="w-full">
                          <input
                            type="text"
                            id="name"
                            {...register("name")}
                            className="username w-full userName block p-2 pl-3 text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-400  focus:border-blue-500  placeholder-gray-400  focus:ring-blue-500 dark:focus:border-blue-500"
                            placeholder="enter part name"
                            onChange={handleChange}
                          />
                          <span className="text-red-500">
                            {errors.name?.message}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="py-3">
                      <div className="name flex justify-center items-center">
                        <label className="font-[300] pr-[10px] w-[170px]">
                          Email
                        </label>
                        <div className="w-full">
                          <input
                            type="email"
                            id="email"
                            {...register("email")}
                            className=" w-full  block p-2 pl-3 text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-400  focus:border-blue-500  placeholder-gray-400  focus:ring-blue-500 dark:focus:border-blue-500"
                            placeholder="enter part email"
                            onChange={handleChange}
                          />
                          <span className="text-red-500">
                            {errors.email?.message}
                            {emailExist}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="w-[40%]">
                    <div className="py-3">
                      <div className="password flex justify-center items-center">
                        <label className="font-[300] pr-[10px] w-[170px]">
                          Password
                        </label>
                        <div className="w-full">
                          <input
                            type="password"
                            id="password"
                            {...register("password")}
                            className="w-full justify-center block p-2 pl-3 text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-400  focus:border-blue-500  placeholder-gray-400  focus:ring-blue-500 dark:focus:border-blue-500"
                            placeholder="enter password"
                            onChange={handleChange}
                          />
                          <span className="text-red-500">
                            {errors.password?.message}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="py-3">
                      <div className="password flex justify-center items-center">
                        <label className="font-[300] pr-[10px] w-[170px] whitespace-nowrap">
                          Confirm Password
                        </label>
                        <div className="w-full">
                          <input
                            type="password"
                            id="confirmPassword"
                            {...register("confirmPassword")}
                            className="w-full justify-center block p-2 pl-3 text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-400  focus:border-blue-500  placeholder-gray-400  focus:ring-blue-500 dark:focus:border-blue-500"
                            placeholder="enter confirm password"
                            onChange={handleChange}
                          />
                          <span className="text-red-500">
                            {errors.confirmPassword?.message}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-center py-5">
                  <button
                    id="clickToUser"
                    className="font-[500] text-green-600 hover:bg-green-500 hover:text-white bg-green-200 rounded-md py-2 px-10 mx-1"
                    type="submit"
                  >
                    Submit
                  </button>
                  <button
                    onClick={handleClear}
                    className="font-[500] text-sky-600 hover:bg-sky-500 hover:text-white bg-sky-200 rounded-md py-2 px-10 mx-1"
                  >
                    Clear
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AddUser;
