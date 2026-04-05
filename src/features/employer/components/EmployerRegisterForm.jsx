import React, { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthInput from "../../../components/ui/AuthInput";
import PasswordInput from "../../../components/ui/PasswordInput";
import { registerEmployer } from "../../auth/api/auth.api";
import { ROUTES } from "../../../routes/routePaths";

const initialState = {
  email: "",
  companyName: "",
  inn: "",
  password: "",
  passwordConfirm: "",
};

const EmployerRegisterForm = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState(initialState);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const passwordStrength = useMemo(() => {
    const password = formData.password;
    let score = 0;

    if (password.length >= 6) score++;
    if (password.length >= 8) score++;
    if (/[A-ZА-Я]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-zА-Яа-я0-9]/.test(password)) score++;

    if (score <= 2) return { text: "Слабый", width: "w-1/3" };
    if (score <= 4) return { text: "Средний", width: "w-2/3" };
    return { text: "Надёжный", width: "w-full" };
  }, [formData.password]);

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

  const validate = () => {
    const newErrors = {};

    if (!formData.email.trim()) {
      newErrors.email = "Введите email";
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      newErrors.email = "Введите корректный email";
    }

    if (!formData.companyName.trim()) {
      newErrors.companyName = "Введите название компании";
    }

    if (!formData.inn.trim()) {
      newErrors.inn = "Введите ИНН";
    } else if (!/^\d{10}(\d{2})?$/.test(formData.inn.trim())) {
      newErrors.inn = "ИНН должен содержать 10 или 12 цифр";
    }

    if (!formData.password) {
      newErrors.password = "Введите пароль";
    } else if (formData.password.length < 6) {
      newErrors.password = "Пароль должен содержать минимум 6 символов";
    }

    if (!formData.passwordConfirm) {
      newErrors.passwordConfirm = "Подтвердите пароль";
    } else if (formData.password !== formData.passwordConfirm) {
      newErrors.passwordConfirm = "Пароли не совпадают";
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validate();

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      setIsSubmitting(true);
      setErrors({});
      setSuccessMessage("");

      await registerEmployer({
        email: formData.email,
        companyName: formData.companyName,
        inn: formData.inn,
        password: formData.password,
        passwordConfirm: formData.passwordConfirm,
      });

      setSuccessMessage("Регистрация работодателя прошла успешно.");

      setTimeout(() => {
        navigate(ROUTES.EMPLOYER_LOGIN);
      }, 700);
    } catch (error) {
      setErrors({
        server:
            error?.response?.data?.message ||
            "Ошибка регистрации. Попробуйте снова.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
      <div className="w-full max-w-xl rounded-3xl border border-white/40 bg-white/80 p-8 shadow-2xl shadow-slate-200/70 backdrop-blur-xl sm:p-10">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-600 text-xl font-bold text-white shadow-lg shadow-indigo-200">
            IT
          </div>

          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            Регистрация работодателя
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            Создайте аккаунт компании для поиска студентов и стажёров
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
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

          <AuthInput
              label="Название компании"
              name="companyName"
              value={formData.companyName}
              onChange={handleChange}
              placeholder="Введите название компании"
              error={errors.companyName}
              autoComplete="organization"
          />

          <AuthInput
              label="ИНН"
              name="inn"
              value={formData.inn}
              onChange={handleChange}
              placeholder="Введите ИНН"
              error={errors.inn}
          />

          <div className="space-y-3">
            <PasswordInput
                label="Пароль"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Введите пароль"
                error={errors.password}
                autoComplete="new-password"
            />

            {formData.password && (
                <div className="space-y-2">
                  <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
                    <div
                        className={`h-full rounded-full bg-indigo-500 transition-all duration-300 ${passwordStrength.width}`}
                    />
                  </div>
                  <p className="text-xs text-slate-500">
                    Надёжность пароля: {passwordStrength.text}
                  </p>
                </div>
            )}
          </div>

          <PasswordInput
              label="Подтверждение пароля"
              name="passwordConfirm"
              value={formData.passwordConfirm}
              onChange={handleChange}
              placeholder="Повторите пароль"
              error={errors.passwordConfirm}
              autoComplete="new-password"
          />

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

          <button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-2xl bg-indigo-600 px-5 py-3.5 text-sm font-semibold text-white shadow-lg shadow-indigo-200 transition hover:-translate-y-0.5 hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isSubmitting ? "Регистрация..." : "Зарегистрироваться"}
          </button>

          <p className="text-center text-sm text-slate-500">
            Уже есть аккаунт?{" "}
            <Link
                to={ROUTES.EMPLOYER_LOGIN}
                className="font-medium text-indigo-600 hover:text-indigo-700"
            >
              Войти
            </Link>
          </p>
        </form>
      </div>
  );
};

export default EmployerRegisterForm;