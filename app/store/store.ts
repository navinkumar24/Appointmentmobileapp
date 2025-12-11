// src/store/store.ts
import { configureStore } from "@reduxjs/toolkit";
import themeReducer from './themeSlice';
// import userReducer from './userSlice'
import authReducer from './authSlice'
import homeReducer from "./homeSlice";

export const store = configureStore({
  reducer: {
    theme: themeReducer,
    // user : userReducer,
    auth: authReducer,
    home: homeReducer
  },
});

// Add these exports
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;