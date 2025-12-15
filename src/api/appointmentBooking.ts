
import axios, { AxiosError } from "axios";
import getStoredValues from "../utils/getStoredValues";
import showToast from "../utils/showToast";

export const getAllDoctorDropDown = async (specialization: any) => {
    const { token, baseUrl } = await getStoredValues();
    try {
        const response = await axios.post(`${baseUrl}/opd/doctor/getAllEntity`,
            {
                "genericRequestEntity": {
                    "dropdown": 0,
                    "specialization": specialization
                }
            },
            {
                headers: {
                    Authorization: token,
                    "Content-Type": "application/json",
                },
            }
        );
        if (response?.data?.success) {
            return response?.data?.responseList;
        }
    } catch (err) {
        const error = err as AxiosError<any>;
        showToast("error", "Error", error?.response?.data?.errorMessage)
    }
};
export const getDoctorLeaves = async (doctorID: number | string) => {
    const { token, baseUrl } = await getStoredValues();
    try {
        const response = await axios.post(`${baseUrl}/opd/doctorleave/getAllEntity`,
            {
                "genericRequestEntity": {
                    "doctorID": doctorID
                }
            },
            {
                headers: {
                    Authorization: token,
                    "Content-Type": "application/json",
                },
            }
        );
        if (response?.data?.success) {
            return response?.data?.responseList;
        }
    } catch (err) {
        const error = err as AxiosError<any>;
        showToast("error", "Error", error?.response?.data?.errorMessage)
    }
};
export const getAvailableSlots = async (doctorID: number | string, appointmentDate: string | any) => {
    const { token, baseUrl } = await getStoredValues();
    try {
        const response = await axios.post(`${baseUrl}/opd/appointment/getAvailableSlots`,
            {
                "genericRequestEntity": {
                    "doctorID": doctorID,
                    "appointmentDate": appointmentDate
                }
            },
            {
                headers: {
                    Authorization: token,
                    "Content-Type": "application/json",
                },
            }
        );
        if (response?.data?.success) {
            return response?.data?.responseList;
        }
    } catch (err) {
        const error = err as AxiosError<any>;
        showToast("error", "Error", error?.response?.data?.errorMessage)
    }
};
export const createAppointment = async (formData: any) => {
    const { token, baseUrl } = await getStoredValues();
    try {
        const response = await axios.post(`${baseUrl}/opd/appointment/createAppointment`,
            {
                "appointmentRequestEntity": {
                    "appointmentStartTime": formData?.startTime,
                    "appointmentEndTime": formData?.endTime,
                    "appointmentDate": formData?.appointmentDate,
                    "orderID": "order_hghs8488",
                    "paymentID": "pay_kfdgj8ng",
                    "doctorID": formData?.doctorID,
                    "patientID": 2
                }
            },
            {
                headers: {
                    Authorization: token,
                    "Content-Type": "application/json",
                },
            }
        );
        if (response?.data?.success) {
            return response?.data?.responseList;
        }
    } catch (err) {
        const error = err as AxiosError<any>;
        showToast("error", "Error", error?.response?.data?.errorMessage)
    }
};


export const getBookedAppointments = async (patientID: number | string) => {
    const { token, baseUrl } = await getStoredValues();
    try {
        const response = await axios.post(`${baseUrl}/opd/appointment/getAllAppointment`,
            {
                "genericRequestEntity": {
                    "doctorID": null,
                    "patientID": 2,
                    "startDate": null,
                    "endDate": null
                }
            },
            {
                headers: {
                    Authorization: token,
                    "Content-Type": "application/json",
                },
            }
        );
        if (response?.data?.success) {
            console.log("Appointments --- ", response?.data)
            return response?.data?.responseList;
        }
    } catch (err) {
        const error = err as AxiosError<any>;
        showToast("error", "Error", error?.response?.data?.errorMessage)
    }
};