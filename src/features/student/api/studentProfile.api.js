import api from "../../../api/axios";
import { STUDENT_PROFILE_ENDPOINTS } from "../../../api/endpoints";
import { clearAuthSession } from "../../auth/utils/session";

export const getCurrentStudentProfile = async () => {
    const response = await api.get(STUDENT_PROFILE_ENDPOINTS.CURRENT);
    return response.data;
};

export const updateStudentProfile = async (data) => {
    const response = await api.put(STUDENT_PROFILE_ENDPOINTS.CURRENT, data);
    return response.data;
};

export const deleteStudentProfile = async () => {
    const response = await api.delete(STUDENT_PROFILE_ENDPOINTS.CURRENT);
    clearAuthSession();
    return response.data;
};

export const logoutStudent = async () => {
    const response = await api.post(STUDENT_PROFILE_ENDPOINTS.LOGOUT);
    clearAuthSession();
    return response.data;
};

export const uploadStudentAvatar = async (file) => {
    const formData = new FormData();
    formData.append("avatarFile", file);

    const response = await api.put(STUDENT_PROFILE_ENDPOINTS.AVATAR, formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });

    return response.data;
};
