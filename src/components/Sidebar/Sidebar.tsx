import React, { useContext, useEffect, useState } from "react";
import { GoDashboard, GoListOrdered } from "react-icons/go";
import { FaBars, FaBoxOpen, FaCashRegister, FaUsersCog } from "react-icons/fa";
import {
  MdInventory,
  MdOutlineAddRoad,
  MdOutlineInventory,
} from "react-icons/md";
import { NavLink, useNavigate } from "react-router-dom";
import { VscChromeClose } from "react-icons/vsc";
import { GiPayMoney, GiReceiveMoney, GiTakeMyMoney } from "react-icons/gi";
import Dropdown from "./Dropdown";
import { FiLogOut, FiSettings, FiUserPlus, FiUsers } from "react-icons/fi";
import { getToken } from "../../service/getToken";
import axios, { AxiosError } from "axios";
import { AiOutlineAppstoreAdd, AiOutlineBarcode } from "react-icons/ai";
import { ImTree } from "react-icons/im";
import { BiCategoryAlt } from "react-icons/bi";
import { url } from "../../service/getAllUrl";
import { StockContext } from "../../App";
import { TbCurrencyTaka } from "react-icons/tb";
import { HiUsers } from "react-icons/hi";
import { BsDistributeVertical, BsLadder } from "react-icons/bs";
import {
  RiBarcodeBoxFill,
  RiMenuAddFill,
  RiUserSettingsFill,
  RiUserShared2Fill,
} from "react-icons/ri";
import { IoMdBarcode } from "react-icons/io";
import { ClimbingBoxLoader, HashLoader, PropagateLoader } from "react-spinners";

const routes = [
  {
    path: "/dashboard",
    name: "Dashboard",
    icon: <GoDashboard />,
  },
  {
    path: "/category",
    name: "Categories",
    icon: <ImTree />,
    subRoutes: [
      {
        path: "/category/view/all",
        name: "All Category",
        icon: <BiCategoryAlt />,
      },
      {
        path: "/category/add",
        name: "Add Category",
        icon: <AiOutlineAppstoreAdd />,
      },
    ],
  },
  // {
  //   path: "/barcode",
  //   name: "Barcode",
  //   icon: <AiOutlineBarcode />,
  //   subRoutes: [
  //     {
  //       path: "/barcode/view/all",
  //       name: "All Barcode",
  //       icon: <IoMdBarcode />,
  //     },
  //     {
  //       path: "/barcode/add",
  //       name: "Add Barcode",
  //       icon: <RiBarcodeBoxFill />,
  //     },
  //     // {
  //     //   path: "/stock/stock/out",
  //     //   name: "Out of Stock",
  //     //   icon: <TbPackageOff />,
  //     // },
  //   ],
  // },
  {
    path: "/stock",
    name: "Stock",
    icon: <MdInventory />,
    subRoutes: [
      {
        path: "/stock/view/all",
        name: "All Stock",
        icon: <MdOutlineInventory />,
      },
      {
        path: "/stock/add",
        name: "Add Stock",
        icon: <FaBoxOpen />,
      },
      // {
      //   path: "/stock/stock/out",
      //   name: "Out of Stock",
      //   icon: <TbPackageOff />,
      // },
    ],
  },
  {
    path: "/sale",
    name: "Sale",
    icon: <TbCurrencyTaka size={18} />,
    subRoutes: [
      {
        path: "/sale/product",
        name: "Make Sale",
        icon: <FaCashRegister />,
      },
      {
        path: "/order/view/all",
        name: "Order List",
        icon: <GoListOrdered />,
      },
      // {
      //   path: "/stock/stock/out",
      //   name: "Out of Stock",
      //   icon: <TbPackageOff />,
      // },
    ],
  },
  {
    path: "/expense",
    name: "Manage Expense",
    icon: <GiTakeMyMoney />,
    subRoutes: [
      {
        path: "/due/0",
        name: "Due List",
        icon: <GiReceiveMoney />,
      },
      // {
      //   path: "/lend/view/all",
      //   name: "Lend List",
      //   icon: <GiPayMoney />,
      // },
    ],
  },
  {
    path: "/customer",
    name: "Customer Infos",
    icon: <RiUserSettingsFill />,
    subRoutes: [
      {
        path: "/customer/view/all",
        name: "All Customer",
        icon: <HiUsers />,
      },
      // {
      //   path: "/customer/add",
      //   name: "Add Customer",
      //   icon: <RiUserShared2Fill />,
      // },
    ],
  },
  {
    path: "/user",
    name: "Manage Users",
    icon: <FaUsersCog />,
    subRoutes: [
      {
        path: "/user/view/all",
        name: "All User",
        icon: <FiUsers />,
      },
      {
        path: "/user/add",
        name: "Add User",
        icon: <FiUserPlus />,
      },
    ],
  },
  {
    path: "/setting/",
    name: "Settings",
    icon: <FiSettings />,
  },
];

const Sidebar = ({ children }: any) => {
  let [updateData, setUpdateData] = useContext(StockContext);
  const [isOpen, setIsOpen] = useState(false);
  const [shopName, setShopName] = useState([] as any);
  const [loadSpinner, setLoadSpinner] = useState([] as any);
  const toggle = () => {
    setIsOpen(!isOpen);
  };

  let navigate = useNavigate();
  useEffect(() => {
    axios
      .get(`${url}/api/info/1`)
      .then((res: any) => {
        setShopName(() => res.data);
        return;
      })
      .catch((error) => {
        const err = error as AxiosError;
        //console.log(err);
      });
  }, [updateData]);

  useEffect(() => {
    axios
      .get(`${url}/api/info/all`, {
        headers: { Authorization: "Bearer " + getToken()?.toString() || "" },
      })
      .then((res: any) => {
        setLoadSpinner(res?.data?.infos);
      })
      .catch((error) => {
        const err = error as AxiosError;
        //console.log(err?.response?.status);
        const status = err?.response?.status;
        // if (status === 401) {
        //   navigate("/login");
        // }
      });
  }, [updateData]);

  const handleLogout = async () => {
    try {
      localStorage.removeItem("_s45_wu_79_uuu798b_");

      if (getToken() == null) {
        navigate("/login");
      }
      return;
    } catch (error) {
      //console.log(error);
    }
  };

  // const showAnimation = {
  //   hidden: {
  //     width: 0,
  //     opacity: 0,
  //     transition: {
  //       duration: 0.2,
  //     },
  //   },
  //   show: {
  //     width: "auto",
  //     opacity: 1,
  //     transition: {
  //       duration: 0.3,
  //     },
  //   },
  // };

  if (loadSpinner.length === 0)
    return (
      <div className="flex justify-center items-center h-screen  w-screen">
        <HashLoader color="#51E5FF" size={70} />
      </div>
    );

  return (
    <>
      <div
        className={`${
          isOpen ? "w-[245px]" : "w-[55px]"
        }  sidebar leading-none h-screen  border-r-200 flex flex-col justify-between bg-white hover:border-r-sky-300 border-r-4`}
      >
        <div
          // animate={{
          //   width: isOpen ? "245px" : "55px",
          //   transition: {
          //     duration: 0.2,
          //     type: "tween",
          //   },
          // }}
          className="overflow-y-auto first-letter:text-current"
        >
          <div className="flex flex-col justify-between pb-[20px]">
            <div>
              <div className="logo flex items-center justify-between px-5 py-5">
                {isOpen && (
                  <div
                    style={{ width: "165px" }}
                    className={`${
                      isOpen ? "245px" : "55px"
                    }  shop_name font-open_sans font-[900] text-[20px] hover:text-red-500`}
                  >
                    <NavLink className="hover:underline" to="/dashboard">
                      <span className="shop_name">{shopName?.info?.name}</span>
                    </NavLink>
                  </div>
                )}

                <div onClick={toggle} className="bars hover:cursor-pointer">
                  {isOpen ? (
                    <VscChromeClose className="text-red-500" />
                  ) : (
                    <div className="">
                      <FaBars className="hover:text-sky-500" />
                    </div>
                  )}
                </div>
              </div>
              <section className="for_icons hover:cursor-pointer font-open_sans text-[15px]">
                {routes.map((route, index) => {
                  if (route.subRoutes) {
                    return (
                      <Dropdown
                        setIsOpen={setIsOpen}
                        route={route}
                        isOpen={isOpen}
                        key={route.name}
                      />
                    );
                  }

                  return (
                    <NavLink
                      to={route.path}
                      key={index}
                      className="main_menu flex items-center text-current gap-5 px-5 py-4 transition duration-150 hover:bg-sky-200 hover:border-r-sky-500 hover:border-r-[7px] hover:transition hover:duration-120"
                    >
                      <div className="icon pr-[10px]">{route.icon}</div>

                      {isOpen && (
                        <div className="whitespace-nowrap">{route.name}</div>
                      )}
                    </NavLink>
                  );
                })}
              </section>
            </div>

            <div
              onClick={handleLogout}
              className="flex items-center  hover: text-current gap-5 px-5 py-4 hover:bg-sky-200 hover:border-r-sky-500 hover:border-r-[7px] transition duration-150 hover:transition hover:duration-120 hover:cursor-pointer "
            >
              <div className="icon pr-[10px]">
                <FiLogOut />
              </div>
              <div className="">
                <button className="rounded-md hover:t-[#fff]">
                  {isOpen && <div className="">Logout</div>}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
