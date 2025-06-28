import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Navbar, Footer } from "@/components/layout";
import { Home, Search, HelpCircle } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navbar />

      <div className="flex-1 flex items-center justify-center px-4">
        <div className="text-center max-w-2xl mx-auto">
          {/* 404 Illustration */}
          <div className="mb-8">
            <div className="text-9xl font-bold text-gray-200 mb-4">404</div>
            <div className="relative">
              <div className="absolute inset-0 flex items-center justify-center">
                <HelpCircle className="w-24 h-24 text-gray-300" />
              </div>
            </div>
          </div>

          {/* Error Message */}
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Page introuvable
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Désolé, la page que vous recherchez n&apos;existe pas ou a été
            déplacée.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/">
              <Button size="lg">
                <Home className="mr-2" />
                Retour à l&apos;accueil
              </Button>
            </Link>
            <Link href="/helpdesk">
              <Button size="lg" variant="outline">
                <Search className="mr-2" />
                Besoin d&apos;aide ?
              </Button>
            </Link>
          </div>

          {/* Helpful Links */}
          <div className="mt-12 pt-8 border-t border-gray-200">
            <p className="text-gray-600 mb-4">Pages populaires :</p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link href="/services" className="text-primary hover:underline">
                Services
              </Link>
              <Link href="/about" className="text-primary hover:underline">
                À propos
              </Link>
              <Link href="/contact" className="text-primary hover:underline">
                Contact
              </Link>
              <Link href="/status" className="text-primary hover:underline">
                Statut des services
              </Link>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
