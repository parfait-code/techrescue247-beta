"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

const resetSchema = z.object({
  email: z.string().email("Email invalide"),
});

type ResetData = z.infer<typeof resetSchema>;

export function PasswordResetForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetData>({
    resolver: zodResolver(resetSchema),
  });

  const onSubmit = async (data: ResetData) => {
    setIsLoading(true);
    try {
      await sendPasswordResetEmail(auth, data.email, {
        url: `${window.location.origin}/login`,
      });

      setIsSuccess(true);
      toast.success("Email envoyé", {
        description:
          "Vérifiez votre boîte de réception pour réinitialiser votre mot de passe.",
      });
    } catch (error: any) {
      let message = "Erreur lors de l'envoi de l'email";

      switch (error.code) {
        case "auth/user-not-found":
          message = "Aucun compte trouvé avec cet email";
          break;
        case "auth/invalid-email":
          message = "Email invalide";
          break;
        case "auth/too-many-requests":
          message = "Trop de tentatives. Veuillez réessayer plus tard";
          break;
      }

      toast.error("Erreur", { description: message });
    } finally {
      setIsLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="text-center space-y-4">
        <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
          <h3 className="text-lg font-medium text-green-800">Email envoyé !</h3>
          <p className="mt-2 text-sm text-green-700">
            Nous avons envoyé un lien de réinitialisation à votre adresse email.
            Vérifiez également vos spams.
          </p>
        </div>

        <Link href="/login">
          <Button variant="outline" className="w-full">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Retour à la connexion
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold">Mot de passe oublié ?</h2>
        <p className="mt-2 text-sm text-gray-600">
          Entrez votre email pour recevoir un lien de réinitialisation
        </p>
      </div>

      <div>
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          placeholder="votre@email.com"
          {...register("email")}
          className="mt-1"
          disabled={isLoading}
          autoComplete="email"
        />
        {errors.email && (
          <p className="text-sm text-red-600 mt-1">{errors.email.message}</p>
        )}
      </div>

      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? "Envoi..." : "Envoyer le lien"}
      </Button>

      <div className="text-center">
        <Link
          href="/login"
          className="text-sm text-primary hover:text-primary/80"
        >
          <ArrowLeft className="inline mr-1 h-3 w-3" />
          Retour à la connexion
        </Link>
      </div>
    </form>
  );
}
