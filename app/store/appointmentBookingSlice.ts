import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { AxiosError } from "axios";
import { getAllDoctorDropDown, getDoctorLeaves } from "../api/appointmentBooking";



export const fetchAllDoctorDropDown = createAsyncThunk(
    'home/fetchAllDoctorDropDown',
    async (_, { rejectWithValue }) => {
        try {
            const response = getAllDoctorDropDown();
            return response;
        } catch (err) {
            const error = err as AxiosError<any>
            rejectWithValue(error?.message)
        }
    }
)
export const fetchDoctorLeaves = createAsyncThunk(
    'home/fetchDoctorLeaves',
    async (doctorID: number | string, { rejectWithValue }) => {
        try {
            const response = getDoctorLeaves(doctorID);
            return response;
        } catch (err) {
            const error = err as AxiosError<any>
            rejectWithValue(error?.message)
        }
    }
)

type InitialState = {
    allDoctors: any[];
    doctorLeaves: any[];
    loading: boolean;
    error: string | any
}

const initialState: InitialState = {
    allDoctors: [],
    doctorLeaves: [],
    loading: false,
    error: null,
}

export const appointmentBookingSlice = createSlice({
    name: 'appointmentBooking',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchAllDoctorDropDown.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchAllDoctorDropDown.fulfilled, (state, action) => {
                state.allDoctors = action.payload;
                state.loading = false;
            })
            .addCase(fetchAllDoctorDropDown.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string
            })
            .addCase(fetchDoctorLeaves.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchDoctorLeaves.fulfilled, (state, action) => {
                state.doctorLeaves = action.payload;
                state.loading = false;
            })
            .addCase(fetchDoctorLeaves.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string
            })
    }
})


export default appointmentBookingSlice.reducer