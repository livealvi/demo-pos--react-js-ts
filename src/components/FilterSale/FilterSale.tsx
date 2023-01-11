import React, { useContext, useEffect, useState } from "react";
import { NavLink, useNavigate, useParams } from "react-router-dom";
import CheckRole from "../../hooks/CheckRole";
import useAuth from "../../hooks/useAuth";
import axios, { AxiosError } from "axios";
import { url } from "../../service/getAllUrl";
import { getToken } from "../../service/getToken";
import { ProgressBar } from "react-loader-spinner";
import TodaySaleTable from "./FilterSaleTable";
import {
  MdArrowForwardIos,
  MdOutlinePointOfSale,
  MdProductionQuantityLimits,
} from "react-icons/md";
import { toast } from "react-hot-toast";
import service from "../../hooks/service";
import { IdContext, StockContext } from "../../App";
import { VscChromeClose } from "react-icons/vsc";
import TodaySaleItemTable from "./FilterSaleItemTable";
import Moment from "react-moment";
import { AiFillPrinter } from "react-icons/ai";
import moment from "moment-timezone";

const FilterSale = () => {
  let [idData, setIdData] = useContext(IdContext);
  let [updateData, setUpdateData] = useContext(StockContext);
  const [orders, setOrders] = useState([] as any);
  const [orderItems, setOrderItems] = useState([] as any);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const [search, setSearch] = useState("" as any);
  const [modal, setModal] = useState<boolean>(false);
  const [disable, setDisable] = useState<boolean>(false);
  const [customDate, setCustomDate] = useState("" as any);
  const [customPicker, setCustomPicker] = useState("" as any);

  const toggleModal = () => {
    setModal(!modal);
  };
  const toggleReturnModal = () => {
    setOrderItems([]);
    //setReturnModal(!returnModal);
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
    navigate(`/sale/0`);
  };

  useEffect(() => {
    if (customPicker === "") {
      axios
        .get(`${url}/api/order/last/${filter}`, {
          headers: { Authorization: "Bearer " + getToken()?.toString() || "" },
        })
        .then((res: any) => {
          setOrders(() => res?.data);
          setIsLoaded(true);
        })
        .catch((err) => {
          //console.log(err);
          if (err.response.status === 401) {
            navigate("/login");
          }
        });
    } else if (customPicker) {
      axios
        .get(`${url}/api/order/last/${customPicker}`, {
          headers: { Authorization: "Bearer " + getToken()?.toString() || "" },
        })
        .then((res: any) => {
          setOrders(() => res?.data);
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
        service.get(`order/${id}`, {
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
        setOrderItems(res?.data?.order);
        const status = res?.data?.success;

        if (status === 1) {
          toggleModal();
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
  let subtotal = 0;
  orderItems?.forEach((element: any) => {
    subtotal += Number(element.subtotal);
  });

  let totalDue = 0;
  orderItems?.forEach((element: any) => {
    totalDue += Number(element.due);
  });

  let discountPrice = 0;
  orderItems?.forEach((element: any) => {
    discountPrice += Number(element.discountPrice);
  });

  let duePrice = 0;
  orderItems?.forEach((element: any) => {
    duePrice += Number(element.discountPrice);
  });

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
      {/* order detail */}
      {modal && (
        <div className="modal h-full w-full fixed bg-gray-400 bg-opacity-50 flex justify-center items-center z-10">
          <div className="overlay ">
            <div className="modal-content h-full w-full bg-white  rounded-md shadow-lg">
              <div className="modal_head flex items-center justify-between px-7 py-5 border-b border-b-gray-200 hover">
                <span className="font-[600] text-[20px] text-gray-500">
                  Order Detail&nbsp;:&nbsp;
                  <span className="capitalize">
                    {orderItems[0]?.status === "due" ? (
                      <span className="text-red-500 font-bold">due</span>
                    ) : (
                      <span className="text-green-600 font-bold">paid</span>
                    )}
                  </span>
                </span>
                <VscChromeClose
                  onClick={toggleModal}
                  className="close_modal text-[20px] text-black hover:cursor-pointer"
                />
              </div>
              <div className="modal_body m-4">
                <div className="order_infos m-3 text-sm flex justify-between">
                  <div className="left items-start">
                    <div className="flex flex-col">
                      <span className="my-1">
                        <span className="">Order ID:&nbsp;</span>
                        <span className="font-medium">
                          {orderItems[0]?.order?.orderId}
                        </span>
                      </span>
                      <span className="my-1">
                        <span className="">Time:&nbsp;</span>
                        <span className="font-medium">
                          <Moment
                            tz="Asia/Dhaka"
                            format="DD/MM/YYYY"
                            date={orderItems[0]?.createdAt}
                          />
                        </span>
                        <span className="mx-1 font-medium">-</span>
                        <span className="font-medium">
                          <Moment
                            tz="Asia/Dhaka"
                            format="hh:mm A"
                            date={orderItems[0]?.createdAt}
                          />
                        </span>
                      </span>
                    </div>
                  </div>

                  <div className="right">
                    <div className="flex flex-col items-end">
                      <span className="my-1">
                        <span className="">Status:&nbsp;</span>
                        <span className="capitalize">
                          {orderItems[0]?.status === "due" ? (
                            <span className="text-red-500 font-bold">due</span>
                          ) : (
                            <span className="text-green-600 font-bold">
                              paid
                            </span>
                          )}
                        </span>
                      </span>

                      <span className="my-1">
                        <span className="">Purchased by:&nbsp;</span>
                        <span
                          className={`${
                            orderItems[0]?.customer?.name === null
                              ? "font-[400]"
                              : "text-sky-700"
                          } font-medium `}
                        >
                          {orderItems[0]?.customer?.name === null
                            ? "No Name"
                            : orderItems[0]?.customer?.name}
                        </span>
                      </span>

                      <span className="my-1">
                        <span className="">Sold by:&nbsp;</span>
                        <span
                          className={`${
                            orderItems[0]?.user?.name === undefined
                              ? "font-[400]"
                              : "text-sky-700"
                          } font-medium `}
                        >
                          {orderItems[0]?.user?.name === undefined
                            ? "No Name"
                            : orderItems[0]?.user?.name}
                        </span>
                      </span>
                    </div>
                  </div>

                  {/* <div className="flex justify-between">
                    <span className="my-1">
                      <span className="">Order ID:&nbsp;</span>
                      <span>{orderItems[0]?.order?.orderId}</span>
                    </span>

                    <span className="my-1">
                      <span className="">Purchased by:&nbsp;</span>
                      <span
                        className={`${
                          orderItems[0]?.user?.name === undefined
                            ? "font-[400]"
                            : "text-sky-700"
                        } font-medium `}
                      >
                        {orderItems[0]?.user?.name === undefined
                          ? "No Name"
                          : orderItems[0]?.user?.name}
                      </span>
                    </span>
                  </div>  */}
                </div>

                <div className="flex flex-col justify-between">
                  <div className="oder_items_detail flex flex-col justify-between max-h-[55vh]">
                    <div className="table_box overflow-y-scroll overflow-x-scroll scroll-smooth">
                      <table className="table w-full text-sm text-gray-500">
                        <thead className="text-xs text-gray-700 uppercase bg-[#f5f8fb] sticky top-[-1px] -z-0">
                          <tr className="">
                            <th scope="col" className="py-3 px-6 ">
                              S/L
                            </th>
                            <th scope="col" className="py-3 px-6">
                              Item
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
                                </svg>  qqsQWSWDSqqrw
                              </a>
                            </div>
                          </th> */}
                            <th scope="col" className="py-3 px-6">
                              Qty.
                            </th>
                            <th scope="col" className="py-3 px-6">
                              Unit Price
                            </th>
                            <th scope="col" className="py-3 px-6">
                              Total Price
                            </th>
                          </tr>
                        </thead>
                        <tbody className="">
                          {orderItems?.map((orderItem: any, index: number) => (
                            <TodaySaleItemTable
                              key={index}
                              count={index}
                              orderItem={orderItem}
                            ></TodaySaleItemTable>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    <div className="all_count flex flex-col pt-4 px-4 mt-2 border-dashed border-t-2 border-b-2 border-gray-400 text-sm text-gray-600">
                      <div className="due_change flex flex-col">
                        <div className="flex items-center justify-between">
                          <span className="pl-2 capitalize">
                            <span className="font-black">
                              <span className="text-gray-500">
                                Total Items&nbsp;:&nbsp;
                              </span>
                              <span>{orderItems.length}</span>
                            </span>
                          </span>
                          <span className="px-2 capitalize font-black flex flex-col">
                            <span className="flex justify-between">
                              <span className="">Total&nbsp;:</span>
                              <span className="ml-1">
                                {Number(subtotal).toFixed(2)}
                              </span>
                            </span>

                            {orderItems[0]?.percentage === "0.00" ? (
                              ""
                            ) : (
                              <span className="flex justify-between mt-1">
                                <span className="">Discount Price&nbsp;:</span>
                                <span className="italic text-gray-400 mx-4">
                                  ({Number(orderItems[0]?.percentage)}%)
                                </span>
                                <span className="">
                                  {orderItems[0]?.discountPrice === "0.00"
                                    ? Number(discountPrice).toFixed(2)
                                    : Number(discountPrice).toFixed(2)}
                                </span>
                              </span>
                            )}

                            <span className="flex justify-between mt-1">
                              <span className="mr-3">Paid&nbsp;:&nbsp;</span>
                              <span
                                className={`${
                                  orderItems[0]?.deposit === "0.00"
                                    ? ""
                                    : "text-blue-600"
                                }`}
                              >
                                {orderItems[0]?.deposit === "0.00"
                                  ? orderItems[0]?.deposit
                                  : orderItems[0]?.deposit}
                              </span>
                            </span>

                            <span className="flex justify-between">
                              {orderItems[0]?.status === "due" ? (
                                <span className="flex justify-between w-full border-t-2 border-gray-300 pt-2 mt-2">
                                  <span className="mr-3">Due&nbsp;:</span>
                                  {orderItems[0]?.dueId === null ? (
                                    ""
                                  ) : (
                                    <span
                                      className={`${
                                        orderItems[0]?.dueId === null
                                          ? ""
                                          : "text-red-500"
                                      }`}
                                    >
                                      -{" "}
                                      {Number(
                                        orderItems[0]?.due?.amount -
                                          orderItems[0]?.due?.collection
                                      ).toFixed(2)}
                                    </span>
                                  )}
                                </span>
                              ) : (
                                <span className="flex justify-between w-full border-t-2 border-gray-300 pt-2 mt-2">
                                  <span className="mr-3">Subtotal&nbsp;:</span>
                                  <span className="">
                                    {orderItems[0]?.due === "0.00"
                                      ? Number(duePrice).toFixed(2)
                                      : Number(duePrice).toFixed(2)}
                                  </span>
                                </span>
                              )}
                            </span>

                            <span className="flex justify-between border-t-2 border-gray-300 pt-2 mt-2">
                              <span className="mr-3">Change&nbsp;:</span>
                              <span
                                className={`${
                                  orderItems[0]?.change === "0.00"
                                    ? ""
                                    : "text-sky-500"
                                }`}
                              >
                                {orderItems[0]?.change}
                              </span>
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

      <div className="all_orders text-slate-900 px-5 py-6 w-full bg-[#f4f7fa]">
        <span className="flex items-center gap-2 font-[900]">
          <NavLink to="/dashboard">
            <span className="underline hover:text-blue-500 ">Dashboard</span>
          </NavLink>
          <MdArrowForwardIos className="font-[900]" />
          <NavLink to="/order/view/all">
            <span className="underline hover:text-blue-500 ">Order</span>
          </NavLink>
          <MdArrowForwardIos className="font-[900]" />
          {customPicker === "" ? (
            <span>
              {filter === "0" ? (
                <span className="capitalize">{}Today Sale</span>
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
                to="/sale/1"
              >
                Previous Days
              </NavLink>
              <NavLink
                className="py-2 px-4 text-sm font-medium text-gray-900 bg-white border-t border-b border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-2 focus:ring-blue-700 focus:text-blue-700"
                to="/sale/7"
              >
                Last 7 Days
              </NavLink>
              <NavLink
                className="py-2 px-4 text-sm font-medium text-gray-900 bg-white border-t border-b border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-2 focus:ring-blue-700 focus:text-blue-700"
                to={`/sale/${end}`}
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
              <div className="table_box overflow-y-scroll overflow-x-scroll scroll-smooth h-[75vh]">
                {orders?.order?.length === 0 ? (
                  <div className="h-[60vh] flex justify-center items-center text-gray-400">
                    <span className="mr-5">
                      <MdOutlinePointOfSale className="text-[40px]" />
                    </span>
                    <span className=" font-open_sans text-[25px] uppercase">
                      {customPicker === "" ? (
                        <span>
                          {filter === "0"
                            ? "No Sale Today"
                            : `No Sale Last ${filter} Days`}
                        </span>
                      ) : (
                        <span>
                          No Sale{" "}
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
                          Order Id
                        </th>
                        <th scope="col" className="py-3 px-6">
                          Purchased by
                        </th>
                        <th scope="col" className="py-3 px-6">
                          Qty.
                        </th>
                        <th scope="col" className="py-3 px-6">
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
                        </th>
                        <th scope="col" className="py-3 px-6">
                          <div className="flex items-center justify-center">
                            Time
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
                          Payment
                        </th>
                        <th scope="col" className="py-3 px-6">
                          Sold By
                        </th>
                        <th scope="col" className="py-3 px-6">
                          Action
                        </th>
                      </tr>
                    </thead>
                    <tbody className="">
                      {orders?.order
                        ?.filter((order: any) => {
                          if (order === "") {
                            return order;
                          } else if (
                            (order?.orderId &&
                              order?.orderId
                                .toLowerCase()
                                .includes(search.toLowerCase())) ||
                            (order?.date &&
                              order?.date
                                .toLowerCase()
                                .includes(search.toLowerCase())) ||
                            (order?.createdAt &&
                              moment(order?.createdAt)
                                .tz("Asia/Dhaka")
                                .format("hh:mm:ss")
                                .toLowerCase()
                                .includes(search.toLowerCase())) ||
                            (order?.sale[0]?.status &&
                              order?.sale[0]?.status
                                .toLowerCase()
                                .includes(search.toLowerCase())) ||
                            (order?.sale[0]?.user?.name &&
                              order?.sale[0]?.user?.name
                                .toLowerCase()
                                .includes(search.toLowerCase())) ||
                            (order?.sale[0]?.customer?.name &&
                              order?.sale[0]?.customer?.name
                                .toLowerCase()
                                .includes(search.toLowerCase()))
                          ) {
                            return order;
                          }
                        })
                        .map((order: any, index: number) => (
                          <TodaySaleTable
                            key={index}
                            count={index}
                            order={order}
                            orderItems={orderItems}
                            handleGetId={handleGetId}
                          ></TodaySaleTable>
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

export default FilterSale;
