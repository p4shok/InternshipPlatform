import api from "../../../api/axios";
import { SKILLS_ENDPOINTS, SPECIALIZATIONS_ENDPOINTS } from "../../../api/endpoints";
import { extractItems } from "../../../api/response";

export const getSkills = async () => {
    const response = await api.get(SKILLS_ENDPOINTS.LIST);
    return extractItems(response.data);
};

export const getSpecializations = async () => {
    const response = await api.get(SPECIALIZATIONS_ENDPOINTS.LIST);
    return extractItems(response.data);
};
