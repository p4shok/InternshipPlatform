import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import RoleSelectPage from "./pages/RoleSelectPage";
import StudentAuthChoicePage from "./pages/StudentAuthChoicePage";
import StudentLoginPage from "./pages/StudentLoginPage";
import StudentRegisterPage from "./pages/StudentRegisterPage";
import EmployerAuthChoicePage from "./pages/EmployerAuthChoicePage";
import EmployerLoginPage from "./pages/EmployerLoginPage";
import EmployerRegisterPage from "./pages/EmployerRegisterPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<RoleSelectPage />} />

        <Route path="/student/auth" element={<StudentAuthChoicePage />} />
        <Route path="/student/login" element={<StudentLoginPage />} />
        <Route path="/student/register" element={<StudentRegisterPage />} />

        <Route path="/employer/auth" element={<EmployerAuthChoicePage />} />
        <Route path="/employer/login" element={<EmployerLoginPage />} />
        <Route path="/employer/register" element={<EmployerRegisterPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;