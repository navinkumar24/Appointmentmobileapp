import { createSlice } from "@reduxjs/toolkit";




type InitialState = {
    selectedSpecialist: any;
    doctorSpecialitiesPageTitle: any;
    loading: boolean;
    error: string | any
}

const initialState: InitialState = {
    selectedSpecialist: null,
    doctorSpecialitiesPageTitle: null,
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
    extraReducers: (builder) => { }
})

export const { setSelectedSpecialist, setDoctorSpecialitiesPageTitle } = utilsSlice.actions
export default utilsSlice.reducer