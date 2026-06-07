import assert from "node:assert/strict";
import { describe, it } from "vitest";

import {
  mapEmployerProfileFormToDto,
  mapEmployerProfileResponseToForm,
} from "./employerProfileMappers.js";
import { validateEmployerProfileForm } from "./employerProfileValidation.js";

describe("employer profile utils", () => {
  it("maps response to form", () => {
    assert.deepEqual(
      mapEmployerProfileResponseToForm({
        email: "employer@example.com",
      }),
      {
      email: "employer@example.com",
      password: "",
      passwordConfirm: "",
    });
  });

  it("builds dto only from changed email and password", () => {
    assert.deepEqual(
      mapEmployerProfileFormToDto(
        {
          email: "new@example.com",
          password: "secret1",
          passwordConfirm: "secret1",
        },
        {
          email: "old@example.com",
        },
      ),
      {
      email: "new@example.com",
      password: "secret1",
      passwordConfirm: "secret1",
    });
  });

  it("validates employer profile form", () => {
    assert.deepEqual(
      validateEmployerProfileForm({
        email: "invalid",
        password: "123",
        passwordConfirm: "321",
      }),
      {
      email: "Введите корректный email",
      password: "Пароль должен содержать минимум 6 символов",
      passwordConfirm: "Пароли не совпадают",
    });
  });
});
