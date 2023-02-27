import React, { useContext, useEffect, useState } from "react";
import { NavLink, useNavigate, useParams } from "react-router-dom";
import CheckRole from "../../hooks/CheckRole";
import useAuth from "../../hooks/useAuth";
import axios, { AxiosError } from "axios";
import { url } from "../../service/getAllUrl";
import { getToken } from "../../service/getToken";
import { ProgressBar } from "react-loader-spinner";
import FilterDueTable from "./FilterDueTable";
import {
  MdArrowForwardIos,
  MdOutlinePointOfSale,
  MdProductionQuantityLimits,
} from "react-icons/md";
import { toast } from "react-hot-toast";
import service from "../../hooks/service";
import { IdContext, StockContext } from "../../App";
import { VscChromeClose } from "react-icons/vsc";

import Moment from "react-moment";
import { AiFillPrinter } from "react-icons/ai";
import moment from "moment-timezone";
import { GiReceiveMoney } from "react-icons/gi";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { schemaEditDue } from "../../utils/yupSchema";

export type IEditDue = {
  description: string;
  collection: number;
};

const FilterDue = () => {
  let [idData, setIdData] = useContext(IdContext);
  let [updateData, setUpdateData] = useContext(StockContext);
  const [dues, setDues] = useState([] as any);
  const [dueItems, setDueItems] = useState([] as any);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const [search, setSearch] = useState("" as any);
  const [modal, setModal] = useState<boolean>(false);
  const [modalEdit, setModalEdit] = useState<boolean>(false);
  const [disable, setDisable] = useState<boolean>(false);
  const [customDate, setCustomDate] = useState("" as any);
  const [customPicker, setCustomPicker] = useState("" as any);
  const [editDue, setEditDue] = useState([] as any);
  const [amountDue, setAmountDue] = useState(0 as any);
  const [amountRemain, setAmountRemain] = useState(0 as any);
  const [amountTotal, setAmountTotal] = useState(0 as any);

  const {
    register,
    handleSubmit,
    setError,
    getValues,
    formState: { errors },
    reset,
  } = useForm<IEditDue>({
    mode: "onSubmit",
    reValidateMode: "onChange",
    resolver: yupResolver(schemaEditDue),
    context: undefined,
    criteriaMode: "firstError",
    shouldFocusError: true,
    shouldUnregister: false,
    shouldUseNativeValidation: false,
    delayError: undefined,
  });

  const buttonDisable = () => {
    reset();
    setDisable(false);
  };

  const toggleModal = () => {
    setModal(!modal);
  };
  const toggleEditModal = () => {
    reset();
    setModalEdit(!modalEdit);
    setEditDue([]);
    setAmountTotal([]);
    setAmountRemain([]);
    setDisable(false);
  };

  const handleChange = (e: any) => {
    setEditDue({
      ...editDue,
      [e.target.id]: e.target.value,
    });
    setDisable(true);
  };

  let navigate = useNavigate();
  const { user } = useAuth();
  const { checkRole } = CheckRole();
  const { filter } = useParams();

  const currentTime = new Date().toISOString();
  const today = moment(currentTime).tz("Asia/Dhaka").format("YYYY-MM-DD");
  const end = moment(today)
    .endOf("M")
    .subtract(1, "M")
    .tz("Asia/Dhaka")
    .format("DD");

  const handelClear = () => {
    setCustomPicker("");
    setUpdateData((v: number) => v + 1);
    navigate(`/due/0`);
  };

  useEffect(() => {
    setDues([""]);
    if (customPicker === "") {
      axios
        .get(`${url}/api/due/last/${filter}`, {
          headers: { Authorization: "Bearer " + getToken()?.toString() || "" },
        })
        .then((res: any) => {
          setDues(() => res?.data);
          setIsLoaded(true);
          return;
        })
        .catch((err) => {
          //console.log(err);
          if (err.response.status === 401) {
            navigate("/login");
          }
        });
    } else if (customPicker) {
      setDues([""]);
      axios
        .get(`${url}/api/due/last/${customPicker}`, {
          headers: { Authorization: "Bearer " + getToken()?.toString() || "" },
        })
        .then((res: any) => {
          setDues(() => res?.data);
          setIsLoaded(true);
        })
        .catch((err) => {
          //console.log(err);
          if (err.response.status === 401) {
            navigate("/login");
          }
        });
    }
  }, [updateData, filter, customPicker]);

  const handleGetId = async (id: number) => {
    toast
      .promise(
        service.get(`due/${id}`, {
          headers: {
            Authorization: "Bearer " + getToken()?.toString() || "",
          },
        }),
        {
          loading: "Loading",
          success: "successfully!",
          error: "Error, no due found",
        }
      )
      .then((res: any) => {
        setDueItems(res?.data?.due);
        const status = res?.data?.success;

        if (status === 1) {
          if (modalEdit) {
            toggleEditModal();
          } else if (modal) {
            toggleModal();
          }
        }
      })
      .catch((error) => {
        const err = error as AxiosError;
        //console.log("err:", err);
      });
  };

  const handleSearch = (e: any) => {
    setSearch(e.target.value);
  };

  const handelDatePicker = (e: any) => {
    setCustomPicker(e.target.value);
  };

  //all sum
  const oldCollection = Number(dueItems.collection);
  const newCollection = Number(editDue.collection);
  const oldTotalDueAmount = Number(dueItems.amount);

  useEffect(() => {
    setAmountTotal(oldCollection + newCollection);
    setAmountRemain(Number(oldTotalDueAmount - amountTotal).toFixed(2));
  }, [editDue, amountTotal, amountRemain]);

  const handleFormSubmit = async (e: any) => {
    toast
      .promise(
        service.put(`due/update/${dueItems.id}`, editDue, {
          headers: { Authorization: "Bearer " + getToken()?.toString() || "" },
        }),
        {
          loading: "Loading",
          success: "Update Due successfully!",
          error: "Error updating due",
        }
      )
      .then((res: any) => {
        const status = res?.data?.success;

        if (status === 1) {
          setDisable(false);
          toggleEditModal();
          setUpdateData((v: number) => v + 1);
          setEditDue([]);
          dueItems([]);
          setAmountTotal([]);
          setAmountRemain([]);
          reset();
        }
      })
      .catch((error) => {
        const err = error as AxiosError;
        //console.log(err);
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

  return (
    <>
      {/* due detail */}
      {modal && (
        <div className="modal h-full w-full fixed bg-gray-400 bg-opacity-50 flex justify-center items-center z-10">
          <div className="overlay min-w-[50%]">
            <div className="modal-content h-full w-full bg-white  rounded-md shadow-lg">
              <div className="modal_head flex items-center justify-between px-7 py-5 border-b border-b-gray-200 hover">
                <span className="font-[600] text-[20px] text-gray-500">
                  Due Detail&nbsp;:&nbsp;
                  <span className="text-gray-400">{dueItems.title}</span>
                </span>
                <VscChromeClose
                  onClick={toggleModal}
                  className="close_modal text-[20px] text-black hover:cursor-pointer"
                />
              </div>
              <div className="modal_body m-4 overflow-y-scroll overflow-x-scroll scroll-smooth">
                <div className="order_infos m-3 text-sm flex justify-between">
                  <div className="left items-start">
                    <div className="flex flex-col">
                      <span className="my-1">
                        <span className="">Order ID:&nbsp;</span>
                        <span className="font-medium">{dueItems.dueId}</span>
                      </span>
                      <span className="my-1">
                        <span className="">Start:&nbsp;</span>
                        <span className="font-medium">
                          <Moment
                            tz="Asia/Dhaka"
                            format="DD/MM/YYYY"
                            date={dueItems?.createdAt}
                          />
                        </span>
                        <span className="mx-1 font-medium">-</span>
                        <span className="font-medium">
                          <Moment
                            tz="Asia/Dhaka"
                            format="hh:mm A"
                            date={dueItems?.createdAt}
                          />
                        </span>
                      </span>
                      <span className="my-1">
                        <span className="">End:&nbsp;</span>
                        {dueItems.updatedAt === null ? (
                          "--/--/--- - -- : --"
                        ) : (
                          <span>
                            <span className="font-medium">
                              <Moment
                                tz="Asia/Dhaka"
                                format="DD/MM/YYYY"
                                date={dueItems?.updatedAt}
                              />
                            </span>
                            <span className="mx-1 font-medium">-</span>
                            <span className="font-medium">
                              <Moment
                                tz="Asia/Dhaka"
                                format="hh:mm A"
                                date={dueItems?.updatedAt}
                              />
                            </span>
                          </span>
                        )}
                      </span>
                    </div>
                  </div>

                  <div className="right">
                    <div className="flex flex-col items-end">
                      <span className="my-1">
                        <span className="">Purchased by:&nbsp;</span>
                        <span
                          className={`${
                            dueItems?.customer?.name === null
                              ? "font-[400]"
                              : "text-sky-700"
                          } font-medium `}
                        >
                          {dueItems?.customer?.name === null
                            ? "No Name"
                            : dueItems?.customer?.name}
                        </span>
                      </span>

                      <span className="my-1">
                        <span className="">Sold by:&nbsp;</span>
                        <span
                          className={`${
                            dueItems?.customer?.sale[0]?.user?.name ===
                            undefined
                              ? "font-[400]"
                              : "text-sky-700"
                          } font-medium `}
                        >
                          {dueItems?.customer?.sale[0]?.user?.name === undefined
                            ? "No Name"
                            : dueItems?.customer?.sale[0]?.user?.name}
                        </span>
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col justify-between">
                  <div className="oder_items_detail flex flex-col justify-between max-h-[55vh]">
                    <div className="all_count flex flex-col pt-4 px-4 mt-2 border-dashed border-t-2 border-b-2 border-gray-400 text-sm text-gray-600">
                      <div className="due_change flex flex-col">
                        <div className="flex justify-between">
                          <span className="flex flex-col mb-1  max-w-[40%]">
                            <span className="font-black pt-1">
                              Description:
                            </span>
                            <span className=" text-justify">
                              {dueItems.description === null
                                ? "No Desc."
                                : dueItems.description}
                            </span>
                          </span>
                          <span className="px-2 capitalize font-black flex flex-col">
                            <span className="flex justify-between mt-1">
                              <span className="mr-3">
                                Total Due Amount&nbsp;:&nbsp;
                              </span>
                              <span
                                className={`${
                                  dueItems?.deposit === "0.00"
                                    ? ""
                                    : "text-red-600"
                                }`}
                              >
                                {dueItems.amount}
                              </span>
                            </span>

                            <span className="flex justify-between mt-1">
                              <span className="mr-3">
                                Total Paid&nbsp;:&nbsp;
                              </span>
                              <span
                                className={`${
                                  dueItems.collection === dueItems.amount
                                    ? "text-green-600"
                                    : "text-blue-600"
                                }`}
                              >
                                {dueItems.collection}
                              </span>
                            </span>

                            <span className="flex justify-between">
                              {dueItems?.collection === "0.00" ? (
                                <span className="flex justify-between w-full border-t-2 border-gray-300 pt-2 mt-2">
                                  <span className="mr-3">Due&nbsp;:</span>
                                  <span className="text-red-600">
                                    {dueItems.remain}
                                  </span>
                                </span>
                              ) : (
                                <span className="flex justify-between w-full border-t-2 border-gray-300 pt-2 mt-2">
                                  <span className="">Remain&nbsp;:</span>
                                  <span className="">
                                    {dueItems.amount <= dueItems.collection
                                      ? dueItems.amount
                                      : dueItems.remain}
                                  </span>
                                </span>
                              )}
                            </span>
                          </span>
                        </div>
                      </div>

                      <div className="flex justify-between border-solid border-t border-gray-400 text-sm text-gray-600 py-5 px-2 mt-4 font-black">
                        <span className="text-gray-500">
                          Payment Method&nbsp;:&nbsp;
                        </span>
                        <span className="text-gray-600">Cash</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* due edit detail */}
      {modalEdit && (
        <div className="modal h-full w-full fixed bg-gray-400 bg-opacity-50 flex justify-center items-center z-10">
          <div className="overlay min-w-[50%]">
            <div className="modal-content h-full w-full bg-white  rounded-md shadow-lg">
              <div className="modal_head flex items-center justify-between px-7 py-5 border-b border-b-gray-200 hover">
                <span className="font-[600] text-[20px] text-gray-500">
                  Due Edit Detail&nbsp;:&nbsp;
                  <span className="text-gray-400">{dueItems.title}</span>
                </span>
                <VscChromeClose
                  onClick={toggleEditModal}
                  className="close_modal text-[20px] text-black hover:cursor-pointer"
                />
              </div>
              <div className="modal_body m-4 overflow-y-scroll overflow-x-scroll scroll-smooth">
                <div className="order_infos m-3 text-sm flex justify-between">
                  <div className="left items-start">
                    <div className="flex flex-col">
                      <span className="my-1">
                        <span className="">Order ID:&nbsp;</span>
                        <span className="font-medium">{dueItems.dueId}</span>
                      </span>
                      <span className="my-1">
                        <span className="">Start:&nbsp;</span>
                        <span className="font-medium">
                          <Moment
                            tz="Asia/Dhaka"
                            format="DD/MM/YYYY"
                            date={dueItems?.createdAt}
                          />
                        </span>
                        <span className="mx-1 font-medium">-</span>
                        <span className="font-medium">
                          <Moment
                            tz="Asia/Dhaka"
                            format="hh:mm A"
                            date={dueItems?.createdAt}
                          />
                        </span>
                      </span>
                      <span className="my-1">
                        <span className="">End:&nbsp;</span>
                        {dueItems.updatedAt === null ? (
                          "--/--/--- - -- : --"
                        ) : (
                          <span>
                            <span className="font-medium">
                              <Moment
                                tz="Asia/Dhaka"
                                format="DD/MM/YYYY"
                                date={dueItems?.updatedAt}
                              />
                            </span>
                            <span className="mx-1 font-medium">-</span>
                            <span className="font-medium">
                              <Moment
                                tz="Asia/Dhaka"
                                format="hh:mm A"
                                date={dueItems?.updatedAt}
                              />
                            </span>
                          </span>
                        )}
                      </span>
                    </div>
                  </div>

                  <div className="right">
                    <div className="flex flex-col items-end">
                      <span className="my-1">
                        <span className="">Purchased by:&nbsp;</span>
                        <span
                          className={`${
                            dueItems?.customer?.name === null
                              ? "font-[400]"
                              : "text-sky-700"
                          } font-medium `}
                        >
                          {dueItems?.customer?.name === null
                            ? "No Name"
                            : dueItems?.customer?.name}
                        </span>
                      </span>

                      <span className="my-1">
                        <span className="">Sold by:&nbsp;</span>
                        <span
                          className={`${
                            dueItems?.customer?.sale[0]?.user?.name ===
                            undefined
                              ? "font-[400]"
                              : "text-sky-700"
                          } font-medium `}
                        >
                          {dueItems?.customer?.sale[0]?.user?.name === undefined
                            ? "No Name"
                            : dueItems?.customer?.sale[0]?.user?.name}
                        </span>
                      </span>
                    </div>
                  </div>
                </div>
                <form onSubmit={handleSubmit(handleFormSubmit) as any}>
                  <div className="flex flex-col justify-between">
                    <div className="oder_items_detail flex flex-col justify-between max-h-[55vh]">
                      <div className="flex flex-col py-4 px-4 mt-2 border-dashed border-t-2 border-gray-400 text-sm text-gray-600">
                        <span className="flex items-center mb-3 justify-center">
                          <span className="font-medium mr-2">
                            Descrip.&nbsp;:
                          </span>
                          <span>
                            <input
                              id="description"
                              {...register("description")}
                              defaultValue={editDue?.description}
                              maxLength={66}
                              className="name w-full remarks block py-1 pl-3 text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-400  focus:border-blue-500  placeholder-gray-400  focus:ring-blue-500 dark:focus:border-blue-500"
                              placeholder="enter description"
                              onChange={handleChange}
                            />
                            <span className="text-red-500 whitespace-nowrap">
                              {errors.description?.message}
                            </span>
                          </span>
                        </span>
                        <span className="flex flex-col">
                          <span className="flex justify-center items-center">
                            <span className="font-medium mr-2">
                              Amount&nbsp;:
                            </span>
                            <span>
                              <input
                                type="number"
                                id="collection"
                                min="0"
                                step="0.01"
                                {...register("collection")}
                                defaultValue="0.00"
                                className="name w-full remarks block py-1 pl-3 text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-400  focus:border-blue-500  placeholder-gray-400  focus:ring-blue-500 dark:focus:border-blue-500"
                                placeholder="enter amount to paid"
                                onChange={handleChange}
                              />
                            </span>
                          </span>
                          <span className="text-red-500 whitespace-nowrap justify-center flex">
                            {errors.collection?.message}
                          </span>
                        </span>
                      </div>

                      <div className="all_count flex flex-col pt-4 px-4 border-dashed border-t-2 border-b-2 border-gray-400 text-sm text-gray-600">
                        <div className="due_change flex flex-col">
                          <div className="flex justify-between">
                            <span className="flex flex-col mb-1  max-w-[40%]">
                              <span className="font-black pt-1">
                                Description:
                              </span>
                              {disable ? (
                                <span className=" text-justify">
                                  {editDue.description === null ||
                                  editDue.description === ""
                                    ? "No Desc."
                                    : editDue.description}
                                </span>
                              ) : (
                                "No Desc."
                              )}
                            </span>
                            <span className="flex flex-col">
                              <span className="px-2 capitalize font-black flex flex-col">
                                <span className="flex justify-between mt-1">
                                  <span className="mr-3">
                                    Prev. Due Amount&nbsp;:&nbsp;
                                  </span>
                                  <span
                                    className={`${
                                      dueItems?.deposit === "0.00"
                                        ? ""
                                        : "text-red-600"
                                    }`}
                                  >
                                    {dueItems.amount}
                                  </span>
                                </span>

                                <span className="flex justify-between mt-1">
                                  <span className="mr-3">
                                    Prev. Paid&nbsp;:&nbsp;
                                  </span>
                                  <span
                                    className={`${
                                      dueItems.collection === dueItems.amount
                                        ? "text-green-600"
                                        : "text-blue-600"
                                    }`}
                                  >
                                    {dueItems.collection}
                                  </span>
                                </span>

                                <span className="flex justify-between">
                                  {dueItems?.collection === "0.00" ? (
                                    <span className="flex justify-between w-full border-t-2 border-gray-300 pt-2 mt-2">
                                      <span className="mr-3">Due&nbsp;:</span>
                                      <span className="text-red-600">
                                        {Number(dueItems.remain).toFixed(2)}
                                      </span>
                                    </span>
                                  ) : (
                                    <span className="flex justify-between w-full border-t-2 border-gray-300 pt-2 mt-2">
                                      <span className="">
                                        Prev. Remain&nbsp;:
                                      </span>
                                      <span className="">
                                        {dueItems.amount <=
                                        dueItems.collection ? (
                                          <span className="text-orange-500">
                                            {Number(dueItems.remain).toFixed(2)}
                                          </span>
                                        ) : (
                                          <span>
                                            {Number(dueItems.remain).toFixed(2)}
                                          </span>
                                        )}
                                      </span>
                                    </span>
                                  )}
                                </span>
                              </span>
                              <span className="px-2 capitalize font-black flex flex-col border-solid border-t-4 border-gray-400 mt-5 pt-3">
                                <span className="flex justify-between mt-1">
                                  <span className="mr-3">
                                    Total Due Amount&nbsp;:&nbsp;
                                  </span>
                                  <span
                                    className={`${
                                      dueItems?.deposit === "0.00"
                                        ? ""
                                        : "text-red-600"
                                    }`}
                                  >
                                    {Number(dueItems.remain).toFixed(2)}
                                  </span>
                                </span>
                                {editDue.collection === undefined ? (
                                  ""
                                ) : (
                                  <span>
                                    <span className="flex justify-between mt-1">
                                      <span className="">New Paid&nbsp;:</span>
                                      <span className="text-bold italic mx-3">
                                        ({dueItems.collection} +{" "}
                                        <span className="text-green-600">
                                          {Number(editDue.collection).toFixed(
                                            2
                                          )}
                                        </span>
                                        )
                                      </span>

                                      <span
                                        className={`${
                                          dueItems.collection ===
                                          dueItems.amount
                                            ? "text-green-600"
                                            : "text-blue-600"
                                        }`}
                                      >
                                        {Number(amountTotal).toFixed(2)}
                                      </span>
                                    </span>

                                    <span className="flex justify-between">
                                      <span className="flex justify-between w-full border-t-2 border-gray-300 pt-2 mt-2 flex-col">
                                        {amountTotal >= oldTotalDueAmount ? (
                                          <span className="flex justify-between w-full">
                                            <span className="">
                                              Full Paid&nbsp;:
                                            </span>
                                            <span className="text-green-500">
                                              {Number(
                                                oldTotalDueAmount
                                              ).toFixed(2)}
                                            </span>
                                          </span>
                                        ) : (
                                          <span className="flex justify-between w-full">
                                            <span className="">
                                              New Remain&nbsp;:
                                            </span>
                                            <span className="text-orange-500">
                                              {Number(amountRemain).toFixed(2)}
                                            </span>
                                          </span>
                                        )}

                                        {amountTotal >= oldTotalDueAmount ? (
                                          <span className="flex justify-between w-full mt-1 text-orange-500">
                                            <span className="">
                                              Change&nbsp;:
                                            </span>
                                            <span className="">
                                              {Number(
                                                Math.pow(
                                                  Math.pow(amountRemain, 2),
                                                  0.5
                                                )
                                              ).toFixed(2)}
                                            </span>
                                          </span>
                                        ) : (
                                          ""
                                        )}
                                      </span>
                                    </span>
                                  </span>
                                )}
                              </span>
                            </span>
                          </div>
                        </div>

                        <div className="flex justify-between border-solid border-t border-gray-400 text-sm text-gray-600 py-5 px-2 mt-4 font-black">
                          <span className="text-gray-500">
                            Payment Method&nbsp;:&nbsp;
                          </span>
                          <span className="text-gray-600">Cash</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-end py-5 px-10 border-b-gray-200">
                        {disable ? (
                          <button
                            className={`font-[500] text-green-600 hover:bg-green-500 hover:text-white bg-green-200 rounded-md py-1 px-5 mx-1 `}
                            type="submit"
                          >
                            Save
                          </button>
                        ) : (
                          <input
                            readOnly
                            disabled
                            value={"Disable"}
                            className={`font-[500] text-gray-400  bg-gray-200 rounded-md py-1 px-5 mx-1 cursor-not-allowed text-center w-[130px]`}
                          />
                        )}

                        <button
                          onClick={() =>
                            (toggleEditModal(), buttonDisable()) as any
                          }
                          className="font-[500] text-red-600 hover:bg-red-500 hover:text-white bg-red-200 rounded-md py-1 px-5 mx-1"
                        >
                          Close
                        </button>
                      </div>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="all_orders text-slate-900 px-5 py-6 w-[96%] bg-[#f4f7fa]">
        <span className="flex items-center gap-2 font-[900]">
          <NavLink to="/dashboard">
            <span className="underline hover:text-blue-500 ">Dashboard</span>
          </NavLink>
          <MdArrowForwardIos className="font-[900]" />
          <NavLink to="/order/view/all">
            <span className="underline hover:text-blue-500 ">Due</span>
          </NavLink>
          <MdArrowForwardIos className="font-[900]" />
          {customPicker === "" ? (
            <span>
              {filter === "0" ? (
                <span className="capitalize">{}Today Due</span>
              ) : (
                <span className="capitalize">Last&nbsp;{filter}&nbsp;Days</span>
              )}
            </span>
          ) : (
            <span className="capitalize">
              {moment(customPicker).tz("Asia/Dhaka").format("DD-MM-YYYY")}
            </span>
          )}
        </span>
        <div className="my-2 flex justify-end">
          <div className="items-center">
            <span className="mr-2 font-bold text-gray-700">
              Filter By&nbsp;:
            </span>
            <div className="inline-flex rounded-md shadow-sm">
              <NavLink
                className="py-2 px-4 text-sm font-medium text-gray-700 bg-white rounded-l-lg border border-gray-200 hover:text-blue-700 focus:z-10 focus:ring-2 focus:ring-blue-700 focus:text-blue-700"
                to="/due/1"
              >
                Previous Days
              </NavLink>
              <NavLink
                className="py-2 px-4 text-sm font-medium text-gray-900 bg-white border-t border-b border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-2 focus:ring-blue-700 focus:text-blue-700"
                to="/due/7"
              >
                Last 7 Days
              </NavLink>
              <NavLink
                className="py-2 px-4 text-sm font-medium text-gray-900 bg-white border-t border-b border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-2 focus:ring-blue-700 focus:text-blue-700"
                to={`/due/${end}`}
              >
                Last Month
              </NavLink>
              <input
                value={customPicker}
                type="date"
                name="datePicker"
                id="datePicker"
                onChange={handelDatePicker}
                className="py-2 px-4 text-sm font-medium text-gray-900 bg-white border-t border-b border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-2 focus:ring-blue-700 focus:text-blue-700"
              />
              <button
                onClick={handelClear}
                className="py-2 px-4 text-sm font-medium text-white bg-red-500 rounded-r-md border border-gray-200 hover:bg-red-600 hover:text-white focus:z-10 focus:ring-2 focus:ring-red-600 focus:text-white"
              >
                Reset
              </button>
            </div>
          </div>
        </div>
        <div className="mt-3">
          <div className="px-5 py-5 h-[85vh] bg-white rounded-md">
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
                    placeholder="Search by: order id, date, status, sold by"
                  />
                </div>
              </div>
              <div className="table_box overflow-y-scroll overflow-x-scroll scroll-smooth h-[75vh] rounded-lg scrollbar">
                {dues?.dues?.length === 0 ? (
                  <div className="h-[60vh] flex justify-center items-center text-gray-400">
                    <span className="mr-5">
                      <GiReceiveMoney className="text-[40px]" />
                    </span>
                    <span className=" font-open_sans text-[25px] uppercase">
                      {customPicker === "" ? (
                        <span>
                          {filter === "0"
                            ? "No Due Today"
                            : `No Due Found at ${filter}`}
                        </span>
                      ) : (
                        <span>
                          No Due at{" "}
                          <span className="font-bold">
                            "
                            {moment(customPicker)
                              .tz("Asia/Dhaka")
                              .format("DD-MM-YYYY")}
                            "
                          </span>
                        </span>
                      )}
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
                          Id
                        </th>
                        <th scope="col" className="py-3 px-6 whitespace-nowrap">
                          Name
                        </th>
                        <th scope="col" className="py-3 px-6">
                          Type
                        </th>
                        <th scope="col" className="py-3 px-6">
                          Date
                        </th>
                        <th scope="col" className="py-3 px-6">
                          Time
                        </th>
                        <th scope="col" className="py-3 px-6">
                          Amount
                        </th>
                        <th scope="col" className="py-3 px-6">
                          Paid
                        </th>
                        <th scope="col" className="py-3 px-6 whitespace-nowrap">
                          Remain
                        </th>
                        <th scope="col" className="py-3 px-6 whitespace-nowrap">
                          Last Paid
                        </th>
                        <th scope="col" className="py-3 px-6">
                          DESC.
                        </th>
                        <th scope="col" className="py-3 px-6">
                          Action
                        </th>
                      </tr>
                    </thead>
                    <tbody className="text-[13px]">
                      {dues?.dues
                        ?.filter((due: any) => {
                          if (due === "") {
                            return due;
                          } else if (
                            (due?.dueId &&
                              due?.dueId
                                .toLowerCase()
                                .includes(search.toLowerCase())) ||
                            (due?.amount &&
                              due?.amount
                                .toLowerCase()
                                .includes(search.toLowerCase())) ||
                            (due?.description &&
                              due?.description
                                .toLowerCase()
                                .includes(search.toLowerCase())) ||
                            (due?.remain &&
                              due?.remain
                                .toLowerCase()
                                .includes(search.toLowerCase())) ||
                            (due?.collection &&
                              due?.collection
                                .toLowerCase()
                                .includes(search.toLowerCase())) ||
                            (due?.customer?.name &&
                              due?.customer?.name
                                .toLowerCase()
                                .includes(search.toLowerCase())) ||
                            (due?.customer?.phone &&
                              due?.customer?.phone
                                .toLowerCase()
                                .includes(search.toLowerCase())) ||
                            (due?.customer?.address &&
                              due?.customer?.address
                                .toLowerCase()
                                .includes(search.toLowerCase())) ||
                            (due?.createdAt &&
                              moment(due?.createdAt)
                                .tz("Asia/Dhaka")
                                .format("hh:mm:ss")
                                .toLowerCase()
                                .includes(search.toLowerCase())) ||
                            (due?.fullPaidDate &&
                              moment(due?.fullPaidDate)
                                .tz("Asia/Dhaka")
                                .format("hh:mm:ss")
                                .toLowerCase()
                                .includes(search.toLowerCase())) ||
                            (due?.date &&
                              due.date
                                .toLowerCase()
                                .includes(search.toLowerCase()))
                          ) {
                            return due;
                          }
                        })
                        .map((due: any, index: number) => (
                          <FilterDueTable
                            key={index}
                            count={index}
                            due={due}
                            dueItems={dueItems}
                            toggleEditModal={toggleEditModal}
                            toggleModal={toggleModal}
                            handleGetId={handleGetId}
                          ></FilterDueTable>
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

export default FilterDue;
