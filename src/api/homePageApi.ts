
import axios, { AxiosError } from "axios";
import getStoredValues from "../utils/getStoredValues";
import showToast from "../utils/showToast";

export const getAllSpecialization = async () => {
    const { token, baseUrl } = await getStoredValues();
    try {
        const response = await axios.get(`${baseUrl}/opd/specialization/getAllEntity`,
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


