import jwtDecode from "jwt-decode";
import { useEffect, useState } from "react";
import { url } from "../service/getAllUrl";
import { getToken } from "../service/getToken";

const CheckRole = () => {
  const [checkRole, setCheckRole] = useState<any>(undefined);
  const [userInfo, setUserInfo] = useState<any>(undefined);
  useEffect(() => {
    (() => {
      const decoded = (() => {
        try {
          return jwtDecode(getToken() as any);
        } catch (error) {
          return null;
        }
      })();
      if (!decoded) return;
      const id = (decoded as any).id;
      fetch(`${url}/api/user/${id}`, {
        headers: { Authorization: "Bearer " + getToken()?.toString() || "" },
      })
        .then((res: any) => res.json())
        .then((res: any) => {
          setCheckRole(res?.user?.role?.name);
          setUserInfo(res?.user);
        })
        .catch((error) => {
          setCheckRole(null);
          setUserInfo(null);
          //console.log(error);
        });
    })();
  }, []);
  return { userInfo, checkRole };
};

export default CheckRole;
