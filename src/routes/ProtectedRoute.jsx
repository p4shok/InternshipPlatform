import React, { useEffect, useMemo, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { getAuthSession, updateAuthSession } from "../features/auth/utils/session";
import { getCurrentStudentProfile } from "../features/student/api/studentProfile.api";
import { ROUTES } from "./routePaths";

const defaultRouteByRole = (role, hasGroup) => {
  switch (role) {
    case "student":
      return hasGroup ? ROUTES.STUDENT_VACANCIES : ROUTES.STUDENT_PROFILE;
    case "employer":
      return ROUTES.EMPLOYER_PROFILE;
    case "teacher":
      return ROUTES.TEACHER_CABINET;
    default:
      return ROUTES.HOME;
  }
};

const ProtectedRoute = ({
  children,
  fallbackPath,
  allowedRoles = [],
  requireGroup = false,
}) => {
  const location = useLocation();
  const session = getAuthSession();
  const normalizedAllowedRoles = useMemo(
    () => allowedRoles.map((role) => role.toLowerCase()),
    [allowedRoles]
  );
  const shouldResolveGroupAccess =
    requireGroup &&
    session?.role === "student" &&
    typeof session?.hasGroup !== "boolean";
  const [resolvedHasGroup, setResolvedHasGroup] = useState(null);
  const effectiveHasGroup =
    typeof session?.hasGroup === "boolean" ? session.hasGroup : resolvedHasGroup;
  const isCheckingGroupAccess =
    shouldResolveGroupAccess && resolvedHasGroup === null;

  useEffect(() => {
    let isMounted = true;

    if (!shouldResolveGroupAccess) {
      return undefined;
    }

    getCurrentStudentProfile()
      .then((profile) => {
        if (!isMounted) {
          return;
        }

        const hasGroup = Boolean(profile?.hasGroup);
        updateAuthSession({ hasGroup });
        setResolvedHasGroup(hasGroup);
      })
      .catch(() => {
        if (!isMounted) {
          return;
        }

        setResolvedHasGroup(false);
      });

    return () => {
      isMounted = false;
    };
  }, [shouldResolveGroupAccess]);

  if (!session?.accessToken) {
    return <Navigate to={fallbackPath} replace state={{ from: location }} />;
  }

  if (
    normalizedAllowedRoles.length > 0 &&
    !normalizedAllowedRoles.includes(session?.role || "")
  ) {
    return (
      <Navigate
        to={defaultRouteByRole(session?.role, session?.hasGroup)}
        replace
      />
    );
  }

  if (isCheckingGroupAccess) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4 text-sm text-slate-500">
        Проверяем доступ...
      </div>
    );
  }

  if (requireGroup && session?.role === "student" && !effectiveHasGroup) {
    return <Navigate to={ROUTES.STUDENT_PROFILE} replace />;
  }

  return children;
};

export default ProtectedRoute;
