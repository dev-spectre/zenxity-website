import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Login - Zenxity",
  description: "Login securely to access your Zenxity farmland dashboard.",
};

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return children;
}
