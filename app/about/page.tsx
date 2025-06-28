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
import { Navbar, Footer } from "@/components/layout";
import {
  Target,
  Eye,
  Heart,
  Users,
  Shield,
  Zap,
  CheckCircle,
} from "lucide-react";

const values = [
  {
    icon: Heart,
    title: "Passion",
    description: "Nous sommes passionnés par la technologie et l'innovation",
  },
  {
    icon: Shield,
    title: "Intégrité",
    description: "Transparence et honnêteté dans toutes nos interactions",
  },
  {
    icon: Zap,
    title: "Excellence",
    description:
      "Nous visons l'excellence dans chaque service que nous offrons",
  },
  {
    icon: Users,
    title: "Collaboration",
    description: "Travailler ensemble pour atteindre des objectifs communs",
  },
];

// const milestones = [
//   {
//     year: "2010",
//     title: "Création de l'entreprise",
//     description: "Début de notre aventure avec une équipe de 3 personnes",
//   },
//   {
//     year: "2015",
//     title: "Expansion régionale",
//     description: "Ouverture de bureaux dans 5 villes du Cameroun",
//   },
//   {
//     year: "2020",
//     title: "10 000 clients",
//     description: "Franchissement du cap des 10 000 entreprises clientes",
//   },
//   {
//     year: "2025",
//     title: "Leader du marché",
//     description: "Reconnu comme le leader du support IT au Cameroun",
//   },
// ];

const team = [
  {
    name: "Emmanuel Ando",
    role: "Co-Fondateur",
    description: "Expert en infrastructure réseau",
  },
  {
    name: "Parfait Kouam",
    role: "Co-Fondateur",
    description: "Expert en Développement logiciel",
  },
  //   {
  //     name: "Pierre Kamga",
  //     role: "Directeur Commercial",
  //     description: "Spécialiste en relations clients",
  //   },
  //   {
  //     name: "Fatima Diallo",
  //     role: "Responsable Support",
  //     description: "15 ans dans le support technique",
  //   },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary to-blue-700 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl sm:text-5xl font-bold mb-4">
              À propos de TechRescue247
            </h1>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto">
              Depuis 2024, nous accompagnons les entreprises dans leur évolution
              technologique. Notre expertise couvre tous les besoins en
              infrastructures informatiques, de la conception à la maintenance
              et à la sécurité.
            </p>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <Badge className="mb-4">Notre histoire</Badge>
              <h2 className="text-3xl font-bold mb-6">
                Une vision technologique au service des entreprises
              </h2>
              <p className="text-gray-600 mb-4">
                Fondée en 2024 par une équipe d&apos;ingénieurs passionnés,
                notre entreprise a débuté avec une vision claire : démocratiser
                l&apos;accès aux technologies d&apos;infrastructure avancées
                pour toutes les entreprises.
              </p>
              <p className="text-gray-600 mb-4">
                Au fil du temps, nous avons développé une expertise reconnue en
                modernisation des systèmes d&apos;information, accompagnant de
                nombreuses entreprises dans leur transformation numérique.
              </p>
              <p className="text-gray-600 mb-4">
                Aujourd&apos;hui, notre équipe d&apos;experts continue
                d&apos;innover pour proposer des solutions sur mesure alliant
                performance, sécurité et durabilité.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-6">
              <Card className="text-center">
                <CardHeader>
                  <Target className="w-12 h-12 text-primary mx-auto mb-2" />
                  <CardTitle>Notre Mission</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    Démocratiser l&apos;accès à un support IT de qualité pour
                    toutes les entreprises
                  </CardDescription>
                </CardContent>
              </Card>
              <Card className="text-center">
                <CardHeader>
                  <Eye className="w-12 h-12 text-primary mx-auto mb-2" />
                  <CardTitle>Notre Vision</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    Devenir le leader panafricain du support IT
                    d&apos;entreprise
                  </CardDescription>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Nos valeurs</h2>
            <p className="text-xl text-gray-600">
              Les principes qui guident notre action quotidienne
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => {
              const Icon = value.icon;
              return (
                <div key={index} className="text-center">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Icon className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">{value.title}</h3>
                  <p className="text-gray-600">{value.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Milestones */}
      {/* <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Notre parcours</h2>
            <p className="text-xl text-gray-600">
              Les étapes clés de notre croissance
            </p>
          </div>
          <div className="relative">
            <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-gray-200"></div>
            <div className="space-y-12">
              {milestones.map((milestone, index) => (
                <div
                  key={index}
                  className={`relative flex items-center ${
                    index % 2 === 0 ? "justify-start" : "justify-end"
                  }`}
                >
                  <div
                    className={`w-5/12 ${
                      index % 2 === 0 ? "text-right pr-8" : "text-left pl-8"
                    }`}
                  >
                    <Badge className="mb-2">{milestone.year}</Badge>
                    <h3 className="font-semibold text-lg mb-1">
                      {milestone.title}
                    </h3>
                    <p className="text-gray-600">{milestone.description}</p>
                  </div>
                  <div className="absolute left-1/2 transform -translate-x-1/2 w-4 h-4 bg-primary rounded-full"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section> */}

      {/* Team */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">
              Notre équipe de direction
            </h2>
            <p className="text-xl text-gray-600">
              Des experts passionnés à votre service
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member, index) => (
              <Card key={index} className="text-center">
                <CardHeader>
                  <div className="w-24 h-24 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <Users className="w-12 h-12 text-gray-400" />
                  </div>
                  <CardTitle>{member.name}</CardTitle>
                  <CardDescription>{member.role}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600">{member.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6">
                Pourquoi nous choisir ?
              </h2>
              <div className="space-y-4">
                {[
                  //   "Plus de 15 ans d'expérience dans le support IT",
                  "Équipe de 10+ experts certifiés",
                  "Support disponible 24/7 en français et anglais",
                  "100+ clients satisfaites",
                  "Temps de réponse garanti < 2 heures",
                  "Infrastructure locale pour une meilleure réactivité",
                ].map((item, index) => (
                  <div key={index} className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-6">
              {/* <Card className="text-center">
                <CardHeader>
                  <div className="text-3xl font-bold text-primary">15+</div>
                  <CardDescription>Années d&apos;expérience</CardDescription>
                </CardHeader>
              </Card> */}
              <Card className="text-center">
                <CardHeader>
                  <div className="text-3xl font-bold text-primary">10+</div>
                  <CardDescription>Experts certifiés</CardDescription>
                </CardHeader>
              </Card>
              <Card className="text-center">
                <CardHeader>
                  <div className="text-3xl font-bold text-primary">100+</div>
                  <CardDescription>Clients satisfaits</CardDescription>
                </CardHeader>
              </Card>
              <Card className="text-center">
                <CardHeader>
                  <div className="text-3xl font-bold text-primary">99.9%</div>
                  <CardDescription>Disponibilité</CardDescription>
                </CardHeader>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-primary text-white">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h2 className="text-3xl font-bold mb-4">
            Prêt à rejoindre notre famille de clients satisfaits ?
          </h2>
          <p className="text-xl mb-8 text-blue-100">
            Découvrez comment nous pouvons transformer votre infrastructure IT
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/contact">
              <Button size="lg" variant="secondary">
                Contactez-nous
              </Button>
            </Link>
            <Link href="/services">
              <Button
                size="lg"
                variant="outline"
                className="bg-white/10 text-white border-white hover:bg-white hover:text-primary"
              >
                Découvrir nos services
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
