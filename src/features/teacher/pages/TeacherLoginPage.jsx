import React from "react";
import LoginForm from "../../auth/components/LoginForm";
import BackButton from "../../../components/shared/BackButton";
import AuthLayout from "../../../layouts/AuthLayout";
import { ROUTES } from "../../../routes/routePaths";

const TeacherLoginPage = () => {
  return (
    <AuthLayout>
      <div className="w-full">
        <div className="mb-6">
          <BackButton to={ROUTES.TEACHER_AUTH} />
        </div>

        <div className="flex justify-center">
          <LoginForm role="teacher" />
        </div>
      </div>
    </AuthLayout>
  );
};

export default TeacherLoginPage;
