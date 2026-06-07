import assert from "node:assert/strict";
import { afterEach, beforeEach, describe, it } from "vitest";

import api from "../../../api/axios.js";
import { AUTH_ENDPOINTS, STUDENT_PROFILE_ENDPOINTS } from "../../../api/endpoints.js";
import {
  getAuthSession,
  clearAuthSession,
} from "../utils/session.js";
import {
  loginEmployer,
  loginStudent,
  loginTeacher,
  registerEmployer,
  registerStudent,
  registerTeacher,
} from "./auth.api.js";

const encodeJwtPayload = (payload) =>
  btoa(JSON.stringify(payload)).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");

const createToken = (payload) => `header.${encodeJwtPayload(payload)}.signature`;

describe("auth api", () => {
  let localStorageMock;
  let originalPost;
  let originalGet;

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
    };

    globalThis.window = { localStorage: localStorageMock };

    originalPost = api.post;
    originalGet = api.get;
  });

  afterEach(() => {
    api.post = originalPost;
    api.get = originalGet;
    clearAuthSession();
    delete globalThis.window;
  });

  it("registers a student, stores tokens and adds group flag from profile", async () => {
    const token = createToken({ role: "Student", userId: 11 });
    const payload = {
      name: "Ivan",
      surname: "Ivanov",
      email: "student@example.com",
      password: "Secret1",
      passwordConfirm: "Secret1",
    };

    api.post = async (url, body) => {
      assert.equal(url, AUTH_ENDPOINTS.REGISTER_STUDENT);
      assert.deepEqual(body, payload);
      return {
        data: {
          accessToken: token,
          refreshToken: "refresh-student",
        },
      };
    };

    api.get = async (url) => {
      assert.equal(url, STUDENT_PROFILE_ENDPOINTS.CURRENT);
      return { data: { hasGroup: true } };
    };

    const result = await registerStudent(payload);

    assert.deepEqual(result, {
      accessToken: token,
      refreshToken: "refresh-student",
    });
    assert.deepEqual(getAuthSession(), {
      accessToken: token,
      refreshToken: "refresh-student",
      role: "student",
      userId: 11,
      hasGroup: true,
    });
  });

  it("registers an employer and stores the auth session without loading a student profile", async () => {
    const token = createToken({ role: "Employer", userId: 22 });
    const payload = {
      email: "company@example.com",
      companyName: "Acme",
      inn: "1234567890",
      password: "Secret1",
      passwordConfirm: "Secret1",
    };

    api.post = async (url, body) => {
      assert.equal(url, AUTH_ENDPOINTS.REGISTER_EMPLOYER);
      assert.deepEqual(body, payload);
      return { data: { accessToken: token } };
    };

    api.get = async () => {
      throw new Error("student profile should not be requested");
    };

    const result = await registerEmployer(payload);

    assert.deepEqual(result, { accessToken: token });
    assert.deepEqual(getAuthSession(), {
      accessToken: token,
      refreshToken: "",
      role: "employer",
      userId: 22,
    });
  });

  it("registers a teacher and stores the auth session", async () => {
    const token = createToken({ role: "Teacher", userId: 33 });
    const payload = {
      name: "Anna",
      surname: "Petrova",
      email: "teacher@example.com",
      password: "Secret1",
      passwordConfirm: "Secret1",
      universityId: 7,
    };

    api.post = async (url, body) => {
      assert.equal(url, AUTH_ENDPOINTS.REGISTER_TEACHER);
      assert.deepEqual(body, payload);
      return { data: { accessToken: token, refreshToken: "refresh-teacher" } };
    };

    const result = await registerTeacher(payload);

    assert.deepEqual(result, {
      accessToken: token,
      refreshToken: "refresh-teacher",
    });
    assert.deepEqual(getAuthSession(), {
      accessToken: token,
      refreshToken: "refresh-teacher",
      role: "teacher",
      userId: 33,
    });
  });

  it("logs in a student and updates the session with an empty group flag", async () => {
    const token = createToken({ role: "Student", userId: 44 });
    const payload = {
      email: "student@example.com",
      password: "Secret1",
    };

    api.post = async (url, body) => {
      assert.equal(url, AUTH_ENDPOINTS.LOGIN);
      assert.deepEqual(body, payload);
      return { data: { accessToken: token, refreshToken: "refresh-login" } };
    };

    api.get = async (url) => {
      assert.equal(url, STUDENT_PROFILE_ENDPOINTS.CURRENT);
      return { data: { hasGroup: 0 } };
    };

    const result = await loginStudent(payload);

    assert.deepEqual(result, {
      accessToken: token,
      refreshToken: "refresh-login",
    });
    assert.deepEqual(getAuthSession(), {
      accessToken: token,
      refreshToken: "refresh-login",
      role: "student",
      userId: 44,
      hasGroup: false,
    });
  });

  it("logs in an employer through the shared login endpoint", async () => {
    const token = createToken({ role: "Employer", userId: 55 });

    api.post = async (url, body) => {
      assert.equal(url, AUTH_ENDPOINTS.LOGIN);
      assert.deepEqual(body, {
        email: "employer@example.com",
        password: "Secret1",
      });
      return { data: { accessToken: token } };
    };

    const result = await loginEmployer({
      email: "employer@example.com",
      password: "Secret1",
    });

    assert.deepEqual(result, { accessToken: token });
    assert.deepEqual(getAuthSession(), {
      accessToken: token,
      refreshToken: "",
      role: "employer",
      userId: 55,
    });
  });

  it("logs in a teacher through the shared login endpoint", async () => {
    const token = createToken({ role: "Teacher", userId: 66 });

    api.post = async (url, body) => {
      assert.equal(url, AUTH_ENDPOINTS.LOGIN);
      assert.deepEqual(body, {
        email: "teacher@example.com",
        password: "Secret1",
      });
      return { data: { accessToken: token, refreshToken: "teacher-refresh" } };
    };

    const result = await loginTeacher({
      email: "teacher@example.com",
      password: "Secret1",
    });

    assert.deepEqual(result, {
      accessToken: token,
      refreshToken: "teacher-refresh",
    });
    assert.deepEqual(getAuthSession(), {
      accessToken: token,
      refreshToken: "teacher-refresh",
      role: "teacher",
      userId: 66,
    });
  });
});
