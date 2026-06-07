import assert from "node:assert/strict";
import { afterEach, beforeEach, describe, it } from "vitest";

import {
  clearAuthSession,
  getAccessToken,
  getAuthRole,
  getAuthSession,
  parseJwtPayload,
  storeAuthSession,
  updateAuthSession,
} from "./session.js";

const STORAGE_KEY = "internship-platform-auth-session";

const encodeJwtPayload = (payload) =>
  btoa(JSON.stringify(payload)).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");

const createToken = (payload) => `header.${encodeJwtPayload(payload)}.signature`;

describe("session utils", () => {
  let localStorageMock;

  beforeEach(() => {
    localStorageMock = {
      store: {},
      getItem(key) {
        return Object.prototype.hasOwnProperty.call(this.store, key) ? this.store[key] : null;
      },
      setItem(key, value) {
        this.store[key] = String(value);
      },
      removeItem(key) {
        delete this.store[key];
      },
      clear() {
        this.store = {};
      },
    };

    globalThis.window = { localStorage: localStorageMock };
  });

  afterEach(() => {
    delete globalThis.window;
  });

  it("parses JWT payload with url-safe base64", () => {
    const payload = { role: "Student", userId: 42 };

    assert.deepEqual(parseJwtPayload(createToken(payload)), payload);
  });

  it("returns null for invalid JWT payload", () => {
    assert.equal(parseJwtPayload("invalid.token"), null);
  });

  it("stores session with normalized role and user id from token", () => {
    storeAuthSession({
      accessToken: createToken({ role: "Employer", userId: "15" }),
    });

    assert.deepEqual(getAuthSession(), {
      accessToken: createToken({ role: "Employer", userId: "15" }),
      role: "employer",
      userId: 15,
    });
    assert.equal(getAuthRole(), "employer");
    assert.ok(getAccessToken().includes("."));
  });

  it("updates an existing session", () => {
    storeAuthSession({
      accessToken: createToken({ role: "student", userId: 7 }),
    });

    updateAuthSession({ role: "teacher" });

    assert.deepEqual(getAuthSession(), {
      accessToken: createToken({ role: "student", userId: 7 }),
      role: "teacher",
      userId: 7,
    });
  });

  it("clears invalid stored JSON and returns null", () => {
    localStorageMock.setItem(STORAGE_KEY, "{broken");

    assert.equal(getAuthSession(), null);
    assert.equal(localStorageMock.getItem(STORAGE_KEY), null);
  });

  it("removes session from storage", () => {
    storeAuthSession({
      accessToken: createToken({ role: "student", userId: 3 }),
    });

    clearAuthSession();

    assert.equal(getAuthSession(), null);
    assert.equal(getAuthRole(), "");
    assert.equal(getAccessToken(), "");
  });
});
