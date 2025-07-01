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

  // SUPPRIMEZ cette ligne qui cause la boucle infinie :
  // dispatch(fetchMessages());

  useEffect(() => {
    // Charger les données nécessaires
    dispatch(fetchTickets());
    dispatch(fetchUsers());
    dispatch(fetchMessages()); // AJOUTEZ cette ligne ICI dans le useEffect
  }, [dispatch]);

  // Récupérer les tickets récents (5 derniers)
  const recentTickets = tickets.slice(0, 5);

  const isLoading = ticketsLoading || usersLoading || messagesLoading;

  if (
    isLoading &&
    tickets.length === 0 &&
    users.length === 0 &&
    messages.length === 0
  ) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">
        Tableau de bord administrateur
      </h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Tickets</CardTitle>
            <Ticket className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalTickets}</div>
            <p className="text-xs text-muted-foreground">Tous les tickets</p>
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
              {((stats.openTickets / stats.totalTickets) * 100 || 0).toFixed(0)}
              % du total
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
            <p className="text-xs text-muted-foreground">En traitement</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Résolus</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.resolvedTickets}</div>
            <p className="text-xs text-muted-foreground">
              {(
                (stats.resolvedTickets / stats.totalTickets) * 100 || 0
              ).toFixed(0)}
              % résolus
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Utilisateurs</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{users.length}</div>
            <p className="text-xs text-muted-foreground">Comptes actifs</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Nouveaux Messages
            </CardTitle>
            <MessageSquare className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{messageStats.newMessages}</div>
            <p className="text-xs text-muted-foreground">
              {messageStats.totalMessages} messages au total
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Tickets */}
      <Card>
        <CardHeader>
          <CardTitle>Tickets Récents</CardTitle>
          <CardDescription>Les 5 derniers tickets créés</CardDescription>
        </CardHeader>
        <CardContent>
          {recentTickets.length === 0 ? (
            <p className="text-center text-gray-600 py-8">
              Aucun ticket pour le moment
            </p>
          ) : (
            <div className="space-y-4">
              {recentTickets.map((ticket, index) => (
                <Link
                  key={index}
                  href={`/admin/tickets`}
                  className="block"
                >
                  <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="flex-1">
                      <h4 className="font-semibold">{ticket.title}</h4>
                      <p className="text-sm text-gray-600">
                        Par {ticket.userId?.name || "Utilisateur supprimé"} -{" "}
                        {formatDate(ticket.createdAt)}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {ticket.description.substring(0, 100)}
                        {ticket.description.length > 100 && "..."}
                      </p>
                    </div>
                    <div className="flex flex-col items-end gap-2">
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
          )}
        </CardContent>
      </Card>

      {/* Messages récents */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Messages récents</CardTitle>
          <Link href="/admin/messages">
            <button className="text-sm text-primary hover:underline">
              Voir tous les messages →
            </button>
          </Link>
        </CardHeader>
        <CardContent>
          {messages.slice(0, 5).map((message, index) => (
            <div key={index} className="mb-4 last:mb-0">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h4 className="font-medium">{message.name}</h4>
                    <Badge
                      variant="outline"
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
          {messages.length === 0 && (
            <p className="text-gray-500 text-center py-4">
              Aucun message pour le moment
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
                  {(
                    (stats.resolvedTickets / stats.totalTickets) * 100 || 0
                  ).toFixed(1)}
                  %
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Tickets urgents</span>
                <span className="text-sm font-medium">
                  {
                    tickets.filter(
                      (t) => t.priority === "urgent" && t.status !== "closed"
                    ).length
                  }
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Admins actifs</span>
                <span className="text-sm font-medium">
                  {users.filter((u) => u.role === "admin").length}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
