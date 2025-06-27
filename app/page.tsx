import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Phone, Mail, MapPin, Headphones, Shield, Clock } from "lucide-react";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-primary">Techrescue247</h1>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/login">
                <Button variant="outline">Connexion</Button>
              </Link>
              <Link href="/register">
                <Button>Créer un compte</Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary to-blue-700 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-4xl font-bold mb-4">
              Support IT Professionnel 24/7
            </h2>
            <p className="text-xl mb-8">
              Résolvons ensemble vos problèmes informatiques
            </p>
            <Link href="/login">
              <Button size="lg" variant="secondary">
                Créer un ticket maintenant
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h3 className="text-3xl font-bold text-center mb-12">
            Pourquoi nous choisir?
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <Headphones className="w-16 h-16 mx-auto mb-4 text-primary" />
              <h4 className="text-xl font-semibold mb-2">Support Expert</h4>
              <p className="text-gray-600">
                Équipe de techniciens qualifiés prêts à vous aider
              </p>
            </div>
            <div className="text-center">
              <Clock className="w-16 h-16 mx-auto mb-4 text-primary" />
              <h4 className="text-xl font-semibold mb-2">Réponse Rapide</h4>
              <p className="text-gray-600">
                Prise en charge de vos demandes en moins de 24h
              </p>
            </div>
            <div className="text-center">
              <Shield className="w-16 h-16 mx-auto mb-4 text-primary" />
              <h4 className="text-xl font-semibold mb-2">Sécurité Garantie</h4>
              <p className="text-gray-600">
                Vos données sont protégées et sécurisées
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Info */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h3 className="text-3xl font-bold text-center mb-12">
            Contactez-nous
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex items-center justify-center">
              <Phone className="w-6 h-6 mr-3 text-primary" />
              <div>
                <p className="font-semibold">Téléphone</p>
                <p className="text-gray-600">+237 678 830 036</p>
                <p className="text-gray-600">+237 650 601 520</p>
              </div>
            </div>
            <div className="flex items-center justify-center">
              <Mail className="w-6 h-6 mr-3 text-primary" />
              <div>
                <p className="font-semibold">Email</p>
                <p className="text-gray-600">contact@techrescue247.com</p>
              </div>
            </div>
            <div className="flex items-center justify-center">
              <MapPin className="w-6 h-6 mr-3 text-primary" />
              <div>
                <p className="font-semibold">Bureau</p>
                <p className="text-gray-600">Terminus Mimboman</p>
                <p className="text-gray-600">Yaoundé - Cameroun</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p>&copy; 2024 Techrescue247. Tous droits réservés.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
