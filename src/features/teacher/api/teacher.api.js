import api from "../../../api/axios";
import {
  EDUCATIONAL_PROGRAM_ENDPOINTS,
  TEACHER_PROFILE_ENDPOINTS,
  UNIVERSITY_ENDPOINTS,
} from "../../../api/endpoints";
import { clearAuthSession } from "../../auth/utils/session";

export const getCurrentTeacherProfile = async () => {
  const response = await api.get(TEACHER_PROFILE_ENDPOINTS.CURRENT);
  return response.data;
};

export const updateTeacherProfile = async (data) => {
  const response = await api.put(TEACHER_PROFILE_ENDPOINTS.CURRENT, data);
  return response.data;
};

export const logoutTeacher = async () => {
  const response = await api.post(TEACHER_PROFILE_ENDPOINTS.LOGOUT);
  clearAuthSession();
  return response.data;
};

export const getUniversities = async () => {
  const response = await api.get(UNIVERSITY_ENDPOINTS.LIST);
  return response.data;
};

export const getEducationalPrograms = async () => {
  const response = await api.get(EDUCATIONAL_PROGRAM_ENDPOINTS.LIST);
  return response.data;
};
