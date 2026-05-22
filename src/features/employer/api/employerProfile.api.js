import api from "../../../api/axios";
import { EMPLOYER_PROFILE_ENDPOINTS } from "../../../api/endpoints";
import { clearAuthSession } from "../../auth/utils/session";

export const getCurrentEmployerProfile = async () => {
    const response = await api.get(EMPLOYER_PROFILE_ENDPOINTS.CURRENT);
    return response.data;
};

export const updateEmployerProfile = async (data) => {
    const response = await api.put(EMPLOYER_PROFILE_ENDPOINTS.CURRENT, data);
    return response.data;
};

export const deleteEmployerProfile = async () => {
    const response = await api.delete(EMPLOYER_PROFILE_ENDPOINTS.CURRENT);
    clearAuthSession();
    return response.data;
};

export const logoutEmployer = async () => {
    const response = await api.post(EMPLOYER_PROFILE_ENDPOINTS.LOGOUT);
    clearAuthSession();
    return response.data;
};
