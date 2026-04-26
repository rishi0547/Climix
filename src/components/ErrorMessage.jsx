import React from "react";

const ErrorMessage = ({ error, theme }) => {
  if (!error) return null;

  const isDark = theme === "dark";

  return (
    <div className={`fixed top-20 left-1/2 -translate-x-1/2 z-50 px-6 py-3 backdrop-blur-md border rounded-xl text-sm font-medium shadow-lg animate-fade-in ${
      isDark
        ? "bg-red-500/20 border-red-400/30 text-red-200"
        : "bg-red-50/90 border-red-300 text-red-700"
    }`}>
      {error}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translate(-50%, -10px); }
          to { opacity: 1; transform: translate(-50%, 0); }
        }
        .animate-fade-in {
          animation: fadeIn 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default ErrorMessage;
