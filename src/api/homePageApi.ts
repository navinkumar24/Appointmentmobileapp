
import { api } from "./client";

export const getAllSpecialization = async () => {
    const response = await api.get(`/opd/specialization/getAllEntity`);
    const data = response.data;
    console.log("Specializations -- ", response);
    if (!data?.success) {
        throw new Error(data?.errorMessage || "Failed to fetch doctors");
    }
    return data?.responseList ?? [];
};


