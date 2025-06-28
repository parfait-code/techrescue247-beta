import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
// import { Providers } from "./providers";
import { Toaster } from "sonner";
import { ReduxProvider } from "@/providers/ReduxProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    template: "%s | TechRescue247",
    default: "TechRescue247 - Support IT Professionnel 24/7",
  },
  description:
    "Service de support informatique professionnel disponible 24/7. HelpDesk, infrastructure réseau, migration cloud et développement d'applications.",
  keywords:
    "support IT, helpdesk, infrastructure réseau, migration cloud, développement applications, Cameroun, Yaoundé",
  authors: [{ name: "TechRescue247" }],
  openGraph: {
    title: "TechRescue247 - Support IT Professionnel 24/7",
    description:
      "Service de support informatique professionnel disponible 24/7",
    url: "https://techrescue247.com",
    siteName: "TechRescue247",
    locale: "fr_FR",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body className={inter.className}>
        <ReduxProvider>
          {children}
          <Toaster position="top-right" richColors />
        </ReduxProvider>
      </body>
    </html>
  );
}
