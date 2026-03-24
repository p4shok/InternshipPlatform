import React from "react";
import { useNavigate } from "react-router-dom";
import LoginForm from "../components/auth/LoginForm";

const StudentLoginPage = () => {
  const navigate = useNavigate();

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-10">
      <div className="mx-auto flex min-h-[calc(100vh-5rem)] max-w-6xl items-center justify-center">
        <div className="w-full">
          <div className="mb-6">
            <button
              onClick={() => navigate("/student/auth")}
              className="text-sm font-medium text-slate-500 transition hover:text-slate-800"
            >
              ← Назад
            </button>
          </div>

          <div className="flex justify-center">
            <LoginForm />
          </div>
        </div>
      </div>
    </main>
  );
};

export default StudentLoginPage;