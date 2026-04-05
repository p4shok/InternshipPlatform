import React, { useRef, useState } from "react";
import { uploadStudentAvatar } from "../api/studentProfile.api";

const ACCEPTED_TYPES = [
    "image/png",
    "image/jpeg",
    "image/jpg",
    "image/webp",
];

const StudentAvatarUpload = ({ onUploadSuccess }) => {
    const inputRef = useRef(null);
    const [isUploading, setIsUploading] = useState(false);
    const [error, setError] = useState("");

    const handleFileChange = async (event) => {
        const file = event.target.files?.[0];
        if (!file) return;

        if (!ACCEPTED_TYPES.includes(file.type)) {
            setError("Допустимы только PNG, JPG, JPEG, WEBP.");
            return;
        }

        setError("");

        try {
            setIsUploading(true);
            const result = await uploadStudentAvatar(file);
            onUploadSuccess?.(result);
        } catch (err) {
            setError(
                err?.response?.data?.message || "Не удалось загрузить аватар."
            );
        } finally {
            setIsUploading(false);
            if (inputRef.current) {
                inputRef.current.value = "";
            }
        }
    };

    return (
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-slate-900">Аватар</h3>
            <p className="mt-1 text-sm text-slate-500">
                Загрузите изображение профиля.
            </p>

            <div className="mt-4 flex items-center gap-4">
                <button
                    type="button"
                    onClick={() => inputRef.current?.click()}
                    disabled={isUploading}
                    className="rounded-2xl bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-indigo-700 disabled:opacity-70"
                >
                    {isUploading ? "Загрузка..." : "Загрузить аватар"}
                </button>

                <input
                    ref={inputRef}
                    type="file"
                    accept=".png,.jpg,.jpeg,.webp"
                    className="hidden"
                    onChange={handleFileChange}
                />
            </div>

            {error && <p className="mt-3 text-sm text-red-500">{error}</p>}
        </div>
    );
};

export default StudentAvatarUpload;