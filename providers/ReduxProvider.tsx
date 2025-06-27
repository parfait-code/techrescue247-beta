"use client";

import { Provider } from "react-redux";
import { store } from "@/store";
import { useEffect } from "react";
import { checkAuth } from "@/store/slices/authSlice";

export function ReduxProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Vérifier l'authentification au chargement de l'application
    store.dispatch(checkAuth());
  }, []);

  return <Provider store={store}>{children}</Provider>;
}
