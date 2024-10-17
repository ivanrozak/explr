import React from "react";

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex min-h-screen flex-col items-center sm:justify-center sm:bg-ex_artboard">
      {children}
    </div>
  );
};

export default AuthLayout;
