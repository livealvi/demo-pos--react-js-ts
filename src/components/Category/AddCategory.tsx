import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { NavLink, useNavigate } from "react-router-dom";
import CheckRole from "../../hooks/CheckRole";
import useAuth from "../../hooks/useAuth";
import { schemaCategory } from "../../utils/yupSchema";
import { AxiosError } from "axios";
import { yupResolver } from "@hookform/resolvers/yup";
import { getToken } from "../../service/getToken";
import toast from "react-hot-toast";
import service from "../../hooks/service";
import { ProgressBar } from "react-loader-spinner";
import { MdArrowForwardIos } from "react-icons/md";

export type ICategory = {
  name: string;
};

const AddCategory = () => {
  const [categories, setCategories] = useState({
    name: "",
  });

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
  } = useForm<ICategory>({
    mode: "onSubmit",
    reValidateMode: "onChange",
    resolver: yupResolver(schemaCategory),
    context: undefined,
    criteriaMode: "firstError",
    shouldFocusError: true,
    shouldUnregister: false,
    shouldUseNativeValidation: false,
    delayError: undefined,
  });

  const handleChange = (e: any) => {
    setCategories({
      ...categories,
      [e.target.name]: e.target.value,
    });
  };

  const handleClear = (e: any) => {
    reset();
    e.preventDefault();
  };

  const handleFormSubmit = async (e: any) => {
    reset();
    toast
      .promise(
        service.post(`cate/add`, categories, {
          headers: { Authorization: "Bearer " + getToken()?.toString() || "" },
        }),
        {
          loading: "Loading",
          success: "Add Category successfully!",
          error: "Error adding category",
        }
      )
      .catch((error) => {
        const err = error as AxiosError;
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
          <NavLink to="/category/view/all">
            <span className="underline hover:text-blue-500 ">Category</span>
          </NavLink>
          <MdArrowForwardIos className="font-[900]" />
          <span className="">Add Category</span>
        </span>
        <div className="mt-5 ">
          <div className="px-5 py-5 bg-white rounded-md">
            <div className="w-full flex justify-center ">
              <form
                onSubmit={handleSubmit(handleFormSubmit) as any}
                className="rounded-md border-2 py-10 px-20"
              >
                <div className="flex justify-around items-center">
                  <div className="">
                    <div className="py-3"></div>
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
                            className="name w-full userName block p-2 pl-3 text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-400  focus:border-blue-500  placeholder-gray-400  focus:ring-blue-500 dark:focus:border-blue-500"
                            placeholder="enter category name"
                            onChange={handleChange}
                          />
                          <span className="text-red-500">
                            {errors.name?.message}
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

export default AddCategory;
