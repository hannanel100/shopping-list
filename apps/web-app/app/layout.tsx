import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import {
  AuthProvider,
  AuthButton,
} from "../components/providers/auth-provider";
import { getSession } from "@/lib/auth";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Smart Shopping List",
  description:
    "Create and manage your shopping lists with AI-powered recipe parsing",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider session={session}>
          <nav className="bg-white shadow-sm">
            <div className="container mx-auto px-4 py-3 flex justify-between items-center">
              <h1 className="text-xl font-semibold">Smart Shopping List</h1>
              <AuthButton />
            </div>
          </nav>
          <main className="min-h-screen bg-gray-50">{children}</main>
        </AuthProvider>
      </body>
    </html>
  );
}
