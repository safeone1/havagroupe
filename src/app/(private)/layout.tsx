import React from "react";
import AdminBar from "./admin/components/AdminBar";

interface Props {
  children: React.ReactNode;
}

const layout = ({ children }: Props) => {
  return (
    <div className="flex min-h-screen bg-gray-100">
      <AdminBar />
      {children}
    </div>
  );
};

export default layout;
