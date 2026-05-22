import api from "../../../api/axios";
import { EMPLOYER_APPLICATIONS_ENDPOINTS } from "../../../api/endpoints";
import { extractItems } from "../../../api/response";

const buildApplicationParams = (filters = {}) => ({
  VacancyId: filters.vacancyId || undefined,
  Status: filters.status || undefined,
  PageIndex: filters.pageIndex || 1,
  PageSize: filters.pageSize || 50,
});

export const getEmployerApplications = async (filters = {}) => {
  const response = await api.get(EMPLOYER_APPLICATIONS_ENDPOINTS.LIST, {
    params: buildApplicationParams(filters),
  });

  return extractItems(response.data);
};

export const updateEmployerApplicationStatus = async (applicationId, applicationStatus) => {
  const response = await api.put(EMPLOYER_APPLICATIONS_ENDPOINTS.BY_ID(applicationId), {
    applicationStatus,
  });

  return response.data;
};
