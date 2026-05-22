import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthInput from "../../../components/ui/AuthInput";
import PasswordInput from "../../../components/ui/PasswordInput";
import { registerTeacher } from "../../auth/api/auth.api";
import { getUniversities } from "../api/teacher.api";
import { ROUTES } from "../../../routes/routePaths";

const initialState = {
  name: "",
  surname: "",
  email: "",
  password: "",
  passwordConfirm: "",
  universityId: "",
};

const TeacherRegisterForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState(initialState);
  const [universities, setUniversities] = useState([]);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingUniversities, setIsLoadingUniversities] = useState(true);
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    getUniversities()
      .then((items) => setUniversities(Array.isArray(items) ? items : []))
      .catch(() => setUniversities([]))
      .finally(() => setIsLoadingUniversities(false));
  }, []);

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

  const handleChange = (event) => {
    const { name, value } = event.target;

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
    const nextErrors = {};

    if (!formData.name.trim()) {
      nextErrors.name = "Введите имя";
    }

    if (!formData.surname.trim()) {
      nextErrors.surname = "Введите фамилию";
    }

    if (!formData.email.trim()) {
      nextErrors.email = "Введите email";
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      nextErrors.email = "Введите корректный email";
    }

    if (!formData.universityId) {
      nextErrors.universityId = "Выберите университет";
    }

    if (!formData.password) {
      nextErrors.password = "Введите пароль";
    } else if (formData.password.length < 6) {
      nextErrors.password = "Пароль должен содержать минимум 6 символов";
    }

    if (!formData.passwordConfirm) {
      nextErrors.passwordConfirm = "Подтвердите пароль";
    } else if (formData.password !== formData.passwordConfirm) {
      nextErrors.passwordConfirm = "Пароли не совпадают";
    }

    return nextErrors;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const nextErrors = validate();
    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    try {
      setIsSubmitting(true);
      setErrors({});
      setSuccessMessage("");

      await registerTeacher({
        name: formData.name,
        surname: formData.surname,
        email: formData.email,
        password: formData.password,
        passwordConfirm: formData.passwordConfirm,
        universityId: Number(formData.universityId),
      });

      setSuccessMessage("Регистрация преподавателя прошла успешно.");

      setTimeout(() => {
        navigate(ROUTES.TEACHER_LOGIN);
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
          Регистрация преподавателя
        </h1>

        <p className="mt-2 text-sm text-slate-500">
          Создайте аккаунт для управления учебными группами
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid gap-5 sm:grid-cols-2">
          <AuthInput
            label="Имя"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Введите имя"
            error={errors.name}
          />

          <AuthInput
            label="Фамилия"
            name="surname"
            value={formData.surname}
            onChange={handleChange}
            placeholder="Введите фамилию"
            error={errors.surname}
          />
        </div>

        <AuthInput
          label="Email"
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="teacher@example.com"
          error={errors.email}
          autoComplete="email"
        />

        <label className="block space-y-2">
          <span className="text-sm font-medium text-slate-700">Университет</span>
          <select
            name="universityId"
            value={formData.universityId}
            onChange={handleChange}
            disabled={isLoadingUniversities}
            className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 disabled:bg-slate-50"
          >
            <option value="">
              {isLoadingUniversities ? "Загрузка университетов..." : "Выберите университет"}
            </option>
            {universities.map((university) => (
              <option key={university.id} value={university.id}>
                {university.name}
              </option>
            ))}
          </select>
          {errors.universityId && (
            <p className="text-sm text-red-600">{errors.universityId}</p>
          )}
        </label>

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
            to={ROUTES.TEACHER_LOGIN}
            className="font-medium text-indigo-600 hover:text-indigo-700"
          >
            Войти
          </Link>
        </p>
      </form>
    </div>
  );
};

export default TeacherRegisterForm;
