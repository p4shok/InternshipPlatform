import React from "react";

const AuthLayout = ({ children }) => {
  return (
    <main className="min-h-screen bg-slate-50 px-4 py-10">
      <div className="mx-auto flex min-h-[calc(100vh-5rem)] max-w-6xl items-center justify-center">
        {children}
      </div>
    </main>
  );
};

export default AuthLayout;