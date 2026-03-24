import React from "react";
import RegisterForm from "../components/auth/RegisterForm";

const LoginPage = () => {
  return (
    <main className="relative min-h-screen overflow-hidden bg-slate-50">
      <div className="absolute inset-0">
        <div className="absolute left-[-80px] top-[-80px] h-72 w-72 rounded-full bg-indigo-200/50 blur-3xl" />
        <div className="absolute bottom-[-100px] right-[-80px] h-80 w-80 rounded-full bg-sky-200/50 blur-3xl" />
        <div className="absolute left-1/2 top-1/3 h-64 w-64 -translate-x-1/2 rounded-full bg-fuchsia-200/30 blur-3xl" />
      </div>

      <div className="relative mx-auto flex min-h-screen max-w-7xl items-center justify-center px-4 py-10">
        <div className="grid w-full items-center gap-10 lg:grid-cols-2">
          <div className="hidden lg:block">
            <div className="max-w-lg">
              <span className="inline-flex rounded-full border border-indigo-200 bg-white px-4 py-2 text-sm font-medium text-indigo-700 shadow-sm">
                Платформа трудоустройства студентов
              </span>

              <h2 className="mt-6 text-5xl font-bold leading-tight text-slate-900">
                Найди свою первую
                <span className="text-indigo-600"> IT-стажировку </span>
                быстрее
              </h2>

              <p className="mt-5 text-lg leading-8 text-slate-600">
                Удобная платформа для студентов, которые хотят проходить стажировки,
                откликаться на вакансии и строить карьеру в IT-компаниях.
              </p>

              <div className="mt-8 grid grid-cols-2 gap-4">
                <div className="rounded-2xl bg-white p-5 shadow-lg shadow-slate-200/60">
                  <p className="text-2xl font-bold text-slate-900">100+</p>
                  <p className="mt-1 text-sm text-slate-500">IT-компаний</p>
                </div>

                <div className="rounded-2xl bg-white p-5 shadow-lg shadow-slate-200/60">
                  <p className="text-2xl font-bold text-slate-900">24/7</p>
                  <p className="mt-1 text-sm text-slate-500">Доступ к платформе</p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-center">
            <RegisterForm />
          </div>
        </div>
      </div>
    </main>
  );
};

export default LoginPage;