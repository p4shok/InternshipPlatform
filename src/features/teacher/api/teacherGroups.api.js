import api from "../../../api/axios";
import {
  CURATOR_GROUP_APPLICATION_ENDPOINTS,
  TEACHER_GROUP_ENDPOINTS,
} from "../../../api/endpoints";

export const getTeacherGroups = async () => {
  const response = await api.get(TEACHER_GROUP_ENDPOINTS.LIST);
  return response.data;
};

export const createTeacherGroup = async (data) => {
  const response = await api.post(TEACHER_GROUP_ENDPOINTS.LIST, data);
  return response.data;
};

export const getTeacherGroupDetails = async (groupId) => {
  const response = await api.get(TEACHER_GROUP_ENDPOINTS.DETAILS(groupId));
  return response.data;
};

export const refreshTeacherGroupInviteCode = async (groupId) => {
  const response = await api.put(TEACHER_GROUP_ENDPOINTS.REFRESH_INVITE(groupId));
  return response.data;
};

export const getCuratorGroupApplications = async () => {
  const response = await api.get(CURATOR_GROUP_APPLICATION_ENDPOINTS.LIST);
  return response.data;
};

export const acceptCuratorGroupApplication = async (applicationId) => {
  const response = await api.put(
    CURATOR_GROUP_APPLICATION_ENDPOINTS.ACCEPT(applicationId)
  );
  return response.data;
};

export const rejectCuratorGroupApplication = async (applicationId) => {
  const response = await api.put(
    CURATOR_GROUP_APPLICATION_ENDPOINTS.REJECT(applicationId)
  );
  return response.data;
};
