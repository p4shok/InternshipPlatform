import React from "react";

const AuthInput = ({
  label,
  type = "text",
  name,
  value,
  onChange,
  placeholder,
  error,
  autoComplete,
}) => {
  return (
    <div className="space-y-2">
      <label
        htmlFor={name}
        className="block text-sm font-medium text-slate-700"
      >
        {label}
      </label>

      <input
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        autoComplete={autoComplete}
        className={`w-full rounded-2xl border bg-white px-4 py-3 text-sm text-slate-900 shadow-sm outline-none transition-all duration-200 placeholder:text-slate-400
          ${
            error
              ? "border-red-400 ring-4 ring-red-100 focus:border-red-500"
              : "border-slate-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
          }`}
      />

      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
};

export default AuthInput;