import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthLayout from "../../../layouts/AuthLayout";
import { ROUTES } from "../../../routes/routePaths";
import VacancyCard from "../components/VacancyCard";
import VacancyFilters from "../components/VacancyFilters";
import { getSpecializations } from "../api/dictionaries.api";
import { getMyResumes } from "../api/resumes.api";
import {
    getRecommendedVacancies,
    getVacancies,
} from "../api/vacancies.api";
import { createStudentApplication } from "../api/applications.api";
import {
    addFavoriteVacancy, removeFavoriteVacancy
} from "../api/favorites.api";
import { mapResumeToListModel } from "../utils/resumeMappers";
import { mapVacancyToCardModel } from "../utils/vacancyMappers";

const initialFilters = {
    isRemote: "",
    region: "",
    salaryFrom: "",
    specializationId: "",
};

const initialApplicationForm = {
    resumeId: "",
    welcomeMessage: "",
};

const StudentVacanciesPage = () => {
    const navigate = useNavigate();
    const [searchValue, setSearchValue] = useState("");
    const [vacancies, setVacancies] = useState([]);
    const [recommendedVacancies, setRecommendedVacancies] = useState([]);
    const [specializations, setSpecializations] = useState([]);
    const [resumes, setResumes] = useState([]);
    const [filters, setFilters] = useState(initialFilters);
    const [isLoading, setIsLoading] = useState(true);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [error, setError] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [isFiltersOpen, setIsFiltersOpen] = useState(false);
    const [favoriteLoadingId, setFavoriteLoadingId] = useState(null);
    const [applicationVacancy, setApplicationVacancy] = useState(null);
    const [applicationForm, setApplicationForm] = useState(initialApplicationForm);
    const [isSubmittingApplication, setIsSubmittingApplication] = useState(false);
    const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);

    const loadData = async (withRefreshingState = false) => {
        try {
            if (withRefreshingState) {
                setIsRefreshing(true);
            } else {
                setIsLoading(true);
            }

            setError("");

            const [vacancyList, recommendedList, specializationList, resumeList] =
                await Promise.all([
                    getVacancies({
                        search: searchValue,
                        searchInTitle: true,
                        searchInDescription: true,
                        searchInCompanyName: true,
                        isRemote:
                            filters.isRemote === ""
                                ? undefined
                                : filters.isRemote === "true",
                        region: filters.region,
                        salaryFrom: filters.salaryFrom || undefined,
                        specializationId: filters.specializationId || undefined,
                        pageIndex: 1,
                        pageSize: 30,
                    }),
                    getRecommendedVacancies(1, 6),
                    getSpecializations(),
                    getMyResumes(),
                ]);

            setVacancies(vacancyList.map(mapVacancyToCardModel));
            setRecommendedVacancies(recommendedList.map(mapVacancyToCardModel));
            setSpecializations(specializationList);
            setResumes(resumeList.map(mapResumeToListModel));
        } catch (loadError) {
            setError(
                loadError?.response?.data?.message ||
                    "Не удалось загрузить вакансии. Проверьте авторизацию и попробуйте снова."
            );
        } finally {
            setIsLoading(false);
            setIsRefreshing(false);
        }
    };

    useEffect(() => {
        loadData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (!applicationVacancy || applicationForm.resumeId || !resumes[0]?.id) {
            return;
        }

        setApplicationForm((prev) => ({
            ...prev,
            resumeId: String(resumes[0].id),
        }));
    }, [applicationForm.resumeId, applicationVacancy, resumes]);

    const handleSearch = () => {
        loadData(true);
    };

    const handleFilterChange = (name, value) => {
        setFilters((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const filteredVacancies = useMemo(() => {
        const normalizedQuery = searchValue.trim().toLowerCase();

        return vacancies.filter((vacancy) => {
            const searchableText = [
                vacancy.title,
                vacancy.company,
                vacancy.description,
                vacancy.specializationName,
                (vacancy.skills || []).join(" "),
            ]
                .join(" ")
                .toLowerCase();

            const matchesSearch = normalizedQuery
                ? searchableText.includes(normalizedQuery)
                : true;

            const matchesFavorites = showFavoritesOnly ? vacancy.isFavorite : true;

            return matchesSearch && matchesFavorites;
        });
    }, [searchValue, showFavoritesOnly, vacancies]);

    const handleToggleFavorite = async (vacancy) => {
        try {
            setFavoriteLoadingId(vacancy.id);
            setError("");

            if (vacancy.isFavorite) {
                await removeFavoriteVacancy(vacancy.id);
            } else {
                await addFavoriteVacancy(vacancy.id);
            }

            const toggleFavorite = (items) =>
                items.map((item) =>
                    item.id === vacancy.id
                        ? {
                              ...item,
                              isFavorite: !item.isFavorite,
                          }
                        : item
                );

            setVacancies((prev) => toggleFavorite(prev));
            setRecommendedVacancies((prev) => toggleFavorite(prev));
        } catch (toggleError) {
            setError(
                toggleError?.response?.data?.message ||
                    "Не удалось обновить избранное."
            );
        } finally {
            setFavoriteLoadingId(null);
        }
    };

    const handleOpenApplication = (vacancy) => {
        setApplicationVacancy(vacancy);
        setApplicationForm({
            resumeId: resumes[0]?.id ? String(resumes[0].id) : "",
            welcomeMessage: "",
        });
        setError("");
        setSuccessMessage("");
    };

    const handleSubmitApplication = async (event) => {
        event.preventDefault();

        if (!applicationForm.resumeId) {
            setError("Для отклика нужно выбрать резюме.");
            return;
        }

        if (!applicationVacancy?.id) {
            setError("Вакансия для отклика не выбрана.");
            return;
        }

        try {
            setIsSubmittingApplication(true);
            setError("");

            await createStudentApplication({
                vacancyId: applicationVacancy.id,
                resumeId: Number(applicationForm.resumeId),
                welcomeMessage: applicationForm.welcomeMessage || null,
            });

            setSuccessMessage("Отклик отправлен. Диалог с работодателем появится в чатах.");
            setApplicationVacancy(null);
            setApplicationForm(initialApplicationForm);
        } catch (submitError) {
            setError(
                submitError?.response?.data?.message ||
                    "Не удалось отправить отклик."
            );
        } finally {
            setIsSubmittingApplication(false);
        }
    };

    const hasResumes = resumes.length > 0;
    
    const handleViewVacancy = (vacancyId) => {
        navigate(ROUTES.STUDENT_VACANCY_DETAILS(vacancyId));
    };

    return (
        <AuthLayout>
            <div className="w-full space-y-6">
                <section className="sticky top-4 z-20 rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
                    <div className="flex flex-col gap-3 lg:flex-row">
                        <input
                            type="text"
                            value={searchValue}
                            onChange={(e) => setSearchValue(e.target.value)}
                            placeholder="Поиск по вакансии, стеку или компании"
                            className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
                        />
                        <div className="flex flex-wrap gap-2">
                            <button
                                type="button"
                                onClick={handleSearch}
                                className="rounded-2xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-200 transition hover:bg-indigo-700"
                            >
                                Найти
                            </button>
                            <button
                                type="button"
                                onClick={() => setIsFiltersOpen(true)}
                                className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                            >
                                Фильтры
                            </button>
                            <button
                                type="button"
                                onClick={() => setShowFavoritesOnly((prev) => !prev)}
                                className={`rounded-2xl px-4 py-3 text-sm font-medium transition ${
                                    showFavoritesOnly
                                        ? "border border-amber-200 bg-amber-50 text-amber-700"
                                        : "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                                }`}
                            >
                                {showFavoritesOnly ? "Все вакансии" : "Только избранное"}
                            </button>
                            <button
                                type="button"
                                onClick={() => navigate(ROUTES.STUDENT_APPLICATIONS)}
                                className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                            >
                                Отклики
                            </button>
                            <button
                                type="button"
                                onClick={() => navigate(ROUTES.STUDENT_CHATS)}
                                className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                            >
                                Чаты
                            </button>
                            <button
                                type="button"
                                onClick={() => navigate(ROUTES.STUDENT_PROFILE)}
                                className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                            >
                                Профиль
                            </button>
                        </div>
                    </div>
                </section>

                {(error || successMessage) && (
                    <div
                        className={`rounded-2xl px-4 py-3 text-sm ${
                            error
                                ? "border border-red-200 bg-red-50 text-red-600"
                                : "border border-emerald-200 bg-emerald-50 text-emerald-600"
                        }`}
                    >
                        {error || successMessage}
                    </div>
                )}

                <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                        <div>
                            <h2 className="text-xl font-semibold text-slate-900">
                                Рекомендации для вас
                            </h2>
                            <p className="mt-1 text-sm text-slate-500">
                                Сервер подбирает предложения по профилю и вашим резюме.
                            </p>
                        </div>
                        <button
                            type="button"
                            onClick={() => loadData(true)}
                            className="rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                        >
                            Обновить рекомендации
                        </button>
                    </div>

                    {recommendedVacancies.length > 0 ? (
                        <div className="mt-4 space-y-4">
                            {recommendedVacancies.slice(0, 3).map((vacancy) => (
                                <VacancyCard
                                    key={`recommended-${vacancy.id}`}
                                    vacancy={vacancy}
                                    onView={(item) => handleViewVacancy(item.id)}
                                    onApply={handleOpenApplication}
                                    onToggleFavorite={handleToggleFavorite}
                                    isFavoriteLoading={favoriteLoadingId === vacancy.id}
                                />
                            ))}
                        </div>
                    ) : (
                        <p className="mt-4 text-sm text-slate-500">
                            Рекомендации появятся после заполнения профиля и резюме.
                        </p>
                    )}
                </section>

                <section className="space-y-4">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-semibold text-slate-900">
                            Подходящие предложения
                        </h2>
                        <p className="text-sm text-slate-500">
                            {isRefreshing || isLoading
                                ? "Обновление..."
                                : `Найдено: ${filteredVacancies.length}`}
                        </p>
                    </div>

                    {isLoading ? (
                        <div className="rounded-3xl border border-slate-200 bg-white p-10 text-center shadow-sm">
                            <p className="text-sm text-slate-500">Загрузка вакансий...</p>
                        </div>
                    ) : filteredVacancies.length > 0 ? (
                        <div className="space-y-4">
                            {filteredVacancies.map((vacancy) => (
                                <VacancyCard
                                    key={vacancy.id}
                                    vacancy={vacancy}
                                    onView={(item) => handleViewVacancy(item.id)}
                                    onApply={handleOpenApplication}
                                    onToggleFavorite={handleToggleFavorite}
                                    isFavoriteLoading={favoriteLoadingId === vacancy.id}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-10 text-center shadow-sm">
                            <h3 className="text-lg font-semibold text-slate-900">
                                Ничего не найдено
                            </h3>
                            <p className="mt-2 text-sm text-slate-500">
                                Попробуйте изменить поисковый запрос, фильтры или список избранного.
                            </p>
                        </div>
                    )}
                </section>

                {isFiltersOpen && (
                    <div className="fixed inset-0 z-40 bg-slate-900/30">
                        <div className="ml-auto h-full w-full max-w-md overflow-auto bg-slate-50 p-4">
                            <div className="mb-4 flex items-center justify-between">
                                <h3 className="text-lg font-semibold text-slate-900">Фильтры</h3>
                                <button
                                    type="button"
                                    onClick={() => setIsFiltersOpen(false)}
                                    className="rounded-2xl border border-slate-200 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                                >
                                    Закрыть
                                </button>
                            </div>

                            <VacancyFilters
                                filters={filters}
                                onFilterChange={handleFilterChange}
                                specializations={specializations}
                            />

                            <div className="mt-4 flex gap-2">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setIsFiltersOpen(false);
                                        handleSearch();
                                    }}
                                    className="rounded-2xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-200 transition hover:bg-indigo-700"
                                >
                                    Применить
                                </button>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setFilters(initialFilters);
                                    }}
                                    className="rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                                >
                                    Сбросить
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {applicationVacancy && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4">
                        <div className="w-full max-w-2xl rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl">
                            <div className="flex items-start justify-between gap-4">
                                <div>
                                    <h3 className="text-2xl font-semibold text-slate-900">
                                        Отклик на вакансию
                                    </h3>
                                    <p className="mt-2 text-sm text-slate-500">
                                        {applicationVacancy.title} · {applicationVacancy.company}
                                    </p>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => setApplicationVacancy(null)}
                                    className="rounded-2xl border border-slate-200 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                                >
                                    Закрыть
                                </button>
                            </div>

                            {hasResumes ? (
                                <form onSubmit={handleSubmitApplication} className="mt-6 space-y-4">
                                    <div>
                                        <label className="mb-2 block text-sm font-medium text-slate-700">
                                            Выберите резюме
                                        </label>
                                        <select
                                            value={applicationForm.resumeId}
                                            onChange={(event) =>
                                                setApplicationForm((prev) => ({
                                                    ...prev,
                                                    resumeId: event.target.value,
                                                }))
                                            }
                                            className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
                                        >
                                            <option value="">Выберите резюме</option>
                                            {resumes.map((resume) => (
                                                <option key={resume.id} value={resume.id}>
                                                    {resume.specializationName || "Без названия"} ·{" "}
                                                    {resume.region || "Регион не указан"}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <div>
                                        <label className="mb-2 block text-sm font-medium text-slate-700">
                                            Сопроводительное сообщение
                                        </label>
                                        <textarea
                                            rows={5}
                                            value={applicationForm.welcomeMessage}
                                            onChange={(event) =>
                                                setApplicationForm((prev) => ({
                                                    ...prev,
                                                    welcomeMessage: event.target.value,
                                                }))
                                            }
                                            placeholder="Коротко расскажите, почему хотите откликнуться на эту вакансию"
                                            className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
                                        />
                                    </div>

                                    <div className="flex flex-wrap gap-3">
                                        <button
                                            type="submit"
                                            disabled={isSubmittingApplication}
                                            className="rounded-2xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-200 transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-70"
                                        >
                                            {isSubmittingApplication ? "Отправка..." : "Отправить отклик"}
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => navigate(ROUTES.STUDENT_RESUMES)}
                                            className="rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                                        >
                                            Управлять резюме
                                        </button>
                                    </div>
                                </form>
                            ) : (
                                <div className="mt-6 rounded-3xl border border-amber-200 bg-amber-50 p-5 text-sm text-amber-800">
                                    Для отклика нужно создать хотя бы одно резюме. После этого вы сможете
                                    отправлять отклики и начинать чат с работодателем.
                                    <div className="mt-4">
                                        <button
                                            type="button"
                                            onClick={() => navigate(ROUTES.STUDENT_RESUMES)}
                                            className="rounded-2xl bg-amber-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-amber-600"
                                        >
                                            Перейти к резюме
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </AuthLayout>
    );
};

export default StudentVacanciesPage;
