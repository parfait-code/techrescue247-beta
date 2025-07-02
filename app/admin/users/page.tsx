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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import {
  Users as UsersIcon,
  Mail,
  Phone,
  Calendar,
  Shield,
  User,
  Search,
  LayoutGrid,
  List,
  ChevronUp,
  ChevronDown,
  MoreVertical,
  Eye,
  Trash2,
  ShieldCheck,
  UserCheck,
  Hash,
  Clock,
} from "lucide-react";

type UserRole = "user" | "admin";
type ViewMode = "table" | "list";
type SortField = "createdAt" | "name" | "email" | "role";
type SortOrder = "asc" | "desc";

interface User {
  _id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  createdAt: string;
  updatedAt?: string;
}

interface ConfirmAction {
  type: "role" | "delete";
  userId: string;
  userName: string;
  newRole?: UserRole;
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRole, setFilterRole] = useState<string>("all");
  const [viewMode, setViewMode] = useState<ViewMode>("table");
  const [sortField, setSortField] = useState<SortField>("createdAt");
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc");
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);
  const [confirmAction, setConfirmAction] = useState<ConfirmAction | null>(
    null
  );
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      // Importer le client API
      const { apiClient } = await import("@/lib/api-client");

      const data = await apiClient.getUsers();

      // S'assurer que data est un tableau
      if (Array.isArray(data)) {
        setUsers(data);
      } else if (data.users && Array.isArray(data.users)) {
        setUsers(data.users);
      } else {
        console.error("Format de données inattendu:", data);
        setUsers([]);
        toast.error("Format de données inattendu");
      }
    } catch (error: any) {
      console.error("Error fetching users:", error);
      toast.error(
        error.message || "Erreur lors du chargement des utilisateurs"
      );
      setUsers([]); // Définir un tableau vide en cas d'erreur
    } finally {
      setLoading(false);
    }
  };

  const updateUserRole = async (userId: string, newRole: UserRole) => {
    try {
      const { apiClient } = await import("@/lib/api-client");

      await apiClient.updateUser(userId, { role: newRole });

      toast.success("Rôle mis à jour avec succès");
      fetchUsers();
    } catch (error: any) {
      toast.error(error.message || "Impossible de mettre à jour le rôle");
    }
  };

  const deleteUser = async (userId: string) => {
    try {
      const { apiClient } = await import("@/lib/api-client");

      await apiClient.deleteUser(userId);

      toast.success("Utilisateur supprimé avec succès");
      fetchUsers();
      if (selectedUser?._id === userId) {
        setDetailsDialogOpen(false);
        setSelectedUser(null);
      }
    } catch (error: any) {
      toast.error(error.message || "Impossible de supprimer l'utilisateur");
    }
  };

  // Fonction de tri
  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  // Ouvrir la confirmation
  const openConfirmDialog = (action: ConfirmAction) => {
    setConfirmAction(action);
    setConfirmDialogOpen(true);
  };

  // Exécuter l'action confirmée
  const executeConfirmedAction = async () => {
    if (!confirmAction) return;

    if (confirmAction.type === "role" && confirmAction.newRole) {
      await updateUserRole(confirmAction.userId, confirmAction.newRole);
    } else if (confirmAction.type === "delete") {
      await deleteUser(confirmAction.userId);
    }

    setConfirmDialogOpen(false);
    setConfirmAction(null);
  };

  // S'assurer que users est toujours un tableau
  const safeUsers = Array.isArray(users) ? users : [];

  // Filtrer et trier les utilisateurs
  const filteredAndSortedUsers = safeUsers
    .filter((user) => {
      const matchesSearch =
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.phone.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesRole = filterRole === "all" || user.role === filterRole;

      return matchesSearch && matchesRole;
    })
    .sort((a, b) => {
      let aValue, bValue;

      switch (sortField) {
        case "createdAt":
          aValue = new Date(a.createdAt).getTime();
          bValue = new Date(b.createdAt).getTime();
          break;
        case "name":
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
          break;
        case "email":
          aValue = a.email.toLowerCase();
          bValue = b.email.toLowerCase();
          break;
        case "role":
          aValue = a.role;
          bValue = b.role;
          break;
        default:
          return 0;
      }

      if (sortOrder === "asc") {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) {
      return <ChevronUp className="w-4 h-4 opacity-20" />;
    }
    return sortOrder === "asc" ? (
      <ChevronUp className="w-4 h-4" />
    ) : (
      <ChevronDown className="w-4 h-4" />
    );
  };

  const RoleIcon = ({ role }: { role: UserRole }) => {
    return role === "admin" ? (
      <Shield className="w-4 h-4 text-blue-600" />
    ) : (
      <User className="w-4 h-4 text-gray-600" />
    );
  };

  const getRoleBadge = (role: UserRole) => {
    return role === "admin" ? (
      <Badge variant="default" className="bg-blue-600">
        <ShieldCheck className="w-3 h-3 mr-1" />
        Admin
      </Badge>
    ) : (
      <Badge variant="secondary">
        <UserCheck className="w-3 h-3 mr-1" />
        Utilisateur
      </Badge>
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Gestion des utilisateurs</h1>
        <div className="flex items-center gap-2">
          <Button
            variant={viewMode === "table" ? "default" : "outline"}
            size="sm"
            onClick={() => setViewMode("table")}
          >
            <LayoutGrid className="w-4 h-4 mr-2" />
            Tableau
          </Button>
          <Button
            variant={viewMode === "list" ? "default" : "outline"}
            size="sm"
            onClick={() => setViewMode("list")}
          >
            <List className="w-4 h-4 mr-2" />
            Liste
          </Button>
        </div>
      </div>

      {/* Statistiques */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UsersIcon className="w-5 h-5" />
            Statistiques
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <p className="text-sm text-gray-600">Total utilisateurs</p>
              <p className="text-3xl font-bold">{safeUsers.length}</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-600">Administrateurs</p>
              <p className="text-3xl font-bold text-blue-600">
                {safeUsers.filter((u) => u.role === "admin").length}
              </p>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-600">Utilisateurs standards</p>
              <p className="text-3xl font-bold text-gray-600">
                {safeUsers.filter((u) => u.role === "user").length}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Filtres */}
      <Card>
        <CardHeader>
          <CardTitle>Filtres</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="search">Rechercher</Label>
              <div className="relative mt-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="search"
                  placeholder="Nom, email, téléphone..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="role-filter">Rôle</Label>
              <Select value={filterRole} onValueChange={setFilterRole}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Tous les rôles" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les rôles</SelectItem>
                  <SelectItem value="admin">Administrateurs</SelectItem>
                  <SelectItem value="user">Utilisateurs</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Résultats */}
      <Card>
        <CardHeader>
          <CardTitle>
            {filteredAndSortedUsers.length} utilisateur(s) trouvé(s)
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {filteredAndSortedUsers.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600">
                {searchTerm || filterRole !== "all"
                  ? "Aucun utilisateur ne correspond aux critères de recherche"
                  : "Aucun utilisateur enregistré"}
              </p>
            </div>
          ) : viewMode === "table" ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[50px]">#</TableHead>
                    <TableHead
                      className="cursor-pointer"
                      onClick={() => handleSort("name")}
                    >
                      <div className="flex items-center gap-1">
                        Nom
                        <SortIcon field="name" />
                      </div>
                    </TableHead>
                    <TableHead
                      className="cursor-pointer"
                      onClick={() => handleSort("email")}
                    >
                      <div className="flex items-center gap-1">
                        Email
                        <SortIcon field="email" />
                      </div>
                    </TableHead>
                    <TableHead>Téléphone</TableHead>
                    <TableHead
                      className="cursor-pointer"
                      onClick={() => handleSort("role")}
                    >
                      <div className="flex items-center gap-1">
                        Rôle
                        <SortIcon field="role" />
                      </div>
                    </TableHead>
                    <TableHead
                      className="cursor-pointer"
                      onClick={() => handleSort("createdAt")}
                    >
                      <div className="flex items-center gap-1">
                        Date d&apos;inscription
                        <SortIcon field="createdAt" />
                      </div>
                    </TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredAndSortedUsers.map((user, index) => (
                    <TableRow key={user._id}>
                      <TableCell className="font-medium">{index + 1}</TableCell>
                      <TableCell className="font-medium">{user.name}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>{user.phone}</TableCell>
                      <TableCell>{getRoleBadge(user.role)}</TableCell>
                      <TableCell>{formatDate(user.createdAt)}</TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreVertical className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onClick={() => {
                                setSelectedUser(user);
                                setDetailsDialogOpen(true);
                              }}
                            >
                              <Eye className="w-4 h-4 mr-2" />
                              Voir détails
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={() =>
                                openConfirmDialog({
                                  type: "role",
                                  userId: user._id,
                                  userName: user.name,
                                  newRole:
                                    user.role === "admin" ? "user" : "admin",
                                })
                              }
                            >
                              {user.role === "admin" ? (
                                <>
                                  <UserCheck className="w-4 h-4 mr-2" />
                                  Passer utilisateur
                                </>
                              ) : (
                                <>
                                  <ShieldCheck className="w-4 h-4 mr-2" />
                                  Passer admin
                                </>
                              )}
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              className="text-red-600"
                              onClick={() =>
                                openConfirmDialog({
                                  type: "delete",
                                  userId: user._id,
                                  userName: user.name,
                                })
                              }
                            >
                              <Trash2 className="w-4 h-4 mr-2" />
                              Supprimer
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="divide-y">
              {filteredAndSortedUsers.map((user) => (
                <div
                  key={user._id}
                  className="p-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <RoleIcon role={user.role} />
                        <h3 className="font-medium text-lg">{user.name}</h3>
                        {getRoleBadge(user.role)}
                      </div>
                      <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                        <span className="flex items-center gap-1">
                          <Mail className="w-4 h-4" />
                          {user.email}
                        </span>
                        <span className="flex items-center gap-1">
                          <Phone className="w-4 h-4" />
                          {user.phone}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {formatDate(user.createdAt)}
                        </span>
                      </div>
                    </div>
                    <div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreVertical className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() => {
                              setSelectedUser(user);
                              setDetailsDialogOpen(true);
                            }}
                          >
                            <Eye className="w-4 h-4 mr-2" />
                            Voir détails
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() =>
                              openConfirmDialog({
                                type: "role",
                                userId: user._id,
                                userName: user.name,
                                newRole:
                                  user.role === "admin" ? "user" : "admin",
                              })
                            }
                          >
                            {user.role === "admin" ? (
                              <>
                                <UserCheck className="w-4 h-4 mr-2" />
                                Passer utilisateur
                              </>
                            ) : (
                              <>
                                <ShieldCheck className="w-4 h-4 mr-2" />
                                Passer admin
                              </>
                            )}
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            className="text-red-600"
                            onClick={() =>
                              openConfirmDialog({
                                type: "delete",
                                userId: user._id,
                                userName: user.name,
                              })
                            }
                          >
                            <Trash2 className="w-4 h-4 mr-2" />
                            Supprimer
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Dialog des détails utilisateur */}
      <Dialog open={detailsDialogOpen} onOpenChange={setDetailsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Détails de l&apos;utilisateur</DialogTitle>
            <DialogDescription>
              Informations complètes sur l&apos;utilisateur
            </DialogDescription>
          </DialogHeader>
          {selectedUser && (
            <div className="space-y-4">
              {/* En-tête avec nom et rôle */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <RoleIcon role={selectedUser.role} />
                  <h3 className="text-xl font-semibold">{selectedUser.name}</h3>
                </div>
                {getRoleBadge(selectedUser.role)}
              </div>

              <Separator />

              {/* Informations détaillées */}
              <div className="grid gap-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500 mb-1">ID</p>
                    <p className="flex items-center gap-2">
                      <Hash className="w-4 h-4 text-gray-400" />
                      <code className="text-xs bg-gray-100 px-2 py-1 rounded">
                        {selectedUser._id}
                      </code>
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Email</p>
                    <p className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-gray-400" />
                      {selectedUser.email}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Téléphone</p>
                    <p className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-gray-400" />
                      {selectedUser.phone}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Rôle</p>
                    <p className="flex items-center gap-2">
                      <Shield className="w-4 h-4 text-gray-400" />
                      {selectedUser.role === "admin"
                        ? "Administrateur"
                        : "Utilisateur"}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500 mb-1">
                      Date d&apos;inscription
                    </p>
                    <p className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      {formatDate(selectedUser.createdAt)}
                    </p>
                  </div>
                  {selectedUser.updatedAt && (
                    <div>
                      <p className="text-sm text-gray-500 mb-1">
                        Dernière modification
                      </p>
                      <p className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-gray-400" />
                        {formatDate(selectedUser.updatedAt)}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              <Separator />

              {/* Actions */}
              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={() => setDetailsDialogOpen(false)}
                >
                  Fermer
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setDetailsDialogOpen(false);
                    openConfirmDialog({
                      type: "role",
                      userId: selectedUser._id,
                      userName: selectedUser.name,
                      newRole: selectedUser.role === "admin" ? "user" : "admin",
                    });
                  }}
                >
                  {selectedUser.role === "admin" ? (
                    <>
                      <UserCheck className="w-4 h-4 mr-2" />
                      Passer utilisateur
                    </>
                  ) : (
                    <>
                      <ShieldCheck className="w-4 h-4 mr-2" />
                      Passer admin
                    </>
                  )}
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => {
                    setDetailsDialogOpen(false);
                    openConfirmDialog({
                      type: "delete",
                      userId: selectedUser._id,
                      userName: selectedUser.name,
                    });
                  }}
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Supprimer
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Dialog de confirmation */}
      <AlertDialog open={confirmDialogOpen} onOpenChange={setConfirmDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmer l&apos;action</AlertDialogTitle>
            <AlertDialogDescription>
              {confirmAction?.type === "role" ? (
                <>
                  Êtes-vous sûr de vouloir changer le rôle de{" "}
                  <strong>{confirmAction.userName}</strong> en{" "}
                  <strong>
                    {confirmAction.newRole === "admin"
                      ? "administrateur"
                      : "utilisateur"}
                  </strong>{" "}
                  ?
                </>
              ) : (
                <>
                  Êtes-vous sûr de vouloir supprimer l&apos;utilisateur{" "}
                  <strong>{confirmAction?.userName}</strong> ? Cette action est
                  irréversible.
                </>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction
              onClick={executeConfirmedAction}
              className={confirmAction?.type === "delete" ? "bg-red-600" : ""}
            >
              {confirmAction?.type === "delete" ? "Supprimer" : "Confirmer"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
