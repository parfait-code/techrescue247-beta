import { notFound } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  ArrowLeft,
  CheckCircle,
  Zap,
  Shield,
  Star,
  Users,
  Clock,
} from "lucide-react";
import { servicesData } from "@/constants/services";

interface ServicePageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function ServicePage({ params }: ServicePageProps) {
  const { slug } = await params;
  const service = servicesData.find((s) => s.slug === slug);

  if (!service) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary via-blue-600 to-primary text-white py-20 sm:py-24 overflow-hidden">
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link href="/services">
            <Button
              variant="ghost"
              className="text-white hover:text-blue-200 hover:bg-white/10 mb-6 transition-all duration-200"
            >
              <ArrowLeft className="mr-2 w-4 h-4" />
              Retour aux services
            </Button>
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                {service.title}
              </h1>
              <p className="text-xl text-blue-100 mb-8 leading-relaxed">
                {service.description}
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/contact">
                  <Button
                    size="lg"
                    className="bg-white text-blue-600 hover:bg-blue-50 font-semibold"
                  >
                    Obtenir un devis gratuit
                  </Button>
                </Link>
                <Link href="/dashboard/tickets/new">
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-white bg-transparent text-white hover:bg-white hover:text-blue-600 font-semibold"
                  >
                    Créer un ticket
                  </Button>
                </Link>
              </div>
            </div>

            <div className="hidden lg:block">
              <div className="grid grid-cols-1 gap-4">
                <div className="flex items-center space-x-3 bg-white/10 backdrop-blur-sm rounded-lg p-4">
                  <Star className="w-6 h-6 text-yellow-400" />
                  <span className="text-blue-100">Service Premium</span>
                </div>
                <div className="flex items-center space-x-3 bg-white/10 backdrop-blur-sm rounded-lg p-4">
                  <Users className="w-6 h-6 text-blue-200" />
                  <span className="text-blue-100">Équipe d&apos;experts</span>
                </div>
                <div className="flex items-center space-x-3 bg-white/10 backdrop-blur-sm rounded-lg p-4">
                  <Clock className="w-6 h-6 text-blue-200" />
                  <span className="text-blue-100">Support 24/7</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features & Benefits */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Fonctionnalités et Avantages
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Découvrez tout ce que notre service peut vous apporter
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Features */}
            <Card className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-t-4 border-t-blue-600">
              <CardHeader className="pb-6">
                <CardTitle className="flex items-center gap-3 text-2xl">
                  <div className="w-12 h-12 bg-blue-600/10 rounded-lg flex items-center justify-center">
                    <Zap className="w-6 h-6 text-blue-600" />
                  </div>
                  Fonctionnalités clés
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-4">
                  {service.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700 leading-relaxed">
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Benefits */}
            <Card className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-t-4 border-t-blue-600">
              <CardHeader className="pb-6">
                <CardTitle className="flex items-center gap-3 text-2xl">
                  <div className="w-12 h-12 bg-blue-600/10 rounded-lg flex items-center justify-center">
                    <Shield className="w-6 h-6 text-blue-600" />
                  </div>
                  Bénéfices pour votre entreprise
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-4">
                  {service.benefits.map((benefit, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700 leading-relaxed">
                        {benefit}
                      </span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Process & Technologies Tabs */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Notre Approche
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Processus éprouvé et technologies de pointe
            </p>
          </div>

          <Tabs defaultValue="process" className="w-full">
            <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 bg-blue-50 border border-blue-200">
              <TabsTrigger
                value="process"
                className="data-[state=active]:bg-blue-600 data-[state=active]:text-white"
              >
                Notre Processus
              </TabsTrigger>
              <TabsTrigger
                value="technologies"
                className="data-[state=active]:bg-blue-600 data-[state=active]:text-white"
              >
                Technologies
              </TabsTrigger>
            </TabsList>

            <TabsContent value="process" className="mt-12">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {service.process.map((step, index) => (
                  <Card
                    key={index}
                    className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1 relative"
                  >
                    <CardHeader className="pb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-lg shadow-lg">
                          {index + 1}
                        </div>
                        <CardTitle className="text-lg">{step.title}</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-600 leading-relaxed">
                        {step.description}
                      </p>
                    </CardContent>
                    {index < service.process.length - 1 && (
                      <div className="hidden lg:block absolute top-8 -right-3 w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                        <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                      </div>
                    )}
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="technologies" className="mt-12">
              <div className="bg-blue-50 rounded-2xl p-8">
                <h3 className="text-2xl font-bold text-center mb-8 text-blue-900">
                  Technologies que nous maîtrisons
                </h3>
                <div className="flex flex-wrap gap-3 justify-center">
                  {service.technologies.map((tech, index) => (
                    <Badge
                      key={index}
                      variant="secondary"
                      className="text-sm py-2 px-4 bg-white text-blue-700 border border-blue-200 hover:bg-blue-600 hover:text-white transition-all duration-200"
                    >
                      {tech}
                    </Badge>
                  ))}
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Questions fréquentes
            </h2>
            <p className="text-xl text-gray-600">
              Retrouvez les réponses aux questions les plus courantes
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-8">
            <Accordion type="single" collapsible>
              {service.faq.map((item, index) => (
                <AccordionItem
                  key={index}
                  value={`item-${index}`}
                  className="border-b border-gray-200"
                >
                  <AccordionTrigger className="text-left hover:text-blue-600 transition-colors duration-200 text-lg font-semibold">
                    {item.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-600 leading-relaxed pt-2">
                    {item.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-blue-600 text-white py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-white/5 [mask-image:linear-gradient(0deg,transparent,rgba(255,255,255,0.3))]" />
        <div className="relative max-w-4xl mx-auto text-center px-4">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Prêt à démarrer votre projet ?
            </h2>
            <p className="text-xl mb-8 text-blue-100">
              Contactez nos experts pour discuter de vos besoins en{" "}
              {service.title.toLowerCase()} et obtenez un devis personnalisé
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/contact">
                <Button
                  size="lg"
                  className="bg-white text-blue-600 hover:bg-blue-50 font-semibold"
                >
                  Demander un devis gratuit
                </Button>
              </Link>
              <Link href="/dashboard/tickets/new">
                <Button
                  size="lg"
                  variant="outline"
                  className="text-white bg-transparent border-white hover:bg-white hover:text-blue-600 font-semibold"
                >
                  Créer un ticket support
                </Button>
              </Link>
            </div>

            <div className="mt-8 flex items-center justify-center space-x-6 text-blue-200">
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-5 h-5" />
                <span>Devis gratuit</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-5 h-5" />
                <span>Réponse sous 24h</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-5 h-5" />
                <span>Sans engagement</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
