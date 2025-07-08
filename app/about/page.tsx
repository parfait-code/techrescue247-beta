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
  Star,
  Award,
  TrendingUp,
  Clock,
  ArrowRight,
  Sparkles,
} from "lucide-react";

const values = [
  {
    icon: Heart,
    title: "Passion",
    description: "Nous sommes passionnés par la technologie et l'innovation",
    color: "from-red-500 to-pink-500",
    bgColor: "bg-red-50",
    iconColor: "text-red-600",
  },
  {
    icon: Shield,
    title: "Intégrité",
    description: "Transparence et honnêteté dans toutes nos interactions",
    color: "from-blue-500 to-cyan-500",
    bgColor: "bg-blue-50",
    iconColor: "text-blue-600",
  },
  {
    icon: Zap,
    title: "Excellence",
    description:
      "Nous visons l'excellence dans chaque service que nous offrons",
    color: "from-yellow-500 to-orange-500",
    bgColor: "bg-yellow-50",
    iconColor: "text-yellow-600",
  },
  {
    icon: Users,
    title: "Collaboration",
    description: "Travailler ensemble pour atteindre des objectifs communs",
    color: "from-green-500 to-emerald-500",
    bgColor: "bg-green-50",
    iconColor: "text-green-600",
  },
];

const team = [
  {
    name: "Emmanuel Ando",
    role: "Co-Fondateur",
    description: "Expert en infrastructure réseau",
    specialties: ["Réseaux", "Sécurité", "Cloud"],
    experience: "8+ ans",
  },
  {
    name: "Parfait Kouam",
    role: "Co-Fondateur",
    description: "Expert en Développement logiciel",
    specialties: ["Dev Full-Stack", "Architecture", "DevOps"],
    experience: "10+ ans",
  },
];

const achievements = [
  {
    icon: Users,
    number: "100+",
    label: "Clients satisfaits",
    description: "Entreprises qui nous font confiance",
  },
  {
    icon: Clock,
    number: "99.9%",
    label: "Disponibilité",
    description: "Service garanti 24/7",
  },
  {
    icon: Star,
    number: "10+",
    label: "Experts certifiés",
    description: "Équipe technique qualifiée",
  },
  {
    icon: TrendingUp,
    number: "< 2h",
    label: "Temps de réponse",
    description: "Réactivité garantie",
  },
];

const whyChooseUs = [
  "Équipe de 10+ experts certifiés",
  "Support disponible 24/7 en français et anglais",
  "100+ clients satisfaites",
  "Temps de réponse garanti < 2 heures",
  "Infrastructure locale pour une meilleure réactivité",
  "Solutions sur mesure adaptées à vos besoins",
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30">
      <Navbar />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary via-blue-600 to-primary text-white py-20 sm:py-24 overflow-hidden">
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 mb-6">
              <Sparkles className="w-4 h-4 text-blue-200" />
              <span className="text-sm font-medium">Fondé en 2024</span>
            </div>

            <h1 className="text-4xl sm:text-6xl font-bold mb-6 bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
              À propos de TechRescue247
            </h1>
            <p className="text-xl sm:text-2xl mb-8 max-w-4xl mx-auto text-blue-100 leading-relaxed">
              Depuis 2024, nous accompagnons les entreprises dans leur évolution
              technologique. Notre expertise couvre tous les besoins en
              infrastructures informatiques, de la conception à la maintenance
              et à la sécurité.
            </p>

            {/* Quick stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8 max-w-4xl mx-auto">
              {achievements.map((achievement, index) => (
                <div
                  key={index}
                  className="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-center"
                >
                  <achievement.icon className="w-6 h-6 text-blue-200 mx-auto mb-2" />
                  <div className="text-xl font-bold text-white">
                    {achievement.number}
                  </div>
                  <div className="text-sm text-blue-200">
                    {achievement.label}
                  </div>
                </div>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/contact">
                <Button className="bg-white text-blue-600 hover:bg-blue-50 hover:text-blue-700 font-semibold px-8 py-3 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                  Découvrir nos services
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <Link href="/contact">
                <Button
                  variant="outline"
                  className="border-2 border-white bg-transparent text-white hover:bg-white hover:text-blue-600 font-semibold px-8 py-3 rounded-lg transition-all duration-300"
                >
                  Nous contacter
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <Badge className="mb-4 bg-blue-600 text-white hover:bg-blue-700">
                Notre histoire
              </Badge>
              <h2 className="text-3xl sm:text-4xl font-bold mb-6 text-gray-900">
                Une vision technologique au service des entreprises
              </h2>
              <div className="space-y-4 text-gray-600 leading-relaxed">
                <p>
                  Fondée en 2024 par une équipe d&apos;ingénieurs passionnés,
                  notre entreprise a débuté avec une vision claire :
                  démocratiser l&apos;accès aux technologies
                  d&apos;infrastructure avancées pour toutes les entreprises.
                </p>
                <p>
                  Au fil du temps, nous avons développé une expertise reconnue
                  en modernisation des systèmes d&apos;information, accompagnant
                  de nombreuses entreprises dans leur transformation numérique.
                </p>
                <p>
                  Aujourd&apos;hui, notre équipe d&apos;experts continue
                  d&apos;innover pour proposer des solutions sur mesure alliant
                  performance, sécurité et durabilité.
                </p>
              </div>

              <div className="mt-8 flex flex-col sm:flex-row gap-4">
                <Link href="/services">
                  <Button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold">
                    Nos services
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </Link>
                <Link href="/contact">
                  <Button
                    variant="outline"
                    className="border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white font-semibold"
                  >
                    Parlons de votre projet
                  </Button>
                </Link>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <Card className="group text-center hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                <CardHeader className="pb-4">
                  <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                    <Target className="w-8 h-8 text-white" />
                  </div>
                  <CardTitle className="text-xl text-gray-900">
                    Notre Mission
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-gray-600">
                    Démocratiser l&apos;accès à un support IT de qualité pour
                    toutes les entreprises
                  </CardDescription>
                </CardContent>
              </Card>

              <Card className="group text-center hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                <CardHeader className="pb-4">
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-blue-700 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                    <Eye className="w-8 h-8 text-white" />
                  </div>
                  <CardTitle className="text-xl text-gray-900">
                    Notre Vision
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-gray-600">
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
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-blue-600 text-white hover:bg-blue-700">
              Nos fondements
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-gray-900">
              Nos valeurs
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Les principes qui guident notre action quotidienne et façonnent
              notre culture d&apos;entreprise
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => {
              const Icon = value.icon;
              return (
                <div key={index} className="group text-center">
                  <div
                    className={`w-20 h-20 ${value.bgColor} rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-all duration-300 shadow-lg`}
                  >
                    <Icon className={`w-10 h-10 ${value.iconColor}`} />
                  </div>
                  <h3 className="font-bold text-xl mb-3 text-gray-900">
                    {value.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {value.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-blue-50/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-blue-600 text-white hover:bg-blue-700">
              Notre équipe
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-gray-900">
              Notre équipe de direction
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Des experts passionnés qui mettent leur expertise au service de
              votre réussite
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {team.map((member, index) => (
              <Card
                key={index}
                className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-white border-0"
              >
                <CardHeader className="text-center pb-4">
                  <div className="w-24 h-24 bg-gradient-to-r from-blue-600 to-blue-700 rounded-full mx-auto mb-4 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <Users className="w-12 h-12 text-white" />
                  </div>
                  <CardTitle className="text-xl text-gray-900">
                    {member.name}
                  </CardTitle>
                  <CardDescription className="text-blue-600 font-semibold">
                    {member.role}
                  </CardDescription>
                  <div className="inline-flex items-center gap-1 bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-sm font-medium">
                    <Award className="w-4 h-4" />
                    {member.experience}
                  </div>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-gray-600 mb-4">{member.description}</p>
                  <div className="flex flex-wrap justify-center gap-2">
                    {member.specialties.map((specialty, idx) => (
                      <Badge
                        key={idx}
                        variant="secondary"
                        className="bg-blue-100 text-blue-700 hover:bg-blue-200"
                      >
                        {specialty}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Achievements */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-blue-600 text-white hover:bg-blue-700">
              Nos résultats
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-gray-900">
              Pourquoi nous choisir ?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Des chiffres qui témoignent de notre engagement et de notre
              expertise
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-2xl font-bold mb-6 text-gray-900">
                Une expertise reconnue
              </h3>
              <div className="space-y-4">
                {whyChooseUs.map((item, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <CheckCircle className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-gray-700 leading-relaxed">
                      {item}
                    </span>
                  </div>
                ))}
              </div>

              <div className="mt-8">
                <Link href="/contact">
                  <Button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-3">
                    Découvrez nos services
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </Link>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              {achievements.map((achievement, index) => (
                <Card
                  key={index}
                  className="group text-center hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
                >
                  <CardHeader className="pb-4">
                    <div className="w-16 h-16 bg-blue-600/10 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-blue-600 group-hover:scale-110 transition-all duration-300">
                      <achievement.icon className="w-8 h-8 text-blue-600 group-hover:text-white transition-colors duration-300" />
                    </div>
                    <div className="text-3xl font-bold text-blue-600 mb-2">
                      {achievement.number}
                    </div>
                    <CardTitle className="text-lg text-gray-900">
                      {achievement.label}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-gray-600 text-sm">
                      {achievement.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative py-20 bg-gradient-to-r from-gray-900 via-blue-900 to-gray-900 text-white overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 bg-gradient-to-r from-gray-900/95 to-blue-900/95"></div>
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-20 left-20 w-32 h-32 bg-blue-600/20 rounded-full blur-xl"></div>
          <div className="absolute bottom-20 right-20 w-48 h-48 bg-blue-600/20 rounded-full blur-xl"></div>
        </div>

        <div className="relative max-w-4xl mx-auto text-center px-4">
          <div className="inline-flex items-center gap-2 bg-blue-600/20 backdrop-blur-sm rounded-full px-4 py-2 mb-6">
            <Star className="w-4 h-4 text-blue-400" />
            <span className="text-sm font-medium text-blue-200">
              Rejoignez-nous
            </span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-bold mb-6 bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
            Prêt à rejoindre notre famille de clients satisfaits ?
          </h2>
          <p className="text-xl mb-8 text-gray-200 leading-relaxed">
            Découvrez comment nous pouvons transformer votre infrastructure IT
            et propulser votre entreprise vers de nouveaux sommets
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/contact">
              <Button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-4 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                Contactez-nous
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
            <Link href="/services">
              <Button
                variant="outline"
                className="border-2 border-blue-600 text-blue-600 bg-white hover:bg-blue-600 hover:text-white font-semibold px-8 py-4 rounded-lg transition-all duration-300"
              >
                Découvrir nos services
              </Button>
            </Link>
          </div>

          <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-8 text-sm text-gray-300">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-400" />
              <span>Consultation gratuite</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-400" />
              <span>Devis personnalisé</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-400" />
              <span>Sans engagement</span>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
