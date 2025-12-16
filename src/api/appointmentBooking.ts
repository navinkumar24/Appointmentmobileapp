
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
                    "paymentEntityID": formData?.entityID,
                    "paymentID": formData?.paymentID,
                    "signature": formData?.signature,
                    "doctorID": formData?.doctorID,
                    "patientID": formData?.patientID
                }
            },
            {
                headers: {
                    Authorization: token,
                    "Content-Type": "application/json",
                },
            }
        );
        console.log("Created Appointment -- ", response?.data)
        if (response?.data?.success) {
            return response?.data?.responseList;
        }
    } catch (err) {
        console.log("Errr  --- ", err)
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
export const createOrder = async (userID: number | string, amount: number | string) => {
    const { token, baseUrl } = await getStoredValues();
    console.log("Create Order Called")
    try {
        const response = await axios.post(`${baseUrl}/opd/payment/createOrder`,
            {
                "orderRequestEntity": {
                    userID: userID,
                    amount
                }
            },
            {
                headers: {
                    Authorization: token,
                    "Content-Type": "application/json",
                },
            }
        );
        console.log("Rea -- ", response?.data)
        // if (response?.data?.success) {
        //     return response?.data?.responseList?.[0]
        // }
         return response?.data?.responseList?.[0]
    } catch (err) {
        const error = err as AxiosError<any>;
        showToast("error", "Error", error?.response?.data?.errorMessage)
    }
};