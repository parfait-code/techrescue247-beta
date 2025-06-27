"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useAppDispatch, useAuth } from "@/store/hooks";
import { login, clearError } from "@/store/slices/authSlice";

const loginSchema = z.object({
  email: z.string().email("Email invalide"),
  password: z
    .string()
    .min(6, "Le mot de passe doit contenir au moins 6 caractères"),
});

type LoginData = z.infer<typeof loginSchema>;

export function LoginForm() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { isLoading, error, isAuthenticated, user } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginData>({
    resolver: zodResolver(loginSchema),
  });

  // Gérer la redirection après connexion réussie
  useEffect(() => {
    if (isAuthenticated && user) {
      toast.success("Connexion réussie", {
        description: "Vous allez être redirigé...",
      });

      // Redirection basée sur le rôle
      const redirectPath =
        user.role === "admin" ? "/admin/dashboard" : "/dashboard";

      // Utiliser un délai court pour permettre à l'utilisateur de voir le message
      // setTimeout(() => {
      router.push(redirectPath);
      // }, 1000);
    }
  }, [isAuthenticated, user, router]);

  // Afficher les erreurs
  useEffect(() => {
    if (error) {
      toast.error("Erreur de connexion", {
        description: error,
      });
      dispatch(clearError());
    }
  }, [error, dispatch]);

  const onSubmit = async (data: LoginData) => {
    dispatch(login(data));
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div>
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          placeholder="votre@email.com"
          {...register("email")}
          className="mt-1"
          disabled={isLoading}
        />
        {errors.email && (
          <p className="text-sm text-red-600 mt-1">{errors.email.message}</p>
        )}
      </div>

      <div>
        <Label htmlFor="password">Mot de passe</Label>
        <Input
          id="password"
          type="password"
          placeholder="••••••••"
          {...register("password")}
          className="mt-1"
          disabled={isLoading}
        />
        {errors.password && (
          <p className="text-sm text-red-600 mt-1">{errors.password.message}</p>
        )}
      </div>

      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? "Connexion..." : "Se connecter"}
      </Button>
    </form>
  );
}
