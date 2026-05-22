import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthLayout from "../../../layouts/AuthLayout";
import { ROUTES } from "../../../routes/routePaths";
import {
    createEmployerVacancy,
    deleteEmployerVacancy,
    getEmployerVacancies,
    updateEmployerVacancy,
} from "../api/vacancies.api";
import {
    mapEmployerVacancyToModel,
    mapVacancyFormToCreateDto,
    mapVacancyFormToUpdateDto,
} from "../utils/vacancyMappers";
import {
    getSkills,
    getSpecializations,
} from "../../student/api/dictionaries.api";

const initialFormState = {
    title: "",
    description: "",
    salaryFrom: "",
    salaryTo: "",
    isRemote: false,
    region: "",
    minWorkExperienceYears: "",
    specializationId: "",
    skillIds: [],
    isActive: true,
};

const EmployerVacanciesPage = () => {
    const navigate = useNavigate();
    const [vacancies, setVacancies] = useState([]);
    const [skills, setSkills] = useState([]);
    const [specializations, setSpecializations] = useState([]);
    const [editingVacancyId, setEditingVacancyId] = useState(null);
    const [formData, setFormData] = useState(initialFormState);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [isConstructorOpen, setIsConstructorOpen] = useState(false);

    const loadData = async () => {
        try {
            setIsLoading(true);
            setError("");

            const [vacancyList, skillsList, specializationsList] = await Promise.all([
                getEmployerVacancies(),
                getSkills(),
                getSpecializations(),
            ]);

            setVacancies(vacancyList.map(mapEmployerVacancyToModel));
            setSkills(skillsList);
            setSpecializations(specializationsList);
        } catch (loadError) {
            setError(
                loadError?.response?.data?.message ||
                    "Не удалось загрузить вакансии работодателя."
            );
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    const resetForm = () => {
        setEditingVacancyId(null);
        setFormData(initialFormState);
        setIsConstructorOpen(false);
    };

    const handleFormChange = (event) => {
        const { name, value, type, checked } = event.target;

        setFormData((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    const handleSkillToggle = (skillId) => {
        setFormData((prev) => ({
            ...prev,
            skillIds: prev.skillIds.includes(skillId)
                ? prev.skillIds.filter((id) => id !== skillId)
                : [...prev.skillIds, skillId],
        }));
    };

    const validateForm = () => {
        if (!formData.specializationId) {
            return "Выберите специализацию.";
        }

        if (!formData.title.trim()) {
            return "Введите название вакансии.";
        }

        return "";
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        const validationError = validateForm();
        if (validationError) {
            setError(validationError);
            return;
        }

        try {
            setIsSubmitting(true);
            setError("");
            setSuccessMessage("");

            if (editingVacancyId) {
                await updateEmployerVacancy(
                    editingVacancyId,
                    mapVacancyFormToUpdateDto(formData)
                );
                setSuccessMessage("Вакансия обновлена.");
            } else {
                await createEmployerVacancy(mapVacancyFormToCreateDto(formData));
                setSuccessMessage("Вакансия создана.");
            }

            await loadData();
            setEditingVacancyId(null);
            setFormData(initialFormState);
            setIsConstructorOpen(false);
        } catch (submitError) {
            setError(
                submitError?.response?.data?.message ||
                    "Не удалось сохранить вакансию."
            );
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleEditVacancy = (vacancy) => {
        setEditingVacancyId(vacancy.id);
        setFormData({
            title: vacancy.title || "",
            description: vacancy.description || "",
            salaryFrom: vacancy.salaryFrom || "",
            salaryTo: vacancy.salaryTo || "",
            isRemote: vacancy.isRemote,
            region: vacancy.region || "",
            minWorkExperienceYears: vacancy.minWorkExperienceYears || "",
            specializationId: vacancy.specializationId || "",
            skillIds: vacancy.skillIds || [],
            isActive: vacancy.isActive,
        });
        setIsConstructorOpen(true);
    };

    const handleDeleteVacancy = async (vacancyId) => {
        if (!window.confirm("Удалить вакансию?")) {
            return;
        }

        try {
            setError("");
            await deleteEmployerVacancy(vacancyId);
            await loadData();
            setSuccessMessage("Вакансия удалена.");
            if (editingVacancyId === vacancyId) {
                resetForm();
            }
        } catch (deleteError) {
            setError(
                deleteError?.response?.data?.message ||
                    "Не удалось удалить вакансию."
            );
        }
    };

    if (isLoading) {
        return (
            <AuthLayout>
                <div className="w-full rounded-3xl border border-slate-200 bg-white p-8 text-sm text-slate-500 shadow-sm">
                    Загрузка вакансий компании...
                </div>
            </AuthLayout>
        );
    }

    return (
        <AuthLayout>
            <div className="w-full space-y-6">
                <section className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
                    <div className="flex flex-wrap items-start justify-between gap-4">
                        <div>
                            <h1 className="text-3xl font-bold text-slate-900">Вакансии компании</h1>
                            <p className="mt-2 max-w-2xl text-sm text-slate-500">
                                Управляйте вакансиями и поддерживайте актуальные предложения для студентов.
                            </p>
                        </div>

                        <div className="flex flex-wrap gap-3">
                            <button
                                type="button"
                                onClick={() => navigate(ROUTES.EMPLOYER_PROFILE)}
                                className="rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                            >
                                Профиль работодателя
                            </button>
                            <button
                                type="button"
                                onClick={() => navigate(ROUTES.EMPLOYER_APPLICATIONS)}
                                className="rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                            >
                                Отклики студентов
                            </button>
                            <button
                                type="button"
                                onClick={() => navigate(ROUTES.EMPLOYER_CHATS)}
                                className="rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                            >
                                Чаты
                            </button>
                            <button
                                type="button"
                                onClick={() => {
                                    setEditingVacancyId(null);
                                    setFormData(initialFormState);
                                    setIsConstructorOpen(true);
                                }}
                                className="rounded-2xl bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white shadow-lg shadow-indigo-200 transition hover:bg-indigo-700"
                            >
                                Новая вакансия
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

                <section className={`grid gap-6 ${isConstructorOpen ? "xl:grid-cols-[1.2fr_1fr]" : ""}`}>
                    <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                        <h2 className="text-xl font-semibold text-slate-900">Список вакансий</h2>
                        {vacancies.length > 0 ? (
                            <div className="mt-4 space-y-4">
                                {vacancies.map((vacancy) => (
                                    <div
                                        key={vacancy.id}
                                        className="rounded-2xl border border-slate-200 p-4"
                                    >
                                        <div className="flex flex-wrap items-center justify-between gap-2">
                                            <div>
                                                <p className="text-base font-semibold text-slate-900">
                                                    {vacancy.title}
                                                </p>
                                                <p className="mt-1 text-xs text-slate-500">
                                                    {vacancy.specializationName || "Без специализации"} ·{" "}
                                                    {vacancy.isActive ? "Активна" : "Неактивна"}
                                                </p>
                                            </div>
                                        </div>

                                        <p className="mt-3 text-sm text-slate-600">
                                            {vacancy.description || "Описание не заполнено"}
                                        </p>

                                        <div className="mt-3 flex flex-wrap gap-2">
                                            <button
                                                type="button"
                                                onClick={() => handleEditVacancy(vacancy)}
                                                className="rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 transition hover:bg-slate-50"
                                            >
                                                Редактировать
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => handleDeleteVacancy(vacancy.id)}
                                                className="rounded-xl border border-red-200 bg-white px-3 py-1.5 text-xs font-medium text-red-600 transition hover:bg-red-50"
                                            >
                                                Удалить
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="mt-4 text-sm text-slate-500">
                                Вакансии пока не созданы. Нажмите "Новая вакансия", чтобы открыть конструктор.
                            </p>
                        )}
                    </article>

                    {isConstructorOpen && (
                        <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                            <h2 className="text-xl font-semibold text-slate-900">
                                {editingVacancyId ? "Редактирование вакансии" : "Создание вакансии"}
                            </h2>

                            <form onSubmit={handleSubmit} className="mt-4 space-y-4">
                            <input
                                name="title"
                                value={formData.title}
                                onChange={handleFormChange}
                                placeholder="Название вакансии"
                                className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
                            />

                            <textarea
                                name="description"
                                rows={4}
                                value={formData.description}
                                onChange={handleFormChange}
                                placeholder="Описание вакансии"
                                className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
                            />

                            <div className="grid gap-4 sm:grid-cols-2">
                                <input
                                    type="number"
                                    min="0"
                                    name="salaryFrom"
                                    value={formData.salaryFrom}
                                    onChange={handleFormChange}
                                    placeholder="Зарплата от"
                                    className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
                                />
                                <input
                                    type="number"
                                    min="0"
                                    name="salaryTo"
                                    value={formData.salaryTo}
                                    onChange={handleFormChange}
                                    placeholder="Зарплата до"
                                    className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
                                />
                            </div>

                            <div className="grid gap-4 sm:grid-cols-2">
                                <input
                                    name="region"
                                    value={formData.region}
                                    onChange={handleFormChange}
                                    placeholder="Регион"
                                    className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
                                />
                                <input
                                    type="number"
                                    min="0"
                                    name="minWorkExperienceYears"
                                    value={formData.minWorkExperienceYears}
                                    onChange={handleFormChange}
                                    placeholder="Мин. опыт (лет)"
                                    className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
                                />
                            </div>

                            <select
                                name="specializationId"
                                value={formData.specializationId}
                                onChange={handleFormChange}
                                className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
                            >
                                <option value="">Выберите специализацию</option>
                                {specializations.map((item) => (
                                    <option key={item.id} value={item.id}>
                                        {item.name}
                                    </option>
                                ))}
                            </select>

                            <label className="inline-flex items-center gap-2 text-sm text-slate-700">
                                <input
                                    type="checkbox"
                                    name="isRemote"
                                    checked={formData.isRemote}
                                    onChange={handleFormChange}
                                />
                                Удаленный формат
                            </label>

                            <label className="inline-flex items-center gap-2 text-sm text-slate-700">
                                <input
                                    type="checkbox"
                                    name="isActive"
                                    checked={formData.isActive}
                                    onChange={handleFormChange}
                                />
                                Вакансия активна
                            </label>

                            <div>
                                <p className="mb-2 text-sm font-medium text-slate-700">Навыки</p>
                                <div className="flex max-h-40 flex-wrap gap-2 overflow-auto rounded-2xl border border-slate-200 p-3">
                                    {skills.map((skill) => (
                                        <label
                                            key={skill.id}
                                            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-1.5 text-xs text-slate-700"
                                        >
                                            <input
                                                type="checkbox"
                                                checked={formData.skillIds.includes(skill.id)}
                                                onChange={() => handleSkillToggle(skill.id)}
                                            />
                                            {skill.name}
                                        </label>
                                    ))}
                                </div>
                            </div>

                                <div className="flex flex-wrap gap-2">
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="rounded-2xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-200 transition hover:bg-indigo-700 disabled:opacity-70"
                                >
                                    {isSubmitting ? "Сохранение..." : "Сохранить"}
                                </button>
                                    <button
                                        type="button"
                                        onClick={resetForm}
                                        className="rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                                    >
                                        Закрыть
                                    </button>
                                </div>
                            </form>
                        </article>
                    )}
                </section>
            </div>
        </AuthLayout>
    );
};

export default EmployerVacanciesPage;
