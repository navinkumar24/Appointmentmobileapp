
import axios from "axios";
import getStoredValues from "@/utils/getStoredValues";
import getenvValues from "@/utils/getenvValues";

export const api = axios.create({
  baseURL: getenvValues()?.baseUrl,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(async(config) => {
  const { token } = await getStoredValues();
  if (token) {
    config.headers.Authorization = token;
  }
  return config;
});
