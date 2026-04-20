import api from "../../../api/axios";
import { EMPLOYER_VACANCIES_ENDPOINTS } from "../../../api/endpoints";
import { extractItems } from "../../../api/response";

export const getEmployerVacancies = async () => {
    const response = await api.get(EMPLOYER_VACANCIES_ENDPOINTS.LIST);
    return extractItems(response.data);
};

export const createEmployerVacancy = async (payload) => {
    const response = await api.post(EMPLOYER_VACANCIES_ENDPOINTS.LIST, payload);
    return response.data;
};

export const updateEmployerVacancy = async (vacancyId, payload) => {
    const response = await api.put(
        EMPLOYER_VACANCIES_ENDPOINTS.BY_ID(vacancyId),
        payload
    );
    return response.data;
};

export const deleteEmployerVacancy = async (vacancyId) => {
    const response = await api.delete(EMPLOYER_VACANCIES_ENDPOINTS.BY_ID(vacancyId));
    return response.data;
};
