import api from "../../../api/axios";
import { STUDENT_FAVORITES_ENDPOINTS } from "../../../api/endpoints";
import { extractItems } from "../../../api/response";

export const getFavoriteVacancies = async () => {
  const response = await api.get(STUDENT_FAVORITES_ENDPOINTS.LIST);
  return extractItems(response.data);
};

export const addFavoriteVacancy = async (vacancyId) => {
  const response = await api.post(STUDENT_FAVORITES_ENDPOINTS.BY_ID(vacancyId));
  return response.data;
};

export const removeFavoriteVacancy = async (vacancyId) => {
  const response = await api.delete(STUDENT_FAVORITES_ENDPOINTS.BY_ID(vacancyId));
  return response.data;
};
