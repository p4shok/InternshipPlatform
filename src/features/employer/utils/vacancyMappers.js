const normalizeSkillIds = (vacancy) => {
    if (Array.isArray(vacancy?.skillIds)) {
        return vacancy.skillIds;
    }

    if (Array.isArray(vacancy?.skills)) {
        return vacancy.skills
            .map((item) => item?.id)
            .filter((id) => id !== null && id !== undefined);
    }

    return [];
};

export const mapEmployerVacancyToModel = (vacancy) => ({
    id: vacancy?.id,
    title: vacancy?.title || "",
    description: vacancy?.description || "",
    salaryFrom: vacancy?.salaryFrom || "",
    salaryTo: vacancy?.salaryTo || "",
    isRemote: Boolean(vacancy?.isRemote),
    region: vacancy?.region || "",
    minWorkExperienceYears:
        vacancy?.minWorkExperienceYears !== null &&
        vacancy?.minWorkExperienceYears !== undefined
            ? vacancy.minWorkExperienceYears
            : "",
    isActive:
        vacancy?.isActive === null || vacancy?.isActive === undefined
            ? true
            : Boolean(vacancy.isActive),
    specializationId:
        vacancy?.specializationId || vacancy?.specialization?.id || "",
    specializationName:
        vacancy?.specializationName || vacancy?.specialization?.name || "",
    skillIds: normalizeSkillIds(vacancy),
    skills: Array.isArray(vacancy?.skills)
        ? vacancy.skills.map((item) => item?.name || item).filter(Boolean)
        : [],
});

export const mapVacancyFormToCreateDto = (formData) => ({
    title: formData.title || null,
    description: formData.description || null,
    salaryFrom: formData.salaryFrom ? Number(formData.salaryFrom) : null,
    salaryTo: formData.salaryTo ? Number(formData.salaryTo) : null,
    isRemote: Boolean(formData.isRemote),
    region: formData.region || null,
    minWorkExperienceYears: Number(formData.minWorkExperienceYears || 0),
    specializationId: Number(formData.specializationId),
    skillIds: formData.skillIds.length ? formData.skillIds.map(Number) : null,
});

export const mapVacancyFormToUpdateDto = (formData) => ({
    title: formData.title || null,
    description: formData.description || null,
    salaryFrom: formData.salaryFrom ? Number(formData.salaryFrom) : null,
    salaryTo: formData.salaryTo ? Number(formData.salaryTo) : null,
    isRemote: Boolean(formData.isRemote),
    region: formData.region || null,
    isActive: Boolean(formData.isActive),
    minWorkExperienceYears: formData.minWorkExperienceYears
        ? Number(formData.minWorkExperienceYears)
        : null,
    specializationId: formData.specializationId
        ? Number(formData.specializationId)
        : null,
    skillIds: formData.skillIds.length ? formData.skillIds.map(Number) : null,
});
