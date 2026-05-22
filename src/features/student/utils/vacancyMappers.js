const formatSalary = (salaryFrom, salaryTo) => {
    if (salaryFrom && salaryTo) {
        return `от ${salaryFrom.toLocaleString("ru-RU")} до ${salaryTo.toLocaleString("ru-RU")} ₽`;
    }

    if (salaryFrom) {
        return `от ${salaryFrom.toLocaleString("ru-RU")} ₽`;
    }

    if (salaryTo) {
        return `до ${salaryTo.toLocaleString("ru-RU")} ₽`;
    }

    return "Зарплата не указана";
};

export const mapVacancyToCardModel = (vacancy) => {
    const skills = Array.isArray(vacancy?.skills)
        ? vacancy.skills.map((item) => item?.name || item).filter(Boolean)
        : [];

    return {
        id: vacancy?.id,
        title: vacancy?.title || "Без названия",
        company: vacancy?.companyName || vacancy?.company?.name || "Компания не указана",
        type: "Вакансия",
        workFormat: vacancy?.isRemote ? "Удаленно" : "Офис / гибрид",
        salary: formatSalary(vacancy?.salaryFrom, vacancy?.salaryTo),
        location: vacancy?.region || "Регион не указан",
        description: vacancy?.description || "Описание отсутствует",
        skills,
        isFavorite: Boolean(vacancy?.isFavorite),
        companyId: vacancy?.companyId || vacancy?.company?.id || null,
        specializationName:
            vacancy?.specializationName || vacancy?.specialization?.name || "",
        minWorkExperienceYears:
            vacancy?.minWorkExperienceYears !== null &&
            vacancy?.minWorkExperienceYears !== undefined
                ? vacancy.minWorkExperienceYears
                : 0,
    };
};
