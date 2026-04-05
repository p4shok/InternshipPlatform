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
                </div>
            </div>
        </AuthLayout>
    );
};

export default EmployerProfilePage;