import React from "react";
import EmployerRegisterForm from "../components/EmployerRegisterForm";
import BackButton from "../../../components/shared/BackButton";
import AuthLayout from "../../../layouts/AuthLayout";
import { ROUTES } from "../../../routes/routePaths";

const EmployerRegisterPage = () => {
  return (
    <AuthLayout>
      <div className="w-full">
        <div className="mb-6">
          <BackButton to={ROUTES.EMPLOYER_AUTH} />
        </div>

        <div className="flex justify-center">
          <EmployerRegisterForm />
        </div>
      </div>
    </AuthLayout>
  );
};

export default EmployerRegisterPage;