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
import { formatDate, getPriorityColor } from "@/lib/utils";
import { toast } from "sonner";

export default function AdminTicketsPage() {
  const [tickets, setTickets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    try {
      const response = await fetch("/api/tickets");
      const data = await response.json();
      setTickets(data);
    } catch (error) {
      console.error("Error fetching tickets:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateTicketStatus = async (ticketId: string, newStatus: string) => {
    try {
      const response = await fetch(`/api/tickets/${ticketId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) {
        throw new Error("Erreur lors de la mise à jour");
      }

      toast("Statut mis à jour", {
        description: "Le statut du ticket a été modifié avec succès",
      });

      // Refresh tickets
      fetchTickets();
    } catch (error) {
      toast("Erreur", {
        description: "Impossible de mettre à jour le statut",
      });
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">Chargement...</div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Gestion des tickets</h1>

      {tickets.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <p className="text-gray-600">Aucun ticket pour le moment</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {tickets.map((ticket) => (
            <Card key={ticket._id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">{ticket.title}</CardTitle>
                    <p className="text-sm text-gray-600 mt-1">
                      Par: {ticket.userId?.name || "Utilisateur"} •{" "}
                      {ticket.userId?.email || ""} • {ticket.phone}
                    </p>
                    <p className="text-sm text-gray-500">
                      {formatDate(ticket.createdAt)}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(
                        ticket.priority
                      )}`}
                    >
                      {ticket.priority}
                    </span>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">{ticket.description}</p>

                {ticket.screenshots && ticket.screenshots.length > 0 && (
                  <div className="mb-4">
                    <p className="text-sm font-medium mb-2">
                      Captures d'écran:
                    </p>
                    <div className="flex gap-2 flex-wrap">
                      {ticket.screenshots.map(
                        (screenshot: string, index: number) => (
                          <a
                            key={index}
                            href={screenshot}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-blue-600 hover:underline"
                          >
                            Image {index + 1}
                          </a>
                        )
                      )}
                    </div>
                  </div>
                )}

                <div className="flex items-center gap-2">
                  <Label className="text-sm">Statut:</Label>
                  <Select
                    value={ticket.status}
                    onValueChange={(value) =>
                      updateTicketStatus(ticket._id, value)
                    }
                  >
                    <SelectTrigger className="w-48">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="open">Ouvert</SelectItem>
                      <SelectItem value="in-progress">En cours</SelectItem>
                      <SelectItem value="resolved">Résolu</SelectItem>
                      <SelectItem value="closed">Fermé</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
