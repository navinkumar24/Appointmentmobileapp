import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { updateUserProfile, loginOtp, register, logout } from '../api/auth'
import { encrypt } from "@/utils/encryption";
import getStoredValues from "@/utils/getStoredValues";
import * as SecureStore from 'expo-secure-store'
import { useRouter } from "expo-router";



export const logginViaOTP = createAsyncThunk(
    "auth/logginViaOTP",
    async (
        { mobile, accessToken }: any, { rejectWithValue }) => {
        try {
            const { key } = await getStoredValues();
            const response = await loginOtp(mobile, accessToken);
            const user = response?.responseList?.[0]
            const encrypted = encrypt(JSON.stringify(user), key);
            await SecureStore.setItemAsync("udtl", encrypted);
            await SecureStore.setItemAsync("tkn", encrypt(user?.token, key));
            await SecureStore.setItemAsync("refTkn", encrypt(user?.refreshToken, key));
            return response;
        } catch (err: any) {
            return rejectWithValue(err?.message || "failed to login");
        }
    }
);
export const loggingOut = createAsyncThunk(
    "auth/logginViaOTP",
    async (_, { rejectWithValue }) => {
        try {
            const router = useRouter()
            const user = await logout();
            await SecureStore.deleteItemAsync("udtl");
            await SecureStore.deleteItemAsync("tkn");
            await SecureStore.deleteItemAsync("refTkn");
            router.replace("/screens/login")
            return user;
        } catch (err: any) {
            return rejectWithValue(err?.message || "failed to login");
        }
    }
);

export const registering = createAsyncThunk(
    "auth/registering",
    async (formData: any, { rejectWithValue }) => {
        try {
            const { key } = await getStoredValues();
            let user = await register(formData);
            if (!user || Object.keys(user).length === 0) {
                return rejectWithValue("Invalid server response");
            }
            const encrypted = encrypt(JSON.stringify(user), key);
            await SecureStore.setItemAsync("udtl", encrypted);
            await SecureStore.setItemAsync("tkn", encrypt(user?.token, key));
            await SecureStore.setItemAsync("refTkn", encrypt(user?.refreshToken, key));
            return user;
        } catch (err: any) {
            return rejectWithValue(err?.message || "failed to register");
        }
    }
);
export const updatingUserProfile = createAsyncThunk(
    "auth/updatingUserProfile",
    async (formData: any, { rejectWithValue }) => {
        try {
            const { key } = await getStoredValues();
            let user = await updateUserProfile(formData);
            if (!user || Object.keys(user).length === 0) {
                return rejectWithValue("Invalid server response");
            }
            // 🔐 Secure storage
            const encrypted = encrypt(JSON.stringify(user), key);
            await SecureStore.setItemAsync("udtl", encrypted);
            return user;
        } catch (err: any) {
            return rejectWithValue(err?.message || "failed to update profile");
        }
    }
);



type InitialState = {
    mobileNumber: string | number | any,
    otpAccessToken: string | number | any,
    isAuthenticated: boolean;
    message: string | number | any
}

const initialState: InitialState = {
    mobileNumber: null,
    otpAccessToken: null,
    isAuthenticated: false,
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
    extraReducers(builder) {
    },
})

export const { setMobileNumber, setOtpAccessToken, setMessage } = authSlice.actions;
export default authSlice.reducer