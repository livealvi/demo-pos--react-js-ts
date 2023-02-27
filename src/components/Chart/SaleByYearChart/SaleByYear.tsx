import { StockContext } from "../../../App";
import axios from "axios";
import { url } from "../../../service/getAllUrl";
import { getToken } from "../../../service/getToken";
import { useNavigate } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import SaleByYearChart from "./SaleByYearChart";

const SaleByYear = () => {
  let [updateData, setUpdateData] = useContext(StockContext);
  const [yearBySale, setYearBySale] = useState([] as any);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  let navigate = useNavigate();

  useEffect(() => {
    axios
      .get(`${url}/api/chart/saleByAllMonth`, {
        headers: { Authorization: "Bearer " + getToken()?.toString() || "" },
      })
      .then((res: any) => {
        setYearBySale(() => res?.data);
        setIsLoaded(true);
      })
      .catch((err) => {
        //console.log(err);
        if (err?.response?.status === 401) {
          navigate("/login");
        }
      });
  }, [updateData]);

  return (
    <>
      <SaleByYearChart yearBySale={yearBySale} />
    </>
  );
};

export default SaleByYear;
