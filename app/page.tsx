"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { useAuth } from "@/store/hooks";
import {
  // Headphones,
  Shield,
  Clock,
  Users,
  CheckCircle,
  ArrowRight,
  Star,
  TrendingUp,
  Zap,
  Award,
  Network,
  Cloud,
  Server,
  Code,
  Phone,
  MessageCircle,
  Sparkles,
  User,
} from "lucide-react";

const stats = [
  { value: "100+", label: "Clients satisfaits" },
  { value: "99.9%", label: "Disponibilité" },
  { value: "24/7", label: "Support continu" },
  { value: "< 2h", label: "Temps de réponse" },
];

const testimonials = [
  {
    name: "Sophie Martin",
    role: "Directrice IT, TechCorp",
    content:
      "TechRescue247 a transformé notre infrastructure IT. Leur réactivité et expertise sont exceptionnelles.",
    rating: 5,
  },
  {
    name: "Jean Dupont",
    role: "CEO, StartupPlus",
    content:
      "Le service HelpDesk est incroyable. Nos problèmes sont résolus rapidement et efficacement.",
    rating: 5,
  },
  {
    name: "Marie Laurent",
    role: "Manager, FinanceGroup",
    content:
      "La migration cloud s'est déroulée sans accroc grâce à leur équipe professionnelle.",
    rating: 5,
  },
];

const services = [
  {
    icon: Network,
    title: "Infrastructure Réseau",
    description:
      "Conception et sécurisation de vos réseaux pour une connectivité optimale.",
    href: "/services/infrastructure-reseau",
  },
  {
    icon: Cloud,
    title: "Migration Cloud",
    description:
      "Migrez vers le cloud en toute sécurité sans interruption de service.",
    href: "/services/migration-cloud",
  },
  {
    icon: Server,
    title: "Gestion d'Infrastructure",
    description:
      "Optimisation et supervision 24/7 de vos systèmes informatiques.",
    href: "/services/gestion-infrastructure",
  },
  {
    icon: Code,
    title: "Développement d'Applications",
    description:
      "Solutions sur mesure adaptées à vos besoins métiers spécifiques.",
    href: "/services/developpement-applications",
  },
];

export default function HomePage() {
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Hero Section avec HelpDesk */}
      <section className="relative bg-gradient-to-br from-primary via-blue-600 to-primary text-white overflow-hidden">
        <div className="absolute inset-0 bg-grid-white/10 [mask-image:linear-gradient(0deg,transparent,rgba(255,255,255,0.5))]" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
          <div className="text-center">
            <Badge
              variant="secondary"
              className="mb-4 px-4 py-1 bg-blue-500/20 text-blue-100 border-blue-400"
            >
              <Sparkles className="w-4 h-4 mr-1" />
              Support IT Premium 24/7
            </Badge>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              HelpDesk Professionnel
              <br />
              <span className="text-blue-200">pour votre entreprise</span>
            </h1>
            <p className="text-xl sm:text-2xl mb-8 max-w-3xl mx-auto text-blue-100">
              Résolvez tous vos problèmes IT instantanément avec notre équipe
              d`&apos;experts disponibles 24/7
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {isAuthenticated ? (
                <>
                  <Link href="/dashboard/tickets/new">
                    <Button
                      size="lg"
                      className="text-base sm:text-lg bg-white text-blue-600 hover:bg-blue-50 font-semibold"
                    >
                      Créer un ticket
                    </Button>
                  </Link>
                  <Link href="/contact">
                    <Button
                      size="lg"
                      variant="outline"
                      className="text-base sm:text-lg border-white text-blue-600 hover:bg-blue-400 hover:text-blue-600"
                    >
                      Nous contacter
                    </Button>
                  </Link>
                </>
              ) : (
                <>
                  <Link href="/register">
                    <Button
                      size="lg"
                      className="text-base sm:text-lg bg-white text-blue-600 hover:bg-blue-50 font-semibold"
                    >
                      Commencer maintenant
                    </Button>
                  </Link>
                  <Link href="/contact">
                    <Button
                      size="lg"
                      variant="outline"
                      className="text-base sm:text-lg border-white bg-transparent text-white hover:bg-white hover:text-blue-600"
                    >
                      Nous contacter
                    </Button>
                  </Link>
                </>
              )}
            </div>
            {/* Features rapides */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-3xl mx-auto mt-12">
              <div className="flex items-center justify-center space-x-2">
                <Clock className="w-6 h-6 text-blue-200" />
                <span className="text-lg">Réponse {`<`} 2h</span>
              </div>
              <div className="flex items-center justify-center space-x-2">
                <Shield className="w-6 h-6 text-blue-200" />
                <span className="text-lg">100% Sécurisé</span>
              </div>
              <div className="flex items-center justify-center space-x-2">
                <Users className="w-6 h-6 text-blue-200" />
                <span className="text-lg">Experts certifiés</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl sm:text-4xl font-bold text-blue-600 mb-2">
                  {stat.value}
                </div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Nos Services IT Complets
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Au-delà du HelpDesk, découvrez notre gamme complète de services
              pour transformer votre infrastructure
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((service, index) => {
              const Icon = service.icon;
              return (
                <Card
                  key={index}
                  className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1 hover:border-blue-300"
                >
                  <CardHeader>
                    <div className="w-12 h-12 bg-blue-600/10 rounded-lg flex items-center justify-center mb-4">
                      <Icon className="w-6 h-6 text-blue-600" />
                    </div>
                    <CardTitle className="text-xl">{service.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="mb-4">
                      {service.description}
                    </CardDescription>
                    <Link href={service.href}>
                      <Button
                        variant="ghost"
                        className="p-0 h-auto font-medium text-blue-600 hover:text-blue-700"
                      >
                        En savoir plus
                        <ArrowRight className="ml-1 w-4 h-4" />
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          <div className="text-center mt-12">
            <Link href="/services">
              <Button
                size="lg"
                variant="outline"
                className="border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white"
              >
                Voir tous nos services
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Ce que disent nos clients
            </h2>
            <p className="text-xl text-gray-600">
              Plus de 100 entreprises nous font confiance
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card
                key={index}
                className="hover:shadow-lg transition-shadow hover:border-blue-300"
              >
                <CardHeader>
                  <div className="flex mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star
                        key={i}
                        className="w-5 h-5 fill-blue-600 text-blue-600"
                      />
                    ))}
                  </div>
                  <CardDescription className="text-base text-gray-700">
                    &quot;{testimonial.content}&quot;
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-blue-600/10 rounded-full flex items-center justify-center mr-4">
                      <User className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-semibold">{testimonial.name}</p>
                      <p className="text-sm text-gray-600">
                        {testimonial.role}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold mb-6">
                Pourquoi choisir TechRescue247 ?
              </h2>
              <div className="space-y-4">
                {[
                  {
                    icon: Award,
                    title: "Expertise reconnue",
                    description:
                      "Plus de 1 ans d'expérience dans le Reseau Informatique",
                  },
                  {
                    icon: Zap,
                    title: "Réactivité maximale",
                    description: "Intervention en moins de 2 heures garantie",
                  },
                  {
                    icon: Shield,
                    title: "Sécurité renforcée",
                    description: "Protocoles de sécurité aux normes ISO",
                  },
                  {
                    icon: TrendingUp,
                    title: "Évolutivité",
                    description:
                      "Solutions qui grandissent avec votre entreprise",
                  },
                ].map((item, index) => {
                  const Icon = item.icon;
                  return (
                    <div key={index} className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-blue-600/10 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Icon className="w-6 h-6 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg mb-1">
                          {item.title}
                        </h3>
                        <p className="text-gray-600">{item.description}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            <div className="bg-blue-50 border border-blue-200 rounded-2xl p-8 lg:p-12">
              <h3 className="text-2xl font-bold mb-6 text-blue-900">
                Prêt à optimiser votre IT ?
              </h3>
              <p className="text-blue-700 mb-6">
                Rejoignez les milliers d`&apos;entreprises qui nous font
                confiance pour leur infrastructure informatique.
              </p>
              <ul className="space-y-3 mb-8">
                {[
                  "Support technique 24/7",
                  "Équipe d'experts certifiés",
                  "Tarifs transparents",
                  "Satisfaction garantie",
                ].map((item, index) => (
                  <li key={index} className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-blue-600 mr-3" />
                    <span className="text-blue-800">{item}</span>
                  </li>
                ))}
              </ul>
              {isAuthenticated ? (
                <Link href="/dashboard/tickets/new">
                  <Button
                    size="lg"
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold"
                  >
                    Créer mon premier ticket
                  </Button>
                </Link>
              ) : (
                <Link href="/register">
                  <Button
                    size="lg"
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold"
                  >
                    Démarrer gratuitement
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-blue-600 text-white">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Besoin d&apos;aide immédiate ?
          </h2>
          <p className="text-xl mb-8 text-blue-100">
            Notre équipe d`&apos;experts est disponible 24/7 pour résoudre vos
            problèmes IT
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/contact">
              <Button
                size="lg"
                variant="secondary"
                className="bg-white text-blue-600 hover:bg-blue-50 font-semibold"
              >
                <Phone className="mr-2" />
                Nous contacter
              </Button>
            </Link>
            <Link href="/helpdesk">
              <Button
                size="lg"
                variant="outline"
                className="bg-white/10 text-white border-white hover:bg-white hover:text-blue-600 font-semibold"
              >
                <MessageCircle className="mr-2" />
                Chat en direct
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}
