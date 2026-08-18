import type { Metadata } from "next";
import type { ReactNode } from "react";
import "highlight.js/styles/github-dark.css";
import "./globals.css";

export const metadata: Metadata = {
  title: "Biblioteca de Snippets",
  description:
    "Creá, listá, editá y eliminá tus snippets de código en un solo lugar.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
