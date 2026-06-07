import assert from "node:assert/strict";
import { describe, it } from "vitest";

import { validateStudentProfileForm } from "./studentProfileValidation.js";

describe("validateStudentProfileForm", () => {
  it("returns required field errors", () => {
    assert.deepEqual(
      validateStudentProfileForm({
        email: " ",
        name: "",
        surname: "",
        password: "",
        passwordConfirm: "",
        graduationYear: "",
      }),
      {
      email: "Введите email",
      name: "Введите имя",
      surname: "Введите фамилию",
    });
  });

  it("validates email, password, password confirmation and graduation year", () => {
    assert.deepEqual(
      validateStudentProfileForm({
        email: "invalid-email",
        name: "Ivan",
        surname: "Ivanov",
        password: "123",
        passwordConfirm: "321",
        graduationYear: "20A4",
      }),
      {
      email: "Введите корректный email",
      password: "Пароль должен содержать минимум 6 символов",
      passwordConfirm: "Пароли не совпадают",
      graduationYear: "Укажите год в формате YYYY",
    });
  });

  it("returns no errors for valid data", () => {
    assert.deepEqual(
      validateStudentProfileForm({
        email: "student@example.com",
        name: "Ivan",
        surname: "Ivanov",
        password: "secret1",
        passwordConfirm: "secret1",
        graduationYear: "2027",
      }),
      {},
    );
  });
});
