import React, { useContext, useEffect, useState } from "react";
import { FiMail } from "react-icons/fi";
import { AiFillUnlock } from "react-icons/ai";
import logo from "../../assets/company_logo/logo.png";
import service from "../../hooks/service";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { ProgressBar } from "react-loader-spinner";
import useAuth from "../../hooks/useAuth";
import axios, { AxiosError } from "axios";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { url } from "../../service/getAllUrl";
import { StockContext } from "../../App";
import { HashLoader } from "react-spinners";
import { CSSProperties } from "react";

type Login = {
  email: string;
  password: string;
};

export const schema = yup.object().shape({
  email: yup.string().email().trim().required("please insert mail"),
  password: yup.string().trim().required("please insert password"),
});

const Login = () => {
  let [updateData, setUpdateData] = useContext(StockContext);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [email, setEmail] = useState<string>("");
  const [setting, setSetting] = useState([] as any);
  const [password, setPassword] = useState<string>("");
  let navigate = useNavigate();
  const show = () => {
    setShowPassword(!showPassword);
  };
  const { user } = useAuth();

  const {
    register,
    handleSubmit,
    setError,
    getValues,
    formState: { errors },
    reset,
  } = useForm<Login>({
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

  useEffect(() => {
    axios
      .get(`${url}/api/info/1`)
      .then((res: any) => {
        setSetting(() => res?.data);
      })
      .catch((error) => {
        const err = error as AxiosError;
        //console.log(err);
      });
  }, [updateData]);

  const handleLoginSubmit = async (e: any) => {
    reset();
    toast
      .promise(
        service.post(`/user/login`, {
          email,
          password,
        }),
        {
          loading: "Please wait...",
          success: "Login successfully",
          error: "Please, provide valid credential",
        }
      )
      .then((res: any) => {
        localStorage.setItem("_s45_wu_79_uuu798b_", res?.data?.access_token);

        if (res?.status === 200) {
          navigate("/dashboard");
        }
      })
      .catch((error) => {
        const err = error as AxiosError;
        //console.log("err:", err);
      });
  };

  if (user === undefined)
    return (
      <div className="flex justify-center items-center h-screen w-screen">
        <HashLoader color="#51E5FF" size={70} />
      </div>
    );

  if (!!user && user.success === 1) {
    navigate("/dashboard");
  }

  return (
    <div className="text-slate-900 bg-[#58728c] w-full mx-auto grid justify-center items-center h-screen">
      <div className="p-5 bg-white rounded-md md:w-[400px] transition duration-900 hover:border-gray-200 hover:shadow-lg hover:border">
        <div className="text-center">
          <span className="text-[22px] md:text-3xl  font-semibold text-gray-500">
            Hi, Welcome Back
          </span>
          <div>
            <div className="flex items-center justify-center">
              <img
                className="h-[100px] md:h-32"
                src={logo}
                alt="Belarus Corner"
              />
            </div>
            <div className="flex flex-col justify-center items-center mt-1">
              <span className="text-lg md:text-2xl font-[300] mb-2 text-gray-700">
                {setting?.info?.name}
              </span>

              <span className="text-xs  md:text-sm font-[300] text-gray-700">
                {setting?.info?.tag}
              </span>
            </div>
          </div>
        </div>
        <div className="flex justify-center pt-5 pb-9">
          <form action="" onSubmit={handleSubmit(handleLoginSubmit) as any}>
            <div className="flex justify-center flex-col w-full md:w-[300px]">
              {" "}
              <div className="email">
                {/* <label className="font-[300]">Email</label> */}
                <div className="relative mt-3">
                  <div className="flex absolute inset-y-0 left-0 items-center pl-3 pointer-events-none">
                    <FiMail />
                  </div>
                  <input
                    {...register("email")}
                    type="text"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="email w-full justify-center block p-2 pl-10 text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-400  focus:border-blue-500  placeholder-gray-400  focus:ring-blue-500 dark:focus:border-blue-500"
                    placeholder="email@xyz.com"
                  />
                </div>
                <span className="text-red-500">{errors.email?.message}</span>
              </div>
              <div className="email mt-2">
                {/* <label className="font-[300]">Password</label> */}
                <div className="relative mt-2">
                  <div className="flex absolute inset-y-0 left-0  items-center px-3 pointer-events-none">
                    <span className="">
                      <AiFillUnlock />
                    </span>
                  </div>
                  <input
                    {...register("password")}
                    type="password"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="password w-full justify-center block p-2 px-10 text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-400  placeholder-gray-400  focus:ring-blue-500 focus:border-blue-500 transition duration-900"
                    placeholder="password"
                  />
                </div>
                <span className="text-red-500">{errors.password?.message}</span>
                <div className="relative mt-6">
                  <button
                    type="submit"
                    onSubmit={handleLoginSubmit}
                    className="login text-white font-[600] rounded-md bg-[#202536] w-full h-9 hover:bg-sky-400"
                  >
                    Login
                  </button>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
