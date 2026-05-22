import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthLayout from "../../../layouts/AuthLayout";
import { ROUTES } from "../../../routes/routePaths";
import {
    getStudentApplications,
    updateStudentApplicationStatus,
} from "../api/applications.api";
import { getMyResumes } from "../api/resumes.api";
import { mapResumeToListModel } from "../utils/resumeMappers";
import {
    APPLICATION_STATUS_OPTIONS,
    getApplicationStatusLabel,
} from "../../applications/utils/applicationStatus";

const StudentApplicationsPage = () => {
    const navigate = useNavigate();
    const [applications, setApplications] = useState([]);
    const [resumes, setResumes] = useState([]);
    const [filters, setFilters] = useState({
        resumeId: "",
        status: "",
    });
    const [isLoading, setIsLoading] = useState(true);
    const [actionApplicationId, setActionApplicationId] = useState(null);
    const [error, setError] = useState("");

    const loadData = async () => {
        try {
            setIsLoading(true);
            setError("");

            const [applicationList, resumeList] = await Promise.all([
                getStudentApplications({
                    resumeId: filters.resumeId || undefined,
                    status: filters.status || undefined,
                }),
                getMyResumes(),
            ]);

            setApplications(applicationList);
            setResumes(resumeList.map(mapResumeToListModel));
        } catch (loadError) {
            setError(
                loadError?.response?.data?.message ||
                    "Не удалось загрузить отклики."
            );
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [filters.resumeId, filters.status]);

    const handleWithdraw = async (applicationId) => {
        try {
            setActionApplicationId(applicationId);
            setError("");
            await updateStudentApplicationStatus(applicationId, 7);
            await loadData();
        } catch (actionError) {
            setError(
                actionError?.response?.data?.message ||
                    "Не удалось отозвать отклик."
            );
        } finally {
            setActionApplicationId(null);
        }
    };

    const handleViewVacancy = (application) => {
        navigate(ROUTES.STUDENT_VACANCY_DETAILS(application.vacancyId));
    };

    return (
        <AuthLayout>
            <div className="w-full space-y-6">
                <section className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
                    <div className="flex flex-wrap items-start justify-between gap-4">
                        <div>
                            <h1 className="text-3xl font-bold text-slate-900">Мои отклики</h1>
                            <p className="mt-2 max-w-2xl text-sm text-slate-500">
                                Следите за статусами откликов и переходите в чат, когда работодатель
                                отвечает.
                            </p>
                        </div>

                        <div className="flex flex-wrap gap-3">
                            <button
                                type="button"
                                onClick={() => navigate(ROUTES.STUDENT_VACANCIES)}
                                className="rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                            >
                                К вакансиям
                            </button>
                            <button
                                type="button"
                                onClick={() => navigate(ROUTES.STUDENT_CHATS)}
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
                            value={filters.resumeId}
                            onChange={(event) =>
                                setFilters((prev) => ({
                                    ...prev,
                                    resumeId: event.target.value,
                                }))
                            }
                            className="rounded-2xl border border-slate-200 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
                        >
                            <option value="">Все резюме</option>
                            {resumes.map((resume) => (
                                <option key={resume.id} value={resume.id}>
                                    {resume.specializationName || "Без специализации"}
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
                                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                                    <div>
                                        <h2 className="text-xl font-semibold text-slate-900">
                                            {application.vacancyTitle}
                                        </h2>
                                        <p className="mt-2 text-sm font-medium text-slate-600">
                                            {application.companyName}
                                        </p>
                                        <div className="mt-4 flex flex-wrap gap-3 text-sm text-slate-500">
                                            <span>
                                                Статус: {application.applicationStatus || getApplicationStatusLabel(application.status)}
                                            </span>
                                            <span>
                                                Обновлено: {application.lastStatusDate || "Не указано"}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="flex flex-wrap gap-3">
                                        <button
                                            type="button"
                                            onClick={() => handleViewVacancy(application)}
                                            className="rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                                        >
                                            Просмотр вакансии
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() =>
                                                navigate(ROUTES.STUDENT_CHATS, {
                                                    state: { chatId: application.chatId },
                                                })
                                            }
                                            className="rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                                        >
                                            Открыть чат
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => handleWithdraw(application.id)}
                                            disabled={actionApplicationId === application.id}
                                            className="rounded-2xl border border-red-200 bg-white px-4 py-2.5 text-sm font-medium text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
                                        >
                                            {actionApplicationId === application.id
                                                ? "Обновление..."
                                                : "Отозвать"}
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
                                После первого отклика вы сможете отслеживать статусы и историю общения здесь.
                            </p>
                        </div>
                    )}
                </section>
            </div>
        </AuthLayout>
    );
};

export default StudentApplicationsPage;
