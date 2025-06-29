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
import { useAuth } from "@/store/hooks";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Headphones,
  Clock,
  Shield,
  Zap,
  MessageCircle,
  Phone,
  Mail,
  CheckCircle,
  ArrowRight,
  Globe,
  Sparkles,
} from "lucide-react";

const helpdeskFeatures = [
  {
    icon: Clock,
    title: "Support 24/7",
    description:
      "Notre équipe est disponible 24 heures sur 24, 7 jours sur 7 pour vous assister.",
  },
  {
    icon: Zap,
    title: "Réponse rapide",
    description:
      "Temps de réponse garanti en moins de 2 heures pour toute demande.",
  },
  {
    icon: Shield,
    title: "Sécurité maximale",
    description:
      "Interventions sécurisées avec respect total de vos données confidentielles.",
  },
  {
    icon: Globe,
    title: "Support à distance",
    description:
      "Assistance à distance sécurisée pour résoudre vos problèmes rapidement.",
  },
];

// const supportTypes = [
//   {
//     title: "Support Niveau 1",
//     description: "Assistance de base",
//     features: [
//       "Résolution des problèmes courants",
//       "Support par email",
//       "Temps de réponse < 24h",
//       "Base de connaissances",
//     ],
//     price: "À partir de 50€/mois",
//   },
//   {
//     title: "Support Niveau 2",
//     description: "Assistance avancée",
//     features: [
//       "Support téléphonique inclus",
//       "Temps de réponse < 4h",
//       "Assistance à distance",
//       "Priority support",
//     ],
//     price: "À partir de 150€/mois",
//     popular: true,
//   },
//   {
//     title: "Support Niveau 3",
//     description: "Assistance premium",
//     features: [
//       "Support dédié 24/7",
//       "Temps de réponse < 1h",
//       "Technicien dédié",
//       "Rapports mensuels",
//     ],
//     price: "Sur devis",
//   },
// ];

const faqs = [
  {
    question: "Comment fonctionne votre service HelpDesk ?",
    answer:
      "Notre service HelpDesk fonctionne via un système de tickets. Vous créez un ticket décrivant votre problème, et notre équipe d'experts vous répond dans les délais garantis selon votre niveau de support.",
  },
  {
    question: "Quels types de problèmes pouvez-vous résoudre ?",
    answer:
      "Nous gérons tous types de problèmes IT : pannes matérielles, problèmes logiciels, configuration réseau, sécurité, sauvegarde de données, et bien plus encore.",
  },
  {
    question: "Proposez-vous un support sur site ?",
    answer:
      "Oui, pour les clients avec un contrat de support Niveau 2 ou 3, nous proposons des interventions sur site lorsque le problème ne peut pas être résolu à distance.",
  },
  {
    question: "Comment puis-je suivre l'état de mon ticket ?",
    answer:
      "Vous pouvez suivre l'état de vos tickets en temps réel depuis votre dashboard. Vous recevez également des notifications par email à chaque mise à jour.",
  },
  {
    question: "Vos techniciens sont-ils certifiés ?",
    answer:
      "Oui, tous nos techniciens sont certifiés et régulièrement formés sur les dernières technologies. Ils possèdent des certifications Microsoft, Cisco, VMware, et autres.",
  },
];

export default function HelpDeskPage() {
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary via-blue-600 to-primary text-white overflow-hidden">
        <div className="absolute inset-0 bg-grid-white/10 [mask-image:linear-gradient(0deg,transparent,rgba(255,255,255,0.5))]" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
          <div className="text-center">
            <Badge variant="secondary" className="mb-4 px-4 py-1">
              <Sparkles className="w-4 h-4 mr-1" />
              Service N°1 au Cameroun
            </Badge>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">
              HelpDesk IT Professionnel
            </h1>
            <p className="text-xl sm:text-2xl mb-8 max-w-3xl mx-auto text-blue-100">
              Résolution rapide de tous vos problèmes informatiques avec notre
              équipe d&apos;experts certifiés
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              {isAuthenticated ? (
                <Link href="/dashboard/tickets/new">
                  <Button
                    size="lg"
                    variant="secondary"
                    className="text-lg px-8"
                  >
                    <Headphones className="mr-2" />
                    Créer un ticket
                  </Button>
                </Link>
              ) : (
                <>
                  <Link href="/register">
                    <Button
                      size="lg"
                      variant="secondary"
                      className="text-lg px-8"
                    >
                      Essayer gratuitement
                    </Button>
                  </Link>
                  <Link href="/contact">
                    <Button
                      size="lg"
                      variant="outline"
                      className="text-lg px-8 bg-white/10 text-white border-white hover:bg-white hover:text-primary"
                    >
                      <Phone className="mr-2" />
                      Parler à un expert
                    </Button>
                  </Link>
                </>
              )}
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 max-w-4xl mx-auto">
              <div>
                <div className="text-3xl font-bold">1k+</div>
                <div className="text-blue-200">Tickets résolus</div>
              </div>
              <div>
                <div className="text-3xl font-bold"> {`<`} 2h</div>
                <div className="text-blue-200">Temps de réponse</div>
              </div>
              <div>
                <div className="text-3xl font-bold">98%</div>
                <div className="text-blue-200">Satisfaction client</div>
              </div>
              <div>
                <div className="text-3xl font-bold">24/7</div>
                <div className="text-blue-200">Disponibilité</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Un support IT complet et fiable
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Notre HelpDesk combine expertise technique et service client
              exceptionnel
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {helpdeskFeatures.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card
                  key={index}
                  className="text-center hover:shadow-lg transition-shadow"
                >
                  <CardHeader>
                    <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Icon className="w-8 h-8 text-primary" />
                    </div>
                    <CardTitle>{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription>{feature.description}</CardDescription>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Support Plans */}
      {/* <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Choisissez votre niveau de support
            </h2>
            <p className="text-xl text-gray-600">
              Des plans adaptés à chaque entreprise
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {supportTypes.map((plan, index) => (
              <Card
                key={index}
                className={`relative hover:shadow-lg transition-shadow ${
                  plan.popular ? "border-primary shadow-md" : ""
                }`}
              >
                {plan.popular && (
                  <Badge className="absolute -top-3 left-1/2 -translate-x-1/2">
                    Plus populaire
                  </Badge>
                )}
                <CardHeader>
                  <CardTitle className="text-2xl">{plan.title}</CardTitle>
                  <CardDescription>{plan.description}</CardDescription>
                  <div className="text-3xl font-bold mt-4 text-primary">
                    {plan.price}
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3 mb-6">
                    {plan.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start">
                        <CheckCircle className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Link
                    href={
                      isAuthenticated ? "/dashboard/tickets/new" : "/contact"
                    }
                  >
                    <Button
                      className="w-full"
                      variant={plan.popular ? "default" : "outline"}
                    >
                      Choisir ce plan
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section> */}

      {/* How it works */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Comment ça marche ?
            </h2>
            <p className="text-xl text-gray-600">
              Un processus simple et efficace
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              {
                step: "1",
                title: "Créez un ticket",
                description:
                  "Décrivez votre problème via notre interface simple",
              },
              {
                step: "2",
                title: "Attribution rapide",
                description:
                  "Un expert est assigné à votre demande immédiatement",
              },
              {
                step: "3",
                title: "Résolution",
                description: "Notre technicien travaille sur votre problème",
              },
              {
                step: "4",
                title: "Suivi & clôture",
                description: "Validation de la solution et support continu",
              },
            ].map((item, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-primary text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                  {item.step}
                </div>
                <h3 className="font-semibold text-lg mb-2">{item.title}</h3>
                <p className="text-gray-600">{item.description}</p>
                {index < 3 && (
                  <ArrowRight className="w-6 h-6 text-gray-400 mx-auto mt-4 hidden md:block" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">
            Questions fréquentes
          </h2>
          <Accordion type="single" collapsible>
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger className="text-left">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent>{faq.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary text-white">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Prêt à améliorer votre support IT ?
          </h2>
          <p className="text-xl mb-8 text-blue-100">
            Rejoignez plus de 100 entreprises qui nous font confiance
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {isAuthenticated ? (
              <Link href="/dashboard/tickets/new">
                <Button size="lg" variant="secondary">
                  <MessageCircle className="mr-2" />
                  Créer mon premier ticket
                </Button>
              </Link>
            ) : (
              <>
                <Link href="/register">
                  <Button size="lg" variant="secondary">
                    Commencer l&apos;essai gratuit
                  </Button>
                </Link>
                <Link href="/contact">
                  <Button
                    size="lg"
                    variant="outline"
                    className="bg-white/10 text-white border-white hover:bg-white hover:text-primary"
                  >
                    <Mail className="mr-2" />
                    Demander une démo
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
