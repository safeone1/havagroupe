import React from "react";
import { LucideIcon } from "lucide-react";

interface AdminPageLayoutProps {
  title: string;
  description: string;
  icon: LucideIcon;
  children: React.ReactNode;
  actions?: React.ReactNode;
}

const AdminPageLayout = ({
  title,
  description,
  icon: Icon,
  children,
  actions,
}: AdminPageLayoutProps) => {
  return (
    <div className="flex flex-col h-full bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header Section */}
      <div className="bg-white border-b border-gray-200 px-8 py-6 flex-shrink-0">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-[#911828] to-[#6b1220] bg-clip-text text-transparent">
              {title}
            </h1>
            <p className="text-gray-600 mt-2 flex items-center">
              <Icon className="w-4 h-4 mr-2" />
              {description}
            </p>
          </div>
          {actions && (
            <div className="flex items-center space-x-4">{actions}</div>
          )}
        </div>
      </div>

      <div className="flex-1 min-h-0 overflow-y-auto">
        <div className="p-8">{children}</div>
      </div>
    </div>
  );
};

export default AdminPageLayout;
