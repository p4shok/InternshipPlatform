import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthLayout from "../../../layouts/AuthLayout";
import { ROUTES } from "../../../routes/routePaths";
import VacancyCard from "../components/VacancyCard";
import VacancyFilters from "../components/VacancyFilters";
import VacancySearchBar from "../components/VacancySearchBar";
import { getSpecializations } from "../api/dictionaries.api";
import {
    getRecommendedVacancies,
    getVacancies,
} from "../api/vacancies.api";
import { mapVacancyToCardModel } from "../utils/vacancyMappers";

const StudentVacanciesPage = () => {
    const navigate = useNavigate();
    const [searchValue, setSearchValue] = useState("");
    const [vacancies, setVacancies] = useState([]);
    const [recommendedVacancies, setRecommendedVacancies] = useState([]);
    const [specializations, setSpecializations] = useState([]);
    const [filters, setFilters] = useState({
        isRemote: "",
        region: "",
        salaryFrom: "",
        specializationId: "",
    });
    const [isLoading, setIsLoading] = useState(true);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [error, setError] = useState("");

    const loadData = async (withRefreshingState = false) => {
        try {
            if (withRefreshingState) {
                setIsRefreshing(true);
            } else {
                setIsLoading(true);
            }

            setError("");

            const [vacancyList, recommendedList, specializationList] = await Promise.all([
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
            ]);

            setVacancies(vacancyList.map(mapVacancyToCardModel));
            setRecommendedVacancies(recommendedList.map(mapVacancyToCardModel));
            setSpecializations(specializationList);
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

        if (!normalizedQuery) {
            return vacancies;
        }

        return vacancies.filter((vacancy) => {
            const searchableText = [
                vacancy.title,
                vacancy.company,
                vacancy.description,
                (vacancy.skills || []).join(" "),
            ]
                .join(" ")
                .toLowerCase();

            return searchableText.includes(normalizedQuery);
        });
    }, [searchValue, vacancies]);

    return (
        <AuthLayout>
            <div className="w-full space-y-6">
                <section className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
                    <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
                        <div>
              <span className="inline-flex rounded-full bg-indigo-50 px-3 py-1 text-xs font-medium text-indigo-700">
                Подбор вакансий
              </span>

                            <h1 className="mt-4 text-3xl font-bold text-slate-900">
                                Вакансии и стажировки для студентов
                            </h1>

                            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-500">
                                Вакансии подбираются по вашему профилю и резюме.
                                Используйте поиск и фильтры, чтобы получить более релевантные результаты.
                            </p>
                        </div>

                        <div className="flex flex-wrap gap-3">
                            <button
                                type="button"
                                onClick={() => navigate(ROUTES.STUDENT_PROFILE)}
                                className="rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                            >
                                Мой профиль
                            </button>

                            <button
                                type="button"
                                onClick={() => navigate(ROUTES.STUDENT_RESUMES)}
                                className="rounded-2xl bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white shadow-lg shadow-indigo-200 transition hover:bg-indigo-700"
                            >
                                Мои резюме
                            </button>
                        </div>
                    </div>
                </section>

                <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                        <h2 className="text-xl font-semibold text-slate-900">
                            Рекомендации для вас
                        </h2>
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
                                <VacancyCard key={`recommended-${vacancy.id}`} vacancy={vacancy} />
                            ))}
                        </div>
                    ) : (
                        <p className="mt-4 text-sm text-slate-500">
                            Рекомендации появятся после заполнения профиля и резюме.
                        </p>
                    )}
                </section>

                <VacancySearchBar
                    value={searchValue}
                    onChange={(e) => setSearchValue(e.target.value)}
                    onSearch={handleSearch}
                />

                <VacancyFilters
                    filters={filters}
                    onFilterChange={handleFilterChange}
                    specializations={specializations}
                />

                {error && (
                    <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                        {error}
                    </div>
                )}

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
                                <VacancyCard key={vacancy.id} vacancy={vacancy} />
                            ))}
                        </div>
                    ) : (
                        <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-10 text-center shadow-sm">
                            <h3 className="text-lg font-semibold text-slate-900">
                                Ничего не найдено
                            </h3>
                            <p className="mt-2 text-sm text-slate-500">
                                Попробуйте изменить поисковый запрос или сбросить фильтры.
                            </p>
                        </div>
                    )}
                </section>
            </div>
        </AuthLayout>
    );
};

export default StudentVacanciesPage;
