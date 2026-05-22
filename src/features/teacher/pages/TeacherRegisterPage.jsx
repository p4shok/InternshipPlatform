import React from "react";
import BackButton from "../../../components/shared/BackButton";
import AuthLayout from "../../../layouts/AuthLayout";
import { ROUTES } from "../../../routes/routePaths";
import TeacherRegisterForm from "../components/TeacherRegisterForm";

const TeacherRegisterPage = () => {
  return (
    <AuthLayout>
      <div className="w-full">
        <div className="mb-6">
          <BackButton to={ROUTES.TEACHER_AUTH} />
        </div>

        <div className="flex justify-center">
          <TeacherRegisterForm />
        </div>
      </div>
    </AuthLayout>
  );
};

export default TeacherRegisterPage;
