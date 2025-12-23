
import dayjs from "dayjs";
import { api } from "./client";
import getStoredValues from "@/utils/getStoredValues";

export const loginOtp = async (mobile: string, accessToken: string) => {
    const response = await api.post(`/opd/user/loginOtp`,
        {
            "mobile": mobile,
            "password": accessToken
        });
    const data = response?.data;
    console.log("NEW DATATATATAT --- ", data)
    if (!data?.success) {
        throw new Error(data?.errorMessage || "Failed to login")
    }
    return data
};

export const logout = async () => {
    const { refreshToken } = await getStoredValues()
    const response = await api.post(`/opd/user/logout`, { refreshToken });
    const data = response?.data;
    if (!data?.success) {
        throw new Error(data?.errorMessage || "Failed to login")
    }
    return data?.responseList?.[0]
};

export const register = async (formData: any) => {
    const response = await api.post(`/opd/user/register`,
        {
            "registerRequestEntity": {
                "entityBusinessName": formData?.fullName,
                "mobileNumber": formData?.mobileNumber,
                "accessToken": formData?.otpAccessToken,
                "gender": formData?.gender,
                "address": formData?.address,
                "DOB": dayjs(formData?.dob)?.format("DD-MM-YYYY"),
            }
        }
    );
    const data = response?.data
    if (!data?.success) {
        throw new Error(data?.errorMessage || "Failed to register")
    }
    return response?.data.responseList?.[0];
};

export const updateUserProfile = async (formData: any) => {
    const response = await api.post(`/opd/user/updateUser`,
        {
            "userUpdateRequest": {
                "entityBusinessID": formData?.userID,
                "entityBusinessName": formData?.fullName,
                "gender": formData?.gender,
                "address": formData?.address,
                "DOB": dayjs(formData?.dob)?.format("DD-MM-YYYY"),
            }
        }
    );
    const data = response?.data
    if (!data?.success) {
        throw new Error(data?.errorMessage || "Failed to update profile")
    }
    return response?.data.responseList?.[0];
};
