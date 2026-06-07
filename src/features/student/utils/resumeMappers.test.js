import assert from "node:assert/strict";
import { describe, it } from "vitest";

import {
  mapRecommendedVacancies,
  mapResumeFormToCreateDto,
  mapResumeFormToUpdateDto,
  mapResumeToFormModel,
  mapResumeToListModel,
} from "./resumeMappers.js";

describe("resumeMappers", () => {
  it("maps resume to list model with derived skill ids and names", () => {
    assert.deepEqual(
      mapResumeToListModel({
        id: 1,
        description: "Resume",
        desiredSalary: 100000,
        region: "SPB",
        isActive: 1,
        specialization: { id: 3, name: "Backend" },
        skills: [{ id: 5, name: "Node.js" }, { id: 6, name: "SQL" }],
      }),
      {
      id: 1,
      description: "Resume",
      desiredSalary: 100000,
      region: "SPB",
      isActive: true,
      specializationId: 3,
      specializationName: "Backend",
      skillIds: [5, 6],
      skills: ["Node.js", "SQL"],
    });
  });

  it("maps resume to form model", () => {
    assert.deepEqual(
      mapResumeToFormModel({
        description: "Resume",
        desiredSalary: 90000,
        region: "Kazan",
        specializationId: 4,
        skillIds: [1, 2],
        isActive: true,
      }),
      {
      description: "Resume",
      desiredSalary: 90000,
      region: "Kazan",
      specializationId: 4,
      skillIds: [1, 2],
      isActive: true,
    });
  });

  it("maps create and update dto with numeric conversion", () => {
    const formData = {
      description: "Resume",
      desiredSalary: "120000",
      region: "Moscow",
      specializationId: "7",
      skillIds: ["1", "2"],
      isActive: "",
    };

    assert.deepEqual(mapResumeFormToCreateDto(formData), {
      description: "Resume",
      desiredSalary: 120000,
      region: "Moscow",
      specializationId: 7,
      skillIds: [1, 2],
    });

    assert.deepEqual(mapResumeFormToUpdateDto(formData), {
      description: "Resume",
      desiredSalary: 120000,
      region: "Moscow",
      isActive: false,
      specializationId: 7,
      skillIds: [1, 2],
    });
  });

  it("maps recommended vacancies through vacancy mapper", () => {
    assert.deepEqual(mapRecommendedVacancies([{ title: "QA" }])[0], {
      title: "QA",
      company: "Компания не указана",
      companyId: null,
      description: "Описание отсутствует",
      id: undefined,
      isFavorite: false,
      location: "Регион не указан",
      minWorkExperienceYears: 0,
      salary: "Зарплата не указана",
      skills: [],
      specializationName: "",
      type: "Вакансия",
      workFormat: "Офис / гибрид",
    });
  });
});
