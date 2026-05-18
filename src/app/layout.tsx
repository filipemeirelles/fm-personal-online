import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "FM Personal Online",
  description: "Plataforma para personal trainers que atuam com consultoria online",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
