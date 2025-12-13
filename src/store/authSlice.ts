import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { AxiosError } from "axios";
import { changePassword, login, register } from '../api/auth'
import { encrypt } from "@/utils/encryption";
import getStoredValues from "@/utils/getStoredValues";
import * as SecureStore from 'expo-secure-store'

export const logging = createAsyncThunk(
    'auth/logging',
    async ({ mobile, password }: any, { rejectWithValue }) => {
        try {
            const { key } = await getStoredValues();
            const response = await login(mobile, password);
            if (Object.entries(response)?.length) {
                const encrypted = encrypt(JSON.stringify(response), key);
                await SecureStore.setItemAsync("udtl", JSON.stringify(encrypted));
            }
            return response
        } catch (err) {
            const error = err as AxiosError<any>
            return rejectWithValue(error.message || "Fetch failed");
        }
    }
);
export const registering = createAsyncThunk(
    "auth/registering",
    async (formData: any, { rejectWithValue }) => {
        try {
            const { key } = await getStoredValues();
            const response = await register(formData);
            // 🔴 Explicit validation
            if (!response || Object.keys(response).length === 0) {
                return rejectWithValue("Invalid server response");
            }
            // 🔐 Secure storage
            const encrypted = encrypt(JSON.stringify(response), key);
            await SecureStore.setItemAsync("udtl", JSON.stringify(encrypted));

            return response;
        } catch (err) {
            const error = err as AxiosError<any>;
            return rejectWithValue(
                error.response?.data?.message ||
                error.message ||
                "Registration failed"
            );
        }
    }
);


export const changingPassword = createAsyncThunk(
    'auth/changingPassword',
    async ({ entityBusinessID, oldPassword, newPassword }: any, { rejectWithValue }) => {
        try {
            const response = await changePassword(entityBusinessID, oldPassword, newPassword);
            response
            return response
        } catch (err) {
            const error = err as AxiosError<any>
            return rejectWithValue(error.message || "Fetch failed");
        }
    }
);


type InitialState = {
    mobileNumber: string | number | any,
    otpAccessToken: string | number | any,
    message: string | number | any
}

const initialState: InitialState = {
    mobileNumber: null,
    otpAccessToken: null,
    message: null
}

export const authSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setMobileNumber: ((state, action) => {
            state.mobileNumber = action.payload;
        }),
        setOtpAccessToken: ((state, action) => {
            state.otpAccessToken = action.payload;
        }),
        setMessage: ((state, action) => {
            state.message = action.payload;
        })
    },
})

export const { setMobileNumber, setOtpAccessToken, setMessage } = authSlice.actions;
export default authSlice.reducer