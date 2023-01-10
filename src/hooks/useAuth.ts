import { useEffect, useState } from "react";
import { url } from "../service/getAllUrl";
import { getToken } from "../service/getToken";

const useAuth = () => {
  const [user, setUser] = useState<any>(undefined);
  useEffect(() => {
    fetch(`${url}/api/info/all`, {
      headers: { Authorization: "Bearer " + getToken()?.toString() || "" },
    })
      .then((res: any) => res.json())
      .then(setUser)
      .catch((error) => {
        setUser(null);
        //console.log(error);
      });
  }, []);
  return { user };
};

export default useAuth;
