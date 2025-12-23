// src/api/index.ts
import { setupRequestInterceptor } from "./request.interceptor";
import { setupResponseInterceptor } from "./response.interceptor";

let initialized = false;

export const initializeApi = () => {
    if (initialized) return;
    initialized = true;
    setupRequestInterceptor();
    setupResponseInterceptor();
};

export * from "./client";
