import React from "react";
import { Building2, Package, FolderOpen, Users } from "lucide-react";
import { getBrandCount } from "@/lib/actions/brands";
import { getProductCount } from "@/lib/actions/products";

const AdminDashboard = async () => {
  const stats = [
    {
      name: "Total Brands",
      value: await getBrandCount(),
      icon: Building2,
      color: "bg-blue-500",
    },
    {
      name: "Total Products",
      value: await getProductCount(),
      icon: Package,
      color: "bg-green-500",
    },
    {
      name: "Total Catalogues",
      value: "300",
      icon: FolderOpen,
      color: "bg-purple-500",
    },
    { name: "Total Users", value: "1", icon: Users, color: "bg-orange-500" },
  ];

  return (
    <div className="flex-1 p-8 bg-gray-50">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="text-gray-600 mt-2">Welcome to the admin panel</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat) => {
          const IconComponent = stat.icon;
          return (
            <div key={stat.name} className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className={`${stat.color} rounded-lg p-3`}>
                  <IconComponent className="h-6 w-6 text-white" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">
                    {stat.name}
                  </p>
                  <p className="text-2xl font-semibold text-gray-900">
                    {stat.value}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Recent Activity
          </h2>
          <p className="text-gray-600">No recent activity to display.</p>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
