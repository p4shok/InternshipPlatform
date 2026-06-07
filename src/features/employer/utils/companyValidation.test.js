import assert from "node:assert/strict";
import { describe, it } from "vitest";

import { validateCompanyForm } from "./companyValidation.js";

describe("validateCompanyForm", () => {
  it("requires company name", () => {
    assert.deepEqual(
      validateCompanyForm({
        name: "",
        inn: "",
        link: "",
      }),
      {
      name: "Введите название компании",
    });
  });

  it("validates inn and link format", () => {
    assert.deepEqual(
      validateCompanyForm({
        name: "Acme",
        inn: "12345",
        link: "company.com",
      }),
      {
      inn: "ИНН должен содержать 10 или 12 цифр",
      link: "Введите корректную ссылку, начиная с http:// или https://",
    });
  });

  it("returns no errors for valid input", () => {
    assert.deepEqual(
      validateCompanyForm({
        name: "Acme",
        inn: "1234567890",
        link: "https://company.com",
      }),
      {},
    );
  });
});
