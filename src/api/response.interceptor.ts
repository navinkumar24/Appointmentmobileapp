
import { api } from "./client";
import { refreshAccessToken } from "./refresh";
import { encrypt } from "../utils/encryption";
import getStoredValues from "@/utils/getStoredValues";
import * as SecureStore from 'expo-secure-store'
import { store } from "@/store/store";
import { loggingOut } from "@/store/authSlice";


let isRefreshing = false;
let queue: any[] = [];

export const setupResponseInterceptor = () => {
  api.interceptors.response.use(
    (response) => response,
    async (error) => {
      const original = error.config;

      // // 1. Ignore refresh endpoint itself
      if (original?.url?.includes("/opd/user/refreshToken")) {
        return Promise.reject(error);
      }

      // 2. Handle expired access token
      if (error.response?.status === 401 && !original._retry) {
        if (isRefreshing) {
          return new Promise((resolve, reject) => {
            queue.push({ resolve, reject });
          }).then((token) => {
            original.headers.Authorization = token;
            return api(original);
          });
        }

        original._retry = true;
        isRefreshing = true;

        try {
          console.log("Refreshing token -- ")
          const token = await refreshAccessToken();
          const {key} = await getStoredValues()
          await SecureStore.setItemAsync("tkn", encrypt(token, key))
          queue.forEach((p) => p.resolve(token));
          queue = [];

          original.headers.Authorization = token;
          return api(original);
        } catch (err) {
          queue.forEach((p) => p.reject(err));
          queue = [];
          store.dispatch(loggingOut());
          return Promise.reject(err);
        } finally {
          isRefreshing = false;
        }
      }

      // 4. Normalize error (no toast here)
      return Promise.reject({
        status: error.response?.status ?? 0,
        message:
          error.response?.data?.errorMessage ||
          error.message ||
          "Something went wrong",
      });
    }
  );
};
