"use client";

import { ContactForm } from "@/components/contact/contact-form";
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  MessageCircle,
  CheckCircle,
  Users,
  Zap,
  Star,
  Shield,
} from "lucide-react";
import { Footer, Navbar } from "@/components/layout";

const contactMethods = [
  {
    icon: Phone,
    title: "Téléphone",
    description: "Appelez-nous directement",
    details: ["+237 678 830 036", "+237 650 601 520"],
    color: "text-blue-600",
    bgColor: "bg-blue-600/10",
    hoverColor: "hover:bg-blue-600/20",
  },
  {
    icon: Mail,
    title: "Email",
    description: "Écrivez-nous",
    details: ["contact@techrescue247.com"],
    color: "text-green-600",
    bgColor: "bg-green-600/10",
    hoverColor: "hover:bg-green-600/20",
  },
  {
    icon: MapPin,
    title: "Adresse",
    description: "Venez nous voir",
    details: ["Terminus Mimboman", "Yaoundé - Cameroun"],
    color: "text-purple-600",
    bgColor: "bg-purple-600/10",
    hoverColor: "hover:bg-purple-600/20",
  },
  {
    icon: Clock,
    title: "Heures d'ouverture",
    description: "Nos disponibilités",
    details: ["Lun - Ven: 8h00 - 18h00", "Sam: 9h00 - 14h00", "Dim: Fermé"],
    color: "text-orange-600",
    bgColor: "bg-orange-600/10",
    hoverColor: "hover:bg-orange-600/20",
  },
];

const features = [
  {
    icon: Zap,
    title: "Réponse rapide",
    description: "Sous 2h en moyenne",
  },
  {
    icon: Users,
    title: "Support expert",
    description: "Équipe certifiée",
  },
  {
    icon: Shield,
    title: "Disponible 24/7",
    description: "Support d'urgence",
  },
];

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30">
      <Navbar />

      {/* Contact Hero */}
      <section className="relative bg-gradient-to-br from-primary via-blue-600 to-primary text-white py-20 sm:py-24 overflow-hidden">
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 mb-6">
            <MessageCircle className="w-4 h-4 text-blue-200" />
            <span className="text-sm font-medium">Parlons de votre projet</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-bold mb-6 bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
            Contactez-nous
          </h1>
          <p className="text-xl sm:text-2xl mb-8 max-w-3xl mx-auto text-blue-100 leading-relaxed">
            Notre équipe d&apos;experts est là pour répondre à toutes vos
            questions et vous accompagner dans vos projets IT
          </p>

          {/* Features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 max-w-4xl mx-auto">
            {features.map((feature, index) => (
              <div
                key={index}
                className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-lg p-4"
              >
                <div className="p-2 bg-blue-500/20 rounded-lg">
                  <feature.icon className="w-5 h-5 text-blue-200" />
                </div>
                <div className="text-left">
                  <p className="font-semibold text-white">{feature.title}</p>
                  <p className="text-sm text-blue-200">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="#contact-form" className="scroll-smooth">
              <button className="bg-white text-blue-600 hover:bg-blue-50 hover:text-blue-700 font-semibold px-8 py-3 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                Commencer maintenant
                <MessageCircle className="ml-2 w-5 h-5 inline" />
              </button>
            </a>
            <a href="tel:+237678830036">
              <button className="border-2 border-white text-white hover:bg-white hover:text-blue-600 font-semibold px-8 py-3 rounded-lg transition-all duration-300">
                Appeler maintenant
                <Phone className="ml-2 w-5 h-5 inline" />
              </button>
            </a>
          </div>
        </div>
      </section>

      {/* Contact Content */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Contact Information */}
            <div className="lg:col-span-1 space-y-6">
              <div className="text-center lg:text-left mb-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-3">
                  Restons connectés
                </h2>
                <p className="text-gray-600">
                  Plusieurs moyens de nous joindre pour votre convenance
                </p>
              </div>

              {/* Contact Methods */}
              <div className="space-y-4">
                {contactMethods.map((method, index) => (
                  <div
                    key={index}
                    className={`group bg-white rounded-xl shadow-md p-6 transition-all duration-300 hover:shadow-lg ${method.hoverColor} border border-gray-100`}
                  >
                    <div className="flex items-start space-x-4">
                      <div
                        className={`p-3 rounded-lg ${method.bgColor} group-hover:scale-110 transition-transform duration-300`}
                      >
                        <method.icon className={`w-6 h-6 ${method.color}`} />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-bold text-gray-900 mb-1">
                          {method.title}
                        </h3>
                        <p className="text-sm text-gray-500 mb-2">
                          {method.description}
                        </p>
                        <div className="space-y-1">
                          {method.details.map((detail, idx) => (
                            <p key={idx} className="text-gray-700 font-medium">
                              {detail}
                            </p>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Trust indicators */}
              <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl p-6 text-white">
                <div className="flex items-center gap-2 mb-4">
                  <Star className="w-5 h-5 text-yellow-400 fill-current" />
                  <h3 className="font-bold">Pourquoi nous choisir ?</h3>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-400" />
                    <span className="text-sm">+500 clients satisfaits</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-400" />
                    <span className="text-sm">Interventions certifiées</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-400" />
                    <span className="text-sm">Garantie satisfaction</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-2" id="contact-form">
              <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-100">
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-bold text-gray-900 mb-3">
                    Démarrons votre projet
                  </h2>
                  <p className="text-gray-600">
                    Remplissez ce formulaire et recevez une réponse
                    personnalisée sous 2h
                  </p>
                </div>
                <ContactForm />
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* FAQ Section */}
      {/* <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
        <div className="flex items-center gap-2 mb-6">
          <div className="p-2 bg-blue-600/10 rounded-lg">
            <MessageCircle className="w-5 h-5 text-blue-600" />
          </div>
          <h3 className="text-xl font-bold text-gray-900">
            Questions fréquentes
          </h3>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="border-l-4 border-blue-600/20 pl-4 py-2"
            >
              <p className="font-semibold text-gray-900 mb-2 flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                {faq.question}
              </p>
              <p className="text-gray-600 text-sm leading-relaxed ml-6">
                {faq.answer}
              </p>
            </div>
          ))}
        </div>
      </div> */}

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-gray-900 via-blue-900 to-gray-900 text-white py-16">
        <div className="max-w-4xl mx-auto text-center px-4">
          <div className="inline-flex items-center gap-2 bg-blue-600/20 backdrop-blur-sm rounded-full px-4 py-2 mb-6">
            <Phone className="w-4 h-4 text-blue-400" />
            <span className="text-sm font-medium text-blue-200">
              Besoin d&apos;aide immédiate ?
            </span>
          </div>

          <h2 className="text-3xl font-bold mb-4">
            Une urgence ? Appelez-nous maintenant !
          </h2>
          <p className="text-xl mb-8 text-gray-200">
            Notre équipe technique est disponible 24/7 pour vos urgences
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="tel:+237678830036">
              <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-4 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                <Phone className="w-5 h-5 inline mr-2" />
                +237 678 830 036
              </button>
            </a>
            <a href="tel:+237650601520">
              <button className="border-2 border-blue-600 text-blue-600 bg-white hover:bg-blue-600 hover:text-white font-semibold px-8 py-4 rounded-lg transition-all duration-300">
                <Phone className="w-5 h-5 inline mr-2" />
                +237 650 601 520
              </button>
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
