import api from "./axios";

export const registerStudent = async (data) => {
  const response = await api.post("/Auth/registerstudent", data);
  return response.data;
};

export const loginStudent = async (data) => {
  const response = await api.post("/Auth/login", data);
  return response.data;
};