import assert from "node:assert/strict";
import { describe, it } from "vitest";

import {
  mapStudentProfileFormToDto,
  mapStudentProfileResponseToForm,
} from "./studentProfileMappers.js";

describe("studentProfileMappers", () => {
  it("maps response to form model with defaults", () => {
    assert.deepEqual(
      mapStudentProfileResponseToForm({
        email: "student@example.com",
        birthdayDate: "2025-03-01T10:00:00Z",
        phone: "+79990000000",
      }),
      {
      email: "student@example.com",
      name: "",
      surname: "",
      password: "",
      passwordConfirm: "",
      patronymic: "",
      birthdayDate: "2025-03-01",
      phone: "+79990000000",
      vkLink: "",
      tgLink: "",
      maxLink: "",
      githubLink: "",
      university: "",
      specialization: "",
      graduationYear: "",
    });
  });

  it("builds dto only from changed fields and includes password pair", () => {
    assert.deepEqual(
      mapStudentProfileFormToDto(
        {
          email: "new@example.com",
          name: "Ivan",
          surname: "Ivanov",
          patronymic: "",
          birthdayDate: "",
          phone: "",
          vkLink: "https://vk.com/id1",
          tgLink: "",
          maxLink: "",
          githubLink: "",
          password: "secret1",
          passwordConfirm: "secret1",
        },
        {
          email: "old@example.com",
          name: "Ivan",
          surname: "Ivanov",
          patronymic: "",
          birthdayDate: "2000-01-01",
          phone: "",
          vkLink: "",
          tgLink: "",
          maxLink: "",
          githubLink: "",
        },
      ),
      {
      email: "new@example.com",
      birthdayDate: null,
      vkLink: "https://vk.com/id1",
      password: "secret1",
      passwordConfirm: "secret1",
    });
  });
});
