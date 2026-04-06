import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthLayout from "../../../layouts/AuthLayout";
import { ROUTES } from "../../../routes/routePaths";
import {
    deleteEmployerProfile,
    logoutEmployer,
} from "../api/employerProfile.api";
import CompanyLogoUpload from "../components/CompanyLogoUpload";
import CompanyProfileForm from "../components/CompanyProfileForm";
import EmployerProfileForm from "../components/EmployerProfileForm";
import EmployerProfileHeader from "../components/EmployerProfileHeader";

const EmployerProfilePage = () => {
    const navigate = useNavigate();
    const [isDeleting, setIsDeleting] = useState(false);
    const [isLoggingOut, setIsLoggingOut] = useState(false);
    const [companyRefreshKey, setCompanyRefreshKey] = useState(0);
    const [companyData, setCompanyData] = useState(null);

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

    const handleLogoUploaded = () => {
        setCompanyRefreshKey((prev) => prev + 1);
    };

    const handleLogoDeleted = () => {
        setCompanyRefreshKey((prev) => prev + 1);
        setCompanyData((prev) => ({
            ...(prev || {}),
            logoUrl: "",
        }));
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

                <CompanyLogoUpload
                    logoUrl={companyData?.logoUrl}
                    onUploadSuccess={handleLogoUploaded}
                    onDeleteSuccess={handleLogoDeleted}
                />

                <div className="grid gap-6 xl:grid-cols-[1fr_1fr]">
                    <EmployerProfileForm />
                    <CompanyProfileForm
                        refreshKey={companyRefreshKey}
                        onCompanyLoaded={setCompanyData}
                    />
                </div>
            </div>
        </AuthLayout>
    );
};

export default EmployerProfilePage;