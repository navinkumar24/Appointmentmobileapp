import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { AxiosError } from "axios";
import { createAppointment, getAllDoctorDropDown, getAvailableSlots, getDoctorLeaves } from "../api/appointmentBooking";



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
export const fetchAvailableSlots = createAsyncThunk(
    'home/fetchAvailableSlots',
    async ({ doctorID, appointmentDate }: any, { rejectWithValue }) => {
        try {
            const response = getAvailableSlots(doctorID, appointmentDate);
            return response;
        } catch (err) {
            const error = err as AxiosError<any>
            rejectWithValue(error?.message)
        }
    }
)
export const creatingAppointment = createAsyncThunk(
    'appointment/creatingAppointment',
    async (formData: any, { rejectWithValue }) => {
        try {
            const response = createAppointment(formData);
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
    allAvailableSlots: any[];
    loading: boolean;
    error: string | any
}

const initialState: InitialState = {
    allDoctors: [],
    doctorLeaves: [],
    allAvailableSlots: [],
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
            .addCase(fetchAvailableSlots.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchAvailableSlots.fulfilled, (state, action) => {
                state.allAvailableSlots = action.payload;
                state.loading = false;
            })
            .addCase(fetchAvailableSlots.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string
            })
    }
})


export default appointmentBookingSlice.reducer