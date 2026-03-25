import React from "react";
import StudentRegisterForm from "../components/StudentRegisterForm";
import BackButton from "../../../components/shared/BackButton";
import AuthLayout from "../../../layouts/AuthLayout";
import { ROUTES } from "../../../routes/routePaths";

const StudentRegisterPage = () => {
  return (
    <AuthLayout>
      <div className="w-full">
        <div className="mb-6">
          <BackButton to={ROUTES.STUDENT_AUTH} />
        </div>

        <div className="flex justify-center">
          <StudentRegisterForm />
        </div>
      </div>
    </AuthLayout>
  );
};

export default StudentRegisterPage;