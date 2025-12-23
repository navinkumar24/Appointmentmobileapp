// src/api/request.interceptor.ts
import { api } from "./client";
import getStoredValues from "@/utils/getStoredValues";

export const setupRequestInterceptor = () => {
  api.interceptors.request.use(async (config) => {
    const { token } = await getStoredValues();
    if (token) {
      config.headers.Authorization = token;
    }
    return config;
  });
};
