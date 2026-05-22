import api from "../../../api/axios";
import {
  STUDENT_GROUP_APPLICATION_ENDPOINTS,
  STUDENT_GROUP_ENDPOINTS,
} from "../../../api/endpoints";

export const getMyStudentGroup = async () => {
  const response = await api.get(STUDENT_GROUP_ENDPOINTS.CURRENT);
  return response.data;
};

export const getStudentGroupApplication = async () => {
  const response = await api.get(STUDENT_GROUP_APPLICATION_ENDPOINTS.CURRENT);
  return response.data;
};

export const createStudentGroupApplication = async (inviteCode) => {
  const response = await api.post(STUDENT_GROUP_APPLICATION_ENDPOINTS.CURRENT, {
    inviteCode,
  });
  return response.data;
};

export const deleteStudentGroupApplication = async (applicationId) => {
  const response = await api.delete(
    STUDENT_GROUP_APPLICATION_ENDPOINTS.BY_ID(applicationId)
  );
  return response.data;
};
