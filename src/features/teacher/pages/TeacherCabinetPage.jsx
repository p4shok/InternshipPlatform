import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthLayout from "../../../layouts/AuthLayout";
import { ROUTES } from "../../../routes/routePaths";
import { getCurrentTeacherProfile, getEducationalPrograms, logoutTeacher } from "../api/teacher.api";
import {
  acceptCuratorGroupApplication,
  createTeacherGroup,
  getCuratorGroupApplications,
  getTeacherGroupDetails,
  getTeacherGroups,
  refreshTeacherGroupInviteCode,
  rejectCuratorGroupApplication,
} from "../api/teacherGroups.api";

const TeacherCabinetPage = () => {
  const navigate = useNavigate();
  const currentYear = new Date().getFullYear();
  const [teacher, setTeacher] = useState(null);
  const [groups, setGroups] = useState([]);
  const [groupApplications, setGroupApplications] = useState([]);
  const [groupDetails, setGroupDetails] = useState(null);
  const [selectedGroupId, setSelectedGroupId] = useState(null);
  const [programs, setPrograms] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmittingGroup, setIsSubmittingGroup] = useState(false);
  const [isRefreshingInviteId, setIsRefreshingInviteId] = useState(null);
  const [isUpdatingApplicationId, setIsUpdatingApplicationId] = useState(null);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [groupForm, setGroupForm] = useState({
    educationalProgramId: "",
    enrollmentYear: String(currentYear),
  });

  const selectedGroup = useMemo(
    () => groups.find((group) => group.id === selectedGroupId) || null,
    [groups, selectedGroupId]
  );

  const loadBaseData = async () => {
    const [teacherProfile, teacherGroups, applications, educationalPrograms] =
      await Promise.all([
        getCurrentTeacherProfile(),
        getTeacherGroups(),
        getCuratorGroupApplications(),
        getEducationalPrograms(),
      ]);

    const normalizedGroups = Array.isArray(teacherGroups) ? teacherGroups : [];
    const normalizedApplications = Array.isArray(applications) ? applications : [];
    const normalizedPrograms = Array.isArray(educationalPrograms)
      ? educationalPrograms
      : [];

    setTeacher(teacherProfile);
    setGroups(normalizedGroups);
    setGroupApplications(normalizedApplications);
    setPrograms(normalizedPrograms);
    setSelectedGroupId((prev) => {
      if (prev && normalizedGroups.some((group) => group.id === prev)) {
        return prev;
      }

      return normalizedGroups[0]?.id || null;
    });
  };

  useEffect(() => {
    loadBaseData()
      .catch((loadError) => {
        setError(
          loadError?.response?.data?.message ||
            "Не удалось загрузить кабинет преподавателя."
        );
      })
      .finally(() => setIsLoading(false));
  }, []);

  useEffect(() => {
    if (!selectedGroupId) {
      setGroupDetails(null);
      return;
    }

    getTeacherGroupDetails(selectedGroupId)
      .then((details) => {
        setGroupDetails(details);
      })
      .catch((loadError) => {
        setError(
          loadError?.response?.data?.message ||
            "Не удалось загрузить состав группы."
        );
      });
  }, [selectedGroupId]);

  const handleLogout = async () => {
    await logoutTeacher();
    navigate(ROUTES.TEACHER_LOGIN);
  };

  const reloadAll = async () => {
    setError("");
    await loadBaseData();
  };

  const handleGroupFormChange = (event) => {
    const { name, value } = event.target;

    setGroupForm((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError("");
    setSuccessMessage("");
  };

  const handleCreateGroup = async (event) => {
    event.preventDefault();

    if (!groupForm.educationalProgramId) {
      setError("Выберите образовательную программу.");
      return;
    }

    try {
      setIsSubmittingGroup(true);
      setError("");
      setSuccessMessage("");

      const createdGroup = await createTeacherGroup({
        educationalProgramId: Number(groupForm.educationalProgramId),
        enrollmentYear: Number(groupForm.enrollmentYear),
      });

      await reloadAll();
      setSelectedGroupId(createdGroup?.id || null);
      setSuccessMessage(
        `Группа ${createdGroup?.groupName || ""} создана. Инвайт-код: ${createdGroup?.inviteCode || "—"}`
      );
    } catch (submitError) {
      setError(
        submitError?.response?.data?.message ||
          "Не удалось создать учебную группу."
      );
    } finally {
      setIsSubmittingGroup(false);
    }
  };

  const handleRefreshInviteCode = async (groupId) => {
    try {
      setIsRefreshingInviteId(groupId);
      setError("");
      const refreshed = await refreshTeacherGroupInviteCode(groupId);
      await reloadAll();
      setSuccessMessage(
        `Инвайт-код обновлён: ${refreshed?.inviteCode || "—"}`
      );
    } catch (refreshError) {
      setError(
        refreshError?.response?.data?.message ||
          "Не удалось обновить инвайт-код."
      );
    } finally {
      setIsRefreshingInviteId(null);
    }
  };

  const handleApplicationDecision = async (applicationId, action) => {
    try {
      setIsUpdatingApplicationId(applicationId);
      setError("");
      setSuccessMessage("");

      if (action === "accept") {
        await acceptCuratorGroupApplication(applicationId);
      } else {
        await rejectCuratorGroupApplication(applicationId);
      }

      await reloadAll();
      if (selectedGroupId) {
        const details = await getTeacherGroupDetails(selectedGroupId);
        setGroupDetails(details);
      }

      setSuccessMessage(
        action === "accept"
          ? "Заявка принята."
          : "Заявка отклонена."
      );
    } catch (decisionError) {
      setError(
        decisionError?.response?.data?.message ||
          "Не удалось обработать заявку."
      );
    } finally {
      setIsUpdatingApplicationId(null);
    }
  };

  if (isLoading) {
    return (
      <AuthLayout>
        <div className="text-sm text-slate-500">Загрузка кабинета...</div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout>
      <div className="w-full space-y-6">
        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <h1 className="text-2xl font-semibold text-slate-900">
                Кабинет преподавателя
              </h1>
              <p className="mt-2 text-sm text-slate-600">
                {[teacher?.surname, teacher?.name, teacher?.patronymic]
                  .filter(Boolean)
                  .join(" ") || teacher?.email}
              </p>
              <p className="mt-1 text-sm text-slate-500">
                {teacher?.university || "Университет не указан"}
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={reloadAll}
                className="rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
              >
                Обновить
              </button>
              <button
                type="button"
                onClick={handleLogout}
                className="rounded-2xl bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-700"
              >
                Выйти
              </button>
            </div>
          </div>
        </section>

        {error && (
          <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
            {error}
          </div>
        )}

        {successMessage && (
          <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-600">
            {successMessage}
          </div>
        )}

        <section className="grid gap-6 xl:grid-cols-[360px_minmax(0,1fr)]">
          <form
            onSubmit={handleCreateGroup}
            className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"
          >
            <h2 className="text-lg font-semibold text-slate-900">
              Создать учебную группу
            </h2>

            <div className="mt-4 space-y-4">
              <label className="block space-y-2">
                <span className="text-sm font-medium text-slate-700">
                  Образовательная программа
                </span>
                <select
                  name="educationalProgramId"
                  value={groupForm.educationalProgramId}
                  onChange={handleGroupFormChange}
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
                >
                  <option value="">Выберите программу</option>
                  {programs.map((program) => (
                    <option key={program.id} value={program.id}>
                      {program.name}
                    </option>
                  ))}
                </select>
              </label>

              <label className="block space-y-2">
                <span className="text-sm font-medium text-slate-700">
                  Год набора
                </span>
                <input
                  type="number"
                  min="2000"
                  max="2100"
                  name="enrollmentYear"
                  value={groupForm.enrollmentYear}
                  onChange={handleGroupFormChange}
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
                />
              </label>

              <button
                type="submit"
                disabled={isSubmittingGroup}
                className="w-full rounded-2xl bg-indigo-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:opacity-70"
              >
                {isSubmittingGroup ? "Создание..." : "Создать группу"}
              </button>
            </div>
          </form>

          <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h2 className="text-lg font-semibold text-slate-900">
                Мои группы
              </h2>
              <span className="text-sm text-slate-500">
                Всего групп: {groups.length}
              </span>
            </div>

            {groups.length === 0 ? (
              <p className="mt-4 text-sm text-slate-500">
                Пока нет созданных групп.
              </p>
            ) : (
              <div className="mt-4 grid gap-3 lg:grid-cols-2">
                {groups.map((group) => (
                  <div
                    key={group.id}
                    className={`rounded-2xl border p-4 text-left transition ${
                      selectedGroupId === group.id
                        ? "border-indigo-500 bg-indigo-50"
                        : "border-slate-200 bg-white hover:bg-slate-50"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-base font-semibold text-slate-900">
                          {group.name}
                        </p>
                        <p className="mt-1 text-sm text-slate-500">
                          Студентов: {group.studentsCount || 0}
                        </p>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <button
                          type="button"
                          onClick={() => setSelectedGroupId(group.id)}
                          className="rounded-xl border border-slate-200 px-3 py-2 text-xs font-medium text-slate-700 transition hover:bg-slate-50"
                        >
                          Открыть
                        </button>
                        <button
                          type="button"
                          onClick={() => handleRefreshInviteCode(group.id)}
                          disabled={isRefreshingInviteId === group.id}
                          className="rounded-xl border border-slate-200 px-3 py-2 text-xs font-medium text-slate-700 transition hover:bg-slate-50 disabled:opacity-70"
                        >
                          {isRefreshingInviteId === group.id
                            ? "..."
                            : "Обновить код"}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {selectedGroup && groupDetails && (
              <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-5">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900">
                      {groupDetails.name}
                    </h3>
                    <p className="mt-1 text-sm text-slate-600">
                      {groupDetails.specialization}
                    </p>
                  </div>
                  <div className="text-right text-sm text-slate-600">
                    <p>Инвайт-код: {groupDetails.inviteCode}</p>
                    <p>Студентов: {groupDetails.studentsCount || 0}</p>
                  </div>
                </div>

                <div className="mt-4 space-y-2">
                  {groupDetails.students?.length > 0 ? (
                    groupDetails.students.map((student) => (
                      <div
                        key={student.id}
                        className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700"
                      >
                        {[student.surname, student.name, student.patronymic]
                          .filter(Boolean)
                          .join(" ")}
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-slate-500">
                      В группе пока нет студентов.
                    </p>
                  )}
                </div>
              </div>
            )}
          </section>
        </section>

        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-lg font-semibold text-slate-900">
              Заявки на вступление
            </h2>
            <span className="text-sm text-slate-500">
              В очереди: {groupApplications.length}
            </span>
          </div>

          {groupApplications.length === 0 ? (
            <p className="mt-4 text-sm text-slate-500">
              Новых заявок нет.
            </p>
          ) : (
            <div className="mt-4 space-y-3">
              {groupApplications.map((application) => (
                <div
                  key={application.id}
                  className="rounded-2xl border border-slate-200 p-4"
                >
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                      <p className="text-base font-semibold text-slate-900">
                        {[application.student?.surname, application.student?.name, application.student?.patronymic]
                          .filter(Boolean)
                          .join(" ")}
                      </p>
                      <p className="mt-1 text-sm text-slate-600">
                        Группа: {application.groupName}
                      </p>
                      <p className="mt-1 text-sm text-slate-500">
                        Заявка от {new Date(application.createdAt).toLocaleString("ru-RU")}
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={() =>
                          handleApplicationDecision(application.id, "accept")
                        }
                        disabled={isUpdatingApplicationId === application.id}
                        className="rounded-2xl bg-emerald-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-emerald-700 disabled:opacity-70"
                      >
                        Принять
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          handleApplicationDecision(application.id, "reject")
                        }
                        disabled={isUpdatingApplicationId === application.id}
                        className="rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:opacity-70"
                      >
                        Отклонить
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </AuthLayout>
  );
};

export default TeacherCabinetPage;
