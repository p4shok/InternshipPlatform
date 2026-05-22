export const AUTH_ENDPOINTS = {
  LOGIN: "/auth/login",
  REGISTER_STUDENT: "/auth/register/student",
  REGISTER_EMPLOYER: "/auth/register/employer",
  REGISTER_TEACHER: "/auth/register/teacher",
  REFRESH: "/auth/refresh-token",
};

export const CHAT_HUB_ENDPOINT = "/hubs/chat";

export const STUDENT_PROFILE_ENDPOINTS = {
  CURRENT: "/students/me",
  AVATAR: "/students/me/avatar",
  LOGOUT: "/students/me/logout",
};

export const STUDENT_GROUP_ENDPOINTS = {
  CURRENT: "/students/me/group",
};

export const STUDENT_GROUP_APPLICATION_ENDPOINTS = {
  CURRENT: "/students/me/group-applications",
  BY_ID: (applicationId) => `/students/me/group-applications/${applicationId}`,
};

export const EMPLOYER_PROFILE_ENDPOINTS = {
  CURRENT: "/employers/me",
  LOGOUT: "/employers/me/logout",
};

export const TEACHER_PROFILE_ENDPOINTS = {
  CURRENT: "/teachers/me",
  LOGOUT: "/teachers/me/logout",
};

export const UNIVERSITY_ENDPOINTS = {
  LIST: "/universities",
};

export const EDUCATIONAL_PROGRAM_ENDPOINTS = {
  LIST: "/educational-programs",
};

export const TEACHER_GROUP_ENDPOINTS = {
  LIST: "/curators/me/groups",
  DETAILS: (groupId) => `/curators/me/groups/${groupId}/students`,
  REFRESH_INVITE: (groupId) => `/curators/me/groups/${groupId}/invite-code`,
};

export const CURATOR_GROUP_APPLICATION_ENDPOINTS = {
  LIST: "/curators/me/group-applications",
  ACCEPT: (applicationId) => `/curators/me/group-applications/${applicationId}/accept`,
  REJECT: (applicationId) => `/curators/me/group-applications/${applicationId}/reject`,
};

export const COMPANY_ENDPOINTS = {
  BY_ID: "/companies",
  CURRENT: "/employers/me/company",
  LOGO: "/employers/me/company/logo",
};

export const SKILLS_ENDPOINTS = {
  LIST: "/skills",
};

export const SPECIALIZATIONS_ENDPOINTS = {
  LIST: "/specializations",
};

export const STUDENT_RESUMES_ENDPOINTS = {
  LIST: "/students/me/resumes",
  BY_ID: (resumeId) => `/students/me/resumes/${resumeId}`,
  COPY: (resumeId) => `/students/me/resumes/${resumeId}/copy`,
  RECOMMENDED_VACANCIES: (resumeId) =>
    `/students/me/resumes/${resumeId}/recommended-vacancies`,
};

export const VACANCIES_ENDPOINTS = {
  LIST: "/vacancies",
  BY_ID: (vacancyId) => `/vacancies/${vacancyId}`,
  COMPANY_VACANCIES: (companyId) => `/companies/${companyId}/vacancies`,
  RECOMMENDED: "/students/me/recommended-vacancies",
};

export const STUDENT_FAVORITES_ENDPOINTS = {
  LIST: "/students/me/favorite-vacancies",
  BY_ID: (vacancyId) => `/students/me/favorite-vacancies/${vacancyId}`,
};

export const STUDENT_APPLICATIONS_ENDPOINTS = {
  LIST: "/students/me/applications",
  BY_ID: (applicationId) => `/students/me/applications/${applicationId}`,
};

export const EMPLOYER_APPLICATIONS_ENDPOINTS = {
  LIST: "/employers/me/applications",
  BY_ID: (applicationId) => `/employers/me/applications/${applicationId}`,
};

export const STUDENT_CHATS_ENDPOINTS = {
  LIST: "/students/me/chats",
  BY_ID: (chatId) => `/students/me/chats/${chatId}`,
  READ: (chatId) => `/students/me/chats/${chatId}/read`,
};

export const EMPLOYER_CHATS_ENDPOINTS = {
  LIST: "/employers/me/chats",
  BY_ID: (chatId) => `/employers/me/chats/${chatId}`,
  READ: (chatId) => `/employers/me/chats/${chatId}/read`,
};

export const EMPLOYER_VACANCIES_ENDPOINTS = {
  LIST: "/employers/me/vacancies",
  BY_ID: (vacancyId) => `/employers/me/vacancies/${vacancyId}`,
  RECOMMENDED_RESUMES: "/employers/me/recommended-resumes",
  VACANCY_RECOMMENDED_RESUMES: (vacancyId) =>
    `/employers/me/vacancies/${vacancyId}/recommended-resumes`,
};
