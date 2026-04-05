import React from "react";

const StudentProfileHeader = ({ onLogout, onDelete, isDeleting, isLoggingOut }) => {
    return (
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900">Личный кабинет</h1>
                    <p className="mt-2 text-sm text-slate-500">
                        Управляйте данными своего профиля.
                    </p>
                </div>

                <div className="flex flex-wrap gap-3">
                    <button
                        type="button"
                        onClick={onLogout}
                        disabled={isLoggingOut}
                        className="rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-slate-300 hover:bg-slate-50 disabled:opacity-70"
                    >
                        {isLoggingOut ? "Выход..." : "Выйти"}
                    </button>

                    <button
                        type="button"
                        onClick={onDelete}
                        disabled={isDeleting}
                        className="rounded-2xl border border-red-200 bg-red-50 px-4 py-2 text-sm font-medium text-red-600 transition hover:bg-red-100 disabled:opacity-70"
                    >
                        {isDeleting ? "Удаление..." : "Удалить аккаунт"}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default StudentProfileHeader;