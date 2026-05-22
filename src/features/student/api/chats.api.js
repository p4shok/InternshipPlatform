import api from "../../../api/axios";
import { STUDENT_CHATS_ENDPOINTS } from "../../../api/endpoints";
import { extractData, extractItems } from "../../../api/response";

export const getStudentChats = async () => {
  const response = await api.get(STUDENT_CHATS_ENDPOINTS.LIST);
  return extractItems(response.data);
};

export const getStudentChatMessages = async (chatId) => {
  const response = await api.get(STUDENT_CHATS_ENDPOINTS.BY_ID(chatId));
  return extractData(response.data);
};

export const getOrCreateStudentChat = async (payload) => {
  const response = await api.post(STUDENT_CHATS_ENDPOINTS.LIST, payload);
  return extractData(response.data);
};

export const markStudentChatAsRead = async (chatId) => {
  const response = await api.post(STUDENT_CHATS_ENDPOINTS.READ(chatId));
  return response.data;
};
