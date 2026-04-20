import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthLayout from "../../../layouts/AuthLayout";
import { ROUTES } from "../../../routes/routePaths";
import {
    deleteEmployerProfile,
    getCurrentEmployerProfile,
    logoutEmployer,
} from "../api/employerProfile.api";
import { getCurrentEmployerCompany } from "../api/company.api";
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
    const [employerData, setEmployerData] = useState(null);
    const [isLoadingInfo, setIsLoadingInfo] = useState(true);
    const [error, setError] = useState("");
    const [isEmployerEditorOpen, setIsEmployerEditorOpen] = useState(false);
    const [isCompanyEditorOpen, setIsCompanyEditorOpen] = useState(false);

    const loadInfo = async () => {
        try {
            setIsLoadingInfo(true);
            setError("");
            const [employer, company] = await Promise.all([
                getCurrentEmployerProfile(),
                getCurrentEmployerCompany(),
            ]);
            setEmployerData(employer);
            setCompanyData((prev) => ({
                ...(prev || {}),
                ...company,
                logoUrl: company?.logoPath || prev?.logoUrl || "",
            }));
        } catch (loadError) {
            setError(
                loadError?.response?.data?.message ||
                    "Не удалось загрузить данные работодателя."
            );
        } finally {
            setIsLoadingInfo(false);
        }
    };

    useEffect(() => {
        loadInfo();
    }, [companyRefreshKey]);

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

                <div className="flex flex-wrap gap-3">
                    <button
                        type="button"
                        onClick={() => navigate(ROUTES.EMPLOYER_VACANCIES)}
                        className="rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                    >
                        Вакансии компании
                    </button>
                    <button
                        type="button"
                        onClick={() => setIsEmployerEditorOpen((prev) => !prev)}
                        className="rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                    >
                        {isEmployerEditorOpen ? "Скрыть редактор аккаунта" : "Редактировать аккаунт"}
                    </button>
                    <button
                        type="button"
                        onClick={() => setIsCompanyEditorOpen((prev) => !prev)}
                        className="rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                    >
                        {isCompanyEditorOpen ? "Скрыть редактор компании" : "Редактировать компанию"}
                    </button>
                </div>

                {error && (
                    <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                        {error}
                    </div>
                )}

                <CompanyLogoUpload
                    logoUrl={companyData?.logoUrl}
                    onUploadSuccess={handleLogoUploaded}
                    onDeleteSuccess={handleLogoDeleted}
                />

                <section className="grid gap-6 xl:grid-cols-[1fr_1fr]">
                    <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                        <div className="mb-3 flex items-center justify-between">
                            <h2 className="text-xl font-semibold text-slate-900">
                                Аккаунт работодателя
                            </h2>
                            <button
                                type="button"
                                onClick={loadInfo}
                                className="rounded-2xl border border-slate-200 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                            >
                                Обновить
                            </button>
                        </div>

                        {isLoadingInfo ? (
                            <p className="text-sm text-slate-500">Загрузка...</p>
                        ) : (
                            <div className="space-y-2 text-sm text-slate-600">
                                <p>
                                    <span className="font-medium text-slate-900">Email: </span>
                                    {employerData?.email || "Не заполнено"}
                                </p>
                            </div>
                        )}
                    </article>

                    <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                        <h2 className="text-xl font-semibold text-slate-900">Компания</h2>
                        {isLoadingInfo ? (
                            <p className="mt-3 text-sm text-slate-500">Загрузка...</p>
                        ) : (
                            <div className="mt-3 space-y-2 text-sm text-slate-600">
                                <p>
                                    <span className="font-medium text-slate-900">Название: </span>
                                    {companyData?.name || "Не заполнено"}
                                </p>
                                <p>
                                    <span className="font-medium text-slate-900">ИНН: </span>
                                    {companyData?.inn || "Не заполнено"}
                                </p>
                                <p>
                                    <span className="font-medium text-slate-900">Ссылка: </span>
                                    {companyData?.link || "Не заполнено"}
                                </p>
                                <p>
                                    <span className="font-medium text-slate-900">Описание: </span>
                                    {companyData?.description || "Не заполнено"}
                                </p>
                            </div>
                        )}
                    </article>
                </section>

                {isEmployerEditorOpen && <EmployerProfileForm />}

                {isCompanyEditorOpen && (
                    <CompanyProfileForm
                        refreshKey={companyRefreshKey}
                        onCompanyLoaded={setCompanyData}
                    />
                )}
            </div>
        </AuthLayout>
    );
};

export default EmployerProfilePage;
