import api from "../../../api/axios";
import { STUDENT_RESUMES_ENDPOINTS } from "../../../api/endpoints";
import { extractItems } from "../../../api/response";

export const getMyResumes = async () => {
    const response = await api.get(STUDENT_RESUMES_ENDPOINTS.LIST);
    return extractItems(response.data);
};

export const createResume = async (payload) => {
    const response = await api.post(STUDENT_RESUMES_ENDPOINTS.LIST, payload);
    return response.data;
};

export const updateResume = async (resumeId, payload) => {
    const response = await api.put(STUDENT_RESUMES_ENDPOINTS.BY_ID(resumeId), payload);
    return response.data;
};

export const deleteResume = async (resumeId) => {
    const response = await api.delete(STUDENT_RESUMES_ENDPOINTS.BY_ID(resumeId));
    return response.data;
};

export const copyResume = async (resumeId) => {
    const response = await api.post(STUDENT_RESUMES_ENDPOINTS.COPY(resumeId));
    return response.data;
};

export const getRecommendedVacanciesByResume = async (
    resumeId,
    pageIndex = 1,
    pageSize = 8
) => {
    const response = await api.get(
        STUDENT_RESUMES_ENDPOINTS.RECOMMENDED_VACANCIES(resumeId),
        {
            params: {
                PageIndex: pageIndex,
                PageSize: pageSize,
            },
        }
    );

    return extractItems(response.data);
};
