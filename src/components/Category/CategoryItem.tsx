import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  MdArrowForwardIos,
  MdInventory,
  MdOutlineInventory,
} from "react-icons/md";
import { NavLink, useNavigate } from "react-router-dom";
import axios, { AxiosError } from "axios";
import { getToken } from "../../service/getToken";
import { url } from "../../service/getAllUrl";
import { ProgressBar } from "react-loader-spinner";
import useAuth from "../../hooks/useAuth";
import service from "../../hooks/service";
import { IdContext, StockContext } from "../../App";
import { toast } from "react-hot-toast";
import { VscChromeClose } from "react-icons/vsc";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { Stock } from "../../../types";
import { schemaStock } from "../../utils/yupSchema";
import CheckRole from "../../hooks/CheckRole";
import CategoryItemTable from "./CategoryItemTable";

const CategoryItem = () => {
  let [updateData, setUpdateData] = useContext(StockContext);
  let [idData, setIdData] = useContext(IdContext);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const [stocks, setStocks] = useState([] as any);
  const [disable, setDisable] = useState<boolean>(false);
  const [modal, setModal] = useState<boolean>(false);
  const [modalDelete, setModalDelete] = useState<boolean>(false);
  const [category, setCategory] = useState([] as any);

  const [search, setSearch] = useState("" as any);

  let navigate = useNavigate();
  const { user } = useAuth();
  const { checkRole } = CheckRole();

  const toggleModal = () => setModal(!modal);
  const toggleModalDelete = () => {
    setModalDelete(!modalDelete);
  };
  const { id, categoryName } = useParams();
  const buttonDisable = () => {
    reset();
    setDisable(false);
  };

  useEffect(() => {
    axios
      .get(`${url}/api/cate/${id}`, {
        headers: { Authorization: "Bearer " + getToken()?.toString() || "" },
      })
      .then((res: any) => {
        setStocks(() => res?.data?.category);
        setIsLoaded(true);
      })
      .catch((err) => {
        //console.log(err);
        if (err.response.status === 401) {
          navigate("/login");
        }
      });
  }, [updateData]);

  useEffect(() => {
    axios
      .get(`${url}/api/cate/all`, {
        headers: { Authorization: "Bearer " + getToken()?.toString() || "" },
      })
      .then((res: any) => {
        setCategory(() => res?.data?.categories);
      })
      .catch((err) => {
        //console.log(err);
        if (err.response.status === 401) {
          navigate("/login");
        }
      });
  }, [updateData]);

  const [editStocks, setEditStocks] = useState({
    id: "",
    name: "",
    description: "",
    mrp: "",
    costing: "",
    wholesale: "",
    retail: "",
    quantity: "",
    date: "",
    categoryId: "",
    categoryName: "",
    reminder: "",
  });

  const handleDelete = async (id: number) => {
    toast
      .promise(
        service.delete(`stock/remove/${id}`, {
          headers: {
            Authorization: "Bearer " + getToken()?.toString() || "",
          },
        }),
        {
          loading: "Loading",
          success: "Delete Stock successfully!",
          error: "Error Delete stock",
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

  //modal - data
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
    resolver: yupResolver(schemaStock),
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
        service.get(`stock/${id}`, {
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
        const response = res?.data?.stock;
        const status = res?.data?.success;
        setEditStocks({
          id: response.id,
          name: response.name,
          description: response.description,
          mrp: response.mrp,
          costing: response.costing,
          wholesale: response.wholesale,
          retail: response.retail,
          quantity: response.quantity,
          date: response.date,
          categoryId: response.category?.id,
          categoryName: response.category?.name,
          reminder: response.reminder,
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
    setEditStocks({
      ...editStocks,
      [e.target.id]: e.target.value,
    });
    setDisable(true);
  };

  const handleSearch = (e: any) => {
    setSearch(e.target.value);
    setDisable(true);
  };

  const handleFormSubmit = async (e: any) => {
    reset();
    toast
      .promise(
        service.put(`stock/update/${editStocks.id}`, editStocks, {
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

  if (!stocks) return <h1>Loading....</h1>;

  return (
    <>
      {modalDelete && (
        <div className="modal h-full w-full fixed bg-gray-400 bg-opacity-50 flex justify-center items-center z-10 ">
          <div className="overlay ">
            <div className="modal-content h-full w-full bg-white  rounded-md shadow-lg">
              <div className="modal_head flex items-center justify-between px-10 py-5 border-b-2 border-b-gray-200 hover">
                <span className="font-[600] text-[20px] text-gray-500">
                  Delete this product?
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
        <div className="modal h-full w-full fixed bg-gray-400 bg-opacity-50 flex justify-center items-center z-10">
          <div className="overlay">
            <div className="modal-content h-full w-full bg-white rounded-md shadow-lg">
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
                          defaultValue={editStocks?.id}
                          className=""
                        />

                        <div className="py-3">
                          <div className="categoryId flex justify-center items-center">
                            <label className="font-[300] pr-[10px] w-[170px]">
                              Category
                            </label>
                            <div className="w-full">
                              <select
                                id="categoryId"
                                {...register("categoryId")}
                                className="w-full  block p-2  text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-400  focus:border-blue-500  placeholder-gray-400  focus:ring-blue-500 dark:focus:border-blue-500"
                                onChange={handleChange}
                                value={
                                  editStocks.categoryId === ""
                                    ? category.categoryId
                                    : editStocks.categoryId
                                }
                              >
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
                                defaultValue={editStocks?.name}
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
                                defaultValue={editStocks?.description}
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
                                type="text"
                                id="quantity"
                                {...register("quantity")}
                                defaultValue={editStocks?.quantity}
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
                                {...register("reminder")}
                                type="text"
                                id="reminder"
                                defaultValue={editStocks?.reminder}
                                className="w-full justify-center block p-2 pl-3 text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-400  focus:border-blue-500  placeholder-gray-400  focus:ring-blue-500 dark:focus:border-blue-500"
                                placeholder="enter reminder"
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
                                type="text"
                                id="mrp"
                                {...register("mrp")}
                                defaultValue={editStocks?.mrp}
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
                                type="text"
                                id="costing"
                                {...register("costing")}
                                defaultValue={editStocks?.costing}
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
                                type="text"
                                id="wholesale"
                                {...register("wholesale")}
                                defaultValue={editStocks?.wholesale}
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
                                type="text"
                                id="retail"
                                {...register("retail")}
                                defaultValue={editStocks?.retail}
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
                            defaultValue={editStocks?.sale}
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

      <div className="all_stock text-slate-900 px-5 py-6 w-full bg-[#f4f7fa]">
        <span className="flex items-center gap-2 font-[900]">
          <NavLink to="/dashboard">
            <span className="underline hover:text-blue-500">Dashboard</span>
          </NavLink>
          <MdArrowForwardIos className="font-[900]" />
          <NavLink to="/category/view/all">
            <span className="underline hover:text-blue-500">Categories</span>
          </NavLink>
          <MdArrowForwardIos className="font-[900]" />{" "}
          <span className="capitalize">{stocks.name}</span>
          <MdArrowForwardIos className="font-[900]" />{" "}
          <span className="">All Stock</span>
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
                    placeholder="Search for stock"
                  />
                </div>
              </div>
              <div className="table_box overflow-y-scroll overflow-x-scroll scroll-smooth h-[75vh]">
                {stocks?.length === 0 ? (
                  <div className="h-[60vh] flex justify-center items-center text-gray-400">
                    <span className="mr-5">
                      <MdInventory className="text-[40px]" />
                    </span>
                    <span className=" font-open_sans text-[25px] uppercase">
                      No Stock Found
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
                          <div className="flex items-center justify-center">
                            Category
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
                          Part No
                        </th>
                        <th scope="col" className="py-3 px-6">
                          <div className="flex items-center justify-center">
                            Description
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
                            M.R.P
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
                            Costing
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
                            Wholesale
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
                            Retail
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
                        {/* <th scope="col" className="py-3 px-6">
                        <div className="flex items-center justify-center">
                          Sale
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
                      </th> */}
                        <th scope="col" className="py-3 px-6">
                          <div className="flex items-center justify-center">
                            Quantity
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
                            Reminder
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
                        {/* <th scope="col" className="py-3 px-6">
                      <div className="flex items-center justify-center">
                        Date
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
                    </th> */}

                        {/* <th scope="col" className="py-3 px-6">
                        Rack
                      </th>
                      <th scope="col" className="py-3 px-6">
                        Level
                      </th> */}
                        <th scope="col" className="py-3 px-6">
                          Action
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {stocks?.stocks
                        ?.filter((stock: any) => {
                          if (search === "") {
                            return stock;
                          } else if (
                            stock?.name
                              .toLowerCase()
                              .includes(search.toLowerCase()) ||
                            stock?.description
                              .toLowerCase()
                              .includes(search.toLowerCase()) ||
                            stock?.mrp
                              .toLowerCase()
                              .includes(search.toLowerCase()) ||
                            stock?.costing
                              .toLowerCase()
                              .includes(search.toLowerCase()) ||
                            stock?.wholesale
                              .toLowerCase()
                              .includes(search.toLowerCase()) ||
                            stock?.retail
                              .toLowerCase()
                              .includes(search.toLowerCase()) ||
                            stock?.category?.name
                              .toLowerCase()
                              .includes(search.toLowerCase())
                          ) {
                            return stock;
                          }
                        })
                        .map((stock: any, index: number) => (
                          <CategoryItemTable
                            key={index}
                            count={index}
                            stocks={stock}
                            categoryName={stocks}
                            handleDelete={handleDelete}
                            handleGetId={handleGetId}
                            toggleModalDelete={toggleModalDelete}
                          ></CategoryItemTable>
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

export default CategoryItem;
