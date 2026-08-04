"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail, Lock } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    const res = await signIn("admin-credentials", {
      email,
      password,
      redirect: false,
    });
    
    setLoading(false);

    if (res?.error) {
      toast.error("Invalid admin credentials");
    } else {
      toast.success("Admin access granted");
      window.location.href = "/admin/dashboard";
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gradient-to-br from-secondary via-white to-white flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-100 p-8">
          <h2 className="text-2xl font-bold text-foreground mb-2 text-center">Admin Access</h2>
          <p className="text-muted-foreground text-center mb-6 text-sm">
            Secure login for authorized administrators
          </p>

          <Alert className="mb-6 bg-blue-50 border-blue-200">
            <Lock className="h-4 w-4 text-blue-600" />
            <AlertDescription className="text-blue-800">
              This is a secure admin portal. Only authorized administrators can access.
            </AlertDescription>
          </Alert>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <Label htmlFor="email" className="text-foreground">Email ID</Label>
              <div className="relative mt-2">
                <Mail className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
                <Input id="email" type="email" placeholder="admin@zenxity.com" className="pl-10" value={email} onChange={(e) => setEmail(e.target.value)} required />
              </div>
            </div>
            <div>
              <Label htmlFor="password" className="text-foreground">Password</Label>
              <div className="relative mt-2">
                <Lock className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
                <Input id="password" type="password" placeholder="••••••••" className="pl-10" value={password} onChange={(e) => setPassword(e.target.value)} required />
              </div>
            </div>
            <Button type="submit" className="w-full mt-6" disabled={loading}>
              {loading ? "Signing in..." : "Admin Sign In"}
            </Button>
          </form>

          <div className="mt-8 pt-6 border-t border-border text-center">
            <p className="text-muted-foreground text-sm mb-2">Are you a user?</p>
            <Link href="/login">
              <Button variant="outline" className="w-full" type="button">User Login</Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
