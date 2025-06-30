"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
  Plus,
  Search,
  Filter,
  Calendar,
  Phone,
  User,
  Eye,
  ExternalLink,
  Image as ImageIcon,
} from "lucide-react";
import { formatDate, getStatusColor, getPriorityColor } from "@/lib/utils";
import { useAppDispatch, useTickets, useAuth } from "@/store/hooks";
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

export default function TicketsPage() {
  const dispatch = useAppDispatch();
  const { tickets, isLoading } = useTickets();
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [selectedTicket, setSelectedTicket] = useState<TicketDetails | null>(
    null
  );
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);

  useEffect(() => {
    dispatch(fetchTickets());
  }, [dispatch]);

  // Filtrer les tickets
  const filteredTickets = tickets.filter((ticket) => {
    const matchesSearch =
      ticket.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || ticket.status === statusFilter;
    const matchesPriority =
      priorityFilter === "all" || ticket.priority === priorityFilter;

    return matchesSearch && matchesStatus && matchesPriority;
  });

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
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold">Mes Tickets</h1>
          <p className="text-gray-600 mt-1">
            Gérez et suivez vos demandes de support
          </p>
        </div>
        <Link href="/dashboard/tickets/new">
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Nouveau ticket
          </Button>
        </Link>
      </div>

      {/* Filtres */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Filter className="w-5 h-5" />
            Filtres
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium mb-1 block">
                Rechercher
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Titre ou description..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Statut</label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Tous les statuts" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les statuts</SelectItem>
                  <SelectItem value="open">Ouvert</SelectItem>
                  <SelectItem value="in-progress">En cours</SelectItem>
                  <SelectItem value="resolved">Résolu</SelectItem>
                  <SelectItem value="closed">Fermé</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Priorité</label>
              <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Toutes les priorités" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Toutes les priorités</SelectItem>
                  <SelectItem value="low">Faible</SelectItem>
                  <SelectItem value="medium">Moyenne</SelectItem>
                  <SelectItem value="high">Élevée</SelectItem>
                  <SelectItem value="urgent">Urgente</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Liste des tickets */}
      {filteredTickets.length > 0 ? (
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Titre</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead>Priorité</TableHead>
                    <TableHead>Date de création</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTickets.map((ticket) => (
                    <TableRow key={ticket._id}>
                      <TableCell className="font-mono text-sm">
                        #{ticket._id.slice(-6)}
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{ticket.title}</p>
                          <p className="text-sm text-gray-600 line-clamp-1">
                            {ticket.description}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          className={getStatusColor(ticket.status)}
                          variant="secondary"
                        >
                          {getStatusText(ticket.status)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge
                          className={getPriorityColor(ticket.priority)}
                          variant="secondary"
                        >
                          {getPriorityText(ticket.priority)}
                        </Badge>
                      </TableCell>
                      <TableCell>{formatDate(ticket.createdAt)}</TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => openDetailsDialog(ticket)}
                        >
                          <Eye className="w-4 h-4 mr-2" />
                          Voir détails
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="text-center py-12">
            <Ticket className="w-12 h-12 mx-auto mb-4 text-gray-400" />
            <h3 className="text-lg font-semibold mb-2">
              {searchTerm || statusFilter !== "all" || priorityFilter !== "all"
                ? "Aucun ticket trouvé"
                : "Aucun ticket pour le moment"}
            </h3>
            <p className="text-gray-600 mb-4">
              {searchTerm || statusFilter !== "all" || priorityFilter !== "all"
                ? "Essayez de modifier vos critères de recherche"
                : "Créez votre premier ticket pour obtenir de l'aide"}
            </p>
            {!(
              searchTerm ||
              statusFilter !== "all" ||
              priorityFilter !== "all"
            ) && (
              <Link href="/dashboard/tickets/new">
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Créer un ticket
                </Button>
              </Link>
            )}
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
