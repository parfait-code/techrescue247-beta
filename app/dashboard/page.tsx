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
import { Ticket, Clock, CheckCircle, AlertCircle, Plus } from "lucide-react";
import { formatDate, getStatusColor, getPriorityColor } from "@/lib/utils";

interface UserDashboardStats {
  totalTickets: number;
  openTickets: number;
  inProgressTickets: number;
  resolvedTickets: number;
  recentTickets: any[];
}

export default function DashboardPage() {
  const [stats, setStats] = useState<UserDashboardStats>({
    totalTickets: 0,
    openTickets: 0,
    inProgressTickets: 0,
    resolvedTickets: 0,
    recentTickets: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUserTickets();
  }, []);

  const fetchUserTickets = async () => {
    try {
      const response = await fetch("/api/tickets");
      const tickets = await response.json();

      const stats: UserDashboardStats = {
        totalTickets: tickets.length,
        openTickets: tickets.filter((t: any) => t.status === "open").length,
        inProgressTickets: tickets.filter(
          (t: any) => t.status === "in-progress"
        ).length,
        resolvedTickets: tickets.filter((t: any) => t.status === "resolved")
          .length,
        recentTickets: tickets.slice(0, 3),
      };

      setStats(stats);
    } catch (error) {
      console.error("Error fetching tickets:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">Chargement...</div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Mon tableau de bord</h1>
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
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">En Attente</CardTitle>
            <AlertCircle className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {stats.openTickets}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">En Cours</CardTitle>
            <Clock className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {stats.inProgressTickets}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Résolus</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {stats.resolvedTickets}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Tickets */}
      {stats.recentTickets.length > 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>Tickets Récents</CardTitle>
            <CardDescription>Vos derniers tickets créés</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stats.recentTickets.map((ticket) => (
                <div
                  key={ticket._id}
                  className="flex items-center justify-between p-4 border rounded-lg"
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
                      {ticket.status}
                    </span>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(
                        ticket.priority
                      )}`}
                    >
                      {ticket.priority}
                    </span>
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
    </div>
  );
}
