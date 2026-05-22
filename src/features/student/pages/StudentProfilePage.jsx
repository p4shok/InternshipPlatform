import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthLayout from "../../../layouts/AuthLayout";
import { ROUTES } from "../../../routes/routePaths";
import { updateAuthSession } from "../../auth/utils/session";
import {
    deleteStudentProfile,
    getCurrentStudentProfile,
    logoutStudent,
} from "../api/studentProfile.api";
import { getMyResumes } from "../api/resumes.api";
import {
    createStudentGroupApplication,
    deleteStudentGroupApplication,
    getMyStudentGroup,
    getStudentGroupApplication,
} from "../api/studentGroups.api";
import StudentAvatarUpload from "../components/StudentAvatarUpload";
import StudentProfileForm from "../components/StudentProfileForm";
import StudentProfileHeader from "../components/StudentProfileHeader";
import { mapResumeToListModel } from "../utils/resumeMappers";

const StudentProfilePage = () => {
    const navigate = useNavigate();
    const [isDeleting, setIsDeleting] = useState(false);
    const [isLoggingOut, setIsLoggingOut] = useState(false);
    const [isSubmittingGroupApplication, setIsSubmittingGroupApplication] = useState(false);
    const [isDeletingGroupApplication, setIsDeletingGroupApplication] = useState(false);
    const [student, setStudent] = useState(null);
    const [studentGroup, setStudentGroup] = useState(null);
    const [groupApplication, setGroupApplication] = useState(null);
    const [resumes, setResumes] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");
    const [isProfileEditorOpen, setIsProfileEditorOpen] = useState(false);
    const [groupInviteCode, setGroupInviteCode] = useState("");
    const [successMessage, setSuccessMessage] = useState("");

    const previewResumes = useMemo(() => resumes.slice(0, 2), [resumes]);
    const hasGroup = Boolean(student?.hasGroup);

    const loadData = async () => {
        try {
            setIsLoading(true);
            setError("");

            const studentProfile = await getCurrentStudentProfile();
            updateAuthSession({ hasGroup: Boolean(studentProfile?.hasGroup) });
            setStudent(studentProfile);

            if (studentProfile?.hasGroup) {
                const [groupDetails, resumesList] = await Promise.all([
                    getMyStudentGroup(),
                    getMyResumes(),
                ]);

                setStudentGroup(groupDetails);
                setGroupApplication(null);
                setResumes(resumesList.map(mapResumeToListModel));
            } else {
                const pendingApplication = await getStudentGroupApplication().catch(
                    (loadError) => {
                        if (loadError?.response?.status === 404) {
                            return null;
                        }

                        throw loadError;
                    }
                );

                setStudentGroup(null);
                setGroupApplication(pendingApplication);
                setResumes([]);
            }
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

    const handleCreateGroupApplication = async (event) => {
        event.preventDefault();

        if (!groupInviteCode.trim()) {
            setError("Введите инвайт-код группы.");
            return;
        }

        try {
            setIsSubmittingGroupApplication(true);
            setError("");
            setSuccessMessage("");
            await createStudentGroupApplication(groupInviteCode.trim());
            setGroupInviteCode("");
            setSuccessMessage("Заявка на вступление в группу отправлена.");
            await loadData();
        } catch (submitError) {
            setError(
                submitError?.response?.data?.message ||
                    "Не удалось отправить заявку в группу."
            );
        } finally {
            setIsSubmittingGroupApplication(false);
        }
    };

    const handleDeleteGroupApplication = async () => {
        if (!groupApplication?.id) {
            return;
        }

        try {
            setIsDeletingGroupApplication(true);
            setError("");
            setSuccessMessage("");
            await deleteStudentGroupApplication(groupApplication.id);
            setSuccessMessage("Заявка на вступление в группу отменена.");
            await loadData();
        } catch (deleteError) {
            setError(
                deleteError?.response?.data?.message ||
                    "Не удалось отменить заявку."
            );
        } finally {
            setIsDeletingGroupApplication(false);
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
                    {hasGroup && (
                        <>
                            <button
                                type="button"
                                onClick={() => navigate(ROUTES.STUDENT_VACANCIES)}
                                className="rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                            >
                                К вакансиям
                            </button>
                            <button
                                type="button"
                                onClick={() => navigate(ROUTES.STUDENT_APPLICATIONS)}
                                className="rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                            >
                                Отклики
                            </button>
                            <button
                                type="button"
                                onClick={() => navigate(ROUTES.STUDENT_CHATS)}
                                className="rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                            >
                                Чаты
                            </button>
                        </>
                    )}
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

                {successMessage && (
                    <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-600">
                        {successMessage}
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

                {!hasGroup && (
                    <section className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_340px]">
                        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                            <h2 className="text-xl font-semibold text-slate-900">
                                Доступ к платформе
                            </h2>
                            <p className="mt-3 text-sm leading-6 text-slate-600">
                                Пока вы не состоите в учебной группе. Сейчас доступны
                                только профиль и отправка заявки на вступление по
                                инвайт-коду преподавателя.
                            </p>

                            <form onSubmit={handleCreateGroupApplication} className="mt-5 space-y-4">
                                <label className="block space-y-2">
                                    <span className="text-sm font-medium text-slate-700">
                                        Инвайт-код группы
                                    </span>
                                    <input
                                        type="text"
                                        value={groupInviteCode}
                                        onChange={(event) => setGroupInviteCode(event.target.value)}
                                        placeholder="Например, TEST-0001"
                                        disabled={Boolean(groupApplication)}
                                        className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 disabled:bg-slate-50"
                                    />
                                </label>

                                <button
                                    type="submit"
                                    disabled={isSubmittingGroupApplication || Boolean(groupApplication)}
                                    className="rounded-2xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-70"
                                >
                                    {isSubmittingGroupApplication
                                        ? "Отправка..."
                                        : "Отправить заявку"}
                                </button>
                            </form>
                        </div>

                        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                            <h2 className="text-xl font-semibold text-slate-900">
                                Статус заявки
                            </h2>

                            {groupApplication ? (
                                <div className="mt-4 space-y-4">
                                    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700">
                                        <p className="font-medium text-slate-900">
                                            {groupApplication.groupName}
                                        </p>
                                        <p className="mt-2">
                                            {groupApplication.university}
                                        </p>
                                        <p className="mt-1">
                                            {groupApplication.specialization}
                                        </p>
                                        <p className="mt-1 text-slate-500">
                                            Код: {groupApplication.inviteCode}
                                        </p>
                                    </div>

                                    <button
                                        type="button"
                                        onClick={handleDeleteGroupApplication}
                                        disabled={isDeletingGroupApplication}
                                        className="rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:opacity-70"
                                    >
                                        {isDeletingGroupApplication
                                            ? "Отмена..."
                                            : "Отменить заявку"}
                                    </button>
                                </div>
                            ) : (
                                <p className="mt-4 text-sm text-slate-500">
                                    Активной заявки на вступление в группу нет.
                                </p>
                            )}
                        </div>
                    </section>
                )}

                {hasGroup && (
                    <>
                        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                            <div className="flex flex-wrap items-center justify-between gap-3">
                                <h2 className="text-xl font-semibold text-slate-900">
                                    Моя группа
                                </h2>
                                <span className="text-sm text-slate-500">
                                    Студентов: {studentGroup?.studentsCount || 0}
                                </span>
                            </div>

                            {studentGroup ? (
                                <div className="mt-4 grid gap-4 lg:grid-cols-2">
                                    <div className="rounded-2xl border border-slate-200 p-4">
                                        <p className="text-lg font-semibold text-slate-900">
                                            {studentGroup.name}
                                        </p>
                                        <p className="mt-2 text-sm text-slate-600">
                                            {studentGroup.specialization}
                                        </p>
                                        <p className="mt-1 text-sm text-slate-500">
                                            Инвайт-код: {studentGroup.inviteCode}
                                        </p>
                                    </div>
                                    <div className="rounded-2xl border border-slate-200 p-4">
                                        <p className="text-sm font-medium text-slate-900">
                                            Куратор
                                        </p>
                                        <p className="mt-2 text-sm text-slate-700">
                                            {[studentGroup.curatorSurname, studentGroup.curatorName, studentGroup.curatorPatronymic]
                                                .filter(Boolean)
                                                .join(" ")}
                                        </p>
                                        <p className="mt-1 text-sm text-slate-500">
                                            {studentGroup.curatorEmail || "Email не указан"}
                                        </p>
                                    </div>
                                </div>
                            ) : (
                                <p className="mt-4 text-sm text-slate-500">
                                    Не удалось загрузить данные группы.
                                </p>
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
                    </>
                )}

                {isProfileEditorOpen && <StudentProfileForm />}
            </div>
        </AuthLayout>
    );
};

export default StudentProfilePage;
