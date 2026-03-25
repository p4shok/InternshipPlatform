import React from "react";

const PageContainer = ({ children }) => {
  return (
    <div className="w-full max-w-6xl mx-auto px-4">
      {children}
    </div>
  );
};

export default PageContainer;