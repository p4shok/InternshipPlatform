import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthLayout from "../../../layouts/AuthLayout";
import { ROUTES } from "../../../routes/routePaths";
import VacancyCard from "../components/VacancyCard";
import {
    copyResume,
    createResume,
    deleteResume,
    getMyResumes,
    getRecommendedVacanciesByResume,
    updateResume,
} from "../api/resumes.api";
import { getSkills, getSpecializations } from "../api/dictionaries.api";
import {
    mapRecommendedVacancies,
    mapResumeFormToCreateDto,
    mapResumeFormToUpdateDto,
    mapResumeToFormModel,
    mapResumeToListModel,
} from "../utils/resumeMappers";

const initialFormState = {
    description: "",
    desiredSalary: "",
    region: "",
    specializationId: "",
    skillIds: [],
    isActive: true,
};

const StudentResumesPage = () => {
    const navigate = useNavigate();
    const [resumes, setResumes] = useState([]);
    const [recommendedVacancies, setRecommendedVacancies] = useState([]);
    const [skills, setSkills] = useState([]);
    const [specializations, setSpecializations] = useState([]);
    const [selectedResumeId, setSelectedResumeId] = useState(null);
    const [editingResumeId, setEditingResumeId] = useState(null);
    const [formData, setFormData] = useState(initialFormState);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState("");
    const [successMessage, setSuccessMessage] = useState("");

    const selectedResume = useMemo(
        () => resumes.find((item) => item.id === selectedResumeId) || null,
        [resumes, selectedResumeId]
    );

    const loadResumes = async () => {
        const response = await getMyResumes();
        const mapped = response.map(mapResumeToListModel);
        setResumes(mapped);
        const selectedId = mapped[0]?.id || null;
        setSelectedResumeId((prev) => {
            if (prev && mapped.some((item) => item.id === prev)) {
                return prev;
            }

            return selectedId;
        });
        return mapped;
    };

    const loadRecommended = async (resumeId) => {
        if (!resumeId) {
            setRecommendedVacancies([]);
            return;
        }

        const response = await getRecommendedVacanciesByResume(resumeId, 1, 6);
        setRecommendedVacancies(mapRecommendedVacancies(response));
    };

    const loadPageData = async () => {
        try {
            setIsLoading(true);
            setError("");

            const [resumeList, skillsList, specializationsList] = await Promise.all([
                getMyResumes(),
                getSkills(),
                getSpecializations(),
            ]);

            const mappedResumes = resumeList.map(mapResumeToListModel);
            setResumes(mappedResumes);
            setSkills(skillsList);
            setSpecializations(specializationsList);

            const firstResumeId = mappedResumes[0]?.id || null;
            setSelectedResumeId(firstResumeId);
            await loadRecommended(firstResumeId);
        } catch (loadError) {
            setError(
                loadError?.response?.data?.message ||
                    "Не удалось загрузить раздел резюме."
            );
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadPageData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

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

    const resetForm = () => {
        setEditingResumeId(null);
        setFormData(initialFormState);
    };

    const validateForm = () => {
        if (!formData.specializationId) {
            return "Выберите специализацию.";
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

            if (editingResumeId) {
                await updateResume(
                    editingResumeId,
                    mapResumeFormToUpdateDto(formData)
                );
                setSuccessMessage("Резюме обновлено.");
            } else {
                await createResume(mapResumeFormToCreateDto(formData));
                setSuccessMessage("Резюме создано.");
            }

            const updatedResumes = await loadResumes();
            const recommendedResumeId =
                selectedResumeId && updatedResumes.some((item) => item.id === selectedResumeId)
                    ? selectedResumeId
                    : updatedResumes[0]?.id || null;
            await loadRecommended(recommendedResumeId);
            resetForm();
        } catch (submitError) {
            setError(
                submitError?.response?.data?.message ||
                    "Не удалось сохранить резюме."
            );
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleEditResume = (resume) => {
        setEditingResumeId(resume.id);
        setFormData(mapResumeToFormModel(resume));
        setError("");
        setSuccessMessage("");
    };

    const handleDeleteResume = async (resumeId) => {
        if (!window.confirm("Удалить резюме?")) {
            return;
        }

        try {
            setError("");
            await deleteResume(resumeId);
            const updatedResumes = await loadResumes();
            const recommendedResumeId =
                selectedResumeId && selectedResumeId !== resumeId
                    ? selectedResumeId
                    : updatedResumes[0]?.id || null;
            await loadRecommended(recommendedResumeId);
            setSuccessMessage("Резюме удалено.");

            if (editingResumeId === resumeId) {
                resetForm();
            }
        } catch (deleteError) {
            setError(
                deleteError?.response?.data?.message ||
                    "Не удалось удалить резюме."
            );
        }
    };

    const handleCopyResume = async (resumeId) => {
        try {
            setError("");
            await copyResume(resumeId);
            await loadResumes();
            setSuccessMessage("Резюме успешно скопировано.");
        } catch (copyError) {
            setError(
                copyError?.response?.data?.message ||
                    "Не удалось скопировать резюме."
            );
        }
    };

    const handleSelectResume = async (resumeId) => {
        setSelectedResumeId(resumeId);
        try {
            await loadRecommended(resumeId);
        } catch (loadError) {
            setError(
                loadError?.response?.data?.message ||
                    "Не удалось загрузить рекомендации по резюме."
            );
        }
    };

    if (isLoading) {
        return (
            <AuthLayout>
                <div className="w-full rounded-3xl border border-slate-200 bg-white p-8 text-sm text-slate-500 shadow-sm">
                    Загрузка раздела резюме...
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
                            <h1 className="text-3xl font-bold text-slate-900">Мои резюме</h1>
                            <p className="mt-2 max-w-2xl text-sm text-slate-500">
                                Создавайте разные варианты резюме под направления и смотрите
                                персональные рекомендации вакансий.
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
                                onClick={() => navigate(ROUTES.STUDENT_PROFILE)}
                                className="rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
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

                <section className="grid gap-6 xl:grid-cols-[1.2fr_1fr]">
                    <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                            <h2 className="text-xl font-semibold text-slate-900">
                                Список резюме
                            </h2>
                            <button
                                type="button"
                                onClick={resetForm}
                                className="rounded-2xl bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-lg shadow-indigo-200 transition hover:bg-indigo-700"
                            >
                                Новое резюме
                            </button>
                        </div>

                        {resumes.length > 0 ? (
                            <div className="space-y-4">
                                {resumes.map((resume) => (
                                    <div
                                        key={resume.id}
                                        className={`rounded-2xl border p-4 ${
                                            selectedResumeId === resume.id
                                                ? "border-indigo-300 bg-indigo-50/40"
                                                : "border-slate-200 bg-white"
                                        }`}
                                    >
                                        <div className="flex flex-wrap items-center justify-between gap-2">
                                            <div>
                                                <p className="text-sm font-semibold text-slate-900">
                                                    {resume.specializationName || "Без специализации"}
                                                </p>
                                                <p className="mt-1 text-xs text-slate-500">
                                                    {resume.region || "Регион не указан"} ·{" "}
                                                    {resume.isActive ? "Активно" : "Неактивно"}
                                                </p>
                                            </div>

                                            <button
                                                type="button"
                                                onClick={() => handleSelectResume(resume.id)}
                                                className="rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 transition hover:bg-slate-50"
                                            >
                                                Рекомендации
                                            </button>
                                        </div>

                                        <p className="mt-3 text-sm text-slate-600">
                                            {resume.description || "Описание не заполнено"}
                                        </p>

                                        <div className="mt-3 flex flex-wrap gap-2">
                                            <button
                                                type="button"
                                                onClick={() => handleEditResume(resume)}
                                                className="rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 transition hover:bg-slate-50"
                                            >
                                                Редактировать
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => handleCopyResume(resume.id)}
                                                className="rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 transition hover:bg-slate-50"
                                            >
                                                Копировать
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => handleDeleteResume(resume.id)}
                                                className="rounded-xl border border-red-200 bg-white px-3 py-1.5 text-xs font-medium text-red-600 transition hover:bg-red-50"
                                            >
                                                Удалить
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-sm text-slate-500">
                                У вас пока нет резюме. Создайте первое резюме справа.
                            </p>
                        )}
                    </article>

                    <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                        <h2 className="text-xl font-semibold text-slate-900">
                            {editingResumeId ? "Редактирование резюме" : "Создание резюме"}
                        </h2>

                        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
                            <textarea
                                name="description"
                                rows={4}
                                value={formData.description}
                                onChange={handleFormChange}
                                placeholder="Описание навыков и интересов"
                                className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
                            />

                            <div className="grid gap-4 sm:grid-cols-2">
                                <input
                                    type="number"
                                    min="0"
                                    name="desiredSalary"
                                    value={formData.desiredSalary}
                                    onChange={handleFormChange}
                                    placeholder="Желаемая зарплата"
                                    className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
                                />
                                <input
                                    name="region"
                                    value={formData.region}
                                    onChange={handleFormChange}
                                    placeholder="Регион"
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

                            <label className="inline-flex items-center gap-2 text-sm text-slate-700">
                                <input
                                    type="checkbox"
                                    name="isActive"
                                    checked={formData.isActive}
                                    onChange={handleFormChange}
                                />
                                Резюме активно
                            </label>

                            <div className="flex flex-wrap gap-2">
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="rounded-2xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-200 transition hover:bg-indigo-700 disabled:opacity-70"
                                >
                                    {isSubmitting ? "Сохранение..." : "Сохранить"}
                                </button>
                                {editingResumeId && (
                                    <button
                                        type="button"
                                        onClick={resetForm}
                                        className="rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                                    >
                                        Отменить
                                    </button>
                                )}
                            </div>
                        </form>
                    </article>
                </section>

                <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                        <h2 className="text-xl font-semibold text-slate-900">
                            Рекомендованные вакансии
                        </h2>
                        <p className="text-sm text-slate-500">
                            {selectedResume
                                ? `По резюме #${selectedResume.id}`
                                : "Выберите резюме для рекомендаций"}
                        </p>
                    </div>

                    {recommendedVacancies.length > 0 ? (
                        <div className="mt-4 space-y-4">
                            {recommendedVacancies.map((vacancy) => (
                                <VacancyCard key={`resume-vacancy-${vacancy.id}`} vacancy={vacancy} />
                            ))}
                        </div>
                    ) : (
                        <p className="mt-4 text-sm text-slate-500">
                            Пока нет рекомендаций для выбранного резюме.
                        </p>
                    )}
                </section>
            </div>
        </AuthLayout>
    );
};

export default StudentResumesPage;
