import React, { useEffect, useState } from "react";
import AuthInput from "../../../components/ui/AuthInput";
import PasswordInput from "../../../components/ui/PasswordInput";
import {
    getCurrentEmployerProfile,
    updateEmployerProfile,
} from "../api/employerProfile.api";
import {
    mapEmployerProfileFormToDto,
    mapEmployerProfileResponseToForm,
} from "../utils/employerProfileMappers";
import { validateEmployerProfileForm } from "../utils/employerProfileValidation";

const initialState = {
    email: "",
    password: "",
    passwordConfirm: "",
};

const EmployerProfileForm = () => {
    const [formData, setFormData] = useState(initialState);
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");

    const loadProfile = async () => {
        try {
            setIsLoading(true);
            setErrors({});
            const data = await getCurrentEmployerProfile();
            setFormData(mapEmployerProfileResponseToForm(data));
        } catch (error) {
            setErrors({
                server:
                    error?.response?.data?.message ||
                    "Не удалось загрузить данные работодателя.",
            });
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadProfile();
    }, []);

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

        const validationErrors = validateEmployerProfileForm(formData);

        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        try {
            setIsSubmitting(true);
            setErrors({});
            setSuccessMessage("");

            await updateEmployerProfile(mapEmployerProfileFormToDto(formData));

            setSuccessMessage("Данные аккаунта успешно обновлены.");
            setFormData((prev) => ({
                ...prev,
                password: "",
                passwordConfirm: "",
            }));
        } catch (error) {
            setErrors({
                server:
                    error?.response?.data?.message ||
                    "Не удалось обновить данные аккаунта.",
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isLoading) {
        return (
            <section className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
                <p className="text-sm text-slate-500">Загрузка данных аккаунта...</p>
            </section>
        );
    }

    return (
        <section className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
            <div className="mb-6">
                <h2 className="text-xl font-semibold text-slate-900">
                    Настройки аккаунта
                </h2>
                <p className="mt-2 text-sm text-slate-500">
                    Обновите контактный email и пароль для входа в систему.
                </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid gap-5 md:grid-cols-2">
                    <AuthInput
                        label="Email"
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="company@example.com"
                        error={errors.email}
                        autoComplete="email"
                    />

                    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                        <p className="text-sm font-medium text-slate-700">
                            Безопасность аккаунта
                        </p>
                        <p className="mt-2 text-sm leading-6 text-slate-500">
                            Вы можете оставить поля пароля пустыми, если не хотите изменять
                            текущий пароль.
                        </p>
                    </div>
                </div>

                <div className="grid gap-5 md:grid-cols-2">
                    <PasswordInput
                        label="Новый пароль"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="Введите новый пароль"
                        error={errors.password}
                        autoComplete="new-password"
                    />

                    <PasswordInput
                        label="Подтверждение пароля"
                        name="passwordConfirm"
                        value={formData.passwordConfirm}
                        onChange={handleChange}
                        placeholder="Повторите новый пароль"
                        error={errors.passwordConfirm}
                        autoComplete="new-password"
                    />
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
                        {isSubmitting ? "Сохранение..." : "Сохранить изменения"}
                    </button>

                    <button
                        type="button"
                        onClick={loadProfile}
                        className="rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                    >
                        Обновить данные
                    </button>
                </div>
            </form>
        </section>
    );
};

export default EmployerProfileForm;