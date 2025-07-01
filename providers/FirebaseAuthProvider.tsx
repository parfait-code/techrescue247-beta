// providers/FirebaseAuthProvider.tsx

"use client";

import { useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useAppDispatch } from "@/store/hooks";
import { checkAuth, setUser } from "@/store/slices/authSlice";

export function FirebaseAuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const dispatch = useAppDispatch();

  useEffect(() => {
    // Vérifier le token au chargement
    dispatch(checkAuth());

    // Écouter les changements Firebase Auth
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (!firebaseUser) {
        // Déconnexion
        dispatch(
          setUser({
            user: null,
            firebaseUser: null,
            token: null,
          })
        );
        localStorage.removeItem("authToken");
      }
    });

    return () => unsubscribe();
  }, [dispatch]);

  return <>{children}</>;
}
