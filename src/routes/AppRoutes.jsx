import { Routes, Route } from "react-router-dom";

import { ROUTES } from "./routePaths";

import RoleSelectPage from "../pages/RoleSelectPage";

import StudentAuthChoicePage from "../features/student/pages/StudentAuthChoicePage";
import StudentLoginPage from "../features/student/pages/StudentLoginPage";
import StudentRegisterPage from "../features/student/pages/StudentRegisterPage";

import EmployerAuthChoicePage from "../features/employer/pages/EmployerAuthChoicePage";
import EmployerLoginPage from "../features/employer/pages/EmployerLoginPage";
import EmployerRegisterPage from "../features/employer/pages/EmployerRegisterPage";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path={ROUTES.HOME} element={<RoleSelectPage />} />

      <Route path={ROUTES.STUDENT_AUTH} element={<StudentAuthChoicePage />} />
      <Route path={ROUTES.STUDENT_LOGIN} element={<StudentLoginPage />} />
      <Route path={ROUTES.STUDENT_REGISTER} element={<StudentRegisterPage />} />

      <Route path={ROUTES.EMPLOYER_AUTH} element={<EmployerAuthChoicePage />} />
      <Route path={ROUTES.EMPLOYER_LOGIN} element={<EmployerLoginPage />} />
      <Route path={ROUTES.EMPLOYER_REGISTER} element={<EmployerRegisterPage />} />
    </Routes>
  );
};

export default AppRoutes;