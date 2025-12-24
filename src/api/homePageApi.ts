
import { api } from "./client";

export const getAllSpecialization = async () => {
    const response = await api.get(`/opd/specialization/getAllEntity`);
    
    console.log("Specializations -- ", response);
    const data = response.data;
    if (!data?.success) {
        throw new Error(data?.errorMessage || "Failed to fetch doctors");
    }
    return data?.responseList ?? [];
};


