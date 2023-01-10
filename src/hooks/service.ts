import axios from "axios";
import { url } from "../service/getAllUrl";

const service = axios.create({
  baseURL: `${url}/api/`,
});

export default service;
