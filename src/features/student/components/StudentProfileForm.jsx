import React, { useEffect, useState } from "react";
import AuthInput from "../../../components/ui/AuthInput";
import PasswordInput from "../../../components/ui/PasswordInput";
import {
    getCurrentStudentProfile,
    updateStudentProfile,
} from "../api/studentProfile.api";
import {
    mapStudentProfileFormToDto,
    mapStudentProfileResponseToForm,
} from "../utils/studentProfileMappers";
import { validateStudentProfileForm } from "../utils/studentProfileValidation";

const initialState = {
    email: "",
    name: "",
    surname: "",
    password: "",
    passwordConfirm: "",
    patronymic: "",
    birthdayDate: "",
    phone: "",
    vkLink: "",
    tgLink: "",
    maxLink: "",
    githubLink: "",
    university: "",
    specialization: "",
    graduationYear: "",
};

const StudentProfileForm = () => {
    const [formData, setFormData] = useState(initialState);
    const [initialFormData, setInitialFormData] = useState(initialState);
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");

    const loadProfile = async () => {
        try {
            setIsLoading(true);
            const data = await getCurrentStudentProfile();
            const mappedProfile = mapStudentProfileResponseToForm(data);
            setFormData(mappedProfile);
            setInitialFormData(mappedProfile);
        } catch (error) {
            setErrors({
                server:
                    error?.response?.data?.message ||
                    "Не удалось загрузить профиль студента.",
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

        const validationErrors = validateStudentProfileForm(formData);

        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        try {
            setIsSubmitting(true);
            setErrors({});
            setSuccessMessage("");

            const payload = mapStudentProfileFormToDto(formData, initialFormData);

            if (Object.keys(payload).length === 0) {
                setSuccessMessage("Изменений нет.");
                return;
            }

            await updateStudentProfile(payload);

            setSuccessMessage("Данные профиля успешно обновлены.");
            const nextFormData = {
                ...formData,
                password: "",
                passwordConfirm: "",
            };
            setFormData(nextFormData);
            setInitialFormData({
                ...nextFormData,
                password: "",
                passwordConfirm: "",
            });
        } catch (error) {
            setErrors({
                server:
                    error?.response?.data?.message ||
                    "Не удалось обновить профиль студента.",
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isLoading) {
        return (
            <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
                <p className="text-sm text-slate-500">Загрузка профиля...</p>
            </div>
        );
    }

    return (
        <form
            onSubmit={handleSubmit}
            className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm"
        >
            <div className="grid gap-5 md:grid-cols-2">
                <AuthInput
                    label="Email"
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Введите email"
                    error={errors.email}
                    autoComplete="email"
                />

                <AuthInput
                    label="Телефон"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+7 ..."
                    error={errors.phone}
                    autoComplete="tel"
                />

                <AuthInput
                    label="Имя"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Введите имя"
                    error={errors.name}
                    autoComplete="given-name"
                />

                <AuthInput
                    label="Фамилия"
                    name="surname"
                    value={formData.surname}
                    onChange={handleChange}
                    placeholder="Введите фамилию"
                    error={errors.surname}
                    autoComplete="family-name"
                />

                <AuthInput
                    label="Отчество"
                    name="patronymic"
                    value={formData.patronymic}
                    onChange={handleChange}
                    placeholder="Введите отчество"
                    error={errors.patronymic}
                />

                <AuthInput
                    label="Дата рождения"
                    type="date"
                    name="birthdayDate"
                    value={formData.birthdayDate}
                    onChange={handleChange}
                    error={errors.birthdayDate}
                />

                <AuthInput
                    label="Университет"
                    name="university"
                    value={formData.university}
                    onChange={handleChange}
                    placeholder="Введите университет"
                    error={errors.university}
                />

                <AuthInput
                    label="Специализация"
                    name="specialization"
                    value={formData.specialization}
                    onChange={handleChange}
                    placeholder="Введите специализацию"
                    error={errors.specialization}
                />

                <AuthInput
                    label="Год выпуска"
                    name="graduationYear"
                    value={formData.graduationYear}
                    onChange={handleChange}
                    placeholder="2027"
                    error={errors.graduationYear}
                />

                <AuthInput
                    label="GitHub"
                    name="githubLink"
                    value={formData.githubLink}
                    onChange={handleChange}
                    placeholder="https://github.com/..."
                    error={errors.githubLink}
                />

                <AuthInput
                    label="Telegram"
                    name="tgLink"
                    value={formData.tgLink}
                    onChange={handleChange}
                    placeholder="https://t.me/..."
                    error={errors.tgLink}
                />

                <AuthInput
                    label="VK"
                    name="vkLink"
                    value={formData.vkLink}
                    onChange={handleChange}
                    placeholder="https://vk.com/..."
                    error={errors.vkLink}
                />

                <AuthInput
                    label="Max"
                    name="maxLink"
                    value={formData.maxLink}
                    onChange={handleChange}
                    placeholder="Ссылка на профиль"
                    error={errors.maxLink}
                />
            </div>

            <div className="mt-6 grid gap-5 md:grid-cols-2">
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
                    label="Подтверждение нового пароля"
                    name="passwordConfirm"
                    value={formData.passwordConfirm}
                    onChange={handleChange}
                    placeholder="Повторите пароль"
                    error={errors.passwordConfirm}
                    autoComplete="new-password"
                />
            </div>

            {errors.server && (
                <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                    {errors.server}
                </div>
            )}

            {successMessage && (
                <div className="mt-6 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-600">
                    {successMessage}
                </div>
            )}

            <div className="mt-6">
                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="rounded-2xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-200 transition hover:bg-indigo-700 disabled:opacity-70"
                >
                    {isSubmitting ? "Сохранение..." : "Сохранить изменения"}
                </button>
            </div>
        </form>
    );
};

export default StudentProfileForm;
