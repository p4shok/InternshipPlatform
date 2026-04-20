import React, { useEffect, useState } from "react";
import AuthInput from "../../../components/ui/AuthInput";
import { getCurrentEmployerCompany, updateCompany } from "../api/company.api";
import {
    mapCompanyFormToDto,
    mapCompanyResponseToForm,
} from "../utils/companyMappers";
import { validateCompanyForm } from "../utils/companyValidation";

const initialState = {
    id: "",
    name: "",
    inn: "",
    link: "",
    description: "",
    logoUrl: "",
};

const CompanyProfileForm = ({ refreshKey = 0, onCompanyLoaded }) => {
    const [formData, setFormData] = useState(initialState);
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");

    const loadCompany = async () => {
        try {
            setIsLoading(true);
            setErrors({});
            setSuccessMessage("");

            const company = await getCurrentEmployerCompany();
            const mappedData = mapCompanyResponseToForm(company);

            setFormData(mappedData);
            onCompanyLoaded?.(mappedData);
        } catch (error) {
            setErrors({
                server:
                    error?.response?.data?.message ||
                    "Не удалось загрузить данные компании.",
            });
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadCompany();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [refreshKey]);

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));

        setErrors((prev) => ({
            ...prev,
            [name]: "",
            server: "",
        }));

        setSuccessMessage("");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const validationErrors = validateCompanyForm(formData);

        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        try {
            setIsSubmitting(true);
            setErrors({});
            setSuccessMessage("");

            await updateCompany(mapCompanyFormToDto(formData));

            setSuccessMessage("Информация о компании успешно обновлена.");
            onCompanyLoaded?.(formData);
        } catch (error) {
            setErrors({
                server:
                    error?.response?.data?.message ||
                    "Не удалось обновить данные компании.",
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isLoading) {
        return (
            <section className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
                <p className="text-sm text-slate-500">Загрузка информации о компании...</p>
            </section>
        );
    }

    return (
        <section className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
            <div className="mb-6">
                <h2 className="text-xl font-semibold text-slate-900">
                    Данные компании
                </h2>
                <p className="mt-2 text-sm text-slate-500">
                    Обновите основную информацию о компании, чтобы профиль выглядел полно и убедительно.
                </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid gap-5 md:grid-cols-2">
                    <AuthInput
                        label="Название компании"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Введите название компании"
                        error={errors.name}
                        autoComplete="organization"
                    />

                    <AuthInput
                        label="ИНН"
                        name="inn"
                        value={formData.inn}
                        onChange={handleChange}
                        placeholder="Введите ИНН"
                        error={errors.inn}
                        disabled
                    />

                    <div className="md:col-span-2">
                        <AuthInput
                            label="Ссылка на сайт или страницу компании"
                            name="link"
                            value={formData.link}
                            onChange={handleChange}
                            placeholder="https://company.ru"
                            error={errors.link}
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <label
                        htmlFor="description"
                        className="block text-sm font-medium text-slate-700"
                    >
                        Описание компании
                    </label>

                    <textarea
                        id="description"
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        rows={6}
                        placeholder="Расскажите о компании, направлениях работы, культуре и преимуществах для студентов"
                        className={`w-full rounded-2xl border bg-white px-4 py-3 text-sm text-slate-900 shadow-sm outline-none transition-all duration-200 placeholder:text-slate-400 ${
                            errors.description
                                ? "border-red-400 ring-4 ring-red-100 focus:border-red-500"
                                : "border-slate-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
                        }`}
                    />

                    {errors.description && (
                        <p className="text-sm text-red-500">{errors.description}</p>
                    )}
                </div>

                {errors.server && (
                    <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                        {errors.server}
                    </div>
                )}

                {successMessage && (
                    <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-600">
                        {successMessage}
                    </div>
                )}

                <div className="flex flex-wrap gap-3">
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="rounded-2xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-200 transition hover:bg-indigo-700 disabled:opacity-70"
                    >
                        {isSubmitting ? "Сохранение..." : "Сохранить данные компании"}
                    </button>

                    <button
                        type="button"
                        onClick={loadCompany}
                        className="rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                    >
                        Обновить данные
                    </button>
                </div>
            </form>
        </section>
    );
};

export default CompanyProfileForm;
