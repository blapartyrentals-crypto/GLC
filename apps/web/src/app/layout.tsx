import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "GLC — Global Life Change",
  description: "Plataforma GLC. Un código, múltiples perfiles de despliegue."
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}