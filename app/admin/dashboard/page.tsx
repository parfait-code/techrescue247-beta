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
import {
  Ticket,
  Users,
  Clock,
  CheckCircle,
  AlertCircle,
  MessageSquare,
} from "lucide-react";
import { formatDate, getStatusColor, getPriorityColor } from "@/lib/utils";
import {
  useAppDispatch,
  useTickets,
  useUsers,
  useMessages,
} from "@/store/hooks";
import { fetchTickets } from "@/store/slices/ticketSlice";
import { fetchUsers } from "@/store/slices/userSlice";
import { fetchMessages } from "@/store/slices/messageSlice";
import { Badge } from "@/components/ui/badge";

export default function AdminDashboardPage() {
  const dispatch = useAppDispatch();
  const { tickets, stats, isLoading: ticketsLoading } = useTickets();
  const { users, isLoading: usersLoading } = useUsers();
  const {
    messages,
    stats: messageStats,
    isLoading: messagesLoading,
  } = useMessages();

  useEffect(() => {
    // Charger les données nécessaires
    dispatch(fetchTickets());
    dispatch(fetchUsers());
    dispatch(fetchMessages());
  }, [dispatch]);

  // S'assurer que les tableaux existent
  const safeTickets = Array.isArray(tickets) ? tickets : [];
  const safeUsers = Array.isArray(users) ? users : [];
  const safeMessages = Array.isArray(messages) ? messages : [];

  // Récupérer les tickets récents (5 derniers)
  const recentTickets = safeTickets.slice(0, 5);

  const isLoading = ticketsLoading || usersLoading || messagesLoading;

  if (
    isLoading &&
    safeTickets.length === 0 &&
    safeUsers.length === 0 &&
    safeMessages.length === 0
  ) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Calculer les statistiques de manière sûre
  const safeStats = {
    totalTickets: stats?.totalTickets || 0,
    openTickets: stats?.openTickets || 0,
    inProgressTickets: stats?.inProgressTickets || 0,
    resolvedTickets: stats?.resolvedTickets || 0,
  };

  const safeMessageStats = {
    newMessages: messageStats?.newMessages || 0,
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">
        Tableau de bord administrateur
      </h1>

      {/* Cartes de statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Tickets totaux
            </CardTitle>
            <Ticket className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{safeStats.totalTickets}</div>
            <p className="text-xs text-muted-foreground">
              Tous les tickets créés
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Tickets ouverts
            </CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{safeStats.openTickets}</div>
            <p className="text-xs text-muted-foreground">En attente</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Utilisateurs totaux
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{safeUsers.length}</div>
            <p className="text-xs text-muted-foreground">
              Utilisateurs enregistrés
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Messages non lus
            </CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {safeMessageStats.newMessages}
            </div>
            <p className="text-xs text-muted-foreground">Messages de contact</p>
          </CardContent>
        </Card>
      </div>

      {/* Tickets récents */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Tickets récents</CardTitle>
          <CardDescription>Les 5 derniers tickets créés</CardDescription>
        </CardHeader>
        <CardContent>
          {recentTickets.map((ticket) => (
            <div key={ticket._id} className="mb-4 pb-4 border-b last:border-0">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h4 className="font-semibold">{ticket.title}</h4>
                  <p className="text-sm text-gray-600">
                    Par: {ticket.user?.name || "Utilisateur inconnu"}
                  </p>
                  <div className="flex gap-2 mt-2">
                    <Badge className={getStatusColor(ticket.status)}>
                      {ticket.status === "open"
                        ? "Ouvert"
                        : ticket.status === "in-progress"
                        ? "En cours"
                        : ticket.status === "resolved"
                        ? "Résolu"
                        : "Fermé"}
                    </Badge>
                    <Badge className={getPriorityColor(ticket.priority)}>
                      {ticket.priority === "low"
                        ? "Faible"
                        : ticket.priority === "medium"
                        ? "Moyen"
                        : ticket.priority === "high"
                        ? "Élevé"
                        : "Urgent"}
                    </Badge>
                  </div>
                </div>
                <Link href={`/admin/tickets/${ticket._id}`}>
                  <button className="text-blue-600 hover:text-blue-800">
                    Voir →
                  </button>
                </Link>
              </div>
            </div>
          ))}
          {recentTickets.length === 0 && (
            <p className="text-gray-500 text-center py-4">
              Aucun ticket pour le moment
            </p>
          )}
        </CardContent>
      </Card>

      {/* Messages récents */}
      <Card>
        <CardHeader>
          <CardTitle>Messages récents</CardTitle>
          <CardDescription>Messages de contact non lus</CardDescription>
        </CardHeader>
        <CardContent>
          {safeMessages
            .filter((message) => message.status === "new")
            .slice(0, 5)
            .map((message) => (
              <div
                key={message._id}
                className="mb-4 pb-4 border-b last:border-0"
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h4 className="font-semibold">{message.name}</h4>
                    <p className="text-sm text-gray-600">{message.email}</p>
                    <div className="mt-2">
                      <Badge
                        className={
                          message.status === "new"
                            ? "bg-blue-100 text-blue-700"
                            : "bg-gray-100 text-gray-700"
                        }
                      >
                        {message.status === "new" ? "Nouveau" : "Lu"}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 line-clamp-1">
                      {message.subject}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {formatDate(message.createdAt)}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          {safeMessages.filter((message) => message.status === "new").length ===
            0 && (
            <p className="text-gray-500 text-center py-4">
              Aucun message non lu
            </p>
          )}
        </CardContent>
      </Card>

      {/* Actions rapides */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        <Card>
          <CardHeader>
            <CardTitle>Actions rapides</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Link href="/admin/tickets" className="block">
              <button className="w-full text-left px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors">
                → Gérer tous les tickets
              </button>
            </Link>
            <Link href="/admin/users" className="block">
              <button className="w-full text-left px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors">
                → Gérer les utilisateurs
              </button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Statistiques rapides</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">
                  Taux de résolution
                </span>
                <span className="text-sm font-medium">
                  {safeStats.totalTickets > 0
                    ? (
                        (safeStats.resolvedTickets / safeStats.totalTickets) *
                        100
                      ).toFixed(1)
                    : 0}
                  %
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Tickets urgents</span>
                <span className="text-sm font-medium">
                  {
                    safeTickets.filter(
                      (t) => t.priority === "urgent" && t.status !== "closed"
                    ).length
                  }
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Admins actifs</span>
                <span className="text-sm font-medium">
                  {safeUsers.filter((u) => u.role === "admin").length}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
