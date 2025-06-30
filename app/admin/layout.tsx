"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/store/hooks";
import {
  Home,
  Ticket,
  Users,
  MessageSquare,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { useAppDispatch } from "@/store/hooks";
import { logout } from "@/store/slices/authSlice";
import { useRouter } from "next/navigation";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { user } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    dispatch(logout());
    router.push("/");
  };

  const navItems = [
    {
      label: "Dashboard",
      href: "/admin/dashboard",
      icon: Home,
    },
    {
      label: "Tickets",
      href: "/admin/tickets",
      icon: Ticket,
    },
    {
      label: "Messages",
      href: "/admin/messages",
      icon: MessageSquare,
    },
    {
      label: "Utilisateurs",
      href: "/admin/users",
      icon: Users,
    },
  ];

  const isActive = (href: string) => pathname === href;

  return (
    <>
      <div className="min-h-screen bg-gray-100">
        {/* Header Mobile */}
        <div className="lg:hidden bg-white shadow-sm">
          <div className="flex items-center justify-between p-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 hover:bg-gray-100 rounded"
            >
              {sidebarOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
            <h1 className="text-xl font-bold text-primary">Admin</h1>
            <div className="w-10" /> {/* Spacer pour centrer le titre */}
          </div>
        </div>

        <div className="flex">
          {/* Sidebar */}
          <aside
            className={`${
              sidebarOpen ? "translate-x-0" : "-translate-x-full"
            } lg:translate-x-0 fixed lg:relative w-64 bg-white shadow-md min-h-screen z-40 transition-transform duration-300 ease-in-out`}
          >
            <div className="p-6 hidden lg:block">
              <h2 className="text-2xl font-bold text-primary">Admin Panel</h2>
              <p className="text-gray-600 text-sm mt-1">Techrescue247</p>
            </div>

            <nav className="px-4 py-2">
              {navItems.map((item) => (
                <Link key={item.href} href={item.href}>
                  <Button
                    variant={isActive(item.href) ? "secondary" : "ghost"}
                    className="w-full justify-start mb-1"
                    onClick={() => setSidebarOpen(false)}
                  >
                    <item.icon className="w-4 h-4 mr-3" />
                    {item.label}
                  </Button>
                </Link>
              ))}
            </nav>

            <div className="absolute bottom-0 left-0 right-0 p-4">
              <div className="bg-gray-50 rounded-lg p-3 mb-4">
                <p className="text-sm text-gray-600">Connecté en tant que</p>
                <p className="font-medium">{user?.name}</p>
                <p className="text-xs text-gray-500">{user?.email}</p>
              </div>
              <Button
                variant="outline"
                className="w-full"
                onClick={handleLogout}
              >
                <LogOut className="w-4 h-4 mr-2" />
                Déconnexion
              </Button>
              <Link href="/admin/users" onClick={() => setSidebarOpen(false)}>
                <Button variant="ghost" className="w-full justify-start">
                  <Users className="w-4 h-4 mr-2" />
                  Utilisateurs
                </Button>
              </Link>
            </div>
          </aside>
          {/* Main content */}
          <main className="flex-1 p-4 lg:p-8 w-full">{children}</main>
        </div>
      </div>
    </>
  );
}
