"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { formatDate, getPriorityColor, getStatusColor } from "@/lib/utils";
import { useAppDispatch, useTickets } from "@/store/hooks";
import { fetchTickets, updateTicket } from "@/store/slices/ticketSlice";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

type TicketStatus = "open" | "in-progress" | "resolved" | "closed";
type TicketPriority = "low" | "medium" | "high" | "urgent";

export default function AdminTicketsPage() {
  const dispatch = useAppDispatch();
  const { tickets, isLoading } = useTickets();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [filterPriority, setFilterPriority] = useState<string>("all");

  useEffect(() => {
    dispatch(fetchTickets());
  }, [dispatch]);

  const updateTicketStatus = async (
    ticketId: string,
    newStatus: TicketStatus
  ) => {
    await dispatch(
      updateTicket({
        id: ticketId,
        data: { status: newStatus },
      })
    );
  };

  // Filtrer les tickets
  const filteredTickets = tickets.filter((ticket) => {
    const matchesSearch =
      ticket.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.userId?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.userId?.email?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      filterStatus === "all" || ticket.status === filterStatus;
    const matchesPriority =
      filterPriority === "all" || ticket.priority === filterPriority;

    return matchesSearch && matchesStatus && matchesPriority;
  });

  if (isLoading && tickets.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Gestion des tickets</h1>

      {/* Filtres */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Filtres</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="search">Rechercher</Label>
              <div className="relative mt-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="search"
                  placeholder="Titre, description, utilisateur..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="status-filter">Statut</Label>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="mt-1">
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
              <Label htmlFor="priority-filter">Priorité</Label>
              <Select value={filterPriority} onValueChange={setFilterPriority}>
                <SelectTrigger className="mt-1">
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
      {filteredTickets.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <p className="text-gray-600">
              {searchTerm || filterStatus !== "all" || filterPriority !== "all"
                ? "Aucun ticket ne correspond aux critères de recherche"
                : "Aucun ticket pour le moment"}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredTickets.map((ticket) => (
            <Card key={ticket._id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <CardTitle className="text-lg">{ticket.title}</CardTitle>
                    <p className="text-sm text-gray-600 mt-1">
                      Par: {ticket.userId?.name || "Utilisateur supprimé"} •{" "}
                      {ticket.userId?.email || ""} • {ticket.phone}
                    </p>
                    <p className="text-sm text-gray-500">
                      Créé le {formatDate(ticket.createdAt)}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
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
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 mb-4">{ticket.description}</p>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Label>Statut:</Label>
                    <Select
                      value={ticket.status}
                      onValueChange={(value) =>
                        updateTicketStatus(ticket._id, value as TicketStatus)
                      }
                      disabled={isLoading}
                    >
                      <SelectTrigger className="w-[180px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="open">
                          <span className="flex items-center">
                            <span className="w-2 h-2 bg-orange-500 rounded-full mr-2"></span>
                            Ouvert
                          </span>
                        </SelectItem>
                        <SelectItem value="in-progress">
                          <span className="flex items-center">
                            <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                            En cours
                          </span>
                        </SelectItem>
                        <SelectItem value="resolved">
                          <span className="flex items-center">
                            <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                            Résolu
                          </span>
                        </SelectItem>
                        <SelectItem value="closed">
                          <span className="flex items-center">
                            <span className="w-2 h-2 bg-gray-500 rounded-full mr-2"></span>
                            Fermé
                          </span>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                      ticket.status
                    )}`}
                  >
                    {ticket.status === "open" && "Ouvert"}
                    {ticket.status === "in-progress" && "En cours"}
                    {ticket.status === "resolved" && "Résolu"}
                    {ticket.status === "closed" && "Fermé"}
                  </span>
                </div>

                {ticket.screenshots && ticket.screenshots.length > 0 && (
                  <div className="mt-4">
                    <p className="text-sm font-medium mb-2">
                      Captures d'écran:
                    </p>
                    <div className="flex gap-2">
                      {ticket.screenshots.map((screenshot, index) => (
                        <a
                          key={index}
                          href={screenshot}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800 text-sm"
                        >
                          Image {index + 1}
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
