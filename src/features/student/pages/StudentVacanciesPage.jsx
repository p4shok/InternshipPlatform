import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthLayout from "../../../layouts/AuthLayout";
import { ROUTES } from "../../../routes/routePaths";
import VacancyCard from "../components/VacancyCard";
import VacancyFilters from "../components/VacancyFilters";
import VacancySearchBar from "../components/VacancySearchBar";

const mockVacancies = [
    {
        id: 1,
        title: "Frontend Intern (React)",
        company: "TechNova",
        type: "Стажировка",
        workFormat: "Удалённо",
        salary: "от 40 000 ₽",
        location: "Москва / Remote",
        description:
            "Ищем студента на стажировку во frontend-команду. Будете работать с React, UI-компонентами и внутренними сервисами.",
        skills: ["React", "JavaScript", "HTML", "CSS", "Git"],
    },
    {
        id: 2,
        title: "Junior Backend Developer",
        company: "CloudSoft",
        type: "Частичная занятость",
        workFormat: "Гибрид",
        salary: "от 60 000 ₽",
        location: "Санкт-Петербург",
        description:
            "Подойдёт студентам, которые хотят развиваться в backend-разработке, изучать API, базы данных и работу с серверной логикой.",
        skills: ["C#", ".NET", "SQL", "REST API"],
    },
    {
        id: 3,
        title: "QA Intern",
        company: "Digital Start",
        type: "Стажировка",
        workFormat: "Офис",
        salary: "по результатам собеседования",
        location: "Казань",
        description:
            "Стажировка для начинающих специалистов по тестированию. Поможем погрузиться в ручное тестирование, баг-репорты и тест-кейсы.",
        skills: ["QA", "Postman", "API", "Test Cases"],
    },
];

const StudentVacanciesPage = () => {
    const navigate = useNavigate();
    const [searchValue, setSearchValue] = useState("");

    const filteredVacancies = useMemo(() => {
        const normalizedQuery = searchValue.trim().toLowerCase();

        if (!normalizedQuery) {
            return mockVacancies;
        }

        return mockVacancies.filter((vacancy) => {
            const searchableText = [
                vacancy.title,
                vacancy.company,
                vacancy.description,
                vacancy.skills.join(" "),
            ]
                .join(" ")
                .toLowerCase();

            return searchableText.includes(normalizedQuery);
        });
    }, [searchValue]);

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
                                Здесь будут показываться вакансии, подобранные под профиль студента,
                                навыки и интересы. Пока API ещё не подключено, поэтому страница
                                работает как интерактивный макет будущего раздела.
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
                                className="rounded-2xl bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white shadow-lg shadow-indigo-200 transition hover:bg-indigo-700"
                            >
                                Рекомендации
                            </button>
                        </div>
                    </div>
                </section>

                <VacancySearchBar
                    value={searchValue}
                    onChange={(e) => setSearchValue(e.target.value)}
                />

                <VacancyFilters />

                <section className="space-y-4">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-semibold text-slate-900">
                            Подходящие предложения
                        </h2>
                        <p className="text-sm text-slate-500">
                            Найдено: {filteredVacancies.length}
                        </p>
                    </div>

                    {filteredVacancies.length > 0 ? (
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