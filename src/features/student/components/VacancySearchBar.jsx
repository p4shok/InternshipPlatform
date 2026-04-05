import React from "react";

const VacancySearchBar = ({ value, onChange }) => {
    return (
        <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="flex flex-col gap-3 md:flex-row">
                <input
                    type="text"
                    value={value}
                    onChange={onChange}
                    placeholder="Поиск по вакансии, стеку или компании"
                    className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
                />

                <button
                    type="button"
                    className="rounded-2xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-200 transition hover:bg-indigo-700"
                >
                    Найти
                </button>
            </div>
        </div>
    );
};

export default VacancySearchBar;