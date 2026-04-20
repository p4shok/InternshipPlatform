import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthLayout from "../../../layouts/AuthLayout";
import { ROUTES } from "../../../routes/routePaths";
import {
    deleteStudentProfile,
    getCurrentStudentProfile,
    logoutStudent,
} from "../api/studentProfile.api";
import { getMyResumes } from "../api/resumes.api";
import StudentAvatarUpload from "../components/StudentAvatarUpload";
import StudentProfileForm from "../components/StudentProfileForm";
import StudentProfileHeader from "../components/StudentProfileHeader";
import { mapResumeToListModel } from "../utils/resumeMappers";

const StudentProfilePage = () => {
    const navigate = useNavigate();
    const [isDeleting, setIsDeleting] = useState(false);
    const [isLoggingOut, setIsLoggingOut] = useState(false);
    const [student, setStudent] = useState(null);
    const [resumes, setResumes] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");
    const [isProfileEditorOpen, setIsProfileEditorOpen] = useState(false);

    const previewResumes = useMemo(() => resumes.slice(0, 2), [resumes]);

    const loadData = async () => {
        try {
            setIsLoading(true);
            setError("");
            const [studentProfile, resumesList] = await Promise.all([
                getCurrentStudentProfile(),
                getMyResumes(),
            ]);
            setStudent(studentProfile);
            setResumes(resumesList.map(mapResumeToListModel));
        } catch (loadError) {
            setError(
                loadError?.response?.data?.message ||
                    "Не удалось загрузить данные профиля."
            );
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    const handleLogout = async () => {
        try {
            setIsLoggingOut(true);
            await logoutStudent();
            navigate(ROUTES.STUDENT_LOGIN);
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoggingOut(false);
        }
    };

    const handleDelete = async () => {
        const confirmed = window.confirm(
            "Вы уверены, что хотите удалить аккаунт?"
        );

        if (!confirmed) return;

        try {
            setIsDeleting(true);
            await deleteStudentProfile();
            navigate(ROUTES.HOME);
        } catch (error) {
            console.error(error);
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <AuthLayout>
            <div className="w-full space-y-6">
                <StudentProfileHeader
                    onLogout={handleLogout}
                    onDelete={handleDelete}
                    isDeleting={isDeleting}
                    isLoggingOut={isLoggingOut}
                />

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
                        onClick={() => setIsProfileEditorOpen((prev) => !prev)}
                        className="rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                    >
                        {isProfileEditorOpen ? "Скрыть редактор профиля" : "Редактировать профиль"}
                    </button>
                </div>

                <StudentAvatarUpload onUploadSuccess={() => {}} />

                {error && (
                    <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                        {error}
                    </div>
                )}

                <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                        <h2 className="text-xl font-semibold text-slate-900">
                            Общая информация
                        </h2>
                        <button
                            type="button"
                            onClick={loadData}
                            className="rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                        >
                            Обновить
                        </button>
                    </div>

                    {isLoading ? (
                        <p className="mt-4 text-sm text-slate-500">Загрузка профиля...</p>
                    ) : (
                        <div className="mt-4 grid gap-3 sm:grid-cols-2">
                            <p className="text-sm text-slate-600">
                                <span className="font-medium text-slate-900">ФИО: </span>
                                {[student?.surname, student?.name, student?.patronymic]
                                    .filter(Boolean)
                                    .join(" ") || "Не заполнено"}
                            </p>
                            <p className="text-sm text-slate-600">
                                <span className="font-medium text-slate-900">Email: </span>
                                {student?.email || "Не заполнено"}
                            </p>
                            <p className="text-sm text-slate-600">
                                <span className="font-medium text-slate-900">Телефон: </span>
                                {student?.phone || "Не заполнено"}
                            </p>
                            <p className="text-sm text-slate-600">
                                <span className="font-medium text-slate-900">Университет: </span>
                                {student?.university || "Не заполнено"}
                            </p>
                            <p className="text-sm text-slate-600">
                                <span className="font-medium text-slate-900">Специализация: </span>
                                {student?.specialization || "Не заполнено"}
                            </p>
                            <p className="text-sm text-slate-600">
                                <span className="font-medium text-slate-900">Год выпуска: </span>
                                {student?.graduationYear || "Не заполнено"}
                            </p>
                        </div>
                    )}
                </section>

                <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                        <h2 className="text-xl font-semibold text-slate-900">
                            Мои резюме
                        </h2>
                        <button
                            type="button"
                            onClick={() => navigate(ROUTES.STUDENT_RESUMES)}
                            className="rounded-2xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-indigo-200 transition hover:bg-indigo-700"
                        >
                            Показать все резюме
                        </button>
                    </div>

                    {previewResumes.length > 0 ? (
                        <div className="mt-4 space-y-3">
                            {previewResumes.map((resume) => (
                                <div
                                    key={resume.id}
                                    className="rounded-2xl border border-slate-200 p-4"
                                >
                                    <p className="text-sm font-semibold text-slate-900">
                                        {resume.specializationName || "Без специализации"}
                                    </p>
                                    <p className="mt-1 text-sm text-slate-600">
                                        {resume.description || "Описание не заполнено"}
                                    </p>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="mt-4 text-sm text-slate-500">
                            У вас пока нет резюме.
                        </p>
                    )}
                </section>

                {isProfileEditorOpen && <StudentProfileForm />}
            </div>
        </AuthLayout>
    );
};

export default StudentProfilePage;
