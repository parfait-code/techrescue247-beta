import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, Network, Cloud, Server, Code } from "lucide-react";

const services = [
  {
    id: "network-infrastructure",
    title: "Infrastructure Réseau",
    shortDescription:
      "Conception et sécurisation de vos réseaux locaux pour une connectivité optimale et protégée.",
    icon: Network,
    slug: "infrastructure-reseau",
  },
  {
    id: "cloud-migration",
    title: "Migration Cloud",
    shortDescription:
      "Accompagnement complet pour migrer vos systèmes vers le cloud sans interruption de service.",
    icon: Cloud,
    slug: "migration-cloud",
  },
  {
    id: "infrastructure-management",
    title: "Gestion d'Infrastructure",
    shortDescription:
      "Optimisation et supervision de vos infrastructures pour une performance maximale et des coûts maîtrisés.",
    icon: Server,
    slug: "gestion-infrastructure",
  },
  {
    id: "application-development",
    title: "Développement d'Applications",
    shortDescription:
      "Création d'applications métier sur mesure adaptées aux besoins spécifiques de votre entreprise.",
    icon: Code,
    slug: "developpement-applications",
  },
];

export default function ServicesPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary to-blue-700 text-white py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl sm:text-5xl font-bold mb-4">
              Nos Services IT
            </h1>
            <p className="text-xl mb-8 max-w-3xl mx-auto">
              Des solutions complètes pour transformer et optimiser votre
              infrastructure technologique
            </p>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {services.map((service) => {
              const Icon = service.icon;
              return (
                <Card
                  key={service.id}
                  className="hover:shadow-lg transition-shadow duration-300"
                >
                  <CardHeader>
                    <div className="flex items-start gap-4">
                      <div className="p-3 bg-primary/10 rounded-lg">
                        <Icon className="w-8 h-8 text-primary" />
                      </div>
                      <div className="flex-1">
                        <CardTitle className="text-2xl mb-2">
                          {service.title}
                        </CardTitle>
                        <CardDescription className="text-base">
                          {service.shortDescription}
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <Link href={`/services/${service.slug}`}>
                      <Button className="w-full" variant="outline">
                        En savoir plus
                        <ArrowRight className="ml-2 w-4 h-4" />
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
      <section className="bg-gray-900 text-white py-16">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h2 className="text-3xl font-bold mb-4">
            Prêt à transformer votre infrastructure IT ?
          </h2>
          <p className="text-xl mb-8">
            Contactez-nous pour discuter de vos besoins et découvrir comment
            nous pouvons vous aider
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/contact">
              <Button size="lg" variant="secondary">
                Contactez-nous
              </Button>
            </Link>
            <Link href="/dashboard/tickets/new">
              <Button
                size="lg"
                variant="outline"
                className="text-white border-white hover:bg-white hover:text-gray-900"
              >
                Créer un ticket
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
