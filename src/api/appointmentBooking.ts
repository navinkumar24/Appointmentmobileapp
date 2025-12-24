
import { api } from "./client";

export const getAllDoctorDropDown = async (specialization: any): Promise<any[]> => {
    const response = await api.post("/opd/doctor/getAllEntity", {
        genericRequestEntity: {
            dropdown: 0,
            specialization,
        },
    });

    const data = response.data;
    if (!data?.success) {
        throw new Error(data?.errorMessage || "Failed to fetch doctors");
    }

    return data.responseList ?? [];
};

export const getDoctorLeaves = async (doctorID: number | string): Promise<any[]> => {
    const response = await api.post("/opd/doctorleave/getAllEntity", {
        genericRequestEntity: { doctorID },
    });

    const data = response.data;
    if (!data?.success) {
        throw new Error(data?.errorMessage || "Failed to fetch doctor's leave");
    }

    return data.responseList ?? [];
};


export const getAvailableSlots = async (doctorID: number | string, appointmentDate: string): Promise<any[]> => {
    const response = await api.post("/opd/appointment/getAvailableSlots", {
        genericRequestEntity: {
            doctorID,
            appointmentDate,
        },
    });

    const data = response.data;
    if (!data?.success) {
        throw new Error(data?.errorMessage || "Failed to fetch available slots");
    }

    return data.responseList ?? [];
};

export const createAppointment = async (formData: any): Promise<any[]> => {
    const response = await api.post("/opd/payment/verifyOrder", {
        verifyOrderRequest: {
            paymentID: formData?.paymentID,
            appointmentID: formData?.appointmentID,
            signature: formData?.signature,
        },
    });

    const data = response.data;
    if (!data?.success) {
        throw new Error(data?.errorMessage || "Failed to create appointment");
    }

    return data.responseList ?? [];
};

export const getBookedAppointments = async (patientID: number | string): Promise<any[]> => {
    const response = await api.post("/opd/appointment/getAllAppointment", {
        genericRequestEntity: {
            doctorID: null,
            patientID,
            startDate: null,
            endDate: null,
        },
    });

    const data = response.data;
    if (!data?.success) {
        throw new Error(data?.errorMessage || "Failed to fetch appointments");
    }

    return data.responseList ?? [];
};

export const createOrder = async (
    userID: number | string,
    amount: number | string,
    formData: any
): Promise<any | null> => {

    console.log("User ID -- ", userID)
    console.log("Amount -- ", amount)
    console.log("Form Data -- ", formData)
    const response = await api.post("/opd/payment/createOrder", {
        orderRequestEntity: {
            userID,
            amount,
        },
        appointmentRequestEntity: {
            appointmentStartTime: formData?.startTime,
            appointmentEndTime: formData?.endTime,
            appointmentDate: formData?.appointmentDate,
            doctorID: formData?.doctorID,
            patientID: userID,
        },
    });
    
    console.log("Create order -- ", response)
    const data = response.data;
    if (!data?.success) {
        console.log("Error -- ", data?.errorMessage)
        throw new Error(data?.errorMessage || "Failed to create order");
    }

    return data.responseList ? data.responseList[0] ?? null : null;
};

export const canReschedule = async (): Promise<any> => {
    const response = await api.get("/opd/appointment/canReschedule");
    const data = response.data;
    if (!data?.success) {
        throw new Error(data?.errorMessage || "Failed to check reschedule availability");
    }
    return data.response ?? data.responseList ?? data;
};


export const rescheduleAppointment = async (formData: any): Promise<any[]> => {
    const response = await api.post("/opd/appointment/rescheduleAppointment", {
        rescheduleRequest: {
            appointmentID: formData?.appointmentID,
            startTime: formData?.startTime,
            endTime: formData?.endTime,
            newAppointmentDate: formData?.newAppointmentDate,
        },
    });

    const data = response.data;
    if (!data?.success) {
        throw new Error(data?.errorMessage || "Failed to reschedule appointment");
    }
    return data.responseList ?? [];
};
