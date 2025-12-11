import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { AxiosError } from "axios";
import { changePassword, login } from '../api/auth'
import { encrypt } from "../utils/encryption";
import getStoredValues from "../utils/getStoredValues";
import * as SecureStore from 'expo-secure-store'

export const logging = createAsyncThunk(
    'auth/logging',
    async ({ mobile, password }: any, { rejectWithValue }) => {
        try {
            const { key } = await getStoredValues();
            const response = await login(mobile, password);
            if (Object.entries(response)?.length) {
                const encrypted = encrypt(JSON.stringify(response), key);
                SecureStore.setItemAsync("udtl", JSON.stringify(encrypted));
            }
            return response
        } catch (err) {
            const error = err as AxiosError<any>
            return rejectWithValue(error.message || "Fetch failed");
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


export const authSlice = createSlice({
    name: 'user',
    initialState: {},
    reducers: {},
})


export default authSlice.reducer