import React from "react";
import { useNavigate } from "react-router-dom";

const BackButton = ({ to }) => {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate(to)}
      className="text-sm font-medium text-slate-500 transition hover:text-slate-800"
    >
      ← Назад
    </button>
  );
};

export default BackButton;