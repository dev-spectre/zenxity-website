import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin Portal - Zenxity",
  description: "Zenxity administration portal authentication.",
};

export default function AdminLoginLayout({ children }: { children: React.ReactNode }) {
  return children;
}
