import type { Metadata } from "next";
import { Plus_Jakarta_Sans, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

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
    <html lang="es" className={`${jakarta.variable} ${jetbrainsMono.variable}`}>
      <body className="bg-white text-slate-900 font-sans antialiased selection:bg-emerald-500/15 selection:text-emerald-900 min-h-screen">
        {children}
      </body>
    </html>
  );
}
