import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "NoWay - Nem Ferrando!",
  description: "Jogo de blefe e curiosidades",
  icons: { icon: "/duck.svg", shortcut: "/duck.svg", apple: "/duck.svg" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className="antialiased">
      <body className="bg-surface text-text-primary min-h-dvh">{children}</body>
    </html>
  );
}
