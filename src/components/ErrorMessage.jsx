import React from "react";

const ErrorMessage = ({ error }) => {
  if (!error) return null;

  return (
    <div className="text-red-500 mb-4 font-semibold p-3 bg-red-50 rounded-lg border border-red-100">
      {error}
    </div>
  );
};

export default ErrorMessage;
