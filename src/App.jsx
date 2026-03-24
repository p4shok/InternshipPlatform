import { BrowserRouter, Routes, Route } from "react-router-dom";
import RoleSelectPage from "./pages/RoleSelectPage";
import StudentAuthChoicePage from "./pages/StudentAuthChoicePage";
import StudentLoginPage from "./pages/StudentLoginPage";
import StudentRegisterPage from "./pages/StudentRegisterPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<RoleSelectPage />} />
        <Route path="/student/auth" element={<StudentAuthChoicePage />} />
        <Route path="/student/login" element={<StudentLoginPage />} />
        <Route path="/student/register" element={<StudentRegisterPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;