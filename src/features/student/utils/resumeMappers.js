import { mapVacancyToCardModel } from "./vacancyMappers";

export const mapResumeToListModel = (resume) => {
    const skills = Array.isArray(resume?.skills)
        ? resume.skills.map((item) => item?.name || item).filter(Boolean)
        : [];

    return {
        id: resume?.id,
        description: resume?.description || "",
        desiredSalary: resume?.desiredSalary || null,
        region: resume?.region || "",
        isActive: Boolean(resume?.isActive),
        specializationId:
            resume?.specializationId || resume?.specialization?.id || "",
        specializationName:
            resume?.specializationName || resume?.specialization?.name || "",
        skillIds: Array.isArray(resume?.skillIds)
            ? resume.skillIds
            : Array.isArray(resume?.skills)
              ? resume.skills
                    .map((item) => item?.id)
                    .filter((id) => id !== null && id !== undefined)
              : [],
        skills,
    };
};

export const mapResumeToFormModel = (resume) => ({
    description: resume?.description || "",
    desiredSalary: resume?.desiredSalary || "",
    region: resume?.region || "",
    specializationId: resume?.specializationId || "",
    skillIds: Array.isArray(resume?.skillIds) ? resume.skillIds : [],
    isActive: Boolean(resume?.isActive),
});

export const mapResumeFormToCreateDto = (formData) => ({
    description: formData.description || null,
    desiredSalary: formData.desiredSalary ? Number(formData.desiredSalary) : null,
    region: formData.region || null,
    specializationId: Number(formData.specializationId),
    skillIds: formData.skillIds.length ? formData.skillIds.map(Number) : null,
});

export const mapResumeFormToUpdateDto = (formData) => ({
    description: formData.description || null,
    desiredSalary: formData.desiredSalary ? Number(formData.desiredSalary) : null,
    region: formData.region || null,
    isActive: Boolean(formData.isActive),
    specializationId: formData.specializationId
        ? Number(formData.specializationId)
        : null,
    skillIds: formData.skillIds.length ? formData.skillIds.map(Number) : null,
});

export const mapRecommendedVacancies = (vacancies) =>
    vacancies.map(mapVacancyToCardModel);
