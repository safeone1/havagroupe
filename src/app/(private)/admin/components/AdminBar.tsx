import React from "react";
import Link from "next/link";
import {
  Building2,
  Package,
  FolderOpen,
  Users,
  Settings,
  Home,
} from "lucide-react";

const AdminBar = () => {
  const navItems = [
    { name: "Dashboard", href: "/admin", icon: Home },
    { name: "Brands", href: "/admin/brands", icon: Building2 },
    { name: "Products", href: "/admin/products", icon: Package },
    { name: "Catalogues", href: "/admin/catalogues", icon: FolderOpen },
    { name: "Users", href: "/admin/users", icon: Users },
    { name: "Settings", href: "/admin/settings", icon: Settings },
  ];

  return (
    <aside className="w-64 bg-primary text-white min-h-screen p-6">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-white">Admin Panel</h2>
      </div>

      <nav className="space-y-2">
        {navItems.map((item) => {
          const IconComponent = item.icon;
          return (
            <Link
              key={item.name}
              href={item.href}
              className="flex items-center space-x-3 p-3 rounded-lg hover:bg-red-900 transition-colors duration-200"
            >
              <IconComponent size={20} />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
};

export default AdminBar;
