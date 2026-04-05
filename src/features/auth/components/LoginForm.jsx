import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthInput from "../../../components/ui/AuthInput";
import PasswordInput from "../../../components/ui/PasswordInput";
import { loginStudent, loginEmployer } from "../api/auth.api";
import { ROUTES } from "../../../routes/routePaths";

const LoginForm = ({ role = "student" }) => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isEmployer = role === "employer";

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
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.email.trim()) {
      newErrors.email = "Введите email";
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      newErrors.email = "Введите корректный email";
    }

    if (!formData.password) {
      newErrors.password = "Введите пароль";
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validate();

    if (Object.keys(validationErrors).length) {
      setErrors(validationErrors);
      return;
    }

    try {
      setIsSubmitting(true);
      setErrors({});

      const loginAction = isEmployer ? loginEmployer : loginStudent;

      await loginAction({
        email: formData.email,
        password: formData.password,
      });

      navigate(
          isEmployer ? ROUTES.HOME : ROUTES.STUDENT_VACANCIES
      );
    } catch (error) {
      setErrors({
        server:
            error?.response?.data?.message || "Ошибка входа. Попробуйте снова.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
      <div className="w-full max-w-xl rounded-3xl border border-slate-200 bg-white p-8 shadow-xl shadow-slate-200/60 sm:p-10">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-slate-900">Вход</h1>
          <p className="mt-2 text-sm text-slate-500">
            {isEmployer
                ? "Войдите в аккаунт работодателя"
                : "Войдите в аккаунт студента"}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <AuthInput
              label="Email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="example@mail.com"
              error={errors.email}
              autoComplete="email"
          />

          <PasswordInput
              label="Пароль"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Введите пароль"
              error={errors.password}
              autoComplete="current-password"
          />

          {errors.server && (
              <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                {errors.server}
              </div>
          )}

          <button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-2xl bg-indigo-600 px-5 py-3.5 text-sm font-semibold text-white shadow-lg shadow-indigo-200 transition hover:-translate-y-0.5 hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isSubmitting ? "Вход..." : "Войти"}
          </button>

          <p className="text-center text-sm text-slate-500">
            Нет аккаунта?{" "}
            <Link
                to={isEmployer ? ROUTES.EMPLOYER_REGISTER : ROUTES.STUDENT_REGISTER}
                className="font-medium text-indigo-600 hover:text-indigo-700"
            >
              Зарегистрироваться
            </Link>
          </p>
        </form>
      </div>
  );
};

export default LoginForm;