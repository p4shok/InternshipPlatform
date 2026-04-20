import api from "../../../api/axios";
import { VACANCIES_ENDPOINTS } from "../../../api/endpoints";
import { extractItems } from "../../../api/response";

const appendArrayParams = (params, key, values) => {
    if (!Array.isArray(values)) return;

    values.forEach((value) => {
        if (value !== null && value !== undefined && value !== "") {
            params.append(key, String(value));
        }
    });
};

const buildVacancyQueryParams = (filters = {}) => {
    const params = new URLSearchParams();
    const mappings = [
        ["Search", filters.search],
        ["SearchInTitle", filters.searchInTitle],
        ["SearchInDescription", filters.searchInDescription],
        ["SearchInCompanyName", filters.searchInCompanyName],
        ["SalaryFrom", filters.salaryFrom],
        ["SalaryTo", filters.salaryTo],
        ["IsRemote", filters.isRemote],
        ["Region", filters.region],
        ["MinWorkExperienceYears", filters.minWorkExperienceYears],
        ["MaxWorkExperienceYears", filters.maxWorkExperienceYears],
        ["SpecializationId", filters.specializationId],
        ["PageIndex", filters.pageIndex],
        ["PageSize", filters.pageSize],
    ];

    mappings.forEach(([key, value]) => {
        if (value !== null && value !== undefined && value !== "") {
            params.append(key, String(value));
        }
    });

    appendArrayParams(params, "SkillIds", filters.skillIds);

    return params;
};

export const getVacancies = async (filters = {}) => {
    const params = buildVacancyQueryParams(filters);
    const response = await api.get(VACANCIES_ENDPOINTS.LIST, { params });
    return extractItems(response.data);
};

export const getRecommendedVacancies = async (pageIndex = 1, pageSize = 8) => {
    const response = await api.get(VACANCIES_ENDPOINTS.RECOMMENDED, {
        params: {
            PageIndex: pageIndex,
            PageSize: pageSize,
        },
    });

    return extractItems(response.data);
};
