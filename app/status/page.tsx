"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/Progress";
import { Navbar, Footer } from "@/components/layout";
import {
  CheckCircle,
  AlertCircle,
  XCircle,
  Activity,
  Server,
  Globe,
  Database,
  Shield,
  RefreshCw,
  Clock,
} from "lucide-react";

interface ServiceStatus {
  name: string;
  status: "operational" | "degraded" | "outage";
  uptime: number;
  lastIncident: string | null;
  icon: any;
}

const services: ServiceStatus[] = [
  {
    name: "HelpDesk Support",
    status: "operational",
    uptime: 99.99,
    lastIncident: null,
    icon: Activity,
  },
  {
    name: "Infrastructure Réseau",
    status: "operational",
    uptime: 99.95,
    lastIncident: "Il y a 15 jours",
    icon: Globe,
  },
  {
    name: "Serveurs Cloud",
    status: "operational",
    uptime: 99.98,
    lastIncident: "Il y a 7 jours",
    icon: Server,
  },
  {
    name: "Base de données",
    status: "operational",
    uptime: 99.97,
    lastIncident: null,
    icon: Database,
  },
  {
    name: "Sécurité & Firewall",
    status: "operational",
    uptime: 100,
    lastIncident: null,
    icon: Shield,
  },
];

const incidents = [
  {
    date: "28 Juin 2025",
    service: "Infrastructure Réseau",
    status: "resolved",
    title: "Maintenance planifiée",
    description: "Mise à jour de sécurité effectuée avec succès",
    duration: "30 minutes",
  },
  {
    date: "21 Juin 2025",
    service: "Serveurs Cloud",
    status: "resolved",
    title: "Latence élevée",
    description: "Problème de performance résolu",
    duration: "1 heure",
  },
];

export default function StatusPage() {
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [isRefreshing, setIsRefreshing] = useState(false);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "operational":
        return (
          <Badge className="bg-green-100 text-green-800">Opérationnel</Badge>
        );
      case "degraded":
        return <Badge className="bg-yellow-100 text-yellow-800">Dégradé</Badge>;
      case "outage":
        return <Badge className="bg-red-100 text-red-800">Panne</Badge>;
      default:
        return <Badge>Inconnu</Badge>;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "operational":
        return <CheckCircle className="w-6 h-6 text-green-500" />;
      case "degraded":
        return <AlertCircle className="w-6 h-6 text-yellow-500" />;
      case "outage":
        return <XCircle className="w-6 h-6 text-red-500" />;
      default:
        return null;
    }
  };

  const refreshStatus = async () => {
    setIsRefreshing(true);
    // Simuler un rafraîchissement
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setLastUpdated(new Date());
    setIsRefreshing(false);
  };

  const allOperational = services.every(
    (service) => service.status === "operational"
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      {/* Hero Section */}
      <section className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold mb-2">
                Statut des Services
              </h1>
              <p className="text-gray-600">
                Surveillez en temps réel la disponibilité de nos services
              </p>
            </div>
            <Button
              onClick={refreshStatus}
              disabled={isRefreshing}
              variant="outline"
            >
              <RefreshCw
                className={`w-4 h-4 mr-2 ${isRefreshing ? "animate-spin" : ""}`}
              />
              Actualiser
            </Button>
          </div>

          {/* Overall Status */}
          <div className="mt-8">
            {allOperational ? (
              <div className="flex items-center space-x-3 p-4 bg-green-50 rounded-lg border border-green-200">
                <CheckCircle className="w-8 h-8 text-green-500" />
                <div>
                  <p className="font-semibold text-green-800">
                    Tous les systèmes sont opérationnels
                  </p>
                  <p className="text-sm text-green-600">
                    Dernière vérification :{" "}
                    {lastUpdated.toLocaleTimeString("fr-FR")}
                  </p>
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-3 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                <AlertCircle className="w-8 h-8 text-yellow-500" />
                <div>
                  <p className="font-semibold text-yellow-800">
                    Certains services rencontrent des problèmes
                  </p>
                  <p className="text-sm text-yellow-600">
                    Nous travaillons à la résolution
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Services Status */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold mb-8">État des services</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service, index) => {
              const Icon = service.icon;
              return (
                <Card key={index} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="p-2 bg-gray-100 rounded-lg">
                          <Icon className="w-6 h-6 text-gray-700" />
                        </div>
                        <div>
                          <CardTitle className="text-lg">
                            {service.name}
                          </CardTitle>
                          {getStatusBadge(service.status)}
                        </div>
                      </div>
                      {getStatusIcon(service.status)}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-gray-600">Disponibilité</span>
                          <span className="font-medium">{service.uptime}%</span>
                        </div>
                        <Progress value={service.uptime} className="h-2" />
                      </div>

                      {service.lastIncident && (
                        <div className="text-sm text-gray-600">
                          <Clock className="w-4 h-4 inline mr-1" />
                          Dernier incident : {service.lastIncident}
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Recent Incidents */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold mb-8">Incidents récents</h2>

          <div className="space-y-4">
            {incidents.length > 0 ? (
              incidents.map((incident, index) => (
                <Card key={index}>
                  <CardHeader>
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                      <div>
                        <CardTitle className="text-lg">
                          {incident.title}
                        </CardTitle>
                        <CardDescription>
                          {incident.service} • {incident.date}
                        </CardDescription>
                      </div>
                      <Badge className="bg-green-100 text-green-800 w-fit">
                        Résolu
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 mb-2">{incident.description}</p>
                    <p className="text-sm text-gray-500">
                      Durée : {incident.duration}
                    </p>
                  </CardContent>
                </Card>
              ))
            ) : (
              <Card>
                <CardContent className="text-center py-8">
                  <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
                  <p className="text-gray-600">
                    Aucun incident récent. Tous nos services fonctionnent
                    normalement.
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </section>

      {/* Uptime Stats */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-primary text-white rounded-2xl p-8 text-center">
            <h2 className="text-2xl font-bold mb-4">
              Statistiques de disponibilité
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mt-8">
              <div>
                <div className="text-4xl font-bold mb-2">99.98%</div>
                <p className="text-blue-100">Disponibilité moyenne</p>
              </div>
              <div>
                <div className="text-4xl font-bold mb-2">{`<`} 2h</div>
                <p className="text-blue-100">Temps de résolution moyen</p>
              </div>
              <div>
                <div className="text-4xl font-bold mb-2">365j</div>
                <p className="text-blue-100">Surveillance continue</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
