"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  Building2,
  Package,
  FolderOpen,
  Users,
  Settings,
  Home,
  Layers2,
  LogOut,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { redirect } from "next/navigation";

const AdminBar = () => {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const navItems = [
    { name: "Dashboard", href: "/admin", icon: Home },
    { name: "Brands", href: "/admin/brands", icon: Building2 },
    { name: "Products", href: "/admin/products", icon: Package },
    { name: "Categories", href: "/admin/categories", icon: Layers2 },
    { name: "Catalogues", href: "/admin/catalogues", icon: FolderOpen },
    // { name: "Users", href: "/admin/users", icon: Users },
    // { name: "Settings", href: "/admin/settings", icon: Settings },
  ];

  return (
    <aside
      className={`${
        isCollapsed ? "w-16" : "w-64"
      } bg-gradient-to-b from-[#911828] to-[#6b1220] text-white h-full flex flex-col transition-all duration-300 ease-in-out relative shadow-2xl`}
    >
      {/* Collapse Button */}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute -right-3 top-8 bg-white text-[#911828] rounded-full p-1.5 shadow-lg hover:shadow-xl transition-all duration-200 z-10"
      >
        {isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
      </button>

      {/* Logo Section */}
      <div className="p-6 border-b border-white/10">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center backdrop-blur-sm">
            <Image
              src="/hava_logo.svg"
              alt="HAVA"
              width={24}
              height={24}
              className="text-white"
            />
          </div>
          {!isCollapsed && (
            <div>
              <h2 className="text-xl font-bold text-white">Admin Panel</h2>
              <p className="text-white/70 text-xs">HAVA HARD TRADE</p>
            </div>
          )}
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {navItems.map((item) => {
          const IconComponent = item.icon;
          const isActive =
            pathname === item.href || pathname.startsWith(item.href + "/");

          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center ${
                isCollapsed ? "justify-center" : "space-x-3"
              } p-3 rounded-xl transition-all duration-200 group relative overflow-hidden ${
                isActive
                  ? "bg-white/20 text-white shadow-lg"
                  : "hover:bg-white/10 text-white/80 hover:text-white"
              }`}
            >
              {/* Active indicator */}
              {isActive && (
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-white rounded-r-full"></div>
              )}

              {/* Hover effect background */}
              <div className="absolute inset-0 bg-gradient-to-r from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>

              <IconComponent
                size={20}
                className="relative z-10 flex-shrink-0"
              />
              {!isCollapsed && (
                <span className="relative z-10 font-medium">{item.name}</span>
              )}

              {/* Tooltip for collapsed state */}
              {isCollapsed && (
                <div className="absolute left-full ml-3 px-2 py-1 bg-gray-900 text-white text-sm rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
                  {item.name}
                </div>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Bottom Section */}
      <div className="p-4 border-t border-white/10 flex-shrink-0">
        <button
          onClick={() =>
            authClient.signOut({
              fetchOptions: {
                onSuccess: () => {
                  redirect("/"); // redirect to login page
                },
              },
            })
          }
          className={`flex items-center ${
            isCollapsed ? "justify-center" : "space-x-3"
          } w-full p-3 rounded-xl hover:bg-white/10 text-white/80 hover:text-white transition-all duration-200 group relative`}
        >
          <LogOut size={20} className="flex-shrink-0" />
          {!isCollapsed && <span className="font-medium">Logout</span>}

          {/* Tooltip for collapsed state */}
          {isCollapsed && (
            <div className="absolute left-full ml-3 px-2 py-1 bg-gray-900 text-white text-sm rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
              Logout
            </div>
          )}
        </button>
      </div>
    </aside>
  );
};

export default AdminBar;
