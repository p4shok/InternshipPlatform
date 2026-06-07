import assert from "node:assert/strict";
import { describe, it } from "vitest";

import { mapVacancyToCardModel } from "./vacancyMappers.js";

describe("mapVacancyToCardModel", () => {
  it("maps vacancy fields to card model", () => {
    assert.deepEqual(
      mapVacancyToCardModel({
        id: 5,
        title: "Frontend Intern",
        company: { id: 9, name: "Acme" },
        isRemote: true,
        salaryFrom: 50000,
        salaryTo: 70000,
        region: "Moscow",
        description: "Build UI",
        skills: [{ name: "React" }, "CSS"],
        isFavorite: 1,
        specialization: { name: "Frontend" },
        minWorkExperienceYears: 2,
      }),
      {
      id: 5,
      title: "Frontend Intern",
      company: "Acme",
      type: "Вакансия",
      workFormat: "Удаленно",
      salary: "от 50\u00a0000 до 70\u00a0000 ₽",
      location: "Moscow",
      description: "Build UI",
      skills: ["React", "CSS"],
      isFavorite: true,
      companyId: 9,
      specializationName: "Frontend",
      minWorkExperienceYears: 2,
    });
  });

  it("fills defaults when source fields are missing", () => {
    assert.deepEqual(mapVacancyToCardModel({}), {
      id: undefined,
      title: "Без названия",
      company: "Компания не указана",
      type: "Вакансия",
      workFormat: "Офис / гибрид",
      salary: "Зарплата не указана",
      location: "Регион не указан",
      description: "Описание отсутствует",
      skills: [],
      isFavorite: false,
      companyId: null,
      specializationName: "",
      minWorkExperienceYears: 0,
    });
  });
});
