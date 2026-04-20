export const AUTH_ENDPOINTS = {
  LOGIN: "/auth/login",
  REGISTER_STUDENT: "/auth/register/student",
  REGISTER_EMPLOYER: "/auth/register/employer",
  REFRESH: "/auth/refresh-token",
};

export const STUDENT_PROFILE_ENDPOINTS = {
  CURRENT: "/students/me",
  AVATAR: "/students/me/avatar",
  LOGOUT: "/students/me/logout",
};

export const EMPLOYER_PROFILE_ENDPOINTS = {
  CURRENT: "/employers/me",
  LOGOUT: "/employers/me/logout",
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

export const EMPLOYER_VACANCIES_ENDPOINTS = {
  LIST: "/employers/me/vacancies",
  BY_ID: (vacancyId) => `/employers/me/vacancies/${vacancyId}`,
  RECOMMENDED_RESUMES: "/employers/me/recommended-resumes",
  VACANCY_RECOMMENDED_RESUMES: (vacancyId) =>
    `/employers/me/vacancies/${vacancyId}/recommended-resumes`,
};
