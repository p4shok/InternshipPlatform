import { Routes, Route } from "react-router-dom";

import { ROUTES } from "./routePaths";
import ProtectedRoute from "./ProtectedRoute";

import RoleSelectPage from "../pages/RoleSelectPage";

import StudentAuthChoicePage from "../features/student/pages/StudentAuthChoicePage";
import StudentLoginPage from "../features/student/pages/StudentLoginPage";
import StudentRegisterPage from "../features/student/pages/StudentRegisterPage";
import StudentProfilePage from "../features/student/pages/StudentProfilePage";
import StudentVacanciesPage from "../features/student/pages/StudentVacanciesPage";
import StudentVacancyDetailsPage from "../features/student/pages/StudentVacancyDetailsPage";
import StudentResumesPage from "../features/student/pages/StudentResumesPage";
import StudentApplicationsPage from "../features/student/pages/StudentApplicationsPage";
import StudentChatsPage from "../features/student/pages/StudentChatsPage";

import EmployerAuthChoicePage from "../features/employer/pages/EmployerAuthChoicePage";
import EmployerLoginPage from "../features/employer/pages/EmployerLoginPage";
import EmployerRegisterPage from "../features/employer/pages/EmployerRegisterPage";
import EmployerProfilePage from "../features/employer/pages/EmployerProfilePage";
import EmployerVacanciesPage from "../features/employer/pages/EmployerVacanciesPage";
import EmployerApplicationsPage from "../features/employer/pages/EmployerApplicationsPage";
import EmployerChatsPage from "../features/employer/pages/EmployerChatsPage";
import TeacherAuthChoicePage from "../features/teacher/pages/TeacherAuthChoicePage";
import TeacherLoginPage from "../features/teacher/pages/TeacherLoginPage";
import TeacherRegisterPage from "../features/teacher/pages/TeacherRegisterPage";
import TeacherCabinetPage from "../features/teacher/pages/TeacherCabinetPage";

const AppRoutes = () => {
    return (
        <Routes>
            <Route path={ROUTES.HOME} element={<RoleSelectPage />} />

            <Route path={ROUTES.STUDENT_AUTH} element={<StudentAuthChoicePage />} />
            <Route path={ROUTES.STUDENT_LOGIN} element={<StudentLoginPage />} />
            <Route path={ROUTES.STUDENT_REGISTER} element={<StudentRegisterPage />} />
            <Route
                path={ROUTES.STUDENT_PROFILE}
                element={
                    <ProtectedRoute
                        fallbackPath={ROUTES.STUDENT_LOGIN}
                        allowedRoles={["student"]}
                    >
                        <StudentProfilePage />
                    </ProtectedRoute>
                }
            />
            <Route
                path={ROUTES.STUDENT_VACANCIES}
                element={
                    <ProtectedRoute
                        fallbackPath={ROUTES.STUDENT_LOGIN}
                        allowedRoles={["student"]}
                        requireGroup
                    >
                        <StudentVacanciesPage />
                    </ProtectedRoute>
                }
            />
            <Route
                path={ROUTES.STUDENT_VACANCY_DETAILS()}
                element={
                    <ProtectedRoute
                        fallbackPath={ROUTES.STUDENT_LOGIN}
                        allowedRoles={["student"]}
                        requireGroup
                    >
                        <StudentVacancyDetailsPage />
                    </ProtectedRoute>
                }
            />
            <Route
                path={ROUTES.STUDENT_RESUMES}
                element={
                    <ProtectedRoute
                        fallbackPath={ROUTES.STUDENT_LOGIN}
                        allowedRoles={["student"]}
                        requireGroup
                    >
                        <StudentResumesPage />
                    </ProtectedRoute>
                }
            />
            <Route
                path={ROUTES.STUDENT_APPLICATIONS}
                element={
                    <ProtectedRoute
                        fallbackPath={ROUTES.STUDENT_LOGIN}
                        allowedRoles={["student"]}
                        requireGroup
                    >
                        <StudentApplicationsPage />
                    </ProtectedRoute>
                }
            />
            <Route
                path={ROUTES.STUDENT_CHATS}
                element={
                    <ProtectedRoute
                        fallbackPath={ROUTES.STUDENT_LOGIN}
                        allowedRoles={["student"]}
                        requireGroup
                    >
                        <StudentChatsPage />
                    </ProtectedRoute>
                }
            />

            <Route path={ROUTES.EMPLOYER_AUTH} element={<EmployerAuthChoicePage />} />
            <Route path={ROUTES.EMPLOYER_LOGIN} element={<EmployerLoginPage />} />
            <Route path={ROUTES.EMPLOYER_REGISTER} element={<EmployerRegisterPage />} />
            <Route
                path={ROUTES.EMPLOYER_PROFILE}
                element={
                    <ProtectedRoute
                        fallbackPath={ROUTES.EMPLOYER_LOGIN}
                        allowedRoles={["employer"]}
                    >
                        <EmployerProfilePage />
                    </ProtectedRoute>
                }
            />
            <Route
                path={ROUTES.EMPLOYER_VACANCIES}
                element={
                    <ProtectedRoute
                        fallbackPath={ROUTES.EMPLOYER_LOGIN}
                        allowedRoles={["employer"]}
                    >
                        <EmployerVacanciesPage />
                    </ProtectedRoute>
                }
            />
            <Route
                path={ROUTES.EMPLOYER_APPLICATIONS}
                element={
                    <ProtectedRoute
                        fallbackPath={ROUTES.EMPLOYER_LOGIN}
                        allowedRoles={["employer"]}
                    >
                        <EmployerApplicationsPage />
                    </ProtectedRoute>
                }
            />
            <Route
                path={ROUTES.EMPLOYER_CHATS}
                element={
                    <ProtectedRoute
                        fallbackPath={ROUTES.EMPLOYER_LOGIN}
                        allowedRoles={["employer"]}
                    >
                        <EmployerChatsPage />
                    </ProtectedRoute>
                }
            />

            <Route path={ROUTES.TEACHER_AUTH} element={<TeacherAuthChoicePage />} />
            <Route path={ROUTES.TEACHER_LOGIN} element={<TeacherLoginPage />} />
            <Route path={ROUTES.TEACHER_REGISTER} element={<TeacherRegisterPage />} />
            <Route
                path={ROUTES.TEACHER_CABINET}
                element={
                    <ProtectedRoute
                        fallbackPath={ROUTES.TEACHER_LOGIN}
                        allowedRoles={["teacher"]}
                    >
                        <TeacherCabinetPage />
                    </ProtectedRoute>
                }
            />
        </Routes>
    );
};

export default AppRoutes;
