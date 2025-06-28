"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Home, Ticket, LogOut, Menu, X } from "lucide-react";
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

  // Fermer la sidebar quand on clique en dehors sur mobile
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsSidebarOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Overlay pour fermer la sidebar sur mobile
  const closeSidebar = () => setIsSidebarOpen(false);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50 border-b">
        <div className="px-3 sm:px-4 lg:px-6">
          <div className="flex justify-between items-center h-14 sm:h-16">
            <div className="flex items-center">
              <button
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="lg:hidden p-2 hover:bg-gray-100 rounded-md transition-colors"
                aria-label="Toggle menu"
              >
                {isSidebarOpen ? (
                  <X className="w-5 h-5" />
                ) : (
                  <Menu className="w-5 h-5" />
                )}
              </button>
              <Link
                href={"/"}
                className="text-lg sm:text-xl lg:text-2xl font-bold text-primary ml-2 truncate"
              >
                Techrescue247
              </Link>
            </div>

            <div className="flex items-center space-x-2 sm:space-x-4">
              <span className="text-xs sm:text-sm text-gray-600 hidden sm:block">
                Bonjour, {user?.name}
              </span>
              <span className="text-xs text-gray-600 sm:hidden">
                {user?.name}
              </span>
              <Button
                variant="ghost"
                onClick={handleLogout}
                size="sm"
                className="text-xs sm:text-sm"
              >
                <LogOut className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                <span className="hidden sm:inline">Déconnexion</span>
                <span className="sm:hidden">Exit</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex relative">
        {/* Overlay pour mobile */}
        {isSidebarOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
            onClick={closeSidebar}
            aria-hidden="true"
          />
        )}

        {/* Sidebar */}
        <aside
          className={`${
            isSidebarOpen ? "translate-x-0" : "-translate-x-full"
          } lg:translate-x-0 fixed lg:relative w-64 sm:w-72 lg:w-64 bg-white shadow-lg lg:shadow-md min-h-screen z-40 transition-transform duration-300 ease-in-out`}
        >
          {/* Header mobile de la sidebar */}
          <div className="lg:hidden flex items-center justify-between p-4 border-b">
            <h2 className="font-semibold text-gray-800">Menu</h2>
            <button
              onClick={closeSidebar}
              className="p-1 hover:bg-gray-100 rounded"
              aria-label="Fermer le menu"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <nav className="p-4 space-y-2">
            <Link href="/dashboard" onClick={closeSidebar}>
              <Button
                variant="ghost"
                className="w-full justify-start text-sm sm:text-base hover:bg-gray-100 transition-colors"
              >
                <Home className="w-4 h-4 mr-3 flex-shrink-0" />
                Tableau de bord
              </Button>
            </Link>

            <Link href="/dashboard/tickets" onClick={closeSidebar}>
              <Button
                variant="ghost"
                className="w-full justify-start text-sm sm:text-base hover:bg-gray-100 transition-colors"
              >
                <Ticket className="w-4 h-4 mr-3 flex-shrink-0" />
                Mes tickets
              </Button>
            </Link>

            <Link href="/dashboard/tickets/new" onClick={closeSidebar}>
              <Button className="w-full text-sm sm:text-base mt-4 shadow-sm hover:shadow-md transition-shadow">
                Créer un ticket
              </Button>
            </Link>
          </nav>

          {/* User info mobile (optionnel) */}
          <div className="lg:hidden absolute bottom-4 left-4 right-4 p-3 bg-gray-50 rounded-lg">
            <div className="text-sm text-gray-600">Connecté en tant que</div>
            <div className="font-medium text-gray-800 truncate">
              {user?.name}
            </div>
          </div>
        </aside>

        {/* Main content */}
        <main className="flex-1 min-h-screen">
          <div className="p-3 sm:p-4 lg:p-6 max-w-full">{children}</div>
        </main>
      </div>
    </div>
  );
}
