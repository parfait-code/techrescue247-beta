"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ContactForm } from "@/components/contact/contact-form";
import { ArrowLeft, Phone, Mail, MapPin, Clock } from "lucide-react";

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Retour à l&apos;accueil
              </Button>
            </Link>
            <h1 className="text-2xl font-bold text-primary">Techrescue247</h1>
          </div>
        </div>
      </header>

      {/* Contact Hero */}
      <section className="bg-primary text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-5xl font-bold mb-4">
            Contactez-nous
          </h1>
          <p className="text-lg sm:text-xl max-w-3xl mx-auto">
            Notre équipe est là pour répondre à toutes vos questions.
            N&apos;hésitez pas à nous contacter pour toute demande
            d&apos;information.
          </p>
        </div>
      </section>

      {/* Contact Content */}
      <section className="py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Contact Information */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-md p-6 space-y-6">
                <h2 className="text-2xl font-bold mb-4">
                  Informations de contact
                </h2>

                <div className="flex items-start space-x-3">
                  <Phone className="w-5 h-5 text-primary mt-1" />
                  <div>
                    <p className="font-semibold">Téléphone</p>
                    <p className="text-gray-600">+237 678 830 036</p>
                    <p className="text-gray-600">+237 650 601 520</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <Mail className="w-5 h-5 text-primary mt-1" />
                  <div>
                    <p className="font-semibold">Email</p>
                    <p className="text-gray-600">contact@techrescue247.com</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <MapPin className="w-5 h-5 text-primary mt-1" />
                  <div>
                    <p className="font-semibold">Adresse</p>
                    <p className="text-gray-600">Terminus Mimboman</p>
                    <p className="text-gray-600">Yaoundé - Cameroun</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <Clock className="w-5 h-5 text-primary mt-1" />
                  <div>
                    <p className="font-semibold">Heures d&apos;ouverture</p>
                    <p className="text-gray-600">Lun - Ven: 8h00 - 18h00</p>
                    <p className="text-gray-600">Sam: 9h00 - 14h00</p>
                    <p className="text-gray-600">Dim: Fermé</p>
                  </div>
                </div>
              </div>

              {/* FAQ Section */}
              <div className="bg-white rounded-lg shadow-md p-6 mt-6">
                <h3 className="text-xl font-bold mb-4">Questions fréquentes</h3>
                <div className="space-y-4">
                  <div>
                    <p className="font-semibold text-sm">
                      Quel est votre temps de réponse ?
                    </p>
                    <p className="text-gray-600 text-sm mt-1">
                      Nous nous engageons à répondre dans les 24 heures.
                    </p>
                  </div>
                  <div>
                    <p className="font-semibold text-sm">
                      Proposez-vous un support d&apos;urgence ?
                    </p>
                    <p className="text-gray-600 text-sm mt-1">
                      Oui, notre équipe est disponible 24/7 pour les urgences.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-2">
              <ContactForm />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
