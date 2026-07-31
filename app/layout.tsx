import type { Metadata } from "next";
import type { ReactNode } from "react";
import "highlight.js/styles/github-dark.css";
import "./globals.css";
import { Fira_Code } from "next/font/google";

const firaCode = Fira_Code({
  subsets: ["latin"],
  variable: "--font-fira-code",
});


export const metadata: Metadata = {
  title: "Biblioteca de Snippets",
  description:
    "Creá, listá, editá y eliminá tus snippets de código en un solo lugar.",
     openGraph: {
    title: "Biblioteca de Snippets",
    description:
      "Creá, listá, editá y eliminá tus snippets de código en un solo lugar.",
    type: "website",
    locale: "es_AR",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="es" className={firaCode.variable} >
      <body>{children}</body>
    </html>
  );
}
