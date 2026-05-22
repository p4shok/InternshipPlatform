import api from "../../../api/axios";
import { EMPLOYER_CHATS_ENDPOINTS } from "../../../api/endpoints";
import { extractData, extractItems } from "../../../api/response";

export const getEmployerChats = async () => {
  const response = await api.get(EMPLOYER_CHATS_ENDPOINTS.LIST);
  return extractItems(response.data);
};

export const getEmployerChatMessages = async (chatId) => {
  const response = await api.get(EMPLOYER_CHATS_ENDPOINTS.BY_ID(chatId));
  return extractData(response.data);
};

export const markEmployerChatAsRead = async (chatId) => {
  const response = await api.post(EMPLOYER_CHATS_ENDPOINTS.READ(chatId));
  return response.data;
};
