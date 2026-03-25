import React from "react";
import { useNavigate } from "react-router-dom";

const RoleSelectPage = () => {
  const navigate = useNavigate();

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-10">
      <div className="mx-auto flex min-h-[calc(100vh-5rem)] max-w-6xl items-center justify-center">
        <div className="grid w-full items-center gap-10 lg:grid-cols-2">
          <div>
            <span className="inline-flex rounded-full border border-indigo-200 bg-white px-4 py-2 text-sm font-medium text-indigo-700 shadow-sm">
              Информационная платформа трудоустройства
            </span>

            <h1 className="mt-6 text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
              Начни путь в IT
              <span className="text-indigo-600"> правильно</span>
            </h1>

            <p className="mt-5 max-w-xl text-lg leading-8 text-slate-600">
              Платформа помогает студентам находить стажировки и вакансии,
              а работодателям — перспективных кандидатов.
            </p>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-xl shadow-slate-200/60 sm:p-10">
            <div className="mb-8 text-center">
              <h2 className="text-2xl font-bold text-slate-900">Кто вы?</h2>
              <p className="mt-2 text-sm text-slate-500">
                Выберите подходящий вариант для продолжения
              </p>
            </div>

            <div className="space-y-4">
              <button
                onClick={() => navigate("/student/auth")}
                className="w-full rounded-2xl bg-indigo-600 px-5 py-4 text-base font-semibold text-white shadow-lg shadow-indigo-200 transition hover:-translate-y-0.5 hover:bg-indigo-700"
              >
                Я студент
              </button>

              <button
                onClick={() => navigate("/employer/auth")}
                className="w-full rounded-2xl border border-slate-200 bg-white px-5 py-4 text-base font-semibold text-slate-700 shadow-sm transition hover:-translate-y-0.5 hover:border-indigo-300 hover:text-indigo-700 hover:shadow-md"
              >
                Я работодатель
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default RoleSelectPage;