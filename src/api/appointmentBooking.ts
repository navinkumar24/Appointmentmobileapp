
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
    console.log("Verify form data - ", formData)
    try {
        const response = await axios.post(`${baseUrl}/opd/payment/verifyOrder`,
            {
                "verifyOrderRequest": {
                    "paymentID": formData?.paymentID,
                    "appointmentID": formData?.appointmentID,
                    "signature": formData?.signature
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
                    "patientID": patientID,
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
export const createOrder = async (userID: number | string, amount: number | string, formData: any) => {
    const { token, baseUrl } = await getStoredValues();
    console.log("Create Order Called")
    console.log("user ID -- ", userID)
    try {
        const response = await axios.post(`${baseUrl}/opd/payment/createOrder`,
            {
                "orderRequestEntity": {
                    userID: userID,
                    amount
                },
                "appointmentRequestEntity": {
                    "appointmentStartTime": formData?.startTime,
                    "appointmentEndTime": formData?.endTime,
                    "appointmentDate": formData?.appointmentDate,
                    "doctorID": formData?.doctorID,
                    "patientID": userID
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
        console.log("Errroorrrrr -- ", error?.response?.data)
        showToast("error", "Error", error?.response?.data?.errorMessage)
    }
};
export const canReschedule: any = async () => {
    const { token, baseUrl } = await getStoredValues();
    try {
        const response = await axios.get(`${baseUrl}/opd/appointment/canReschedule`,
            {
                headers: {
                    Authorization: token,
                    "Content-Type": "application/json",
                },
            }
        );

        return response?.data
    } catch (err) {
        const error = err as AxiosError<any>;
        console.log("Can Reschedule -- ", error?.response?.data)
        showToast("error", "Error", error?.response?.data?.errorMessage)
    }
};
export const rescheduleAppointment: any = async (formData: any) => {
    const { token, baseUrl } = await getStoredValues();
    try {
        const response = await axios.post(`${baseUrl}/opd/appointment/rescheduleAppointment`,
            {
                "rescheduleRequest": {
                    "appointmentID": formData?.appointmentID,
                    "startTime": formData?.startTime,
                    "endTime": formData?.endTime,
                    "newAppointmentDate": formData?.newAppointmentDate
                }
            },
            {
                headers: {
                    Authorization: token,
                    "Content-Type": "application/json",
                },
            }
        );

        console.log("Data -- ", response?.data)

        return response?.data?.responseList
    } catch (err) {
        const error = err as AxiosError<any>;
        console.log("Reschedule Error -- ", error?.response?.data)
        showToast("error", "Error", error?.response?.data?.errorMessage)
    }
};