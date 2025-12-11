import { createSlice } from "@reduxjs/toolkit";




type InitialState = {
    doctorSpecialitiesPageTitle: string | any;
    loading: boolean;
    error: string | any
}

const initialState: InitialState = {
    doctorSpecialitiesPageTitle: null,
    loading: false,
    error: null,
}

export const utilsSlice = createSlice({
    name: 'utils',
    initialState,
    reducers: {
        setDoctorSpecialitiesPageTitle: (state, action) => {
            state.doctorSpecialitiesPageTitle = action.payload
        }
    },
    extraReducers: (builder) => { }
})

export const { setDoctorSpecialitiesPageTitle } = utilsSlice.actions
export default utilsSlice.reducer