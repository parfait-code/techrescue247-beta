"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Navbar, Footer } from "@/components/layout";
import { toast } from "sonner";
import { Phone, Mail, MapPin, Clock, MessageCircle, Send } from "lucide-react";

const contactSchema = z.object({
  name: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
  email: z.string().email("Email invalide"),
  phone: z.string().min(9, "Numéro de téléphone invalide"),
  subject: z.string().min(5, "Le sujet doit contenir au moins 5 caractères"),
  message: z
    .string()
    .min(20, "Le message doit contenir au moins 20 caractères"),
});

type ContactData = z.infer<typeof contactSchema>;

const contactInfo = [
  {
    icon: Phone,
    title: "Téléphone",
    content: "+237 123 456 789",
    action: "tel:+237123456789",
  },
  {
    icon: Mail,
    title: "Email",
    content: "contact@techrescue247.com",
    action: "mailto:contact@techrescue247.com",
  },
  {
    icon: MapPin,
    title: "Adresse",
    content: "Yaoundé, Centre, Cameroun",
    action: null,
  },
  {
    icon: Clock,
    title: "Horaires",
    content: "24/7 - Toujours disponibles",
    action: null,
  },
];

export default function ContactPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactData>({
    resolver: zodResolver(contactSchema),
  });

  const onSubmit = async (data: ContactData) => {
    setIsSubmitting(true);
    try {
      // Simuler l'envoi du formulaire
      await new Promise((resolve) => setTimeout(resolve, 2000));

      toast.success("Message envoyé avec succès !");
      reset();
    } catch (error) {
      toast.error("Erreur lors de l'envoi du message");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Navbar */}
      <Navbar />

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary to-blue-700 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl sm:text-5xl font-bold mb-4">
              Contactez-nous
            </h1>
            <p className="text-xl text-blue-100 max-w-2xl mx-auto">
              Notre équipe est à votre écoute pour répondre à toutes vos
              questions
            </p>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Contact Form */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl">
                    Envoyez-nous un message
                  </CardTitle>
                  <CardDescription>
                    Remplissez le formulaire ci-dessous et nous vous répondrons
                    dans les plus brefs délais
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="name">Nom complet *</Label>
                        <Input
                          id="name"
                          {...register("name")}
                          placeholder="Jean Dupont"
                        />
                        {errors.name && (
                          <p className="text-sm text-red-500">
                            {errors.name.message}
                          </p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="email">Email *</Label>
                        <Input
                          id="email"
                          type="email"
                          {...register("email")}
                          placeholder="jean@exemple.com"
                        />
                        {errors.email && (
                          <p className="text-sm text-red-500">
                            {errors.email.message}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="phone">Téléphone *</Label>
                        <Input
                          id="phone"
                          {...register("phone")}
                          placeholder="+237 600 000 000"
                        />
                        {errors.phone && (
                          <p className="text-sm text-red-500">
                            {errors.phone.message}
                          </p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="subject">Sujet *</Label>
                        <Input
                          id="subject"
                          {...register("subject")}
                          placeholder="Demande d'information"
                        />
                        {errors.subject && (
                          <p className="text-sm text-red-500">
                            {errors.subject.message}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="message">Message *</Label>
                      <Textarea
                        id="message"
                        {...register("message")}
                        placeholder="Décrivez votre demande en détail..."
                        rows={6}
                      />
                      {errors.message && (
                        <p className="text-sm text-red-500">
                          {errors.message.message}
                        </p>
                      )}
                    </div>

                    <Button
                      type="submit"
                      size="lg"
                      className="w-full sm:w-auto"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        "Envoi en cours..."
                      ) : (
                        <>
                          <Send className="mr-2" />
                          Envoyer le message
                        </>
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>

            {/* Contact Info */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Informations de contact</CardTitle>
                  <CardDescription>
                    Vous pouvez également nous contacter directement
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {contactInfo.map((info, index) => {
                      const Icon = info.icon;
                      return (
                        <div key={index} className="flex items-start space-x-4">
                          <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                            <Icon className="w-5 h-5 text-primary" />
                          </div>
                          <div>
                            <h3 className="font-semibold">{info.title}</h3>
                            {info.action ? (
                              <a
                                href={info.action}
                                className="text-gray-600 hover:text-primary transition-colors"
                              >
                                {info.content}
                              </a>
                            ) : (
                              <p className="text-gray-600">{info.content}</p>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Support immédiat</CardTitle>
                  <CardDescription>
                    Besoin d&apos;une assistance urgente ?
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <p className="text-gray-600">
                      Pour les problèmes urgents, notre équipe de support est
                      disponible 24/7.
                    </p>
                    <Button className="w-full" variant="outline">
                      <MessageCircle className="mr-2" />
                      Démarrer un chat
                    </Button>
                    <Button className="w-full">
                      <Phone className="mr-2" />
                      Appeler maintenant
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Map Section (Optional) */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Notre localisation</h2>
            <p className="text-gray-600">
              Nous sommes situés au cœur de Yaoundé, facilement accessibles pour
              nos clients
            </p>
          </div>
          <div className="bg-gray-200 h-96 rounded-lg flex items-center justify-center">
            <p className="text-gray-500">Carte interactive ici</p>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
