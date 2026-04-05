import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthLayout from "../../../layouts/AuthLayout";
import { ROUTES } from "../../../routes/routePaths";
import {
    deleteEmployerProfile,
    logoutEmployer,
} from "../api/employerProfile.api";
import EmployerProfileForm from "../components/EmployerProfileForm";
import EmployerProfileHeader from "../components/EmployerProfileHeader";

const EmployerProfilePage = () => {
    const navigate = useNavigate();
    const [isDeleting, setIsDeleting] = useState(false);
    const [isLoggingOut, setIsLoggingOut] = useState(false);

    const handleLogout = async () => {
        try {
            setIsLoggingOut(true);
            await logoutEmployer();
            navigate(ROUTES.EMPLOYER_LOGIN);
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoggingOut(false);
        }
    };

    const handleDelete = async () => {
        const confirmed = window.confirm(
            "Вы уверены, что хотите удалить аккаунт работодателя?"
        );

        if (!confirmed) return;

        try {
            setIsDeleting(true);
            await deleteEmployerProfile();
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
                <EmployerProfileHeader
                    onLogout={handleLogout}
                    onDelete={handleDelete}
                    isDeleting={isDeleting}
                    isLoggingOut={isLoggingOut}
                />

                <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
                    <EmployerProfileForm />

                    <section className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
                        <h2 className="text-xl font-semibold text-slate-900">
                            Подсказки по работе с аккаунтом
                        </h2>

                        <div className="mt-6 space-y-4">
                            <div className="rounded-2xl bg-slate-50 p-4">
                                <p className="text-sm font-medium text-slate-700">
                                    Поддерживайте актуальный email
                                </p>
                                <p className="mt-2 text-sm leading-6 text-slate-500">
                                    Этот адрес используется для входа и дальнейшей работы с
                                    кабинетом работодателя.
                                </p>
                            </div>

                            <div className="rounded-2xl bg-slate-50 p-4">
                                <p className="text-sm font-medium text-slate-700">
                                    Используйте надёжный пароль
                                </p>
                                <p className="mt-2 text-sm leading-6 text-slate-500">
                                    Новый пароль лучше делать длиннее и уникальнее предыдущего.
                                </p>
                            </div>

                            <div className="rounded-2xl bg-indigo-50 p-4">
                                <p className="text-sm font-medium text-indigo-800">
                                    Следующий шаг развития кабинета
                                </p>
                                <p className="mt-2 text-sm leading-6 text-indigo-700">
                                    Позже сюда можно добавить профиль компании, публикацию вакансий
                                    и управление откликами студентов.
                                </p>
                            </div>
                        </div>
                    </section>
                </div>
            </div>
        </AuthLayout>
    );
};

export default EmployerProfilePage;