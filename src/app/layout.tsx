import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "30X HackRadar | Inteligencia de Tendencias, Ganchos y Matriz JEV",
  description:
    "Plataforma de inteligencia de contenido automatizada para el equipo de media de 30X (@crece30x y @andresbilbao).",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="dark">
      <body className="bg-slate-950 text-slate-100 antialiased selection:bg-emerald-500/30 selection:text-emerald-200 min-h-screen">
        {children}
      </body>
    </html>
  );
}
