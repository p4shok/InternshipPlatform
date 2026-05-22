import React, { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import AuthLayout from "../../../layouts/AuthLayout";
import BackButton from "../../../components/shared/BackButton";
import { ROUTES } from "../../../routes/routePaths";
import { getVacancyDetails } from "../api/vacancies.api";
import { getMyResumes } from "../api/resumes.api";
import { createStudentApplication } from "../api/applications.api";
import {
  addFavoriteVacancy,
  removeFavoriteVacancy,
} from "../api/favorites.api";
import { mapResumeToListModel } from "../utils/resumeMappers";
import { mapVacancyToCardModel } from "../utils/vacancyMappers";

const initialApplicationForm = {
  resumeId: "",
  welcomeMessage: "",
};

const formatSalary = (salaryFrom, salaryTo) => {
  if (salaryFrom && salaryTo) {
    return `${salaryFrom.toLocaleString("ru-RU")} - ${salaryTo.toLocaleString("ru-RU")} ₽`;
  }

  if (salaryFrom) {
    return `от ${salaryFrom.toLocaleString("ru-RU")} ₽`;
  }

  if (salaryTo) {
    return `до ${salaryTo.toLocaleString("ru-RU")} ₽`;
  }

  return "Зарплата не указана";
};

const StudentVacancyDetailsPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { vacancyId } = useParams();
  const [vacancyDetails, setVacancyDetails] = useState(null);
  const [resumes, setResumes] = useState([]);
  const [applicationForm, setApplicationForm] = useState(initialApplicationForm);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmittingApplication, setIsSubmittingApplication] = useState(false);
  const [isFavoriteLoading, setIsFavoriteLoading] = useState(false);
  const [isApplicationOpen, setIsApplicationOpen] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const hasResumes = resumes.length > 0;
  const specializationName = vacancyDetails?.specialization?.name || "Не указана";

  const loadData = async () => {
    if (!vacancyId) {
      setError("Вакансия не найдена.");
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError("");

      const [details, resumeList] = await Promise.all([
        getVacancyDetails(vacancyId),
        getMyResumes(),
      ]);

      setVacancyDetails(details);
      setResumes(resumeList.map(mapResumeToListModel));
    } catch (loadError) {
      setError(
        loadError?.response?.data?.message ||
          "Не удалось загрузить подробную информацию о вакансии."
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [vacancyId]);

  useEffect(() => {
    if (!isApplicationOpen || applicationForm.resumeId || !resumes[0]?.id) {
      return;
    }

    setApplicationForm((prev) => ({
      ...prev,
      resumeId: String(resumes[0].id),
    }));
  }, [applicationForm.resumeId, isApplicationOpen, resumes]);

  useEffect(() => {
    if (!location.state?.openApplication) {
      return;
    }

    setIsApplicationOpen(true);
    navigate(location.pathname, { replace: true, state: null });
  }, [location.pathname, location.state, navigate]);

  const handleToggleFavorite = async () => {
    if (!vacancyDetails?.id) {
      return;
    }

    try {
      setIsFavoriteLoading(true);
      setError("");

      if (vacancyDetails.isFavorite) {
        await removeFavoriteVacancy(vacancyDetails.id);
      } else {
        await addFavoriteVacancy(vacancyDetails.id);
      }

      setVacancyDetails((prev) =>
        prev
          ? {
              ...prev,
              isFavorite: !prev.isFavorite,
            }
          : prev
      );
    } catch (toggleError) {
      setError(
        toggleError?.response?.data?.message || "Не удалось обновить избранное."
      );
    } finally {
      setIsFavoriteLoading(false);
    }
  };

  const handleSubmitApplication = async (event) => {
    event.preventDefault();

    if (!applicationForm.resumeId) {
      setError("Для отклика нужно выбрать резюме.");
      return;
    }

    if (!vacancyDetails?.id) {
      setError("Вакансия для отклика не найдена.");
      return;
    }

    try {
      setIsSubmittingApplication(true);
      setError("");

      await createStudentApplication({
        vacancyId: vacancyDetails.id,
        resumeId: Number(applicationForm.resumeId),
        welcomeMessage: applicationForm.welcomeMessage || null,
      });

      setSuccessMessage("Отклик отправлен. Диалог с работодателем появится в чатах.");
      setIsApplicationOpen(false);
      setApplicationForm(initialApplicationForm);
    } catch (submitError) {
      setError(
        submitError?.response?.data?.message || "Не удалось отправить отклик."
      );
    } finally {
      setIsSubmittingApplication(false);
    }
  };

  const vacancyCardModel = useMemo(
    () => (vacancyDetails ? mapVacancyToCardModel(vacancyDetails) : null),
    [vacancyDetails]
  );

  return (
    <AuthLayout>
      <div className="w-full space-y-6">
        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <BackButton to={ROUTES.STUDENT_VACANCIES} />
            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => navigate(ROUTES.STUDENT_APPLICATIONS)}
                className="rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
              >
                Отклики
              </button>
              <button
                type="button"
                onClick={() => navigate(ROUTES.STUDENT_CHATS)}
                className="rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
              >
                Чаты
              </button>
            </div>
          </div>
        </section>

        {(error || successMessage) && (
          <div
            className={`rounded-2xl px-4 py-3 text-sm ${
              error
                ? "border border-red-200 bg-red-50 text-red-600"
                : "border border-emerald-200 bg-emerald-50 text-emerald-600"
            }`}
          >
            {error || successMessage}
          </div>
        )}

        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          {isLoading ? (
            <p className="text-sm text-slate-500">Загрузка деталей вакансии...</p>
          ) : vacancyDetails ? (
            <div className="space-y-6">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-medium text-indigo-700">
                      {specializationName}
                    </span>
                    <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
                      {vacancyDetails.isRemote ? "Удаленно" : "Офис / гибрид"}
                    </span>
                  </div>
                  <h1 className="mt-4 text-3xl font-semibold text-slate-900">
                    {vacancyDetails.title}
                  </h1>
                  <p className="mt-2 text-sm font-medium text-slate-600">
                    {vacancyDetails.company?.name || "Компания не указана"}
                  </p>
                </div>

                <div className="flex flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={handleToggleFavorite}
                    disabled={isFavoriteLoading}
                    className={`rounded-2xl px-4 py-2 text-sm font-medium transition ${
                      vacancyDetails.isFavorite
                        ? "border border-amber-200 bg-amber-50 text-amber-700 hover:bg-amber-100"
                        : "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                    } disabled:cursor-not-allowed disabled:opacity-60`}
                  >
                    {vacancyDetails.isFavorite ? "Убрать из избранного" : "Добавить в избранное"}
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsApplicationOpen(true)}
                    className="rounded-2xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-indigo-200 transition hover:bg-indigo-700"
                  >
                    Откликнуться
                  </button>
                </div>
              </div>

              <div className="grid gap-4 text-sm text-slate-600 sm:grid-cols-2 xl:grid-cols-4">
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <p className="font-medium text-slate-900">Зарплата</p>
                  <p className="mt-2">{formatSalary(vacancyDetails.salaryFrom, vacancyDetails.salaryTo)}</p>
                </div>
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <p className="font-medium text-slate-900">Регион</p>
                  <p className="mt-2">{vacancyDetails.region || "Не указан"}</p>
                </div>
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <p className="font-medium text-slate-900">Опыт</p>
                  <p className="mt-2">{vacancyDetails.minWorkExperienceYears || 0} лет</p>
                </div>
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <p className="font-medium text-slate-900">Сайт компании</p>
                  <p className="mt-2 break-all">{vacancyDetails.company?.link || "Не указана"}</p>
                </div>
              </div>

              <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
                <article className="rounded-3xl border border-slate-200 p-6">
                  <h2 className="text-lg font-semibold text-slate-900">Описание</h2>
                  <p className="mt-4 whitespace-pre-line text-sm leading-6 text-slate-600">
                    {vacancyDetails.description || "Описание отсутствует"}
                  </p>
                </article>

                <article className="rounded-3xl border border-slate-200 p-6">
                  <h2 className="text-lg font-semibold text-slate-900">Навыки</h2>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {(vacancyDetails.skills || []).length > 0 ? (
                      vacancyDetails.skills.map((skill) => (
                        <span
                          key={skill.id || skill.name}
                          className="rounded-full border border-slate-200 px-3 py-1 text-xs font-medium text-slate-600"
                        >
                          {skill.name}
                        </span>
                      ))
                    ) : (
                      <p className="text-sm text-slate-500">Навыки не указаны.</p>
                    )}
                  </div>
                </article>
              </div>

              {vacancyCardModel && (
                <section className="rounded-3xl border border-slate-200 p-6">
                  <h2 className="text-lg font-semibold text-slate-900">Краткая карточка</h2>
                  <div className="mt-4">
                    <div className="pointer-events-none opacity-100">
                      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                          <div className="min-w-0">
                            <div className="flex flex-wrap items-center gap-2">
                              <span className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-medium text-indigo-700">
                                {vacancyCardModel.type}
                              </span>
                              <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
                                {vacancyCardModel.workFormat}
                              </span>
                            </div>
                            <h3 className="mt-4 text-xl font-semibold text-slate-900">
                              {vacancyCardModel.title}
                            </h3>
                            <p className="mt-2 text-sm font-medium text-slate-600">
                              {vacancyCardModel.company}
                            </p>
                            <p className="mt-4 text-sm leading-6 text-slate-500">
                              {vacancyCardModel.description}
                            </p>
                          </div>
                          <div className="flex shrink-0 flex-col gap-3 lg:items-end">
                            <p className="text-sm font-semibold text-slate-900">{vacancyCardModel.salary}</p>
                            <p className="text-xs text-slate-500">{vacancyCardModel.location}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </section>
              )}
            </div>
          ) : (
            <p className="text-sm text-slate-500">Вакансия не найдена.</p>
          )}
        </section>

        {isApplicationOpen && vacancyDetails && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4">
            <div className="w-full max-w-2xl rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-2xl font-semibold text-slate-900">Отклик на вакансию</h3>
                  <p className="mt-2 text-sm text-slate-500">
                    {vacancyDetails.title} · {vacancyDetails.company?.name}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsApplicationOpen(false)}
                  className="rounded-2xl border border-slate-200 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                >
                  Закрыть
                </button>
              </div>

              {hasResumes ? (
                <form onSubmit={handleSubmitApplication} className="mt-6 space-y-4">
                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-700">
                      Выберите резюме
                    </label>
                    <select
                      value={applicationForm.resumeId}
                      onChange={(event) =>
                        setApplicationForm((prev) => ({
                          ...prev,
                          resumeId: event.target.value,
                        }))
                      }
                      className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
                    >
                      <option value="">Выберите резюме</option>
                      {resumes.map((resume) => (
                        <option key={resume.id} value={resume.id}>
                          {resume.specializationName || "Без названия"} · {resume.region || "Регион не указан"}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-700">
                      Сопроводительное сообщение
                    </label>
                    <textarea
                      rows={5}
                      value={applicationForm.welcomeMessage}
                      onChange={(event) =>
                        setApplicationForm((prev) => ({
                          ...prev,
                          welcomeMessage: event.target.value,
                        }))
                      }
                      placeholder="Коротко расскажите, почему хотите откликнуться на эту вакансию"
                      className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
                    />
                  </div>

                  <div className="flex flex-wrap gap-3">
                    <button
                      type="submit"
                      disabled={isSubmittingApplication}
                      className="rounded-2xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-200 transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-70"
                    >
                      {isSubmittingApplication ? "Отправка..." : "Отправить отклик"}
                    </button>
                    <button
                      type="button"
                      onClick={() => navigate(ROUTES.STUDENT_RESUMES)}
                      className="rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                    >
                      Управлять резюме
                    </button>
                  </div>
                </form>
              ) : (
                <div className="mt-6 rounded-3xl border border-amber-200 bg-amber-50 p-5 text-sm text-amber-800">
                  Для отклика нужно создать хотя бы одно резюме. После этого вы сможете
                  отправлять отклики и начинать чат с работодателем.
                  <div className="mt-4">
                    <button
                      type="button"
                      onClick={() => navigate(ROUTES.STUDENT_RESUMES)}
                      className="rounded-2xl bg-amber-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-amber-600"
                    >
                      Перейти к резюме
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </AuthLayout>
  );
};

export default StudentVacancyDetailsPage;
