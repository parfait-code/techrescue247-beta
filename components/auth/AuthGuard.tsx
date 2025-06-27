"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/store/hooks";

interface AuthGuardProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
}

export function AuthGuard({ children, requireAdmin = false }: AuthGuardProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated, user, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading) {
      // Si l'utilisateur n'est pas authentifié, rediriger vers la page de connexion
      if (!isAuthenticated) {
        router.push(`/login?redirect=${encodeURIComponent(pathname)}`);
        return;
      }

      // Si la route nécessite un admin et que l'utilisateur n'en est pas un
      if (requireAdmin && user?.role === "user") {
        router.push("/dashboard");
        return;
      }
      if (requireAdmin && user?.role === "admin") {
        router.push("/admin/dashboard");
        return;
      }
    }
  }, [isAuthenticated, user, isLoading, requireAdmin, router, pathname]);

  // Afficher un loader pendant la vérification
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Ne pas rendre le contenu si non authentifié
  if (!isAuthenticated) {
    return router.push("/");
  }

  // Ne pas rendre le contenu si admin requis mais utilisateur non admin
  if (user?.role !== "admin") {
    return null;
  }

  return <>{children}</>;
}
