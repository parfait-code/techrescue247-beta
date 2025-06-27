"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { toast } from "sonner";
import { Upload } from "lucide-react";
import { useAppDispatch, useTickets } from "@/store/hooks";
import { createTicket } from "@/store/slices/ticketSlice";

const ticketSchema = z.object({
  title: z.string().min(5, "Le titre doit contenir au moins 5 caractères"),
  description: z
    .string()
    .min(20, "La description doit contenir au moins 20 caractères"),
  priority: z.enum(["low", "medium", "high", "urgent"]),
  phone: z.string().min(9, "Numéro de téléphone invalide"),
});

type TicketData = z.infer<typeof ticketSchema>;

export default function NewTicketPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { isLoading } = useTickets();
  const [files, setFiles] = useState<File[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<TicketData>({
    resolver: zodResolver(ticketSchema),
    defaultValues: {
      priority: "medium",
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files);
      if (selectedFiles.length > 3) {
        toast.error("Vous ne pouvez télécharger que 3 fichiers maximum");
        return;
      }
      setFiles(selectedFiles);
    }
  };

  const uploadFiles = async () => {
    const screenshots: string[] = [];

    for (const file of files) {
      const formData = new FormData();
      formData.append("file", file);

      try {
        const uploadResponse = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });

        if (uploadResponse.ok) {
          const { url } = await uploadResponse.json();
          screenshots.push(url);
        } else {
          throw new Error("Erreur lors du téléchargement");
        }
      } catch (error) {
        toast.error(`Erreur lors du téléchargement de ${file.name}`);
      }
    }

    return screenshots;
  };

  const onSubmit = async (data: TicketData) => {
    setIsUploading(true);

    try {
      // Upload des fichiers si présents
      let screenshots: string[] = [];
      if (files.length > 0) {
        screenshots = await uploadFiles();
      }

      // Créer le ticket via Redux
      const result = await dispatch(
        createTicket({
          ...data,
          screenshots,
        })
      ).unwrap();

      // Redirection après succès
      router.push("/dashboard/tickets");
    } catch (error) {
      // Les erreurs sont déjà gérées dans le slice
      console.error("Erreur lors de la création:", error);
    } finally {
      setIsUploading(false);
    }
  };

  const isSubmitting = isLoading || isUploading;

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Créer un nouveau ticket</h1>

      <Card>
        <CardHeader>
          <CardTitle>Décrivez votre problème</CardTitle>
          <CardDescription>
            Fournissez autant de détails que possible pour nous aider à résoudre
            votre problème rapidement
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <Label htmlFor="title">Titre du problème</Label>
              <Input
                id="title"
                placeholder="Ex: Problème de connexion au serveur"
                {...register("title")}
                className="mt-1"
                disabled={isSubmitting}
              />
              {errors.title && (
                <p className="text-sm text-red-600 mt-1">
                  {errors.title.message}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="description">Description détaillée</Label>
              <Textarea
                id="description"
                placeholder="Décrivez votre problème en détail..."
                rows={6}
                {...register("description")}
                className="mt-1"
                disabled={isSubmitting}
              />
              {errors.description && (
                <p className="text-sm text-red-600 mt-1">
                  {errors.description.message}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="priority">Priorité</Label>
              <Select
                defaultValue="medium"
                onValueChange={(value) => setValue("priority", value as any)}
                disabled={isSubmitting}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Sélectionnez la priorité" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Faible</SelectItem>
                  <SelectItem value="medium">Moyenne</SelectItem>
                  <SelectItem value="high">Élevée</SelectItem>
                  <SelectItem value="urgent">Urgente</SelectItem>
                </SelectContent>
              </Select>
              {errors.priority && (
                <p className="text-sm text-red-600 mt-1">
                  {errors.priority.message}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="phone">Numéro de téléphone</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="Ex: 0123456789"
                {...register("phone")}
                className="mt-1"
                disabled={isSubmitting}
              />
              {errors.phone && (
                <p className="text-sm text-red-600 mt-1">
                  {errors.phone.message}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="screenshots">Captures d'écran (optionnel)</Label>
              <div className="mt-1 flex items-center gap-4">
                <label className="cursor-pointer">
                  <input
                    id="screenshots"
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                    disabled={isSubmitting}
                  />
                  <div className="flex items-center gap-2 px-4 py-2 border rounded-md hover:bg-gray-50">
                    <Upload className="w-4 h-4" />
                    <span className="text-sm">
                      {files.length > 0
                        ? `${files.length} fichier(s) sélectionné(s)`
                        : "Ajouter des captures"}
                    </span>
                  </div>
                </label>
                {files.length > 0 && (
                  <button
                    type="button"
                    onClick={() => setFiles([])}
                    className="text-sm text-red-600 hover:text-red-800"
                    disabled={isSubmitting}
                  >
                    Supprimer
                  </button>
                )}
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Max 3 fichiers, formats acceptés: JPG, PNG, GIF
              </p>
            </div>

            <div className="flex gap-4">
              <Button type="submit" className="flex-1" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Création en cours...
                  </>
                ) : (
                  "Créer le ticket"
                )}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
                disabled={isSubmitting}
              >
                Annuler
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
