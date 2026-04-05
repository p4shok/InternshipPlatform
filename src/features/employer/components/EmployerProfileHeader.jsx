import React from "react";

const EmployerProfileHeader = ({
                                   onLogout,
                                   onDelete,
                                   isDeleting,
                                   isLoggingOut,
                               }) => {
    return (
        <section className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
                <div>
          <span className="inline-flex rounded-full bg-indigo-50 px-3 py-1 text-xs font-medium text-indigo-700">
            Личный кабинет работодателя
          </span>

                    <h1 className="mt-4 text-3xl font-bold text-slate-900">
                        Управление аккаунтом компании
                    </h1>

                    <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-500">
                        Здесь можно обновить email для входа, изменить пароль и управлять
                        текущей сессией аккаунта работодателя.
                    </p>
                </div>

                <div className="flex flex-wrap gap-3">
                    <button
                        type="button"
                        onClick={onLogout}
                        disabled={isLoggingOut}
                        className="rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:opacity-70"
                    >
                        {isLoggingOut ? "Выход..." : "Выйти"}
                    </button>

                    <button
                        type="button"
                        onClick={onDelete}
                        disabled={isDeleting}
                        className="rounded-2xl border border-red-200 bg-red-50 px-4 py-2.5 text-sm font-medium text-red-600 transition hover:bg-red-100 disabled:opacity-70"
                    >
                        {isDeleting ? "Удаление..." : "Удалить аккаунт"}
                    </button>
                </div>
            </div>
        </section>
    );
};

export default EmployerProfileHeader;