import api from "../../../api/axios";
import { COMPANY_ENDPOINTS } from "../../../api/endpoints";

export const getCompanyById = async (companyId) => {
    const response = await api.get(`${COMPANY_ENDPOINTS.BY_ID}/${companyId}`);
    return response.data;
};

export const getCurrentEmployerCompany = async () => {
    const response = await api.get(COMPANY_ENDPOINTS.CURRENT);
    return response.data;
};

export const updateCompany = async (data) => {
    const response = await api.put(COMPANY_ENDPOINTS.CURRENT, data);
    return response.data;
};

export const uploadCompanyLogo = async (file) => {
    const formData = new FormData();
    formData.append("logoFile", file);

    const response = await api.put(COMPANY_ENDPOINTS.LOGO, formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });

    return response.data;
};

export const deleteCompanyLogo = async () => {
    const response = await api.delete(COMPANY_ENDPOINTS.LOGO);
    return response.data;
};
