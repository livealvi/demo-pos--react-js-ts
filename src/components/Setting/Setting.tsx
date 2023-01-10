import React, { useContext, useEffect, useState } from "react";
import { FiEdit } from "react-icons/fi";
import { MdArrowForwardIos } from "react-icons/md";
import { NavLink, useNavigate } from "react-router-dom";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import logo from "../../assets/company_logo//logo.png";
import axios, { AxiosError } from "axios";
import { getToken } from "../../service/getToken";
import { ProgressBar } from "react-loader-spinner";
import useAuth from "../../hooks/useAuth";
import { url } from "../../service/getAllUrl";
import { StockContext } from "../../App";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import service from "../../hooks/service";
import CheckRole from "../../hooks/CheckRole";

type Setting = {
  name: string;
  tag: string;
};

const schema = yup.object().shape({
  name: yup.string().trim().required("please insert name"),
  tag: yup.string().trim().required("please insert tag"),
});

const Setting = () => {
  let [updateData, setUpdateData] = useContext(StockContext);
  const [edit, setEdit] = useState(false);
  const [setting, setSetting] = useState([] as any);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const [disable, setDisable] = useState<boolean>(false);

  const {
    register,
    handleSubmit,
    setError,
    getValues,
    formState: { errors },
    reset,
  } = useForm<Setting>({
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

  let navigate = useNavigate();
  const { user } = useAuth();
  const { userInfo, checkRole } = CheckRole();

  const [editSetting, setEditSetting] = useState({
    id: "",
    name: "",
    tag: "",
    path: "",
    userId: "",
  });

  const handleEdit = () => {
    setEdit(true);
  };

  useEffect(() => {
    axios
      .get(`${url}/api/info/1`, {
        headers: { Authorization: "Bearer " + getToken()?.toString() || "" },
      })
      .then((res: any) => {
        reset();
        const response = res?.data?.info;
        const status = res?.data?.success;
        setEditSetting({
          id: response?.id,
          name: response?.name,
          tag: response?.tag,
          path: response?.path,
          userId: response?.userId,
        });
        setSetting(() => res.data);
        setIsLoaded(true);
      })
      .catch((err) => {
        //console.log(err);
        if (err.response.status === 401) {
          navigate("/login");
        }
      });
  }, [updateData]);

  const buttonDisable = () => {
    reset();
    setDisable(false);
    setEdit(false);
  };

  const handleFormSubmit = async (e: any) => {
    reset();
    toast
      .promise(
        service.put(`info/update/${editSetting.id}`, editSetting, {
          headers: { Authorization: "Bearer " + getToken()?.toString() || "" },
        }),
        {
          loading: "Loading",
          success: "Updated Setting successfully!",
          error: "Error : info not change",
        }
      )
      .then((res: any) => {
        const status = res?.data?.success;

        if (status === 1) {
          setUpdateData((v: number) => v + 1);
          setEdit(false);
          setDisable(false);
        }
      })
      .catch((error) => {
        const err = error as AxiosError;
        //console.log("err:", err);
      });
  };

  const handleChange = (e: any) => {
    setEditSetting({
      ...editSetting,
      [e.target.id]: e.target.value,
    });
    setDisable(true);
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
  if (!setting) return <h1>Loading....</h1>;

  return (
    <>
      <div className="setting text-slate-900 px-5 py-6 w-full bg-[#f4f7fa]">
        <span className="flex items-center gap-2 font-[900]">
          <NavLink to="/dashboard">
            <span className="underline hover:text-blue-500 ">Dashboard</span>
          </NavLink>
          <MdArrowForwardIos className="font-[900]" />
          <span>Setting</span>
          <MdArrowForwardIos className="font-[900]" />
          <span>View All</span>
        </span>

        <div className="mt-5">
          <div className="px-5 py-5  h-[85vh] bg-white rounded-md overflow-x-scroll overflow-y-scroll">
            <div className="user px-4 py-2  bg-violet-100 rounded-lg">
              <span className="font-semibold text-[50px] text-gray-700">
                Hello!
              </span>{" "}
              <div className="flex item-center">
                <span className="font-normal text-[40px] text-gray-700">
                  {userInfo?.name}
                </span>{" "}
                <span className="flex items-center">
                  <span className="rounded-md text-white py-[1px] px-2 text-[15px] font-bold bg-red-500 ml-1">
                    {checkRole}
                  </span>
                </span>
              </div>
            </div>
            <div>
              <form onSubmit={handleSubmit(handleFormSubmit) as any}>
                <input
                  type="hidden"
                  id="id"
                  defaultValue={editSetting?.id}
                  className=""
                />
                <div className="info mt-5 px-4 py-2 rounded-lg text-[19px]">
                  <div className="flex flex-wrap items-center border rounded-lg p-3">
                    <div>
                      <div className="border rounded-lg w-[300px]">
                        <img
                          className="h-auto w-auto"
                          src={logo}
                          alt="Belarus Corner"
                        />
                      </div>
                      <div className="py-2">
                        <input
                          type="file"
                          className="block w-full text-sm text-slate-500
      file:mr-4 file:py-2 file:px-4
      file:rounded-lg file:border-0
      file:text-sm file:font-semibold
      file:bg-green-200 file:text-green-700
      hover:file:bg-green-100
    "
                        />
                      </div>
                    </div>
                    <div className="px-10">
                      <table className="">
                        <tbody>
                          <tr className="border-b-2">
                            <td className="py-2 pr-2 font-semibold">
                              Shop Name
                            </td>
                            <td className="py-2 font-semibold">:</td>
                            <td className="py-2 pl-2 ">
                              {edit === true ? (
                                <div>
                                  <input
                                    className="w-[350px] block p-2 text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-400 focus:ring-blue-500 focus:border-blue-500  placeholder-gray-400 "
                                    placeholder="enter shop name"
                                    type="text"
                                    id="name"
                                    {...register("name")}
                                    defaultValue={editSetting?.name}
                                    onChange={handleChange}
                                  />
                                  <span className="text-red-500">
                                    {errors.name?.message}
                                  </span>
                                </div>
                              ) : (
                                <span>{setting?.info?.name}</span>
                              )}
                            </td>
                            <td className="pl-4">
                              {edit === false ? (
                                <button
                                  onClick={handleEdit}
                                  className="flex justify-center items-center text-green-600 hover:bg-green-500 hover:text-white bg-green-200 rounded-md py-2 px-3"
                                >
                                  <FiEdit />
                                </button>
                              ) : (
                                ""
                              )}
                            </td>
                          </tr>
                          <tr>
                            <td className="py-2 pr-2 font-semibold">
                              Tag Line
                            </td>
                            <td className="py-2 font-semibold">:</td>
                            <td className="py-2 pl-2">
                              {edit === true ? (
                                <div>
                                  <input
                                    className="w-[350px] block p-2 text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-400 focus:ring-blue-500 focus:border-blue-500  placeholder-gray-400 "
                                    placeholder="enter shop name"
                                    type="text"
                                    id="tag"
                                    {...register("tag")}
                                    defaultValue={editSetting?.tag}
                                    onChange={handleChange}
                                  />
                                  <span className="text-red-500">
                                    {errors.tag?.message}
                                  </span>
                                </div>
                              ) : (
                                <span>{setting?.info?.tag}</span>
                              )}
                            </td>
                            <td className="pl-4">
                              {edit === false ? (
                                <button
                                  onClick={handleEdit}
                                  className="flex justify-center items-center text-green-600 hover:bg-green-500 hover:text-white bg-green-200 rounded-md py-2 px-3"
                                >
                                  <FiEdit />
                                </button>
                              ) : (
                                ""
                              )}
                            </td>
                          </tr>
                        </tbody>
                      </table>
                      <div>
                        {edit === false ? (
                          ""
                        ) : (
                          <div className="flex">
                            {disable ? (
                              <input
                                className={` text-[15px] text-green-600 hover:bg-green-500 hover:text-white bg-green-200 rounded-md  py-2 px-3 `}
                                type="submit"
                                value={"Save"}
                              />
                            ) : (
                              <input
                                readOnly
                                disabled
                                value={"Disable"}
                                className={`text-[15px] text-gray-400  bg-gray-200 rounded-md py-2 px-3 cursor-not-allowed text-center w-[100px] `}
                              />
                            )}
                            {/* <input
                              onClick={() => buttonDisable() as any}
                              className={` hover:cursor-pointer ml-2 text-[15px] flex justify-center items-center text-red-600 hover:bg-red-500 hover:text-white bg-red-200 rounded-md py-2 px-3 `}
                              readOnly
                              value={"Close"}
                            /> */}
                            <button
                              onClick={() => buttonDisable() as any}
                              className="ml-2 text-[15px] flex justify-center items-center text-red-600 hover:bg-red-500 hover:text-white bg-red-200 rounded-md py-2 px-3"
                            >
                              Close{" "}
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Setting;
