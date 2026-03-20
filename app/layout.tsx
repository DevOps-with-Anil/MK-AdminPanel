import React from "react";
import type { Metadata } from "next";
import { Outfit, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AdminProvider } from "@/contexts/AdminContext";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
});

export const metadata: Metadata = {
  title: "MK Project | Enterprise Admin Management",
  description: "Enterprise multi-tenant admin panel",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${outfit.variable} ${geistMono.variable}`}>
      <body className="font-sans antialiased">
        <AdminProvider>
          {children}
        </AdminProvider>
      </body>
    </html>
  );
}