import api from "../../../api/axios.js";
import { AUTH_ENDPOINTS } from "../../../api/endpoints.js";
import { storeAuthSession, updateAuthSession } from "../utils/session.js";
import { getCurrentStudentProfile } from "../../student/api/studentProfile.api.js";

const persistAuthResponse = (responseData, extraSession = {}) => {
  if (responseData?.accessToken) {
    storeAuthSession({
      accessToken: responseData.accessToken,
      refreshToken: responseData.refreshToken || "",
      ...extraSession,
    });
  }

  return responseData;
};

export const registerStudent = async (data) => {
  const response = await api.post(AUTH_ENDPOINTS.REGISTER_STUDENT, data);
  const authData = persistAuthResponse(response.data);
  const profile = await getCurrentStudentProfile();
  updateAuthSession({ hasGroup: Boolean(profile?.hasGroup) });
  return authData;
};

export const registerEmployer = async (data) => {
  const response = await api.post(AUTH_ENDPOINTS.REGISTER_EMPLOYER, data);
  return persistAuthResponse(response.data);
};

export const registerTeacher = async (data) => {
  const response = await api.post(AUTH_ENDPOINTS.REGISTER_TEACHER, data);
  return persistAuthResponse(response.data);
};

export const loginStudent = async (data) => {
  const response = await api.post(AUTH_ENDPOINTS.LOGIN, data);
  const authData = persistAuthResponse(response.data);
  const profile = await getCurrentStudentProfile();
  updateAuthSession({ hasGroup: Boolean(profile?.hasGroup) });
  return authData;
};

export const loginEmployer = async (data) => {
  const response = await api.post(AUTH_ENDPOINTS.LOGIN, data);
  return persistAuthResponse(response.data);
};

export const loginTeacher = async (data) => {
  const response = await api.post(AUTH_ENDPOINTS.LOGIN, data);
  return persistAuthResponse(response.data);
};
