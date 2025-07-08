import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  Network,
  Cloud,
  Server,
  Code,
  CheckCircle,
  Star,
} from "lucide-react";

const services = [
  {
    id: "network-infrastructure",
    title: "Infrastructure Réseau",
    shortDescription:
      "Conception et sécurisation de vos réseaux locaux pour une connectivité optimale et protégée.",
    icon: Network,
    slug: "infrastructure-reseau",
    featured: true,
  },
  {
    id: "cloud-migration",
    title: "Migration Cloud",
    shortDescription:
      "Accompagnement complet pour migrer vos systèmes vers le cloud sans interruption de service.",
    icon: Cloud,
    slug: "migration-cloud",
    featured: false,
  },
  {
    id: "infrastructure-management",
    title: "Gestion d'Infrastructure",
    shortDescription:
      "Optimisation et supervision de vos infrastructures pour une performance maximale et des coûts maîtrisés.",
    icon: Server,
    slug: "gestion-infrastructure",
    featured: true,
  },
  {
    id: "application-development",
    title: "Développement d'Applications",
    shortDescription:
      "Création d'applications métier sur mesure adaptées aux besoins spécifiques de votre entreprise.",
    icon: Code,
    slug: "developpement-applications",
    featured: false,
  },
];

const benefits = [
  "Expertise technique certifiée",
  "Support 24/7 disponible",
  "Solutions sur mesure",
  "ROI garanti sous 6 mois",
];

export default function ServicesPage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary via-blue-600 to-primary text-white py-20 sm:py-24 overflow-hidden">
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 mb-6">
              <Star className="w-4 h-4 text-yellow-400 fill-current" />
              <span className="text-sm font-medium">Solutions IT Premium</span>
            </div>
            <h1 className="text-4xl sm:text-6xl font-bold mb-6 bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
              Nos Services IT
            </h1>
            <p className="text-xl sm:text-2xl mb-8 max-w-3xl mx-auto text-blue-100 leading-relaxed">
              Des solutions complètes pour transformer et optimiser votre
              infrastructure technologique avec l&apos;expertise qui fait la
              différence
            </p>

            {/* Benefits list */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8 max-w-4xl mx-auto">
              {benefits.map((benefit, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2 text-blue-100"
                >
                  <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0" />
                  <span className="text-sm font-medium">{benefit}</span>
                </div>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/contact">
                <Button
                  size="lg"
                  className="bg-white text-blue-600 hover:bg-blue-50 hover:text-blue-700 font-semibold px-8 py-3 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                >
                  Consultation gratuite
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <Link href="/dashboard/tickets/new">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-2 border-white bg-transparent text-white hover:bg-white hover:text-blue-600 font-semibold px-8 py-3 rounded-lg transition-all duration-300"
                >
                  Créer un ticket
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-20 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Nos Expertises
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Découvrez nos services spécialisés conçus pour propulser votre
              entreprise vers le succès
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {services.map((service) => {
              const Icon = service.icon;
              return (
                <Card
                  key={service.id}
                  className={`group relative overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 ${
                    service.featured
                      ? "ring-2 ring-blue-600/20 bg-gradient-to-br from-white to-blue-50/30"
                      : "hover:shadow-lg"
                  }`}
                >
                  {service.featured && (
                    <div className="absolute top-4 right-4 bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-semibold">
                      Populaire
                    </div>
                  )}

                  <CardHeader className="pb-4">
                    <div className="flex items-start gap-4">
                      <div
                        className={`p-4 rounded-xl transition-all duration-300 group-hover:scale-110 ${
                          service.featured
                            ? "bg-blue-600 text-white shadow-lg"
                            : "bg-blue-600/10 text-blue-600 group-hover:bg-blue-600 group-hover:text-white"
                        }`}
                      >
                        <Icon className="w-8 h-8" />
                      </div>
                      <div className="flex-1">
                        <CardTitle className="text-2xl mb-3 text-gray-900 group-hover:text-blue-600 transition-colors">
                          {service.title}
                        </CardTitle>
                        <CardDescription className="text-base text-gray-600 leading-relaxed">
                          {service.shortDescription}
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="pt-0">
                    <Link href={`/services/${service.slug}`}>
                      <Button
                        className={`w-full font-semibold transition-all duration-300 ${
                          service.featured
                            ? "bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl"
                            : "bg-transparent border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white"
                        }`}
                        variant={service.featured ? "default" : "outline"}
                      >
                        {service.featured
                          ? "Découvrir maintenant"
                          : "En savoir plus"}
                        <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative bg-gradient-to-r from-gray-900 via-blue-900 to-gray-900 text-white py-20 overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 bg-gradient-to-r from-gray-900/95 to-blue-900/95"></div>
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-20 left-20 w-32 h-32 bg-blue-600/20 rounded-full blur-xl"></div>
          <div className="absolute bottom-20 right-20 w-48 h-48 bg-blue-600/20 rounded-full blur-xl"></div>
        </div>

        <div className="relative max-w-4xl mx-auto text-center px-4">
          <div className="inline-flex items-center gap-2 bg-blue-600/20 backdrop-blur-sm rounded-full px-4 py-2 mb-6">
            <CheckCircle className="w-4 h-4 text-blue-400" />
            <span className="text-sm font-medium text-blue-200">
              Démarrage immédiat
            </span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-bold mb-6 bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
            Prêt à transformer votre infrastructure IT ?
          </h2>
          <p className="text-xl mb-8 text-gray-200 leading-relaxed">
            Contactez-nous pour une consultation gratuite et découvrez comment
            nos solutions peuvent propulser votre entreprise vers de nouveaux
            sommets
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/contact">
              <Button
                size="lg"
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-4 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
              >
                Consultation gratuite
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
            <Link href="/dashboard/tickets/new">
              <Button
                size="lg"
                variant="outline"
                className="border-2 border-blue-600 text-blue-600 bg-white hover:bg-blue-600 hover:text-white font-semibold px-8 py-4 rounded-lg transition-all duration-300"
              >
                Créer un ticket support
              </Button>
            </Link>
          </div>

          <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-8 text-sm text-gray-300">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-400" />
              <span>Réponse sous 2h</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-400" />
              <span>Devis gratuit</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-400" />
              <span>Sans engagement</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
