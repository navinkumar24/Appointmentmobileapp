
import axios, { AxiosError } from "axios";
import getStoredValues from "../utils/getStoredValues";
import showToast from "../utils/showToast";
import dayjs from "dayjs";

export const loginOtp = async (
    mobile: string,
    accessToken: string
) => {
    const { token, baseUrl } = await getStoredValues();
    try {
        const response = await axios.post(
            `${baseUrl}/opd/user/loginOtp`,
            {},
            {
                headers: {
                    Authorization: token,
                    "Content-Type": "application/json",
                    "mobile": mobile,
                    "accessCode": accessToken
                }
            }
        );
        if (response?.data.success) {
            return response.data;
        }
        console.log("Response Data -- ", response?.data)
    } catch (err) {
        console.log("Error -- ", err)
        const error = err as AxiosError<any>;
        throw new Error(
            error.response?.data?.errorMessage ||
            error.message ||
            "OTP login failed"
        );
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
        console.log("Res -- ", response)
        if (response?.data?.success) {
            showToast("success", "Success", "Logged in Successfully!")
            return response?.data.responseList?.[0];
        }
        return response?.data;
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
