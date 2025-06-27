"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
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
  const searchParams = useSearchParams();
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
    // Log pour débogage
    console.log("Auth state changed:", { isAuthenticated, user });

    if (isAuthenticated && user) {
      toast.success("Connexion réussie", {
        description: "Vous allez être redirigé...",
      });

      // Récupérer l'URL de redirection depuis les query params si elle existe
      const redirectUrl = searchParams.get("redirect");

      // Déterminer la redirection basée sur le rôle ou l'URL de redirection
      let redirectPath = "/dashboard"; // Par défaut pour les utilisateurs normaux

      if (user.role === "admin") {
        redirectPath = "/admin/dashboard";
      } else if (redirectUrl) {
        redirectPath = decodeURIComponent(redirectUrl);
      }

      console.log("Redirecting to:", redirectPath);

      // Utiliser un délai court pour permettre à l'utilisateur de voir le message
      setTimeout(() => {
        router.push(redirectPath);
      }, 500);
    }
  }, [isAuthenticated, user, router, searchParams]);

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
    console.log("Attempting login with:", data.email);

    try {
      const resultAction = await dispatch(login(data));

      if (login.fulfilled.match(resultAction)) {
        console.log("Login successful:", resultAction.payload);
        // La redirection sera gérée par le useEffect ci-dessus
      } else if (login.rejected.match(resultAction)) {
        console.error("Login failed:", resultAction.payload);
      }
    } catch (err) {
      console.error("Login error:", err);
    }
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

      {/* Section de débogage - à retirer en production */}
      {process.env.NODE_ENV === "development" && (
        <div className="mt-4 p-4 bg-gray-100 rounded text-xs">
          <p>Debug Info:</p>
          <p>isAuthenticated: {String(isAuthenticated)}</p>
          <p>user: {user ? JSON.stringify(user) : "null"}</p>
          <p>isLoading: {String(isLoading)}</p>
        </div>
      )}
    </form>
  );
}
