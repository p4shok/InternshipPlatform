import api from "../../../api/axios";
import { STUDENT_APPLICATIONS_ENDPOINTS } from "../../../api/endpoints";
import { extractItems } from "../../../api/response";

const buildApplicationParams = (filters = {}) => ({
  ResumeId: filters.resumeId || undefined,
  Status: filters.status || undefined,
  PageIndex: filters.pageIndex || 1,
  PageSize: filters.pageSize || 50,
});

export const createStudentApplication = async (payload) => {
  const response = await api.post(STUDENT_APPLICATIONS_ENDPOINTS.LIST, payload);
  return response.data;
};

export const getStudentApplications = async (filters = {}) => {
  const response = await api.get(STUDENT_APPLICATIONS_ENDPOINTS.LIST, {
    params: buildApplicationParams(filters),
  });

  return extractItems(response.data);
};

export const updateStudentApplicationStatus = async (applicationId, applicationStatus) => {
  const response = await api.put(STUDENT_APPLICATIONS_ENDPOINTS.BY_ID(applicationId), {
    applicationStatus,
  });

  return response.data;
};
