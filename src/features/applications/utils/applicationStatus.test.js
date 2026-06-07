import assert from "node:assert/strict";
import { describe, it } from "vitest";

import {
  APPLICATION_STATUS_LABELS,
  APPLICATION_STATUS_OPTIONS,
  getApplicationStatusLabel,
} from "./applicationStatus.js";

describe("applicationStatus utils", () => {
  it("keeps label map in sync with options", () => {
    assert.equal(Object.keys(APPLICATION_STATUS_LABELS).length, APPLICATION_STATUS_OPTIONS.length);
    assert.equal(APPLICATION_STATUS_LABELS[1], "На рассмотрении");
  });

  it("returns label, raw status, or fallback", () => {
    assert.equal(getApplicationStatusLabel(2), "Приглашение на интервью");
    assert.equal(getApplicationStatusLabel("custom"), "custom");
    assert.equal(getApplicationStatusLabel(""), "Неизвестно");
  });
});
