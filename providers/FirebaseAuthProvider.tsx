"use client";

import { useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import { useAppDispatch } from "@/store/hooks";
import { setUser, clearError } from "@/store/slices/authSlice";

interface FirebaseAuthProviderProps {
  children: React.ReactNode;
}

export function FirebaseAuthProvider({ children }: FirebaseAuthProviderProps) {
  const dispatch = useAppDispatch();

  useEffect(() => {
    // Écouter les changements d'état d'authentification
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          // Récupérer les données utilisateur depuis Firestore
          const userDoc = await getDoc(doc(db, "users", firebaseUser.uid));

          if (userDoc.exists()) {
            const userData = userDoc.data();
            dispatch(
              setUser({
                user: {
                  id: firebaseUser.uid,
                  name: userData.name || firebaseUser.displayName || "",
                  email: userData.email || firebaseUser.email || "",
                  role: userData.role || "user",
                  phone: userData.phone,
                },
                firebaseUser,
              })
            );
          } else {
            // Si le document n'existe pas, créer un utilisateur par défaut
            // Cela peut arriver si l'utilisateur se connecte avec Google/Social login
            dispatch(
              setUser({
                user: {
                  id: firebaseUser.uid,
                  name: firebaseUser.displayName || "",
                  email: firebaseUser.email || "",
                  role: "user",
                },
                firebaseUser,
              })
            );
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
          dispatch(clearError());
        }
      } else {
        // Utilisateur déconnecté
        dispatch(
          setUser({
            user: null as any,
            firebaseUser: null as any,
          })
        );
      }
    });

    // Cleanup
    return () => unsubscribe();
  }, [dispatch]);

  return <>{children}</>;
}
