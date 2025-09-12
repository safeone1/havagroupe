import React from "react";
import {
  Building2,
  Package,
  FolderOpen,
  TrendingUp,
  Activity,
  Calendar,
  Clock,
} from "lucide-react";
import { getBrandCount } from "@/lib/actions/brands";
import { getProductCount } from "@/lib/actions/products";
import { getCatalogueCount } from "@/lib/actions/catalogues";
import { getCategoryCount } from "@/lib/actions/categories";

const AdminDashboard = async () => {
  const stats = [
    {
      name: "Total Brands",
      value: await getBrandCount(),
      icon: Building2,
      color: "from-blue-500 to-blue-600",
      change: "+12%",
      trend: "up",
    },
    {
      name: "Total Products",
      value: await getProductCount(),
      icon: Package,
      color: "from-green-500 to-green-600",
      change: "+8%",
      trend: "up",
    },
    {
      name: "Total Categories",
      value: await getCategoryCount(),
      icon: FolderOpen,
      color: "from-purple-500 to-purple-600",
      change: "+3%",
      trend: "up",
    },
    {
      name: "Total Catalogues",
      value: await getCatalogueCount(),
      icon: FolderOpen,
      color: "from-orange-500 to-orange-600",
      change: "+5%",
      trend: "up",
    },
  ];

  const quickActions = [
    { name: "Add New Product", href: "/admin/products/create", icon: Package },
    { name: "Add New Brand", href: "/admin/brands/create", icon: Building2 },
    {
      name: "Add Category",
      href: "/admin/categories/create",
      icon: FolderOpen,
    },
    {
      name: "Add Catalogue",
      href: "/admin/catalogues/create",
      icon: FolderOpen,
    },
  ];

  return (
    <div className="flex flex-col h-full bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header Section */}
      <div className="bg-white border-b border-gray-200 px-8 py-6 flex-shrink-0">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-[#911828] to-[#6b1220] bg-clip-text text-transparent">
              Admin Dashboard
            </h1>
            <p className="text-gray-600 mt-2 flex items-center">
              <Calendar className="w-4 h-4 mr-2" />
              Welcome back! Here&apos;s what&apos;s happening with your store
              today.
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="bg-gradient-to-r from-[#911828] to-[#6b1220] text-white px-4 py-2 rounded-lg flex items-center space-x-2">
              <Activity className="w-4 h-4" />
              <span className="text-sm font-medium">Live Status</span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 min-h-0 overflow-y-auto">
        <div className="p-8">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat) => {
              const IconComponent = stat.icon;
              return (
                <div key={stat.name} className="group">
                  <div className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 p-6 border border-gray-100 hover:border-[#911828]/20 transform hover:-translate-y-1">
                    <div className="flex items-center justify-between mb-4">
                      <div
                        className={`bg-gradient-to-r ${stat.color} rounded-xl p-3 shadow-lg`}
                      >
                        <IconComponent className="h-6 w-6 text-white" />
                      </div>
                      <div className="flex items-center text-green-600 text-sm font-medium">
                        <TrendingUp className="w-3 h-3 mr-1" />
                        {stat.change}
                      </div>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600 mb-1">
                        {stat.name}
                      </p>
                      <p className="text-3xl font-bold text-gray-900">
                        {stat.value}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Quick Actions & Recent Activity Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Quick Actions */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                <Clock className="w-5 h-5 mr-2 text-[#911828]" />
                Quick Actions
              </h2>
              <div className="grid grid-cols-2 gap-4">
                {quickActions.map((action) => {
                  const IconComponent = action.icon;
                  return (
                    <a
                      key={action.name}
                      href={action.href}
                      className="group p-4 rounded-xl border-2 border-dashed border-gray-200 hover:border-[#911828] transition-all duration-300 text-center hover:bg-[#911828]/5"
                    >
                      <IconComponent className="w-8 h-8 mx-auto mb-2 text-gray-400 group-hover:text-[#911828] transition-colors" />
                      <p className="text-sm font-medium text-gray-600 group-hover:text-[#911828] transition-colors">
                        {action.name}
                      </p>
                    </a>
                  );
                })}
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                <Activity className="w-5 h-5 mr-2 text-[#911828]" />
                Recent Activity
              </h2>
              <div className="space-y-4">
                <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">
                      System initialized
                    </p>
                    <p className="text-xs text-gray-500">
                      Welcome to your dashboard
                    </p>
                  </div>
                  <span className="text-xs text-gray-400">Just now</span>
                </div>
                <div className="text-center py-8 text-gray-500">
                  <Activity className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                  <p className="text-sm">No recent activity yet</p>
                  <p className="text-xs">
                    Activity will appear here as you manage your store
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
