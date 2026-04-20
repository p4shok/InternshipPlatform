import React from "react";

const VacancyFilters = ({
    filters,
    onFilterChange,
    specializations = [],
}) => {
    const handleChange = (event) => {
        const { name, value } = event.target;
        onFilterChange(name, value);
    };

    return (
        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
            <h3 className="text-lg font-semibold text-slate-900">Фильтры</h3>

            <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                <select
                    name="isRemote"
                    value={filters.isRemote}
                    onChange={handleChange}
                    className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
                >
                    <option value="">Формат работы</option>
                    <option value="true">Удаленно</option>
                    <option value="false">Офис / гибрид</option>
                </select>

                <select
                    name="specializationId"
                    value={filters.specializationId}
                    onChange={handleChange}
                    className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
                >
                    <option value="">Направление</option>
                    {specializations.map((item) => (
                        <option key={item.id} value={item.id}>
                            {item.name}
                        </option>
                    ))}
                </select>

                <input
                    name="region"
                    value={filters.region}
                    onChange={handleChange}
                    placeholder="Регион"
                    className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
                />

                <input
                    type="number"
                    min="0"
                    name="salaryFrom"
                    value={filters.salaryFrom}
                    onChange={handleChange}
                    placeholder="Зарплата от"
                    className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
                />
            </div>
        </div>
    );
};

export default VacancyFilters;
