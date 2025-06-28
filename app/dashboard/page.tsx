"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import {
  Ticket,
  Clock,
  CheckCircle,
  AlertCircle,
  Plus,
  Eye,
  Calendar,
  Phone,
  User,
  ExternalLink,
} from "lucide-react";
import { formatDate, getStatusColor, getPriorityColor } from "@/lib/utils";
import { useAppDispatch, useAuth, useTickets } from "@/store/hooks";
import { fetchTickets } from "@/store/slices/ticketSlice";

interface TicketDetails {
  _id: string;
  title: string;
  description: string;
  status: string;
  priority: string;
  phone: string;
  createdAt: string;
  updatedAt?: string;
  screenshots?: string[];
  userId?: {
    name: string;
    email: string;
  };
}

export default function DashboardPage() {
  const dispatch = useAppDispatch();
  const { user } = useAuth();
  const { tickets, stats, isLoading } = useTickets();
  const [selectedTicket, setSelectedTicket] = useState<TicketDetails | null>(
    null
  );
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);

  useEffect(() => {
    // Charger les tickets au montage du composant
    dispatch(fetchTickets());
  }, [dispatch]);

  // Récupérer les tickets récents (3 derniers)
  const recentTickets = tickets.slice(0, 3);

  const getStatusText = (status: string) => {
    switch (status) {
      case "open":
        return "Ouvert";
      case "in-progress":
        return "En cours";
      case "resolved":
        return "Résolu";
      case "closed":
        return "Fermé";
      default:
        return status;
    }
  };

  const getPriorityText = (priority: string) => {
    switch (priority) {
      case "low":
        return "Faible";
      case "medium":
        return "Moyen";
      case "high":
        return "Élevé";
      case "urgent":
        return "Urgent";
      default:
        return priority;
    }
  };

  const openDetailsDialog = (ticket: any) => {
    setSelectedTicket(ticket);
    setDetailsDialogOpen(true);
  };

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
                <div
                  key={ticket._id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
                  onClick={() => openDetailsDialog(ticket)}
                >
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
                      {getStatusText(ticket.status)}
                    </span>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(
                        ticket.priority
                      )}`}
                    >
                      {getPriorityText(ticket.priority)}
                    </span>
                    <Button variant="ghost" size="sm">
                      <Eye className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
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

      {/* Dialog pour afficher les détails du ticket */}
      <Dialog open={detailsDialogOpen} onOpenChange={setDetailsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Détails du ticket</DialogTitle>
            <DialogDescription>
              Ticket #{selectedTicket?._id.slice(-6)}
            </DialogDescription>
          </DialogHeader>
          {selectedTicket && (
            <div className="space-y-4">
              {/* Informations principales */}
              <div>
                <h3 className="font-semibold text-lg mb-2">
                  {selectedTicket.title}
                </h3>
                <div className="flex items-center gap-2 mb-3">
                  <Badge
                    variant="secondary"
                    className={getPriorityColor(selectedTicket.priority)}
                  >
                    {getPriorityText(selectedTicket.priority)}
                  </Badge>
                  <Badge
                    variant="secondary"
                    className={getStatusColor(selectedTicket.status)}
                  >
                    {getStatusText(selectedTicket.status)}
                  </Badge>
                </div>
              </div>

              <Separator />

              {/* Description */}
              <div>
                <h4 className="font-medium mb-2">Description</h4>
                <p className="text-gray-700 whitespace-pre-wrap">
                  {selectedTicket.description}
                </p>
              </div>

              <Separator />

              {/* Informations de contact */}
              <div>
                <h4 className="font-medium mb-2">Informations de contact</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-gray-500" />
                    <span className="text-sm">
                      {user?.name || "Utilisateur"}
                    </span>
                  </div>
                  {selectedTicket.phone && (
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-gray-500" />
                      <span className="text-sm">{selectedTicket.phone}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-gray-500" />
                    <span className="text-sm">
                      Créé le {formatDate(selectedTicket.createdAt)}
                    </span>
                  </div>
                  {selectedTicket.updatedAt && (
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-gray-500" />
                      <span className="text-sm">
                        Mis à jour le {formatDate(selectedTicket.updatedAt)}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Captures d'écran */}
              {selectedTicket.screenshots &&
                selectedTicket.screenshots.length > 0 && (
                  <>
                    <Separator />
                    <div>
                      <h4 className="font-medium mb-2">
                        Captures d&apos;écran
                      </h4>
                      <div className="grid grid-cols-2 gap-2">
                        {selectedTicket.screenshots.map(
                          (screenshot: string, index: number) => (
                            <a
                              key={index}
                              href={screenshot}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="group relative border rounded-lg overflow-hidden hover:shadow-md transition-shadow"
                            >
                              <img
                                src={screenshot}
                                alt={`Capture ${index + 1}`}
                                className="w-full h-32 object-cover"
                              />
                              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-opacity flex items-center justify-center">
                                <ExternalLink className="w-6 h-6 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                              </div>
                            </a>
                          )
                        )}
                      </div>
                    </div>
                  </>
                )}

              {/* Actions */}
              <Separator />
              <div className="flex justify-end gap-2">
                <Link href={`/dashboard/tickets/${selectedTicket._id}`}>
                  <Button variant="outline">Voir la page complète</Button>
                </Link>
                <Button
                  variant="default"
                  onClick={() => setDetailsDialogOpen(false)}
                >
                  Fermer
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
