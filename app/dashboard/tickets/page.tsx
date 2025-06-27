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
import { Ticket, Plus, Search, Filter } from "lucide-react";
import { formatDate, getStatusColor, getPriorityColor } from "@/lib/utils";
import { useAppDispatch, useTickets } from "@/store/hooks";
import { fetchTickets } from "@/store/slices/ticketSlice";

export default function TicketsPage() {
  const dispatch = useAppDispatch();
  const { tickets, isLoading } = useTickets();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");

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
                        <Link href={`/dashboard/tickets/${ticket._id}`}>
                          <Button variant="ghost" size="sm">
                            Voir détails
                          </Button>
                        </Link>
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
    </div>
  );
}
