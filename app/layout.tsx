import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { CartProvider } from "./context/CartContext";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AuraRx Pharmacy | Safe, Professional Online Medication Store",
  description: "AuraRx is a professional, licensed online pharmaceutical store. Browse, consult, and order certified prescription and OTC drugs safely with next-day cold-chain shipping.",
  keywords: ["online pharmacy", "prescriptions", "OTC drugs", "medicine delivery", "health supplements"],
  authors: [{ name: "AuraRx Medical Team" }],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-slate-50 font-sans text-zinc-900 transition-colors duration-150 dark:bg-zinc-950 dark:text-zinc-50">
        <CartProvider>
          <Navbar />
          <main className="flex-1 flex flex-col">{children}</main>
          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}
