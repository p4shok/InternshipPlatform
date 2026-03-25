import api from "../../../api/axios";
import { AUTH_ENDPOINTS } from "../../../api/endpoints";

export const registerStudent = async (data) => {
  const response = await api.post(AUTH_ENDPOINTS.REGISTER_STUDENT, data);
  return response.data;
};

export const registerEmployer = async (data) => {
  const response = await api.post(AUTH_ENDPOINTS.REGISTER_EMPLOYER, data);
  return response.data;
};

export const loginStudent = async (data) => {
  const response = await api.post(AUTH_ENDPOINTS.LOGIN, data);
  return response.data;
};

export const loginEmployer = async (data) => {
  const response = await api.post(AUTH_ENDPOINTS.LOGIN, data);
  return response.data;
};