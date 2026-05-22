import React from "react";

const VacancyCard = ({
    vacancy,
    onView,
    onApply,
    onToggleFavorite,
    isFavoriteLoading = false,
}) => {
    return (
        <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-medium text-indigo-700">
              {vacancy.type}
            </span>
                        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
              {vacancy.workFormat}
            </span>
                    </div>

                    <h3 className="mt-4 text-xl font-semibold text-slate-900">
                        {vacancy.title}
                    </h3>

                    <p className="mt-2 text-sm font-medium text-slate-600">
                        {vacancy.company}
                    </p>

                    <p className="mt-4 text-sm leading-6 text-slate-500">
                        {vacancy.description}
                    </p>

                    {vacancy.skills?.length > 0 && (
                        <div className="mt-4 flex flex-wrap gap-2">
                            {vacancy.skills.map((skill) => (
                                <span
                                    key={skill}
                                    className="rounded-full border border-slate-200 px-3 py-1 text-xs font-medium text-slate-600"
                                >
                                    {skill}
                                </span>
                            ))}
                        </div>
                    )}
                </div>

                <div className="flex shrink-0 flex-col gap-3 lg:items-end">
                    <p className="text-sm font-semibold text-slate-900">{vacancy.salary}</p>
                    <p className="text-xs text-slate-500">{vacancy.location}</p>
                    <button
                        type="button"
                        onClick={() => onToggleFavorite?.(vacancy)}
                        disabled={!onToggleFavorite || isFavoriteLoading}
                        className={`rounded-2xl px-4 py-2 text-sm font-medium transition ${
                            vacancy.isFavorite
                                ? "border border-amber-200 bg-amber-50 text-amber-700 hover:bg-amber-100"
                                : "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                        } disabled:cursor-not-allowed disabled:opacity-60`}
                    >
                        {vacancy.isFavorite ? "В избранном" : "В избранное"}
                    </button>

                    <div className="flex gap-2">
                        <button
                            type="button"
                            onClick={() => onView?.(vacancy)}
                            disabled={!onView}
                            className="rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            Подробнее
                        </button>

                        <button
                            type="button"
                            onClick={() => onApply?.(vacancy)}
                            disabled={!onApply}
                            className="rounded-2xl bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-lg shadow-indigo-200 transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            Откликнуться
                        </button>
                    </div>
                </div>
            </div>
        </article>
    );
};

export default VacancyCard;
