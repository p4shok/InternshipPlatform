import React from "react";
import LoginForm from "../../auth/components/LoginForm";
import BackButton from "../../../components/shared/BackButton";
import AuthLayout from "../../../layouts/AuthLayout";
import { ROUTES } from "../../../routes/routePaths";

const StudentLoginPage = () => {
  return (
    <AuthLayout>
      <div className="w-full">
        <div className="mb-6">
          <BackButton to={ROUTES.STUDENT_AUTH} />
        </div>

        <div className="flex justify-center">
          <LoginForm role="student" />
        </div>
      </div>
    </AuthLayout>
  );
};

export default StudentLoginPage;