import { Metadata } from "next";
import { Navbar, Footer } from "@/components/layout";

export const metadata: Metadata = {
  title: {
    template: "%s | Services IT",
    default: "Services IT",
  },
  description:
    "Découvrez nos services IT professionnels : infrastructure réseau, migration cloud, gestion d'infrastructure et développement d'applications sur mesure.",
};

export default function ServicesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Navbar />
      <main>{children}</main>
      <Footer />
    </>
  );
}
