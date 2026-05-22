const formatPersonName = (...parts) => parts.filter(Boolean).join(" ").trim();

export const mapChatListItem = (chat, role) => {
  const isStudent = role === "student";
  const counterpartName = isStudent
    ? chat?.companyName || "Компания"
    : formatPersonName(chat?.studentSurname, chat?.studentName, chat?.studentPatronymic) ||
      "Студент";

  return {
    id: chat?.id,
    vacancyId: chat?.vacancyId,
    vacancyTitle: chat?.vacancyTitle || "Вакансия",
    counterpartName,
    counterpartSubtitle: isStudent
      ? "Работодатель"
      : chat?.specializationName || "Соискатель",
    avatarUrl: isStudent ? chat?.companyLogoPath || "" : chat?.studentAvatarPath || "",
    unreadMessagesCount: chat?.unreadMessagesCount || 0,
    lastMessage: chat?.lastMessage || null,
    isClosed: Boolean(chat?.isClosed),
  };
};

export const mapChatDetails = (chat, role) => ({
  ...mapChatListItem(chat, role),
  messages: Array.isArray(chat?.messages) ? chat.messages : [],
});

export const isOwnMessage = (message, accessTokenPayload) =>
  Number(message?.senderUserId) ===
  Number(
    accessTokenPayload?.userId ||
      accessTokenPayload?.nameid ||
      accessTokenPayload?.[
        "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"
      ]
  );

export const parseJwtPayload = (token) => {
  if (!token) {
    return null;
  }

  try {
    const [, payload] = token.split(".");
    return JSON.parse(atob(payload.replace(/-/g, "+").replace(/_/g, "/")));
  } catch {
    return null;
  }
};
