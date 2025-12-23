
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";

import {
    createAppointment,
    getAllDoctorDropDown,
    getAvailableSlots,
    getBookedAppointments,
    getDoctorLeaves,
    rescheduleAppointment,
} from "../api/appointmentBooking";

/* ------------------------- Utility ---------------------------------- */
const getErrorMessage = (err: unknown): string => {
    if (!err) return "Unknown error";
    const e = err as any;
    if (typeof e === "string") return e;
    if (e?.response?.data?.errorMessage) return String(e.response.data.errorMessage);
    if (e?.message) return String(e.message);
    return JSON.stringify(e);
};


type InitialState = {
    allDoctors: any[];
    doctorLeaves: any[];
    allAvailableSlots: any[];
    allBookedAppointments: any[];
    selectedDoctor: any | null;
    rescheduleAppointmentDetails: any | null;
    loading: boolean;
    error: string | any | null;
};

const initialState: InitialState = {
    allDoctors: [],
    doctorLeaves: [],
    allAvailableSlots: [],
    allBookedAppointments: [],
    selectedDoctor: null,
    rescheduleAppointmentDetails: null,
    loading: false,
    error: null,
};


export const fetchAllDoctorDropDown = createAsyncThunk(
    "home/fetchAllDoctorDropDown",
    async (specialization, { rejectWithValue }) => {
        try {
            const response = await getAllDoctorDropDown(specialization);
            return Array.isArray(response) ? response : [];
        } catch (err) {
            return rejectWithValue(getErrorMessage(err));
        }
    });

export const fetchDoctorLeaves = createAsyncThunk<
    any[],
    number | string,
    { rejectValue: string }
>("home/fetchDoctorLeaves", async (doctorID, { rejectWithValue }) => {
    try {
        const response = await getDoctorLeaves(doctorID);
        return Array.isArray(response) ? response : [];
    } catch (err) {
        return rejectWithValue(getErrorMessage(err));
    }
});

export const fetchAvailableSlots = createAsyncThunk<
    any[],
    { doctorID: number | string; appointmentDate: string },
    { rejectValue: string }
>(
    "home/fetchAvailableSlots",
    async ({ doctorID, appointmentDate }, { rejectWithValue }) => {
        try {
            const response = await getAvailableSlots(doctorID, appointmentDate);
            return Array.isArray(response) ? response : [];
        } catch (err) {
            return rejectWithValue(getErrorMessage(err));
        }
    }
);

export const creatingAppointment = createAsyncThunk<
    any, // created appointment payload
    any, // formData
    { rejectValue: string }
>("appointment/creatingAppointment", async (formData, { rejectWithValue }) => {
    try {
        const response = await createAppointment(formData);
        return response;
    } catch (err) {
        return rejectWithValue(getErrorMessage(err));
    }
});

export const fetchBookedAppointments = createAsyncThunk<
    any[],
    number | string,
    { rejectValue: string }
>("home/fetchBookedAppointments", async (patientID, { rejectWithValue }) => {
    try {
        const response = await getBookedAppointments(patientID);
        return Array.isArray(response) ? response : [];
    } catch (err) {
        return rejectWithValue(getErrorMessage(err));
    }
});

export const reschedulingAppointment = createAsyncThunk<
    any,
    any,
    { rejectValue: string }
>("home/reschedulingAppointment", async (formData, { rejectWithValue }) => {
    try {
        const response = await rescheduleAppointment(formData);
        return response;
    } catch (err) {
        return rejectWithValue(getErrorMessage(err));
    }
});

/* ------------------------- Slice ------------------------------------ */

export const appointmentBookingSlice = createSlice({
    name: "appointmentBooking",
    initialState,
    reducers: {
        setSelectedDoctor: (state, action) => {
            state.selectedDoctor = action.payload;
        },
        setAvailableSlots: (state, action) => {
            state.allAvailableSlots = action.payload;
        },
        setRescheduleAppointmentDetails: (state, action: PayloadAction<any>) => {
            state.rescheduleAppointmentDetails = action.payload;
        },
        clearError: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        // fetchAllDoctorDropDown
        builder
            .addCase(fetchAllDoctorDropDown.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchAllDoctorDropDown.fulfilled, (state, action) => {
                state.loading = false;
                state.allDoctors = action.payload;
            })
            .addCase(fetchAllDoctorDropDown.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload ?? action.error.message ?? "Failed to fetch doctors";
                state.allDoctors = [];
            });

        // fetchDoctorLeaves
        builder
            .addCase(fetchDoctorLeaves.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchDoctorLeaves.fulfilled, (state, action) => {
                state.loading = false;
                state.doctorLeaves = action.payload;
            })
            .addCase(fetchDoctorLeaves.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload ?? action.error.message ?? "Failed to fetch doctor's leave";
                state.doctorLeaves = [];
            });

        // fetchAvailableSlots
        builder
            .addCase(fetchAvailableSlots.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchAvailableSlots.fulfilled, (state, action) => {
                state.loading = false;
                state.allAvailableSlots = action.payload;
            })
            .addCase(fetchAvailableSlots.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload ?? action.error.message ?? "Failed to fetch slots";
                state.allAvailableSlots = [];
            });

        // creatingAppointment
        builder
            .addCase(creatingAppointment.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(creatingAppointment.fulfilled, (state, action) => {
                state.loading = false;
                // caller/UI decides how to handle created appointment (toast, redirect, refetch)
            })
            .addCase(creatingAppointment.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload ?? action.error.message ?? "Failed to create appointment";
            });

        // fetchBookedAppointments
        builder
            .addCase(fetchBookedAppointments.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchBookedAppointments.fulfilled, (state, action) => {
                state.loading = false;
                state.allBookedAppointments = action.payload;
            })
            .addCase(fetchBookedAppointments.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload ?? action.error.message ?? "Failed to fetch appointments";
                state.allBookedAppointments = [];
            });

        // reschedulingAppointment
        builder
            .addCase(reschedulingAppointment.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(reschedulingAppointment.fulfilled, (state) => {
                state.loading = false;
                // UI can react to the fulfilled action
            })
            .addCase(reschedulingAppointment.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload ?? action.error.message ?? "Failed to reschedule appointment";
            });
    },
});

/* ------------------------- Exports ---------------------------------- */
export const { setSelectedDoctor, setAvailableSlots, setRescheduleAppointmentDetails, clearError } =
    appointmentBookingSlice.actions;

export default appointmentBookingSlice.reducer;
