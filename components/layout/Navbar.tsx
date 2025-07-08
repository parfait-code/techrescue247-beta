"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Menu,
  X,
  User,
  LogOut,
  Settings,
  Ticket,
  ChevronDown,
} from "lucide-react";
import { useAuth } from "@/store/hooks";
import { useAppDispatch } from "@/store/hooks";
import { logout } from "@/store/slices/authSlice";
import Image from "next/image";

export function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { isAuthenticated, user } = useAuth();
  const router = useRouter();
  const dispatch = useAppDispatch();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = () => {
    dispatch(logout());
    router.push("/");
    closeMobileMenu();
  };

  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  const navLinks = [
    // { href: "/", label: "Accueil" },
    { href: "/about", label: "À propos" },
    { href: "/contact", label: "Contact" },
  ];

  return (
    <nav
      className={`bg-white sticky top-0 z-50 transition-shadow ${
        isScrolled ? "shadow-md" : "border-b"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <Image
                src={"/images/logo.png"}
                height={80}
                width={200}
                alt="logo techrescue237"
              />
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-8">
            {/* Services Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center text-gray-700 hover:text-primary transition-colors font-medium">
                Services <ChevronDown className="ml-1 w-4 h-4" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>Nos Services</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/services/infrastructure-reseau">
                    Infrastructure Réseau
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/services/migration-cloud">Migration Cloud</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/services/gestion-infrastructure">
                    Gestion d&apos;Infrastructure
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/services/developpement-applications">
                    Développement d&apos;Applications
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Link
              href="/helpdesk"
              className="text-gray-700 hover:text-primary transition-colors font-medium"
            >
              HelpDesk
            </Link>

            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-gray-700 hover:text-primary transition-colors font-medium"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Desktop Auth Buttons */}
          <div className="hidden lg:flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                <Link href="/dashboard/tickets/new">
                  <Button variant="outline" size="sm">
                    <Ticket className="w-4 h-4 mr-2" />
                    Créer un ticket
                  </Button>
                </Link>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <User className="w-4 h-4 mr-2" />
                      {user?.name}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Mon compte</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link href="/dashboard">
                        <User className="w-4 h-4 mr-2" />
                        Dashboard
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/dashboard/tickets">
                        <Ticket className="w-4 h-4 mr-2" />
                        Mes tickets
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/profile">
                        <Settings className="w-4 h-4 mr-2" />
                        Paramètres
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout}>
                      <LogOut className="w-4 h-4 mr-2" />
                      Déconnexion
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <>
                <Link href="/login">
                  <Button variant="outline" size="sm">
                    Connexion
                  </Button>
                </Link>
                <Link href="/register">
                  <Button size="sm">Créer un compte</Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2 rounded-md hover:bg-gray-100 transition-colors"
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="lg:hidden border-t">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <Link
                href="/helpdesk"
                onClick={closeMobileMenu}
                className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-primary hover:bg-gray-50 rounded-md"
              >
                HelpDesk
              </Link>
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={closeMobileMenu}
                  className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-primary hover:bg-gray-50 rounded-md"
                >
                  {link.label}
                </Link>
              ))}

              <div className="pt-4 pb-3 border-t border-gray-200">
                {isAuthenticated ? (
                  <>
                    <div className="px-3 py-2">
                      <p className="text-sm text-gray-600">
                        Connecté en tant que
                      </p>
                      <p className="font-medium text-gray-900">{user?.name}</p>
                    </div>
                    <div className="mt-3 space-y-1">
                      <Link
                        href="/dashboard"
                        onClick={closeMobileMenu}
                        className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-primary hover:bg-gray-50 rounded-md"
                      >
                        Dashboard
                      </Link>
                      <Link
                        href="/dashboard/tickets"
                        onClick={closeMobileMenu}
                        className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-primary hover:bg-gray-50 rounded-md"
                      >
                        Mes tickets
                      </Link>
                      <Link
                        href="/dashboard/tickets/new"
                        onClick={closeMobileMenu}
                        className="block px-3 py-2"
                      >
                        <Button className="w-full">
                          <Ticket className="w-4 h-4 mr-2" />
                          Créer un ticket
                        </Button>
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="block w-full text-left px-3 py-2 text-base font-medium text-gray-700 hover:text-primary hover:bg-gray-50 rounded-md"
                      >
                        Déconnexion
                      </button>
                    </div>
                  </>
                ) : (
                  <div className="mt-3 space-y-2 px-3">
                    <Link href="/login" onClick={closeMobileMenu}>
                      <Button variant="outline" className="w-full">
                        Connexion
                      </Button>
                    </Link>
                    <Link href="/register" onClick={closeMobileMenu}>
                      <Button className="w-full">Créer un compte</Button>
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Overlay pour mobile */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-25 z-40 lg:hidden"
          onClick={closeMobileMenu}
        />
      )}
    </nav>
  );
}
