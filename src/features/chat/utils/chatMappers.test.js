import assert from "node:assert/strict";
import { describe, it } from "vitest";

import {
  isOwnMessage,
  mapChatDetails,
  mapChatListItem,
  parseJwtPayload,
} from "./chatMappers.js";

const encodeJwtPayload = (payload) =>
  btoa(JSON.stringify(payload)).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");

describe("chatMappers", () => {
  it("maps student chat list item", () => {
    assert.deepEqual(
      mapChatListItem(
        {
          id: 1,
          companyName: "Acme",
          companyLogoPath: "/logo.png",
          vacancyTitle: "Intern",
          unreadMessagesCount: 2,
        },
        "student",
      ),
      {
      id: 1,
      vacancyId: undefined,
      vacancyTitle: "Intern",
      counterpartName: "Acme",
      counterpartSubtitle: "Работодатель",
      avatarUrl: "/logo.png",
      unreadMessagesCount: 2,
      lastMessage: null,
      isClosed: false,
    });
  });

  it("maps employer chat details with student fallback values", () => {
    const details = mapChatDetails(
      {
        studentName: "Ivan",
        studentSurname: "Ivanov",
        specializationName: "Frontend",
        messages: [{ id: 1 }],
      },
      "employer",
    );

    assert.equal(details.counterpartName, "Ivanov Ivan");
    assert.equal(details.counterpartSubtitle, "Frontend");
    assert.deepEqual(details.messages, [{ id: 1 }]);
  });

  it("detects own message by payload user id", () => {
    assert.equal(
      isOwnMessage(
        { senderUserId: "18" },
        { "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier": "18" },
      ),
      true,
    );
  });

  it("parses JWT payload and returns null for broken token", () => {
    const token = `header.${encodeJwtPayload({ userId: 4 })}.signature`;

    assert.deepEqual(parseJwtPayload(token), { userId: 4 });
    assert.equal(parseJwtPayload("broken"), null);
  });
});
