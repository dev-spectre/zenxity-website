import type { Metadata } from "next";
import { Providers } from "@/components/Providers";
import { Navbar } from "@/components/layout/Navbar";
import { Toaster } from "sonner";
import "./globals.css";

export const metadata: Metadata = {
  title: "Zenxity",
  description: "Turn Your Land Into Profitable Farmland",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <Navbar />
          {children}
          <Toaster richColors position="top-center" />
        </Providers>
      </body>
    </html>
  );
}
