import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { AxiosError } from "axios";
import { getAllSpecialization } from "../api/homePageApi";



export const fetchAllSpecializations = createAsyncThunk(
    'home/fetchAllSpecializations',
    async (_, { rejectWithValue }) => {
        try {
            const response = getAllSpecialization();
            return response;
        } catch (err) {
            const error = err as AxiosError<any>
            rejectWithValue(error?.message)
        }
    }
)

type InitialState = {
    allSpecializations: any[];
    loading: boolean;
    error: string | any
}

const initialState: InitialState = {
    allSpecializations: [],
    loading: false,
    error: null,
}

export const homeSlice = createSlice({
    name: 'home',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchAllSpecializations.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchAllSpecializations.fulfilled, (state, action) => {
                state.allSpecializations = action.payload;
                state.loading = false;
            })
            .addCase(fetchAllSpecializations.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string
            })
    }
})


export default homeSlice.reducer