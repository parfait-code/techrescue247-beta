"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Phone,
  Mail,
  MapPin,
  Headphones,
  Shield,
  Clock,
  Menu,
  X,
  User,
  Settings,
} from "lucide-react";
import { useAuth } from "@/store/hooks";

export default function HomePage() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { isAuthenticated, user } = useAuth();

  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="bg-white shadow-sm sticky top-0 z-50 border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center flex-shrink-0">
              <Link href="/" className="flex items-center">
                <h1 className="text-xl sm:text-2xl font-bold text-primary truncate">
                  Techrescue247
                </h1>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-4">
              {isAuthenticated ? (
                // Menu utilisateur connecté
                <>
                  {/* User Icon Button */}
                  <Link href="/dashboard">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="p-2 hover:bg-gray-100 border border-gray-200 rounded-full"
                      title={`Dashboard - ${user?.name}`}
                    >
                      <User className="w-5 h-5" />
                      <span className="text-sm text-gray-600 hidden lg:block">
                        Bonjour, {user?.name}
                      </span>
                    </Button>
                  </Link>
                  <Link href="/dashboard/tickets/new">
                    <Button size="sm">Nouveau ticket</Button>
                  </Link>
                </>
              ) : (
                // Menu utilisateur non connecté
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
            <div className="md:hidden flex items-center space-x-2">
              {/* User Icon for mobile when authenticated */}
              {isAuthenticated && (
                <Link href="/dashboard">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="p-2 hover:bg-gray-100 border border-gray-200 rounded-full"
                    title={`Dashboard - ${user?.name}`}
                  >
                    <User className="w-4 h-4" />
                  </Button>
                </Link>
              )}

              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 hover:bg-gray-100 rounded-md transition-colors"
                aria-label="Toggle menu"
              >
                {isMobileMenuOpen ? (
                  <X className="w-5 h-5" />
                ) : (
                  <Menu className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>

          {/* Mobile Navigation Menu */}
          {isMobileMenuOpen && (
            <div className="md:hidden border-t bg-white shadow-lg">
              <div className="px-2 pt-2 pb-3 space-y-1">
                {isAuthenticated ? (
                  // Menu mobile utilisateur connecté
                  <>
                    <div className="px-3 py-2 border-b border-gray-100">
                      <p className="text-sm text-gray-600">
                        Connecté en tant que
                      </p>
                      <p className="font-medium text-gray-900 truncate">
                        {user?.name}
                      </p>
                    </div>

                    <Link href="/dashboard" onClick={closeMobileMenu}>
                      <Button
                        variant="ghost"
                        className="w-full justify-start text-left"
                      >
                        <User className="w-4 h-4 mr-3" />
                        Dashboard
                      </Button>
                    </Link>

                    <Link href="/dashboard/tickets" onClick={closeMobileMenu}>
                      <Button
                        variant="ghost"
                        className="w-full justify-start text-left"
                      >
                        <Settings className="w-4 h-4 mr-3" />
                        Mes tickets
                      </Button>
                    </Link>

                    <Link
                      href="/dashboard/tickets/new"
                      onClick={closeMobileMenu}
                    >
                      <Button className="w-full mt-2">Créer un ticket</Button>
                    </Link>
                  </>
                ) : (
                  // Menu mobile utilisateur non connecté
                  <>
                    <Link href="/login" onClick={closeMobileMenu}>
                      <Button variant="outline" className="w-full mb-2">
                        Connexion
                      </Button>
                    </Link>

                    <Link href="/register" onClick={closeMobileMenu}>
                      <Button className="w-full">Créer un compte</Button>
                    </Link>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Overlay pour fermer le menu mobile */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-25 z-40 md:hidden"
          onClick={closeMobileMenu}
          aria-hidden="true"
        />
      )}

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary to-blue-700 text-white py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
              Support IT Professionnel 24/7
            </h2>
            <p className="text-lg sm:text-xl mb-6 sm:mb-8 max-w-2xl mx-auto">
              Résolvons ensemble vos problèmes informatiques
            </p>
            {isAuthenticated ? (
              <Link href="/dashboard/tickets/new">
                <Button
                  size="lg"
                  variant="secondary"
                  className="text-base sm:text-lg"
                >
                  Créer un ticket maintenant
                </Button>
              </Link>
            ) : (
              <Link href="/register">
                <Button
                  size="lg"
                  variant="secondary"
                  className="text-base sm:text-lg"
                >
                  Commencer maintenant
                </Button>
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h3 className="text-2xl sm:text-3xl font-bold text-center mb-8 sm:mb-12">
            Pourquoi nous choisir?
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            <div className="text-center p-4">
              <Headphones className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-4 text-primary" />
              <h4 className="text-lg sm:text-xl font-semibold mb-2">
                Support Expert
              </h4>
              <p className="text-gray-600 text-sm sm:text-base">
                Équipe de techniciens qualifiés prêts à vous aider
              </p>
            </div>
            <div className="text-center p-4">
              <Clock className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-4 text-primary" />
              <h4 className="text-lg sm:text-xl font-semibold mb-2">
                Réponse Rapide
              </h4>
              <p className="text-gray-600 text-sm sm:text-base">
                Prise en charge de vos demandes en moins de 24h
              </p>
            </div>
            <div className="text-center p-4">
              <Shield className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-4 text-primary" />
              <h4 className="text-lg sm:text-xl font-semibold mb-2">
                Sécurité Garantie
              </h4>
              <p className="text-gray-600 text-sm sm:text-base">
                Vos données sont protégées et sécurisées
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Info */}
      <section className="bg-gray-50 py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h3 className="text-2xl sm:text-3xl font-bold text-center mb-8 sm:mb-12">
            Contactez-nous
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            <div className="flex items-start sm:items-center justify-center text-center sm:text-left">
              <Phone className="w-5 h-5 sm:w-6 sm:h-6 mr-3 text-primary flex-shrink-0 mt-1 sm:mt-0" />
              <div>
                <p className="font-semibold text-sm sm:text-base">Téléphone</p>
                <p className="text-gray-600 text-sm">+237 678 830 036</p>
                <p className="text-gray-600 text-sm">+237 650 601 520</p>
              </div>
            </div>
            <div className="flex items-start sm:items-center justify-center text-center sm:text-left">
              <Mail className="w-5 h-5 sm:w-6 sm:h-6 mr-3 text-primary flex-shrink-0 mt-1 sm:mt-0" />
              <div>
                <p className="font-semibold text-sm sm:text-base">Email</p>
                <p className="text-gray-600 text-sm">
                  contact@techrescue247.com
                </p>
              </div>
            </div>
            <div className="flex items-start sm:items-center justify-center text-center sm:text-left sm:col-span-2 lg:col-span-1">
              <MapPin className="w-5 h-5 sm:w-6 sm:h-6 mr-3 text-primary flex-shrink-0 mt-1 sm:mt-0" />
              <div>
                <p className="font-semibold text-sm sm:text-base">Bureau</p>
                <p className="text-gray-600 text-sm">Terminus Mimboman</p>
                <p className="text-gray-600 text-sm">Yaoundé - Cameroun</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-6 sm:py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-sm sm:text-base">
              &copy; 2024 Techrescue247. Tous droits réservés.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
