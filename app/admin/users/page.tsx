"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { formatDate } from "@/lib/utils";
import { toast } from "sonner";
import {
  Users as UsersIcon,
  Mail,
  Phone,
  Calendar,
  Shield,
  User,
} from "lucide-react";

export default function AdminUsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await fetch("/api/users");
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateUserRole = async (userId: string, newRole: string) => {
    try {
      const response = await fetch(`/api/users/${userId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: newRole }),
      });

      if (!response.ok) {
        throw new Error("Erreur lors de la mise à jour");
      }

      toast("Rôle mis à jour", {
        description: "Le rôle de l'utilisateur a été modifié avec succès",
      });

      // Refresh users
      fetchUsers();
    } catch (error) {
      toast("Erreur", {
        description: "Impossible de mettre à jour le rôle",
      });
    }
  };

  const deleteUser = async (userId: string) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer cet utilisateur ?")) {
      return;
    }

    try {
      const response = await fetch(`/api/users/${userId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Erreur lors de la suppression");
      }

      toast("Utilisateur supprimé", {
        description: "L'utilisateur a été supprimé avec succès",
      });

      // Refresh users
      fetchUsers();
    } catch (error) {
      toast("Erreur", {
        description: "Impossible de supprimer l'utilisateur",
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
      <h1 className="text-3xl font-bold mb-6">Gestion des utilisateurs</h1>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UsersIcon className="w-5 h-5" />
            Statistiques
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <p className="text-sm text-gray-600">Total utilisateurs</p>
              <p className="text-2xl font-bold">{users.length}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Administrateurs</p>
              <p className="text-2xl font-bold">
                {users.filter((u) => u.role === "admin").length}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Utilisateurs standards</p>
              <p className="text-2xl font-bold">
                {users.filter((u) => u.role === "user").length}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4">
        {users.map((user) => (
          <Card key={user._id}>
            <CardContent className="pt-6">
              <div className="flex justify-between items-start">
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    {user.role === "admin" ? (
                      <Shield className="w-4 h-4 text-blue-600" />
                    ) : (
                      <User className="w-4 h-4" />
                    )}
                    {user.name}
                  </h3>
                  <div className="space-y-1 text-sm text-gray-600">
                    <p className="flex items-center gap-2">
                      <Mail className="w-4 h-4" />
                      {user.email}
                    </p>
                    <p className="flex items-center gap-2">
                      <Phone className="w-4 h-4" />
                      {user.phone}
                    </p>
                    <p className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      Inscrit le {formatDate(user.createdAt)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Select
                    value={user.role}
                    onValueChange={(value) => updateUserRole(user._id, value)}
                  >
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="user">Utilisateur</SelectItem>
                      <SelectItem value="admin">Admin</SelectItem>
                    </SelectContent>
                  </Select>

                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => deleteUser(user._id)}
                  >
                    Supprimer
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
