
import axios, { AxiosError } from "axios";
import getStoredValues from "../utils/getStoredValues";
import showToast from "../utils/showToast";
import dayjs from "dayjs";

export const login = async (mobile: any, password: any) => {
    const { token, baseUrl } = await getStoredValues();
    try {
        const response = await axios.post(
            `${baseUrl}/opd/user/login`, {},
            {
                headers: {
                    Authorization: token,
                    "Content-Type": "application/json",
                    "mobile": mobile,
                    "password": password
                },
            }
        );
        if (response?.data?.success) {
            showToast("success", "Success", "Logged in Successfully!")
        }
        return response?.data?.responseList?.[0];
    } catch (err) {
        const error = err as AxiosError<any>;
        showToast("error", "Error", error?.response?.data?.errorMessage)
    }
};
export const register = async (formData: any) => {
    const { token, baseUrl } = await getStoredValues();
    try {
        const response = await axios.post(`${baseUrl}/opd/user/register`,
            {
                "registerRequestEntity": {
                    "entityBusinessName": formData?.fullName,
                    "mobileNumber": formData?.mobileNumber,
                    "accessToken": formData?.otpAccessToken,
                    "gender": formData?.gender,
                    "address": formData?.address,
                    "DOB": dayjs(formData?.dob)?.format("DD-MM-YYYY"),
                    "password": formData?.password
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
            showToast("success", "Success", "Logged in Successfully!")
        }
        console.log("Response -- ", response.data)
        return response?.data?.responseList?.[0];
    } catch (err) {
        const error = err as AxiosError<any>;
        showToast("error", "Error", error?.response?.data?.errorMessage)
    }
};

export const changePassword = async (entityBusinessID: any, oldPassword: any, newPassword: any) => {
    const { token, baseUrl } = await getStoredValues();
    try {
        const response = await axios.post(
            `${baseUrl}/opd/user/changePassword`,
            {
                changePasswordRequest: {
                    userID: entityBusinessID,
                    oldPassword,
                    newPassword,
                },
            },
            {
                headers: {
                    Authorization: token,
                    "Content-Type": "application/json",
                },
            }
        );
        if (response?.data?.success) {
            showToast("error", "Success", "Password Changed Successfully!")
        }
        return response?.data?.responseList;
    } catch (err) {
        const error = err as AxiosError<any>;
        showToast("error", "Error", error?.response?.data?.errorMessage)
    }
};
