"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Home, Ticket, LogOut, Menu, X } from "lucide-react";
import { AuthGuard } from "@/components/auth/AuthGuard";
import { useAppDispatch, useAuth } from "@/store/hooks";
import { logout } from "@/store/slices/authSlice";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { user } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleLogout = () => {
    dispatch(logout());
    router.push("/login");
  };

  return (
    <AuthGuard>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white shadow-sm sticky top-0 z-50">
          <div className="px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center">
                <button
                  onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                  className="lg:hidden p-2"
                >
                  {isSidebarOpen ? <X /> : <Menu />}
                </button>
                <h1 className="text-2xl font-bold text-primary ml-2">
                  Techrescue247
                </h1>
              </div>
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-600">
                  Bonjour, {user?.name}
                </span>
                <Button variant="ghost" onClick={handleLogout}>
                  <LogOut className="w-4 h-4 mr-2" />
                  Déconnexion
                </Button>
              </div>
            </div>
          </div>
        </header>

        <div className="flex">
          {/* Sidebar */}
          <aside
            className={`${
              isSidebarOpen ? "block" : "hidden"
            } lg:block w-64 bg-white shadow-md min-h-screen fixed lg:relative z-40`}
          >
            <nav className="p-4 space-y-2">
              <Link href="/dashboard" onClick={() => setIsSidebarOpen(false)}>
                <Button variant="ghost" className="w-full justify-start">
                  <Home className="w-4 h-4 mr-2" />
                  Tableau de bord
                </Button>
              </Link>
              <Link
                href="/dashboard/tickets"
                onClick={() => setIsSidebarOpen(false)}
              >
                <Button variant="ghost" className="w-full justify-start">
                  <Ticket className="w-4 h-4 mr-2" />
                  Mes tickets
                </Button>
              </Link>
              <Link
                href="/dashboard/tickets/new"
                onClick={() => setIsSidebarOpen(false)}
              >
                <Button className="w-full">Créer un ticket</Button>
              </Link>
            </nav>
          </aside>

          {/* Main content */}
          <main className="flex-1 p-6">{children}</main>
        </div>
      </div>
    </AuthGuard>
  );
}
