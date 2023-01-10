import React, { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { MdArrowForwardIos } from "react-icons/md";
import toast from "react-hot-toast";
import { useForm } from "react-hook-form";
import service from "../../hooks/service";
import { getToken } from "../../service/getToken";
import axios, { Axios, AxiosError } from "axios";
import useAuth from "../../hooks/useAuth";
import { ProgressBar } from "react-loader-spinner";
import { yupResolver } from "@hookform/resolvers/yup";
import { Stock } from "../../../types";
import { schemaAddStock } from "../../utils/yupSchema";
import { url } from "../../service/getAllUrl";
import CheckRole from "../../hooks/CheckRole";

const AddStock = () => {
  const [stocks, setStocks] = useState({
    name: "",
    description: "",
    mrp: "",
    costing: "",
    wholesale: "",
    retail: "",
    quantity: "",
    categoryId: "",
    reminder: "",
  });
  const [category, setCategory] = useState([] as any);

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
  } = useForm<Stock>({
    mode: "onSubmit",
    reValidateMode: "onChange",
    resolver: yupResolver(schemaAddStock),
    context: undefined,
    criteriaMode: "firstError",
    shouldFocusError: true,
    shouldUnregister: false,
    shouldUseNativeValidation: false,
    delayError: undefined,
  });

  useEffect(() => {
    axios
      .get(`${url}/api/cate/all`, {
        headers: { Authorization: "Bearer " + getToken()?.toString() || "" },
      })
      //res?.data?.categories
      .then((res: any) => {
        setCategory(() => res?.data?.categories);
      })
      .catch((err) => {
        //console.log(err);
        if (err.response.status === 401) {
          navigate("/login");
        }
      });
  }, []);

  const handleChange = (e: any) => {
    setStocks({
      ...stocks,
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
        service.post(`stock/add`, stocks, {
          headers: { Authorization: "Bearer " + getToken()?.toString() || "" },
        }),
        {
          loading: "Loading",
          success: "Add Stock successfully!",
          error: "Error adding stock",
        }
      )
      .catch((error) => {
        const err = error as AxiosError;
        // console.log("err:", err);
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
    <div className="text-slate-900 px-5 py-6 w-full bg-[#f4f7fa] ">
      <span className="flex items-center gap-2 font-[900]">
        <NavLink to="/dashboard">
          <span className="underline hover:text-blue-500 ">Dashboard</span>
        </NavLink>
        <MdArrowForwardIos className="font-[900]" />
        <NavLink to="/stock/view/all">
          <span className="underline hover:text-blue-500 ">Stock</span>
        </NavLink>
        <MdArrowForwardIos className="font-[900]" />
        <span className="">Add Stock</span>
      </span>
      <div className="mt-5 ">
        <div className="px-5 py-5 bg-white rounded-md">
          <div className=" w-full">
            <form action="" onSubmit={handleSubmit(handleFormSubmit) as any}>
              <div className="flex justify-around items-center">
                <div className="w-[40%]">
                  <div className="py-3">
                    <div className="categoryId flex justify-center items-center">
                      <label className="font-[300] pr-[10px] w-[170px]">
                        Select Category
                      </label>
                      <div className="w-full">
                        <select
                          id="categoryId"
                          {...register("categoryId")}
                          className="w-full  block p-2  text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-400  focus:border-blue-500  placeholder-gray-400  focus:ring-blue-500 dark:focus:border-blue-500"
                          onChange={handleChange}
                          value={
                            stocks.categoryId === ""
                              ? stocks.categoryId
                              : stocks.categoryId
                          }
                        >
                          <option defaultValue="">Choose From List</option>
                          {!!category &&
                            category.map((c: any, i: any) => (
                              <option value={c.id} key={i}>
                                {c.name}
                              </option>
                            ))}
                        </select>
                        <span className="text-red-500">
                          {errors.categoryId?.message}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="py-3">
                    <div className="name flex justify-center items-center">
                      <label className="font-[300] pr-[10px] w-[170px]">
                        Part No
                      </label>
                      <div className="w-full">
                        <input
                          type="text"
                          id="name"
                          {...register("name")}
                          className=" w-full  block p-2 pl-3 text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-400  focus:border-blue-500  placeholder-gray-400  focus:ring-blue-500 dark:focus:border-blue-500"
                          placeholder="enter part no"
                          onChange={handleChange}
                        />
                        <span className="text-red-500">
                          {errors.name?.message}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="py-3">
                    <div className="description flex justify-center items-center">
                      <label className="font-[300] pr-[10px] w-[170px]">
                        Description
                      </label>
                      <div className="w-full">
                        <textarea
                          cols={60}
                          rows={9}
                          id="description"
                          {...register("description")}
                          className="w-full justify-center block p-2 pl-3 text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-400  focus:border-blue-500  placeholder-gray-400  focus:ring-blue-500 dark:focus:border-blue-500"
                          placeholder="enter description"
                          onChange={handleChange}
                        ></textarea>
                        <span className="text-red-500">
                          {errors.description?.message}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="w-[40%]">
                  <div className="py-3">
                    <div className="quantity flex justify-center items-center">
                      <label className="font-[300] pr-[10px] w-[170px]">
                        Quantity
                      </label>
                      <div className="w-full">
                        <input
                          type="number"
                          id="quantity"
                          min="0"
                          step="0.01"
                          {...register("quantity")}
                          className="w-full justify-center block p-2 pl-3 text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-400  focus:border-blue-500  placeholder-gray-400  focus:ring-blue-500 dark:focus:border-blue-500"
                          placeholder="enter quantity"
                          onChange={handleChange}
                        />
                        <span className="text-red-500">
                          {errors.quantity?.message}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="py-3">
                    <div className="quantity flex justify-center items-center">
                      <label className="font-[300] pr-[10px] w-[170px]">
                        Reminder
                      </label>
                      <div className="w-full">
                        <input
                          type="number"
                          id="reminder"
                          min="0"
                          step="0.01"
                          {...register("reminder")}
                          className="w-full justify-center block p-2 pl-3 text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-400  focus:border-blue-500  placeholder-gray-400  focus:ring-blue-500 dark:focus:border-blue-500"
                          placeholder="enter quantity"
                          onChange={handleChange}
                        />
                        <span className="text-red-500">
                          {errors.reminder?.message}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="py-3">
                    <div className="mrp flex justify-center items-center">
                      <label className="font-[300] pr-[10px] w-[170px]">
                        MRP
                      </label>
                      <div className="w-full">
                        <input
                          type="number"
                          id="mrp"
                          min="0"
                          step="0.01"
                          {...register("mrp")}
                          className="w-full justify-center block p-2 pl-3 text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-400  focus:border-blue-500  placeholder-gray-400  focus:ring-blue-500 dark:focus:border-blue-500"
                          placeholder="enter mrp"
                          onChange={handleChange}
                        />
                        <span className="text-red-500">
                          {errors.mrp?.message}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="py-3">
                    <div className="costing flex justify-center items-center">
                      <label className="font-[300] pr-[10px] w-[170px]">
                        Costing
                      </label>
                      <div className="w-full">
                        <input
                          type="number"
                          id="costing"
                          min="0"
                          step="0.01"
                          {...register("costing")}
                          className="w-full justify-center block p-2 pl-3 text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-400  focus:border-blue-500  placeholder-gray-400  focus:ring-blue-500 dark:focus:border-blue-500"
                          placeholder="enter costing"
                          onChange={handleChange}
                        />
                        <span className="text-red-500">
                          {errors.costing?.message}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="py-3">
                    <div className="wholesale flex justify-center items-center">
                      <label className="font-[300] pr-[10px] w-[170px]">
                        Wholesale
                      </label>
                      <div className="w-full">
                        <input
                          type="number"
                          id="wholesale"
                          min="0"
                          step="0.01"
                          {...register("wholesale")}
                          className="w-full justify-center block p-2 pl-3 text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-400  focus:border-blue-500  placeholder-gray-400  focus:ring-blue-500 dark:focus:border-blue-500"
                          placeholder="enter wholesale"
                          onChange={handleChange}
                        />
                        <span className="text-red-500">
                          {errors.wholesale?.message}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="py-3">
                    <div className="retail flex justify-center items-center">
                      <label className="font-[300] pr-[10px] w-[170px]">
                        Retail
                      </label>
                      <div className="w-full">
                        <input
                          type="number"
                          id="retail"
                          min="0"
                          step="0.01"
                          {...register("retail")}
                          className="w-full justify-center block p-2 pl-3 text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-400  focus:border-blue-500  placeholder-gray-400  focus:ring-blue-500 dark:focus:border-blue-500"
                          placeholder="enter retail"
                          onChange={handleChange}
                        />
                        <span className="text-red-500">
                          {errors.retail?.message}
                        </span>
                      </div>
                    </div>
                  </div>
                  {/* <div className="py-3">
                    <div className="sale flex justify-center items-center">
                      <label className="font-[300] pr-[10px] w-[170px]">
                        Sale
                      </label>
                      <div className="w-full">
                        <input
                          type="text"
                          id="sale"
                          {...register("sale")}
                          className="w-full justify-center block p-2 pl-3 text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-400  focus:border-blue-500  placeholder-gray-400  focus:ring-blue-500 dark:focus:border-blue-500"
                          placeholder="enter sale"
                          onChange={handleChange}
                        />
                        <span className="text-red-500">
                          {errors.sale?.message}
                        </span>
                      </div>
                    </div>
                  </div> */}

                  {/* <div className="py-3">
                    <div className="email flex justify-center items-center">
                      <label className="font-[300] pr-[10px] w-[170px]">
                        Date
                      </label>
                      <div className="w-full">
                        <input
                          type="date"
                          name="costing"
                          id="costing"
                          className="w-full justify-center block p-2 pl-3 text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-400  focus:border-blue-500  placeholder-gray-400  focus:ring-blue-500 dark:focus:border-blue-500"
                          placeholder="enter costing"
                        />
                      </div>
                    </div>
                  </div> */}
                  {/* <div className="py-3">
                    <div className="userId flex justify-center items-center">
                      <div className="w-full">
                        <input
                          type="hidden"
                          id="userId"
                          className=""
                          placeholder="enter userId"
                          onChange={handleChange}
                        />
                      </div>
                    </div>
                  </div> */}
                </div>
              </div>
              <div className="flex items-center justify-center py-5">
                <button
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
  );
};

export default AddStock;
