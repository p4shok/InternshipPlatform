import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthLayout from "../../../layouts/AuthLayout";
import { ROUTES } from "../../../routes/routePaths";
import {
    deleteStudentProfile,
    logoutStudent,
} from "../api/studentProfile.api";
import StudentAvatarUpload from "../components/StudentAvatarUpload";
import StudentProfileForm from "../components/StudentProfileForm";
import StudentProfileHeader from "../components/StudentProfileHeader";

const StudentProfilePage = () => {
    const navigate = useNavigate();
    const [isDeleting, setIsDeleting] = useState(false);
    const [isLoggingOut, setIsLoggingOut] = useState(false);

    const handleLogout = async () => {
        try {
            setIsLoggingOut(true);
            await logoutStudent();
            navigate(ROUTES.STUDENT_LOGIN);
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoggingOut(false);
        }
    };

    const handleDelete = async () => {
        const confirmed = window.confirm(
            "Вы уверены, что хотите удалить аккаунт?"
        );

        if (!confirmed) return;

        try {
            setIsDeleting(true);
            await deleteStudentProfile();
            navigate(ROUTES.HOME);
        } catch (error) {
            console.error(error);
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <AuthLayout>
            <div className="w-full space-y-6">
                <StudentProfileHeader
                    onLogout={handleLogout}
                    onDelete={handleDelete}
                    isDeleting={isDeleting}
                    isLoggingOut={isLoggingOut}
                />

                <StudentAvatarUpload onUploadSuccess={() => {}} />

                <StudentProfileForm />
            </div>
        </AuthLayout>
    );
};

export default StudentProfilePage;