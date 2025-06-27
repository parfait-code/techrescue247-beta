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
  const [isLoading, setIsLoading] = useState(false);
  const [files, setFiles] = useState<File[]>([]);

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
      setFiles(Array.from(e.target.files));
    }
  };

  const onSubmit = async (data: TicketData) => {
    setIsLoading(true);
    try {
      // Upload files first if any
      const screenshots: string[] = [];

      if (files.length > 0) {
        for (const file of files) {
          const formData = new FormData();
          formData.append("file", file);

          const uploadResponse = await fetch("/api/upload", {
            method: "POST",
            body: formData,
          });

          if (uploadResponse.ok) {
            const { url } = await uploadResponse.json();
            screenshots.push(url);
          }
        }
      }

      // Create ticket
      const response = await fetch("/api/tickets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          screenshots,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.message || "Erreur lors de la création du ticket"
        );
      }

      toast.success("Ticket créé avec succès", {
        description: "Nous vous contacterons bientôt",
      });

      router.push("/dashboard/tickets");
    } catch (error: any) {
      toast.error("Erreur", {
        description:
          error.message ||
          "Une erreur est survenue lors de la création du ticket",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
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
                placeholder="Ex: Mon ordinateur ne démarre plus"
                {...register("title")}
                className="mt-1"
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
              />
              {errors.description && (
                <p className="text-sm text-red-600 mt-1">
                  {errors.description.message}
                </p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="priority">Priorité</Label>
                <Select
                  onValueChange={(value) => setValue("priority", value as any)}
                  defaultValue="medium"
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
                  placeholder="+237 6XX XXX XXX"
                  {...register("phone")}
                  className="mt-1"
                />
                {errors.phone && (
                  <p className="text-sm text-red-600 mt-1">
                    {errors.phone.message}
                  </p>
                )}
              </div>
            </div>

            <div>
              <Label htmlFor="screenshots">
                Captures d&apos;écran (optionnel)
              </Label>
              <div className="mt-1">
                <label
                  htmlFor="file-upload"
                  className="flex items-center justify-center w-full px-4 py-2 border-2 border-gray-300 border-dashed rounded-md cursor-pointer hover:border-gray-400"
                >
                  <Upload className="w-5 h-5 mr-2" />
                  <span>Cliquez pour ajouter des images</span>
                  <input
                    id="file-upload"
                    name="file-upload"
                    type="file"
                    className="sr-only"
                    multiple
                    accept="image/*"
                    onChange={handleFileChange}
                  />
                </label>
                {files.length > 0 && (
                  <p className="mt-2 text-sm text-gray-600">
                    {files.length} fichier(s) sélectionné(s)
                  </p>
                )}
              </div>
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Création..." : "Créer le ticket"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
