import React from "react";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../../../routes/routePaths";

const EmployerAuthChoicePage = () => {
  const navigate = useNavigate();

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-10">
      <div className="mx-auto flex min-h-[calc(100vh-5rem)] max-w-5xl items-center justify-center">
        <div className="w-full max-w-2xl rounded-3xl border border-slate-200 bg-white p-8 shadow-xl shadow-slate-200/60 sm:p-10">
          <div className="mb-8 text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-600 text-lg font-bold text-white shadow-lg shadow-indigo-200">
              IT
            </div>

            <h1 className="text-3xl font-bold text-slate-900">
              Добро пожаловать
            </h1>
            <p className="mt-2 text-sm text-slate-500">
              Выберите, что хотите сделать дальше
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <button
              onClick={() => navigate(ROUTES.EMPLOYER_LOGIN)}
              className="rounded-2xl border border-slate-200 bg-white px-5 py-5 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-indigo-300 hover:shadow-md"
            >
              <div className="text-lg font-semibold text-slate-900">Войти</div>
              <p className="mt-2 text-sm text-slate-500">
                Для работодателей, у которых уже есть аккаунт
              </p>
            </button>

            <button
              onClick={() => navigate(ROUTES.EMPLOYER_REGISTER)}
              className="rounded-2xl bg-indigo-600 px-5 py-5 text-left text-white shadow-lg shadow-indigo-200 transition hover:-translate-y-0.5 hover:bg-indigo-700"
            >
              <div className="text-lg font-semibold">Зарегистрироваться</div>
              <p className="mt-2 text-sm text-indigo-100">
                Создать новый аккаунт компании
              </p>
            </button>
          </div>

          <div className="mt-6 text-center">
            <button
              onClick={() => navigate(ROUTES.HOME)}
              className="text-sm font-medium text-slate-500 transition hover:text-slate-800"
            >
              ← Вернуться назад
            </button>
          </div>
        </div>
      </div>
    </main>
  );
};

export default EmployerAuthChoicePage;