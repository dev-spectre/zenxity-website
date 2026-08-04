import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin Dashboard - Zenxity",
  description: "Zenxity platform administration panel.",
};

export default function AdminDashboardLayout({ children }: { children: React.ReactNode }) {
  return children;
}
