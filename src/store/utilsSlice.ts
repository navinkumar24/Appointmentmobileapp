import { canReschedule } from "@/api/appointmentBooking";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { AxiosError } from "axios";


export const canRescheduleAppoint = createAsyncThunk(
    'utils/canRescheduleAppoint',
    async (_, { rejectWithValue }) => {
        try {
            const response = await canReschedule();
            return response?.canReschedule ? true : false;
        } catch (err) {
            const error = err as AxiosError<any>
            rejectWithValue(error?.message)
        }
    }
)

type InitialState = {
    selectedSpecialist: any;
    doctorSpecialitiesPageTitle: any;
    canReschedule: boolean | any;
    loading: boolean;
    error: string | any
}

const initialState: InitialState = {
    selectedSpecialist: null,
    doctorSpecialitiesPageTitle: null,
    canReschedule: false,
    loading: false,
    error: null,
}

export const utilsSlice = createSlice({
    name: 'utils',
    initialState,
    reducers: {
        setSelectedSpecialist: (state, action) => {
            state.selectedSpecialist = action.payload
        },
        setDoctorSpecialitiesPageTitle: (state, action) => {
            state.doctorSpecialitiesPageTitle = action.payload
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(canRescheduleAppoint.pending, (state, action) => {
                state.loading = true
            })
            .addCase(canRescheduleAppoint.fulfilled, (state, action) => {
                state.loading = false;
                state.canReschedule = action.payload;
            })
            .addCase(canRescheduleAppoint.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload
            })
    }
})

export const { setSelectedSpecialist, setDoctorSpecialitiesPageTitle } = utilsSlice.actions
export default utilsSlice.reducer