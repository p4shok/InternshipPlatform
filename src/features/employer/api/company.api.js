import api from "../../../api/axios";
import { COMPANY_ENDPOINTS } from "../../../api/endpoints";

export const getCompanyById = async (companyId) => {
    const response = await api.get(`${COMPANY_ENDPOINTS.BASE}/${companyId}`);
    return response.data;
};

export const updateCompany = async (data) => {
    const response = await api.put(COMPANY_ENDPOINTS.BASE, data);
    return response.data;
};

export const uploadCompanyLogo = async (file) => {
    const formData = new FormData();
    formData.append("file", file);

    const response = await api.post(COMPANY_ENDPOINTS.LOGO, formData, {
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