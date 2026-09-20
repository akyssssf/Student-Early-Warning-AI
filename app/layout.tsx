import type { Metadata } from "next";
import "./globals.css";
import { QueryProvider } from "@/components/providers/QueryProvider";

export const metadata: Metadata = {
  title: "Student Early Warning AI",
  description: "Sistem peringatan dini risiko akademik mahasiswa.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="id">
      <body>
        <QueryProvider>{children}</QueryProvider>
      </body>
    </html>
  );
}