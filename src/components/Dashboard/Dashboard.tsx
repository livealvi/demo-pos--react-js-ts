import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import { getToken } from "../../service/getToken";
import axios from "axios";
import { ProgressBar } from "react-loader-spinner";
import Stock from "./Stock";
import TodaySale from "./TodaySale";
import SaleHistory from "./SaleHistory";
import { url } from "../../service/getAllUrl";
import { StockContext } from "../../App";
import CheckRole from "../../hooks/CheckRole";
import SaleByYear from "../Chart/SaleByYearChart/SaleByYear";

const Dashboard = () => {
  let [updateData, setUpdateData] = useContext(StockContext);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const [stock, setStock] = useState([]);
  let navigate = useNavigate();
  const { user } = useAuth();
  const { checkRole } = CheckRole();

  useEffect(() => {
    axios
      .get(`${url}/api/stock/total`, {
        headers: { Authorization: "Bearer " + getToken()?.toString() || "" },
      })
      .then((res: any) => {
        setStock(() => res.data);
        setIsLoaded(true);
      })
      .catch((err) => {
        //console.log(err);
        if (err?.response?.status === 401) {
          navigate("/login");
        }
      });
  }, [updateData]);

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
  if (!stock) return <h1>Loading....</h1>;
  //bg-[#f4f7fa]
  return (
    <>
      <div id="dashboard" className="dashboard w-screen bg-white">
        <div className="text-slate-900 px-5 py-6">
          <span className="flex items-center gap-2 font-[900]  text-gray-700 ">
            <span className="text-base">Dashboard</span>
          </span>
          <div className="mt-5">
            <div className="grid md:grid-cols-3 grid-cols-1 xs:grid-cols-2 xs:grid-col-5 mx-auto gap-3">
              <div className="">
                <Stock stock={stock} />
              </div>
              <div className="">
                <TodaySale stock={stock} />
              </div>
              <div className="">
                <SaleHistory stock={stock} />
              </div>
            </div>
          </div>
        </div>
        {/*<hr />
        <div> 
          <SaleByYear />
        </div> */}
      </div>
    </>
  );
};

export default Dashboard;
