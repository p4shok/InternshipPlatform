import React from "react";

const VacancyFilters = () => {
    return (
        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
            <h3 className="text-lg font-semibold text-slate-900">Фильтры</h3>

            <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                <select className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100">
                    <option>Формат занятости</option>
                    <option>Стажировка</option>
                    <option>Частичная занятость</option>
                    <option>Полная занятость</option>
                </select>

                <select className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100">
                    <option>Формат работы</option>
                    <option>Удалённо</option>
                    <option>Гибрид</option>
                    <option>Офис</option>
                </select>

                <select className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100">
                    <option>Направление</option>
                    <option>Frontend</option>
                    <option>Backend</option>
                    <option>QA</option>
                    <option>Data Science</option>
                    <option>DevOps</option>
                </select>

                <select className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100">
                    <option>Опыт</option>
                    <option>Без опыта</option>
                    <option>До 1 года</option>
                    <option>1-3 года</option>
                </select>
            </div>
        </div>
    );
};

export default VacancyFilters;