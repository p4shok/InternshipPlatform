import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthLayout from "../../../layouts/AuthLayout";
import { ROUTES } from "../../../routes/routePaths";
import {
    APPLICATION_STATUS_OPTIONS,
    getApplicationStatusLabel,
} from "../../applications/utils/applicationStatus";
import {
    getEmployerApplications,
    updateEmployerApplicationStatus,
} from "../api/applications.api";
import { getEmployerVacancies } from "../api/vacancies.api";
import { mapEmployerVacancyToModel } from "../utils/vacancyMappers";

const EmployerApplicationsPage = () => {
    const navigate = useNavigate();
    const [applications, setApplications] = useState([]);
    const [vacancies, setVacancies] = useState([]);
    const [filters, setFilters] = useState({
        vacancyId: "",
        status: "",
    });
    const [isLoading, setIsLoading] = useState(true);
    const [actionState, setActionState] = useState({
        applicationId: null,
        status: null,
    });
    const [error, setError] = useState("");

    const loadData = async () => {
        try {
            setIsLoading(true);
            setError("");

            const [applicationList, vacancyList] = await Promise.all([
                getEmployerApplications({
                    vacancyId: filters.vacancyId || undefined,
                    status: filters.status || undefined,
                }),
                getEmployerVacancies(),
            ]);

            setApplications(applicationList);
            setVacancies(vacancyList.map(mapEmployerVacancyToModel));
        } catch (loadError) {
            setError(
                loadError?.response?.data?.message ||
                    "Не удалось загрузить отклики студентов."
            );
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [filters.vacancyId, filters.status]);

    const handleStatusUpdate = async (applicationId, status) => {
        try {
            setActionState({ applicationId, status });
            setError("");
            await updateEmployerApplicationStatus(applicationId, status);
            await loadData();
        } catch (actionError) {
            setError(
                actionError?.response?.data?.message ||
                    "Не удалось обновить статус отклика."
            );
        } finally {
            setActionState({ applicationId: null, status: null });
        }
    };

    return (
        <AuthLayout>
            <div className="w-full space-y-6">
                <section className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
                    <div className="flex flex-wrap items-start justify-between gap-4">
                        <div>
                            <h1 className="text-3xl font-bold text-slate-900">Отклики студентов</h1>
                            <p className="mt-2 max-w-2xl text-sm text-slate-500">
                                Управляйте статусами кандидатов и быстро переходите в диалог по каждой
                                заявке.
                            </p>
                        </div>

                        <div className="flex flex-wrap gap-3">
                            <button
                                type="button"
                                onClick={() => navigate(ROUTES.EMPLOYER_VACANCIES)}
                                className="rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                            >
                                Вакансии
                            </button>
                            <button
                                type="button"
                                onClick={() => navigate(ROUTES.EMPLOYER_CHATS)}
                                className="rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                            >
                                Чаты
                            </button>
                        </div>
                    </div>
                </section>

                <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                    <div className="grid gap-4 md:grid-cols-3">
                        <select
                            value={filters.vacancyId}
                            onChange={(event) =>
                                setFilters((prev) => ({
                                    ...prev,
                                    vacancyId: event.target.value,
                                }))
                            }
                            className="rounded-2xl border border-slate-200 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
                        >
                            <option value="">Все вакансии</option>
                            {vacancies.map((vacancy) => (
                                <option key={vacancy.id} value={vacancy.id}>
                                    {vacancy.title}
                                </option>
                            ))}
                        </select>

                        <select
                            value={filters.status}
                            onChange={(event) =>
                                setFilters((prev) => ({
                                    ...prev,
                                    status: event.target.value,
                                }))
                            }
                            className="rounded-2xl border border-slate-200 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
                        >
                            <option value="">Все статусы</option>
                            {APPLICATION_STATUS_OPTIONS.map((option) => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>

                        <button
                            type="button"
                            onClick={loadData}
                            className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                        >
                            Обновить
                        </button>
                    </div>
                </section>

                {error && (
                    <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                        {error}
                    </div>
                )}

                <section className="space-y-4">
                    {isLoading ? (
                        <div className="rounded-3xl border border-slate-200 bg-white p-10 text-center shadow-sm">
                            <p className="text-sm text-slate-500">Загрузка откликов...</p>
                        </div>
                    ) : applications.length > 0 ? (
                        applications.map((application) => (
                            <article
                                key={application.id}
                                className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"
                            >
                                <div className="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
                                    <div>
                                        <h2 className="text-xl font-semibold text-slate-900">
                                            {[application.studentSurname, application.studentName, application.studentPatronymic]
                                                .filter(Boolean)
                                                .join(" ")}
                                        </h2>
                                        <p className="mt-2 text-sm text-slate-600">
                                            {application.specializationName || "Специализация не указана"}
                                        </p>
                                        <div className="mt-4 flex flex-wrap gap-3 text-sm text-slate-500">
                                            <span>
                                                Статус: {application.applicationStatus || getApplicationStatusLabel(application.status)}
                                            </span>
                                            <span>
                                                Обновлено: {application.lastStatusDate || "Не указано"}
                                            </span>
                                            <span>Резюме #{application.resumeId}</span>
                                        </div>
                                    </div>

                                    <div className="space-y-3">
                                        <div className="flex flex-wrap gap-2">
                                            {APPLICATION_STATUS_OPTIONS.filter((item) => item.value !== 7).map((option) => (
                                                <button
                                                    key={option.value}
                                                    type="button"
                                                    onClick={() =>
                                                        handleStatusUpdate(application.id, option.value)
                                                    }
                                                    disabled={
                                                        actionState.applicationId === application.id
                                                    }
                                                    className="rounded-2xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
                                                >
                                                    {actionState.applicationId === application.id &&
                                                    actionState.status === option.value
                                                        ? "..."
                                                        : option.label}
                                                </button>
                                            ))}
                                        </div>

                                        <button
                                            type="button"
                                            onClick={() =>
                                                navigate(ROUTES.EMPLOYER_CHATS, {
                                                    state: { chatId: application.chatId },
                                                })
                                            }
                                            className="rounded-2xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-200 transition hover:bg-indigo-700"
                                        >
                                            Открыть чат
                                        </button>
                                    </div>
                                </div>
                            </article>
                        ))
                    ) : (
                        <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-10 text-center shadow-sm">
                            <h3 className="text-lg font-semibold text-slate-900">
                                Откликов пока нет
                            </h3>
                            <p className="mt-2 text-sm text-slate-500">
                                Когда студенты начнут откликаться, здесь появится очередь кандидатов.
                            </p>
                        </div>
                    )}
                </section>
            </div>
        </AuthLayout>
    );
};

export default EmployerApplicationsPage;
