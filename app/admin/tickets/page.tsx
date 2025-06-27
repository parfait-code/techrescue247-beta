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
import { Button } from "@/components/ui/button";
import {
  Search,
  LayoutGrid,
  List,
  ChevronUp,
  ChevronDown,
  ExternalLink,
  User,
  Mail,
  Phone,
  Calendar,
  AlertCircle,
} from "lucide-react";
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";

type TicketStatus = "open" | "in-progress" | "resolved" | "closed";
type TicketPriority = "low" | "medium" | "high" | "urgent";
type ViewMode = "table" | "list";
type SortField = "createdAt" | "priority" | "status" | "title";
type SortOrder = "asc" | "desc";

export default function AdminTicketsPage() {
  const dispatch = useAppDispatch();
  const { tickets, isLoading } = useTickets();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [filterPriority, setFilterPriority] = useState<string>("all");
  const [viewMode, setViewMode] = useState<ViewMode>("table");
  const [sortField, setSortField] = useState<SortField>("createdAt");
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc");
  const [selectedTicket, setSelectedTicket] = useState<string | null>(null);
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);
  const [selectedTicketDetails, setSelectedTicketDetails] = useState<any>(null);

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

  // Fonction pour ouvrir la popup de détails
  const openDetailsDialog = (ticket: any) => {
    setSelectedTicketDetails(ticket);
    setDetailsDialogOpen(true);
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

  // Filtrer et trier les tickets
  const filteredAndSortedTickets = tickets
    .filter((ticket) => {
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
    })
    .sort((a, b) => {
      let aValue, bValue;

      switch (sortField) {
        case "createdAt":
          aValue = new Date(a.createdAt).getTime();
          bValue = new Date(b.createdAt).getTime();
          break;
        case "priority":
          const priorityOrder = { urgent: 4, high: 3, medium: 2, low: 1 };
          aValue = priorityOrder[a.priority];
          bValue = priorityOrder[b.priority];
          break;
        case "status":
          aValue = a.status;
          bValue = b.status;
          break;
        case "title":
          aValue = a.title.toLowerCase();
          bValue = b.title.toLowerCase();
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

  const getPriorityLabel = (priority: TicketPriority) => {
    const labels = {
      low: "Faible",
      medium: "Moyen",
      high: "Élevé",
      urgent: "Urgent",
    };
    return labels[priority];
  };

  const getStatusLabel = (status: TicketStatus) => {
    const labels = {
      open: "Ouvert",
      "in-progress": "En cours",
      resolved: "Résolu",
      closed: "Fermé",
    };
    return labels[status];
  };

  if (isLoading && tickets.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Gestion des tickets</h1>
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

      {/* Filtres */}
      <Card>
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

      {/* Résultats */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>
              {filteredAndSortedTickets.length} ticket(s) trouvé(s)
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {filteredAndSortedTickets.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600">
                {searchTerm ||
                filterStatus !== "all" ||
                filterPriority !== "all"
                  ? "Aucun ticket ne correspond aux critères de recherche"
                  : "Aucun ticket pour le moment"}
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
                      onClick={() => handleSort("title")}
                    >
                      <div className="flex items-center gap-1">
                        Titre
                        <SortIcon field="title" />
                      </div>
                    </TableHead>
                    <TableHead>Utilisateur</TableHead>
                    <TableHead
                      className="cursor-pointer"
                      onClick={() => handleSort("priority")}
                    >
                      <div className="flex items-center gap-1">
                        Priorité
                        <SortIcon field="priority" />
                      </div>
                    </TableHead>
                    <TableHead
                      className="cursor-pointer"
                      onClick={() => handleSort("status")}
                    >
                      <div className="flex items-center gap-1">
                        Statut
                        <SortIcon field="status" />
                      </div>
                    </TableHead>
                    <TableHead
                      className="cursor-pointer"
                      onClick={() => handleSort("createdAt")}
                    >
                      <div className="flex items-center gap-1">
                        Date
                        <SortIcon field="createdAt" />
                      </div>
                    </TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredAndSortedTickets.map((ticket, index) => (
                    <TableRow
                      key={ticket._id}
                      className={`hover:bg-gray-50 ${
                        selectedTicket === ticket._id ? "bg-gray-50" : ""
                      }`}
                    >
                      <TableCell className="font-medium">{index + 1}</TableCell>
                      <TableCell>
                        <div className="max-w-xs">
                          <p className="font-medium truncate">{ticket.title}</p>
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <p className="text-sm text-gray-500 truncate cursor-help">
                                  {ticket.description}
                                </p>
                              </TooltipTrigger>
                              <TooltipContent className="max-w-sm">
                                <p>{ticket.description}</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <p className="font-medium">
                            {ticket.userId?.name || "Utilisateur supprimé"}
                          </p>
                          <p className="text-gray-500">
                            {ticket.userId?.email}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={getPriorityColor(ticket.priority)}
                        >
                          {getPriorityLabel(ticket.priority)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Select
                          value={ticket.status}
                          onValueChange={(value) =>
                            updateTicketStatus(
                              ticket._id,
                              value as TicketStatus
                            )
                          }
                          disabled={isLoading}
                        >
                          <SelectTrigger className="w-[140px]">
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
                      </TableCell>
                      <TableCell>
                        <span className="text-sm text-gray-500">
                          {formatDate(ticket.createdAt)}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              ⋮
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onClick={() => openDetailsDialog(ticket)}
                            >
                              Voir détails
                            </DropdownMenuItem>
                            {ticket.screenshots &&
                              ticket.screenshots.length > 0 && (
                                <DropdownMenuItem asChild>
                                  <a
                                    href={ticket.screenshots[0]}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                  >
                                    <ExternalLink className="w-4 h-4 mr-2" />
                                    Voir captures
                                  </a>
                                </DropdownMenuItem>
                              )}
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
              {filteredAndSortedTickets.map((ticket) => (
                <div
                  key={ticket._id}
                  className="p-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-medium text-lg truncate">
                          {ticket.title}
                        </h3>
                        <Badge
                          variant="outline"
                          className={getPriorityColor(ticket.priority)}
                        >
                          {getPriorityLabel(ticket.priority)}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                        {ticket.description}
                      </p>
                      <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                        <span className="flex items-center gap-1">
                          <User className="w-4 h-4" />
                          {ticket.userId?.name || "Utilisateur supprimé"}
                        </span>
                        {ticket.userId?.email && (
                          <span className="flex items-center gap-1">
                            <Mail className="w-4 h-4" />
                            {ticket.userId.email}
                          </span>
                        )}
                        {ticket.phone && (
                          <span className="flex items-center gap-1">
                            <Phone className="w-4 h-4" />
                            {ticket.phone}
                          </span>
                        )}
                        <span className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {formatDate(ticket.createdAt)}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => openDetailsDialog(ticket)}
                      >
                        Voir détails
                      </Button>
                      <Select
                        value={ticket.status}
                        onValueChange={(value) =>
                          updateTicketStatus(ticket._id, value as TicketStatus)
                        }
                        disabled={isLoading}
                      >
                        <SelectTrigger className="w-[140px]">
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
                      {ticket.screenshots && ticket.screenshots.length > 0 && (
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <a
                                href={ticket.screenshots[0]}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-gray-500 hover:text-gray-700"
                              >
                                <AlertCircle className="w-5 h-5" />
                              </a>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>{ticket.screenshots.length} capture(s)</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Dialog pour afficher les détails du ticket */}
      <Dialog open={detailsDialogOpen} onOpenChange={setDetailsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Détails du ticket</DialogTitle>
            <DialogDescription>
              Toutes les informations concernant ce ticket
            </DialogDescription>
          </DialogHeader>
          {selectedTicketDetails && (
            <div className="space-y-4">
              {/* Informations principales */}
              <div>
                <h3 className="font-semibold text-lg mb-2">
                  {selectedTicketDetails.title}
                </h3>
                <div className="flex items-center gap-2 mb-3">
                  <Badge
                    variant="outline"
                    className={getPriorityColor(selectedTicketDetails.priority)}
                  >
                    {getPriorityLabel(selectedTicketDetails.priority)}
                  </Badge>
                  <Badge
                    variant="outline"
                    className={getStatusColor(selectedTicketDetails.status)}
                  >
                    {getStatusLabel(selectedTicketDetails.status)}
                  </Badge>
                </div>
              </div>

              <Separator />

              {/* Description */}
              <div>
                <h4 className="font-medium mb-2">Description</h4>
                <p className="text-gray-700 whitespace-pre-wrap">
                  {selectedTicketDetails.description}
                </p>
              </div>

              <Separator />

              {/* Informations utilisateur */}
              <div>
                <h4 className="font-medium mb-2">Informations du demandeur</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-gray-500" />
                    <span className="text-sm">
                      {selectedTicketDetails.userId?.name ||
                        "Utilisateur supprimé"}
                    </span>
                  </div>
                  {selectedTicketDetails.userId?.email && (
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-gray-500" />
                      <span className="text-sm">
                        {selectedTicketDetails.userId.email}
                      </span>
                    </div>
                  )}
                  {selectedTicketDetails.phone && (
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-gray-500" />
                      <span className="text-sm">
                        {selectedTicketDetails.phone}
                      </span>
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-gray-500" />
                    <span className="text-sm">
                      {formatDate(selectedTicketDetails.createdAt)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Captures d'écran */}
              {selectedTicketDetails.screenshots &&
                selectedTicketDetails.screenshots.length > 0 && (
                  <>
                    <Separator />
                    <div>
                      <h4 className="font-medium mb-2">
                        Captures d&apos;écran
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {selectedTicketDetails.screenshots.map(
                          (screenshot: string, index: number) => (
                            <a
                              key={index}
                              href={screenshot}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-2 px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-md text-sm"
                            >
                              <ExternalLink className="w-4 h-4" />
                              Capture {index + 1}
                            </a>
                          )
                        )}
                      </div>
                    </div>
                  </>
                )}

              {/* Actions */}
              <Separator />
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Label>Changer le statut :</Label>
                  <Select
                    value={selectedTicketDetails.status}
                    onValueChange={(value) => {
                      updateTicketStatus(
                        selectedTicketDetails._id,
                        value as TicketStatus
                      );
                      // Mettre à jour l'état local pour refléter le changement
                      setSelectedTicketDetails({
                        ...selectedTicketDetails,
                        status: value,
                      });
                    }}
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
                <Button
                  variant="outline"
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
