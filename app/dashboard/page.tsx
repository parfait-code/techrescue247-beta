"use client";

import { useEffect } from "react";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Ticket, Clock, CheckCircle, AlertCircle, Plus } from "lucide-react";
import { formatDate, getStatusColor, getPriorityColor } from "@/lib/utils";
import { useAppDispatch, useAuth, useTickets } from "@/store/hooks";
import { fetchTickets } from "@/store/slices/ticketSlice";

export default function DashboardPage() {
  const dispatch = useAppDispatch();
  const { user } = useAuth();
  const { tickets, stats, isLoading } = useTickets();

  useEffect(() => {
    // Charger les tickets au montage du composant
    dispatch(fetchTickets());
  }, [dispatch]);

  // Récupérer les tickets récents (3 derniers)
  const recentTickets = tickets.slice(0, 3);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Mon tableau de bord</h1>
          <p className="text-gray-600 mt-1">Bienvenue, {user?.name} !</p>
        </div>
        <Link href="/dashboard/tickets/new">
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Nouveau ticket
          </Button>
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Mes Tickets</CardTitle>
            <Ticket className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalTickets}</div>
            <p className="text-xs text-muted-foreground">
              Total de vos demandes
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ouverts</CardTitle>
            <AlertCircle className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.openTickets}</div>
            <p className="text-xs text-muted-foreground">
              En attente de traitement
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">En cours</CardTitle>
            <Clock className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.inProgressTickets}</div>
            <p className="text-xs text-muted-foreground">Traitement en cours</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Résolus</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.resolvedTickets}</div>
            <p className="text-xs text-muted-foreground">Problèmes résolus</p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Tickets */}
      {recentTickets.length > 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>Tickets Récents</CardTitle>
            <CardDescription>Vos derniers tickets créés</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentTickets.map((ticket) => (
                <Link
                  key={ticket._id}
                  href={`/dashboard/tickets/${ticket._id}`}
                  className="block"
                >
                  <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="flex-1">
                      <h4 className="font-semibold">{ticket.title}</h4>
                      <p className="text-sm text-gray-600">
                        {formatDate(ticket.createdAt)}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                          ticket.status
                        )}`}
                      >
                        {ticket.status === "open" && "Ouvert"}
                        {ticket.status === "in-progress" && "En cours"}
                        {ticket.status === "resolved" && "Résolu"}
                        {ticket.status === "closed" && "Fermé"}
                      </span>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(
                          ticket.priority
                        )}`}
                      >
                        {ticket.priority === "low" && "Faible"}
                        {ticket.priority === "medium" && "Moyen"}
                        {ticket.priority === "high" && "Élevé"}
                        {ticket.priority === "urgent" && "Urgent"}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
            <div className="mt-4">
              <Link href="/dashboard/tickets">
                <Button variant="outline" className="w-full">
                  Voir tous les tickets
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="text-center py-12">
            <Ticket className="w-12 h-12 mx-auto mb-4 text-gray-400" />
            <h3 className="text-lg font-semibold mb-2">
              Aucun ticket pour le moment
            </h3>
            <p className="text-gray-600 mb-4">
              Créez votre premier ticket pour obtenir de l&apos;aide
            </p>
            <Link href="/dashboard/tickets/new">
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Créer un ticket
              </Button>
            </Link>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
