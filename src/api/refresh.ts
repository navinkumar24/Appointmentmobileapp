import axios from "axios";
import getStoredValues from "@/utils/getStoredValues";

export const refreshAccessToken = async () => {
    const { refreshToken, baseUrl } = await getStoredValues();
    const response = await axios.post(`${baseUrl}/opd/user/refreshToken`, {
        refreshToken,
    });
    return response.data.token;
};
