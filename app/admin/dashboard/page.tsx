"use client";

import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Ticket, Users, Clock } from "lucide-react";
import { formatDate, getStatusColor, getPriorityColor } from "@/lib/utils";

interface DashboardStats {
  totalTickets: number;
  openTickets: number;
  inProgressTickets: number;
  resolvedTickets: number;
  totalUsers: number;
  recentTickets: any[];
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<DashboardStats>({
    totalTickets: 0,
    openTickets: 0,
    inProgressTickets: 0,
    resolvedTickets: 0,
    totalUsers: 0,
    recentTickets: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // Fetch tickets
      const ticketsResponse = await fetch("/api/tickets");
      const tickets = await ticketsResponse.json();

      // Fetch users
      const usersResponse = await fetch("/api/users");
      const users = await usersResponse.json();

      // Calculate stats
      const stats: DashboardStats = {
        totalTickets: tickets.length,
        openTickets: tickets.filter((t: any) => t.status === "open").length,
        inProgressTickets: tickets.filter(
          (t: any) => t.status === "in-progress"
        ).length,
        resolvedTickets: tickets.filter((t: any) => t.status === "resolved")
          .length,
        totalUsers: users.length,
        recentTickets: tickets.slice(0, 5),
      };

      setStats(stats);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
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
      <h1 className="text-3xl font-bold mb-6">
        Tableau de bord administrateur
      </h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Tickets</CardTitle>
            <Ticket className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalTickets}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Tickets Ouverts
            </CardTitle>
            <Clock className="h-4 w-4 text-blue-600" />
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
            <CardTitle className="text-sm font-medium">Utilisateurs</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalUsers}</div>
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
          <div className="space-y-4">
            {stats.recentTickets.map((ticket) => (
              <div
                key={ticket._id}
                className="flex items-center justify-between p-4 border rounded-lg"
              >
                <div className="flex-1">
                  <h4 className="font-semibold">{ticket.title}</h4>
                  <p className="text-sm text-gray-600">
                    Par {ticket.userId?.name || "Utilisateur"} -{" "}
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
        </CardContent>
      </Card>
    </div>
  );
}
