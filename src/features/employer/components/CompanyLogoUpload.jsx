import React, { useRef, useState } from "react";
import { deleteCompanyLogo, uploadCompanyLogo } from "../api/company.api";

const ACCEPTED_TYPES = [
    "image/png",
    "image/jpeg",
    "image/jpg",
    "image/webp",
];

const CompanyLogoUpload = ({ logoUrl, onUploadSuccess, onDeleteSuccess }) => {
    const inputRef = useRef(null);
    const [isUploading, setIsUploading] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
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
            const result = await uploadCompanyLogo(file);
            onUploadSuccess?.(result);
        } catch (err) {
            setError(err?.response?.data?.message || "Не удалось загрузить логотип.");
        } finally {
            setIsUploading(false);
            if (inputRef.current) {
                inputRef.current.value = "";
            }
        }
    };

    const handleDelete = async () => {
        try {
            setError("");
            setIsDeleting(true);
            await deleteCompanyLogo();
            onDeleteSuccess?.();
        } catch (err) {
            setError(err?.response?.data?.message || "Не удалось удалить логотип.");
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <section className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-center">
                <div className="flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-3xl border border-slate-200 bg-slate-50">
                    {logoUrl ? (
                        <img
                            src={logoUrl}
                            alt="Логотип компании"
                            className="h-full w-full object-cover"
                        />
                    ) : (
                        <span className="text-xs font-medium text-slate-400">LOGO</span>
                    )}
                </div>

                <div className="min-w-0 flex-1">
                    <h2 className="text-xl font-semibold text-slate-900">
                        Логотип компании
                    </h2>
                    <p className="mt-2 text-sm leading-6 text-slate-500">
                        Загрузите логотип компании, чтобы профиль выглядел профессиональнее и
                        узнаваемее.
                    </p>

                    <div className="mt-4 flex flex-wrap gap-3">
                        <button
                            type="button"
                            onClick={() => inputRef.current?.click()}
                            disabled={isUploading}
                            className="rounded-2xl bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white shadow-lg shadow-indigo-200 transition hover:bg-indigo-700 disabled:opacity-70"
                        >
                            {isUploading ? "Загрузка..." : "Загрузить логотип"}
                        </button>

                        <button
                            type="button"
                            onClick={handleDelete}
                            disabled={isDeleting}
                            className="rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:opacity-70"
                        >
                            {isDeleting ? "Удаление..." : "Удалить логотип"}
                        </button>
                    </div>

                    <input
                        ref={inputRef}
                        type="file"
                        accept=".png,.jpg,.jpeg,.webp"
                        className="hidden"
                        onChange={handleFileChange}
                    />

                    {error && <p className="mt-3 text-sm text-red-500">{error}</p>}
                </div>
            </div>
        </section>
    );
};

export default CompanyLogoUpload;