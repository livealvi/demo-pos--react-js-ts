import React, { useContext, useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  MdArrowForwardIos,
  MdDeleteSweep,
  MdProductionQuantityLimits,
} from "react-icons/md";
import { getToken } from "../../service/getToken";
import axios, { AxiosError } from "axios";
import { url } from "../../service/getAllUrl";
import { IdContext, StockContext } from "../../App";
import useAuth from "../../hooks/useAuth";
import SaleTable from "./SaleTable";
import { FaCashRegister } from "react-icons/fa";
import { TbCurrencyTaka } from "react-icons/tb";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { schema, schemaCustomer } from "../../utils/yupSchema";
import SaleCart from "./SaleCart";
import toast from "react-hot-toast";
import service from "../../hooks/service";
import CheckRole from "../../hooks/CheckRole";
import { ProgressBar } from "react-loader-spinner";
import { BsFillPersonPlusFill } from "react-icons/bs";
import { VscChromeClose } from "react-icons/vsc";
import CustomerTable from "./CustomerTable";

type ISale = {
  deposit: number;
  customerName: string;
  email: string;
  phone: string;
  address: string;
};

const Sale = () => {
  let [updateData, setUpdateData] = useContext(StockContext);
  let [idData, setIdData] = useContext(IdContext);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const [stocks, setStocks] = useState([] as any);
  const [disable, setDisable] = useState<boolean>(false);
  const [disableCustomer, setDisableCustomer] = useState<boolean>(false);
  const [edit, setEdit] = useState(false);
  const [modal, setModal] = useState<boolean>(false);
  const [modalCustomer, setModalCustomer] = useState<boolean>(false);
  const [price, setPrice] = useState(0);
  const [deposit, setDeposit] = useState(0 as any);
  const [discount, setDiscount] = useState(0 as any);
  const [discountPrice, setDiscountPrice] = useState(0 as any);
  const [afterDiscount, setAfterDiscount] = useState(0 as any);
  const [percentage, setPercentage] = useState(0 as any);
  const [due, setDue] = useState(0);
  const [status, setStatus] = useState("due" as any);
  const [change, setChange] = useState(0 as any);
  const [check, setCheck] = useState(true);
  const [mainCheck, setMainCheck] = useState(false);
  const [update, setUpdate] = useState(0);
  const [cart, setCart] = useState([] as any);
  const [readOnly, setReadOnly] = useState<boolean>(false);
  const [selectCustomer, setSelectCustomer] = useState("" as any);
  const { userInfo, checkRole } = CheckRole();
  const [customers, setCustomers] = useState([] as any);
  const [customerFound, setCustomerFound] = useState([] as any);
  const [saveBtnShow, setSaveBtnShow] = useState<boolean>(false);
  const [pass, setPass] = useState<boolean>(true);

  // disable button -
  const buttonDisable = (e: any) => {
    e.preventDefault();
    reset();
    setEdit(true);
  };

  // disable button customer -
  const buttonDisableCustomer = (e: any) => {
    e.preventDefault();
    reset();
    setDisableCustomer(false);
  };

  // form validator
  const {
    register,
    handleSubmit,
    setError,
    getValues,
    formState: { errors },
    reset,
  } = useForm<ISale>({
    mode: "onSubmit",
    reValidateMode: "onChange",
    resolver: yupResolver(schema),
    context: undefined,
    criteriaMode: "firstError",
    shouldFocusError: true,
    shouldUnregister: false,
    shouldUseNativeValidation: false,
    delayError: undefined,
  });

  const [search, setSearch] = useState("" as any);
  const [searchCustomer, setSearchCustomer] = useState("" as any);

  let navigate = useNavigate();
  const { user } = useAuth();

  // ----> customer infos
  //load customer
  useEffect(() => {
    axios
      .get(`${url}/api/customer/all`, {
        headers: { Authorization: "Bearer " + getToken()?.toString() || "" },
      })
      .then((res: any) => {
        setCustomers(() => res?.data?.customers);
        setIsLoaded(true);
      })
      .catch((err: any) => {
        //console.log(err);
        // if (err.response.status === 401) {
        //   navigate("/login");
        // }
      });
  }, [navigate, updateData, update]);
  //modal
  const toggleModalCustomer = (e: any) => {
    handelClearCustomer(e);
    setModalCustomer(!modalCustomer);
    setUpdateData((v: number) => v + 1);
    handelClearCustomer(e);
    setSaveBtnShow(false);
    setPass(true);
  };

  const saveBtnClose = (e: any) => {
    e.preventDefault();
    setModalCustomer(!modalCustomer);
    setPass(false);
  };

  //modal check customer
  const checkCustomer = async (e: any) => {
    e.preventDefault();
    toast
      .promise(
        service.post(
          `order/check`,
          {
            selectCustomer,
          },
          {
            headers: {
              Authorization: "Bearer " + getToken()?.toString() || "",
            },
          }
        ),
        {
          loading: "Loading",
          success: "successfully!",
          error: "Please, Fill Name & Phone",
        }
      )
      .then((res: any) => {
        const status = res?.data?.success;
        if (status === 1) {
          setCustomerFound(": email is already registered");
        }
        if (status === 2) {
          setCustomerFound(": phone is already registered");
        }

        if (status === 0) {
          setModalCustomer(!modalCustomer);
          setPass(false);
        }
      })
      .catch((error) => {
        const err = error as AxiosError;
        //console.log("err:", err);
      });
  };

  //search customer
  const handelSearchCustomer = (e: any) => setSearchCustomer(e.target.value);
  //handel customer
  const handelCustomer = async (customer: any) => {
    setSelectCustomer({
      id: customer?.id,
      name: customer?.name,
      email: customer?.email,
      phone: customer?.phone,
      address: customer?.address,
    });
    setReadOnly(true);
    setDisableCustomer(true);
    setSaveBtnShow(true);
  };

  // clear customer
  const handelClearCustomer = (e: any) => {
    e.preventDefault();
    reset();
    setSelectCustomer("");
    setEdit(true);
    setReadOnly(false);
    setDisableCustomer(false);
    setCustomerFound("");
    setSaveBtnShow(false);
    //btn();
  };

  // button disable
  const handelChangeCustomer = (e: any) => {
    setSelectCustomer({
      ...selectCustomer,
      [e.target.id]: e.target.value,
    });
    setDisableCustomer(true);
    //setEdit(false);
  };

  // ----> stock
  // modal
  const toggleModal = () => setModal(!modal);
  // load stock
  useEffect(() => {
    axios
      .get(`${url}/api/stock/all`, {
        headers: { Authorization: "Bearer " + getToken()?.toString() || "" },
      })
      .then((res: any) => {
        setStocks(() => res.data);
        setIsLoaded(true);
      })
      .catch((err: any) => {
        //console.log(err);
        if (err.response.status === 401) {
          navigate("/login");
        }
      });
  }, [navigate, updateData, update]);
  // search
  const handleSearch = (e: any) => {
    setSearch(e.target.value);
  };
  // get product
  const handleGetProduct = async (product: any) => {
    if (cart.find((p: any) => p.id === product.id)) return;
    setCart((c: any) => [...c, { ...product, selectedQuantity: 1 }]);
    setUpdate((v) => v + 1);
  };
  // remove product
  const handelRemove = (id: any) => {
    const arr = cart.filter((product: any) => product.id !== id);
    setCart(arr);
    setUpdate((v) => v + 1);
    handelPrice();
    setDeposit(0);
    setChange(0);
    setDiscount(0);
    setDiscountPrice(0);
    setPercentage(0);
    setAfterDiscount(0);
  };
  // clear cart
  const handelClear = () => {
    setCart([]);
    handelPrice();
    setDeposit(0);
    setChange(0);
    setDiscount(0);
    setDiscountPrice(0);
    setPercentage(0);
    setAfterDiscount(0);
    setPass(true);
  };
  // count | all price
  // change
  const handleChange = (e: any) => {
    setDeposit(e.target.value);
  };
  // discount
  const handelDiscount = (e: any) => {
    setPercentage(e.target.value);
  };

  // sum
  const handelPrice = () => {
    let ans = 0;
    cart.map((product: any) => (ans += product.selectedQuantity * product.mrp));
    setPrice(ans);
  };
  useEffect(() => {
    let ans = 0;
    let discount = 0;
    let afterDiscount = 0;
    let discountPrice = 0;

    cart.map((product: any) => (ans += product.selectedQuantity * product.mrp));

    let back = 0;
    back = ans - deposit;
    setDue(back);

    setPrice(Number(ans).toFixed(2) as any);
    discount = (percentage / 100) * ans;
    setDiscount(discount);
    afterDiscount = price - discount;
    setAfterDiscount(afterDiscount);
    discountPrice = deposit - afterDiscount;
    setDiscountPrice(discountPrice);

    if (percentage >= 0.001) {
      setMainCheck(false);
      if (afterDiscount > deposit) {
        setCheck(false);
        setChange(0);
        setStatus("due");
      } else {
        setChange(Number(Math.pow(Math.pow(discountPrice, 2), 0.5)).toFixed(2));
        setStatus("paid");
        setCheck(true);
      }
    } else {
      setMainCheck(true);
      if (ans > deposit) {
        setCheck(false);
        setChange(0);
        setStatus("due");
      } else {
        setChange(Number(Math.pow(Math.pow(back, 2), 0.5)).toFixed(2));
        setStatus("paid");
        setCheck(true);
      }
    }
  }, [cart, update, due, deposit, percentage, afterDiscount]);

  // form submit
  const handleFormSubmit = async (e: any) => {
    if (pass === true && check === false) {
      toggleModalCustomer(e);
    } else {
      reset();
      toast
        .promise(
          service.post(
            `order/add`,
            {
              status,
              percentage,
              discount,
              afterDiscount,
              deposit,
              change,
              price,
              products: cart,
              selectCustomer,
              userInfo,
            },
            {
              headers: {
                Authorization: "Bearer " + getToken()?.toString() || "",
              },
            }
          ),
          {
            loading: "Loading",
            success: "Checkout successfully!",
            error: "Error adding order",
          }
        )
        .then((res: any) => {
          const status = res?.data?.success;
          if (status === 1) {
            setUpdate((v) => v + 1);
            setCart([]);
            handelPrice();
            setDeposit(0);
            setChange(0);
            setDiscount(0);
            setDiscountPrice(0);
            setPercentage(0);
            setAfterDiscount(0);
            setUpdateData((v: number) => v + 1);
            setSelectCustomer("");
            setPass(true);
            handelClearCustomer(e);
          }
        })
        .catch((error) => {
          const err = error as AxiosError;
          //console.log("err:", err);
        });
    }
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

  return (
    <>
      {modalCustomer && (
        <div className="modal_customer h-full w-full fixed bg-gray-400 bg-opacity-50 flex justify-center items-center z-10 ">
          <div className="overlay w-[950px]">
            <div className="modal-content h-full w-full bg-white  rounded-md shadow-lg">
              <div className="modal_head flex items-center justify-between px-10 py-5 border-b-2 border-b-gray-200 hover">
                <span className="font-[600] text-[20px] text-gray-500">
                  Add Customer Info
                  <span className="ml-1 text-red-500">{customerFound}</span>
                </span>
                <VscChromeClose
                  onClick={toggleModalCustomer}
                  className="close_modal text-[20px] text-black hover:cursor-pointer"
                />
              </div>
              <div className="modal_body">
                <div className="flex justify-evenly p-5">
                  <div className="customer_search w-full border-r-2 border-gray-300">
                    <div className="flex justify-around items-center">
                      <div className="w-[90%]">
                        <div className="search_box flex items-center justify-center ">
                          <div className="search_bar bg-white w-[100%]">
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
                                onChange={handelSearchCustomer}
                                className="w-full block p-2 px-10 text-sm text-gray-900 bg-gray-50 rounded-sm border border-gray-400 focus:ring-blue-500 focus:border-blue-500  placeholder-gray-400 "
                                placeholder="Search for users"
                              />
                            </div>
                          </div>
                        </div>

                        <div className="customer_table flex items-center justify-center border-b border-r border-l border-gray-400">
                          <div className="table_box overflow-y-scroll overflow-x-scroll scroll-smooth h-[36.6vh] w-[100%]">
                            <table className="table w-full text-sm text-gray-500">
                              <thead className="text-xs text-gray-700 uppercase bg-[#f5f8fb] sticky top-[-1px] -z-0">
                                <tr className="">
                                  <th scope="col" className="py-3 px-6 ">
                                    S/L
                                  </th>
                                  <th scope="col" className="py-3 px-6">
                                    Name
                                  </th>
                                  <th scope="col" className="py-3 px-6">
                                    Phone
                                  </th>
                                  <th scope="col" className="py-3 px-6">
                                    Email
                                  </th>
                                </tr>
                              </thead>
                              <tbody>
                                {customers
                                  ?.filter((customer: any) => {
                                    if (customer === "") {
                                      return customer;
                                    } else if (
                                      (customer?.name &&
                                        customer?.name
                                          .toLowerCase()
                                          .includes(
                                            searchCustomer.toLowerCase()
                                          )) ||
                                      (customer?.phone &&
                                        customer?.phone
                                          .toLowerCase()
                                          .includes(
                                            searchCustomer.toLowerCase()
                                          )) ||
                                      (customer?.email &&
                                        customer?.email
                                          .toLowerCase()
                                          .includes(
                                            searchCustomer.toLowerCase()
                                          ))
                                    ) {
                                      return customer;
                                    }
                                  })
                                  .filter((r: any) => r.name != null)
                                  .map((customer: any, index: number) => (
                                    <CustomerTable
                                      key={index}
                                      count={index}
                                      customer={customer}
                                      handelCustomer={handelCustomer}
                                    ></CustomerTable>
                                  ))}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="w-full flex justify-center items-center flex-col">
                    <div className="flex justify-center items-start pb-6">
                      <span className="whitespace-nowrap font-bold text-gray-600 text-[20px]">
                        Customer Info
                      </span>
                    </div>
                    <div className="customer_form w-full" onClick={toggleModal}>
                      <form onSubmit={handleSubmit(checkCustomer) as any}>
                        <div className="flex justify-around items-center">
                          <div className="w-[90%]">
                            <input
                              type="hidden"
                              id="id"
                              defaultValue={selectCustomer?.id}
                              className=""
                            />
                            <div className="pt-5 border-t border-gray-300">
                              <div className="name flex justify-center items-center">
                                <label className="font-[300] pr-[10px] w-[200px]">
                                  Name
                                </label>
                                <div className="w-full">
                                  <input
                                    readOnly={readOnly}
                                    type="text"
                                    id="customerName"
                                    {...register("customerName")}
                                    defaultValue={selectCustomer?.name}
                                    className="w-full block p-2 pl-3 text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-400  focus:border-blue-500  placeholder-gray-400  focus:ring-blue-500 dark:focus:border-blue-500"
                                    placeholder="enter name"
                                    onChange={handelChangeCustomer}
                                  />
                                  <span className="text-red-500 whitespace-nowrap">
                                    {errors.customerName?.message}
                                  </span>
                                </div>
                              </div>
                            </div>
                            <div className="pt-3">
                              <div className="email flex justify-center items-center">
                                <label className="font-[300] pr-[10px] w-[200px]">
                                  Email
                                </label>
                                <div className="w-full">
                                  <input
                                    readOnly={readOnly}
                                    type="text"
                                    id="email"
                                    {...register("email")}
                                    defaultValue={selectCustomer?.email}
                                    className="w-full block p-2 pl-3 text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-400  focus:border-blue-500  placeholder-gray-400  focus:ring-blue-500 dark:focus:border-blue-500"
                                    placeholder="enter email"
                                    onChange={handelChangeCustomer}
                                  />
                                  <span className="text-red-500 whitespace-nowrap">
                                    {errors.email?.message}
                                  </span>
                                </div>
                              </div>
                            </div>
                            <div className="pt-3">
                              <div className="oldPassword flex justify-center items-center">
                                <label className="font-[300] pr-[10px] w-[200px] whitespace-nowrap">
                                  Phone
                                </label>
                                <div className="w-full">
                                  <input
                                    readOnly={readOnly}
                                    type="text"
                                    id="phone"
                                    {...register("phone")}
                                    defaultValue={selectCustomer?.phone}
                                    className="w-full block p-2 pl-3 text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-400  focus:border-blue-500  placeholder-gray-400  focus:ring-blue-500 dark:focus:border-blue-500"
                                    placeholder="enter phone"
                                    onChange={handelChangeCustomer}
                                  />
                                  <span className="text-red-500 whitespace-nowrap">
                                    {errors.phone?.message}
                                  </span>
                                </div>
                              </div>
                            </div>
                            <div className="pt-3 pb-5">
                              <div className="description flex justify-center items-center">
                                <label className="font-[300] pr-[10px] w-[200px]">
                                  Address
                                </label>
                                <div className="w-full">
                                  <input
                                    readOnly={readOnly}
                                    type="text"
                                    id="address"
                                    {...register("address")}
                                    defaultValue={selectCustomer?.address}
                                    className="w-full block p-2 pl-3 text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-400  focus:border-blue-500  placeholder-gray-400  focus:ring-blue-500 dark:focus:border-blue-500"
                                    placeholder="enter address"
                                    onChange={handelChangeCustomer}
                                  />
                                  <span className="text-red-500">
                                    {errors.address?.message}
                                  </span>
                                </div>
                              </div>
                            </div>
                            <div className="font-bold text-[16px] flex items-center justify-end pt-3 border-t border-gray-300">
                              {edit === false ? (
                                ""
                              ) : (
                                <div>
                                  {disableCustomer ? (
                                    <span>
                                      <button
                                        onClick={handelClearCustomer}
                                        className=" text-blue-400 hover:bg-blue-400 hover:text-white rounded-md py-1 px-3 mr-1"
                                      >
                                        Reset
                                      </button>
                                      {saveBtnShow === false ? (
                                        <button
                                          type="submit"
                                          onClick={checkCustomer}
                                          className={` text-green-600 hover:bg-green-500 hover:text-white  rounded-md py-1 px-3 mr-1`}
                                        >
                                          Save
                                        </button>
                                      ) : (
                                        <button
                                          onClick={saveBtnClose}
                                          className={` text-green-600 hover:bg-green-500 hover:text-white  rounded-md py-1 px-3 mr-1`}
                                        >
                                          Save
                                        </button>
                                      )}
                                    </span>
                                  ) : (
                                    <input
                                      readOnly
                                      disabled
                                      value={"Disable"}
                                      className={`text-gray-400 rounded-md mr-1 cursor-not-allowed text-center w-[69px] bg-transparent`}
                                    />
                                  )}
                                </div>
                              )}
                              <button
                                onClick={toggleModalCustomer}
                                className=" text-red-600 hover:bg-red-500 hover:text-white rounded-md py-1 px-3"
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
            </div>
          </div>
        </div>
      )}

      <div className="all_stock text-slate-900 px-5 py-6 w-full bg-[#f4f7fa] ">
        <span className="flex items-center gap-2 font-[900]">
          <NavLink to="/dashboard">
            <span className="underline hover:text-blue-500 ">Dashboard</span>
          </NavLink>
          <MdArrowForwardIos className="font-[900]" />
          <NavLink to="/stock/view/all">
            <span className="underline hover:text-blue-500 ">Products</span>
          </NavLink>
          <MdArrowForwardIos className="font-[900]" />{" "}
          <span className="">Sale</span>
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
              <div className="flex justify-between">
                <div className="for_table w-[50%] rounded-lg border mr-[16px]  hover:border-blue-400 ">
                  <div className="table_box overflow-y-scroll overflow-x-scroll scroll-smooth h-[75vh] rounded-lg scrollbar">
                    <table className="table w-full text-sm text-gray-500 ">
                      <thead className="text-xs text-gray-700 uppercase bg-[#f5f8fb] sticky top-[-1px] -z-0">
                        <tr className="">
                          <th scope="col" className="py-2 px-4">
                            S/L
                          </th>
                          <th scope="col" className="py-3 px-5">
                            Part No
                          </th>
                          <th scope="col" className="py-3 px-3">
                            Description
                          </th>
                          <th scope="col" className="py-3 px-3">
                            Category
                          </th>
                          <th scope="col" className="py-3 px-4">
                            Costing
                          </th>
                          <th scope="col" className="py-3 px-4">
                            Wholesale
                          </th>
                          <th scope="col" className="py-3 px-3">
                            M.R.P
                          </th>
                          <th scope="col" className="py-3 px-3">
                            Quantity
                          </th>
                          <th scope="col" className="py-3 px-3">
                            Barcode
                          </th>
                          <th scope="col" className="py-3 px-3">
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
                              stock?.costing
                                .toLowerCase()
                                .includes(search.toLowerCase()) ||
                              stock?.mrp
                                .toLowerCase()
                                .includes(search.toLowerCase()) ||
                              stock?.category?.name
                                .toLowerCase()
                                .includes(search.toLowerCase()) ||
                              stock?.barcode?.number
                                .toLowerCase()
                                .includes(search.toLowerCase())
                            ) {
                              return stock;
                            }
                          })
                          .map((stock: any, index: number) => (
                            <SaleTable
                              key={index}
                              count={index}
                              stocks={stock}
                              handleGetProduct={handleGetProduct}
                            />
                          ))}
                      </tbody>
                    </table>
                  </div>
                </div>
                <div className="for_cart w-[50%] rounded-lg border hover:border-blue-400 ">
                  <div className="cart_head flex justify-between items-center h-[60px] bg-[#f5f8fb] rounded- rounded-t-lg px-4 overflow-x-auto">
                    <span className="flex items-center text-gray-700 uppercase font-medium text-[16px] pr-5">
                      <span>Total</span>
                      <span className="flex items-center bg-red-500 text-white ml-1 rounded-md px-2">
                        <TbCurrencyTaka className="text-[20px]" />
                        {mainCheck ? (
                          <span>
                            {Number(Math.pow(Math.pow(price, 2), 0.5)).toFixed(
                              2
                            )}
                          </span>
                        ) : (
                          <span>
                            {Number(
                              Math.pow(Math.pow(afterDiscount, 2), 0.5)
                            ).toFixed(2)}
                          </span>
                        )}
                      </span>
                    </span>
                    <span className="flex items-center text-gray-700 uppercase font-medium text-[16px]">
                      {mainCheck ? (
                        check ? (
                          <span className="flex items-center text-gray-700 uppercase font-medium  pr-5">
                            <span>Change</span>
                            <span className="flex items-center bg-green-500 text-white ml-1 rounded-md px-2">
                              <TbCurrencyTaka className="text-[20px]" />
                              {Number(Math.pow(Math.pow(due, 2), 0.5)).toFixed(
                                2
                              )}
                            </span>
                          </span>
                        ) : (
                          <span className="flex items-center text-gray-700 uppercase font-medium text-[16px] pr-5">
                            <span className="">Due</span>
                            <span className="flex items-center bg-red-500 text-white ml-1 rounded-md px-2">
                              <TbCurrencyTaka className="text-[20px]" />
                              {Number(Math.pow(Math.pow(due, 2), 0.5)).toFixed(
                                2
                              )}
                            </span>
                          </span>
                        )
                      ) : check ? (
                        <span className="flex items-center text-gray-700 uppercase font-medium text-[16px] pr-5">
                          <span>Change</span>
                          <span className="flex items-center bg-green-500 text-white ml-1 rounded-md px-2">
                            <TbCurrencyTaka className="text-[20px]" />
                            {Number(
                              Math.pow(Math.pow(discountPrice, 2), 0.5)
                            ).toFixed(2)}
                          </span>
                        </span>
                      ) : (
                        <span className="flex items-center text-gray-700 uppercase font-medium text-[16px] pr-5">
                          <span>Due</span>
                          <span className="flex items-center bg-red-500 text-white ml-1 rounded-md px-2">
                            <TbCurrencyTaka className="text-[20px]" />
                            {Number(
                              Math.pow(Math.pow(discountPrice, 2), 0.5)
                            ).toFixed(2)}
                          </span>
                        </span>
                      )}
                    </span>
                  </div>
                  <div className="px-4 py-4">
                    <div className="cart_items ">
                      {cart.length === 0 ? (
                        <div className="h-[60vh] flex justify-center items-center text-gray-400">
                          <span className="mr-5">
                            <MdProductionQuantityLimits className="text-[40px]" />
                          </span>
                          <span className=" font-open_sans text-[25px] uppercase">
                            No product on cart
                          </span>
                        </div>
                      ) : (
                        <div className="cart_items flex flex-col justify-between h-[63vh]">
                          <div className="overflow-y-scroll overflow-x-scroll scroll-smooth ">
                            <table className="cart_table w-full text-sm text-gray-500">
                              <thead className="text-xs text-gray-700 uppercase bg-[#f5f8fb] sticky top-[-1px] -z-0">
                                <tr>
                                  <th scope="col" className="py-3 px-6 ">
                                    Item
                                  </th>
                                  <th scope="col" className="py-3 px-6 ">
                                    Quantity
                                  </th>
                                  <th scope="col" className="py-3 px-6 ">
                                    Price
                                  </th>
                                  <th scope="col" className="py-3 px-6 ">
                                    Action
                                  </th>
                                </tr>
                              </thead>

                              <tbody className="text-center">
                                {cart.map((product: any, count: any) => (
                                  <SaleCart
                                    key={count}
                                    product={product}
                                    handelRemove={handelRemove}
                                    setCart={setCart}
                                  />
                                ))}
                              </tbody>
                            </table>
                          </div>

                          <div className="flex flex-col px-4 py-4 bg-gray-100">
                            <div className="">
                              <table className="table_cart_count w-full text-sm text-gray-500 text-center h-[55px]">
                                <thead className="text-gray-700 uppercase bg-gray-200">
                                  <tr>
                                    <td className="font-bold">
                                      <span>Total&nbsp;:</span>
                                      <span> {cart.length}</span>
                                    </td>
                                    <td className="font-bold w-2">
                                      <span className="flex">
                                        New&nbsp;:
                                        <TbCurrencyTaka className="text-[19px]" />
                                        {Number(
                                          Math.pow(
                                            Math.pow(afterDiscount, 2),
                                            0.5
                                          )
                                        ).toFixed(2)}
                                      </span>
                                    </td>
                                    <td className="">
                                      <span className="flex items-center justify-center text-gray-700 uppercase font-bold ">
                                        <span>Total&nbsp;:</span>
                                        <span className="flex items-center">
                                          <TbCurrencyTaka className="text-[18px]" />
                                          {price}
                                        </span>
                                      </span>
                                    </td>
                                    <td className="w-[21%]">
                                      <button
                                        onClick={handelClear}
                                        className="flex justify-center items-center font-[500]  text-red-600 hover:bg-red-500 hover:text-white bg-red-200 rounded-md py-2 px-2 whitespace-nowrap "
                                      >
                                        <span>
                                          <MdDeleteSweep className="text-[20px]" />
                                        </span>
                                        <span className="ml-1">Clear All</span>
                                      </button>
                                    </td>
                                  </tr>
                                </thead>
                              </table>
                            </div>
                            <div className="due_change flex justify-between mt-3">
                              <div className="flex items-center">
                                <span className="pr-2 text-gray-700 uppercase font-bold">
                                  <span className=" font-black">%</span>
                                </span>
                                <span className="flex items-center">
                                  <input
                                    type="number"
                                    step="0.01"
                                    onChange={handelDiscount}
                                    className="deposit w-[120px] block p-2 text-sm font-bold
                                    text-gray-900 bg-gray-50 rounded-lg border
                                    border-gray-400 focus:ring-blue-500
                                    focus:border-blue-500 placeholder-gray-400 "
                                  />
                                </span>
                                <span className="px-2 text-gray-700 uppercase font-bold">
                                  <span className=" font-black">=</span>
                                </span>
                                <span className="flex items-center text-gray-700 uppercase font-bold">
                                  <TbCurrencyTaka className="text-[19px]" />
                                  <span className="font-black">
                                    {Number(
                                      Math.pow(Math.pow(discount, 2), 0.5)
                                    ).toFixed(2)}
                                  </span>
                                </span>
                              </div>
                              <div className="flex items-center">
                                <span className="pr-2 text-gray-700 uppercase font-bold">
                                  Deposit
                                </span>
                                <span>
                                  <input
                                    type="number"
                                    min="0"
                                    step="0.01"
                                    onChange={handleChange}
                                    className="deposit w-[120px] block p-2 text-sm font-bold
                                    text-gray-900 bg-gray-50 rounded-lg border
                                    border-gray-400 focus:ring-blue-500
                                    focus:border-blue-500 placeholder-gray-400 "
                                  />
                                </span>
                              </div>
                            </div>

                            <div className="flex flex-col justify-center pt-3">
                              <div className="flex justify-between items-center mb-3">
                                <button
                                  onClick={toggleModalCustomer}
                                  className="w-[auto] flex justify-center items-center font-[500]  text-sky-600 hover:bg-sky-500 hover:text-white bg-sky-200 rounded-md py-2 px-4 whitespace-nowrap "
                                >
                                  <span className="flex items-center">
                                    <span>
                                      <BsFillPersonPlusFill className="text-[20px]" />
                                    </span>
                                    {selectCustomer.name === undefined &&
                                    selectCustomer.customerName ===
                                      undefined ? (
                                      <span className="ml-2">Add Customer</span>
                                    ) : (
                                      <span className="ml-2">
                                        {selectCustomer.name ||
                                          selectCustomer.customerName}
                                      </span>
                                    )}
                                  </span>
                                </button>
                                {mainCheck ? (
                                  <span className=" font-black">
                                    No Discount
                                  </span>
                                ) : check ? (
                                  <span className="flex font-extrabold items-center">
                                    Change:
                                    <span className="flex items-center bg-green-500 text-white ml-1 rounded-md px-2">
                                      <TbCurrencyTaka className="text-[20px]" />
                                      {Number(
                                        Math.pow(
                                          Math.pow(discountPrice, 2),
                                          0.5
                                        )
                                      ).toFixed(2)}
                                    </span>
                                  </span>
                                ) : (
                                  <span className="flex font-extrabold items-center">
                                    Due:
                                    <span className="flex items-center bg-red-500 text-white ml-1 rounded-md px-2">
                                      <TbCurrencyTaka className="text-[20px]" />
                                      {Number(
                                        Math.pow(
                                          Math.pow(discountPrice, 2),
                                          0.5
                                        )
                                      ).toFixed(2)}
                                    </span>
                                  </span>
                                )}
                              </div>
                              <button
                                onClick={handleFormSubmit}
                                className="w-full flex justify-center items-center font-[500]  text-green-600 hover:bg-green-500 hover:text-white bg-green-200 rounded-md py-2 px-2 whitespace-nowrap "
                              >
                                <span>
                                  <FaCashRegister className="text-[20px]" />
                                </span>
                                <span className="ml-1">Checkout</span>
                              </button>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sale;
