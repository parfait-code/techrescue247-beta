"use client";

import { Provider } from "react-redux";
import { store } from "@/store";
import { FirebaseAuthProvider } from "./FirebaseAuthProvider";

export function ReduxProvider({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <FirebaseAuthProvider>{children}</FirebaseAuthProvider>
    </Provider>
  );
}
