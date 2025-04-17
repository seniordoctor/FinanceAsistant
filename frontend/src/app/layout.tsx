// app/layout.tsx

import "./globals.css";
import type { Metadata } from "next";
import Navbar from "@/components/Navbar"; // doğru import! 👌

export const metadata: Metadata = {
  title: "FinanceAsistant",
  description: "Kişisel Finans Yönetimi",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="tr">
      <body className="bg-gray-50">
        {/* 🌟 Navbar tüm sayfalarda olacak */}
        <Navbar />
        <main className="max-w-5xl mx-auto px-4 py-10">
          {children}
        </main>
      </body>
    </html>
  );
}
