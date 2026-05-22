export const ROUTES = {
  HOME: "/",

  STUDENT_AUTH: "/student/auth",
  STUDENT_LOGIN: "/student/login",
  STUDENT_REGISTER: "/student/register",
  STUDENT_PROFILE: "/student/profile",
  STUDENT_VACANCIES: "/student/vacancies",
  STUDENT_VACANCY_DETAILS: (vacancyId = ":vacancyId") => `/student/vacancies/${vacancyId}`,
  STUDENT_RESUMES: "/student/resumes",
  STUDENT_APPLICATIONS: "/student/applications",
  STUDENT_CHATS: "/student/chats",

  EMPLOYER_AUTH: "/employer/auth",
  EMPLOYER_LOGIN: "/employer/login",
  EMPLOYER_REGISTER: "/employer/register",
  EMPLOYER_PROFILE: "/employer/profile",
  EMPLOYER_VACANCIES: "/employer/vacancies",
  EMPLOYER_APPLICATIONS: "/employer/applications",
  EMPLOYER_CHATS: "/employer/chats",

  TEACHER_AUTH: "/teacher/auth",
  TEACHER_LOGIN: "/teacher/login",
  TEACHER_REGISTER: "/teacher/register",
  TEACHER_CABINET: "/teacher/cabinet",
};
