const AUTH_SESSION_KEY = "internship-platform-auth-session";
const ROLE_CLAIM = "http://schemas.microsoft.com/ws/2008/06/identity/claims/role";

const readStorage = () => {
  if (typeof window === "undefined") {
    return null;
  }

  return window.localStorage;
};

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

const enrichSession = (session) => {
  if (!session?.accessToken) {
    return session;
  }

  const payload = parseJwtPayload(session.accessToken);
  const role = (
    session.role ||
    payload?.role ||
    payload?.[ROLE_CLAIM] ||
    ""
  ).toString().toLowerCase();

  const userId = Number(
    session.userId ||
      payload?.userId ||
      payload?.nameid ||
      payload?.[
        "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"
      ]
  );

  return {
    ...session,
    role,
    userId: Number.isFinite(userId) ? userId : null,
  };
};

export const getAuthSession = () => {
  const storage = readStorage();

  if (!storage) {
    return null;
  }

  const rawSession = storage.getItem(AUTH_SESSION_KEY);

  if (!rawSession) {
    return null;
  }

  try {
    return enrichSession(JSON.parse(rawSession));
  } catch {
    storage.removeItem(AUTH_SESSION_KEY);
    return null;
  }
};

export const storeAuthSession = (session) => {
  const storage = readStorage();

  if (!storage || !session) {
    return;
  }

  storage.setItem(AUTH_SESSION_KEY, JSON.stringify(enrichSession(session)));
};

export const updateAuthSession = (patch) => {
  const currentSession = getAuthSession();

  if (!currentSession) {
    return;
  }

  storeAuthSession({
    ...currentSession,
    ...patch,
  });
};

export const clearAuthSession = () => {
  const storage = readStorage();

  if (!storage) {
    return;
  }

  storage.removeItem(AUTH_SESSION_KEY);
};

export const getAccessToken = () => getAuthSession()?.accessToken || "";
export const getAuthRole = () => getAuthSession()?.role || "";
