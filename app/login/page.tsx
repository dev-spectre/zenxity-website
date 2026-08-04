"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail, Lock, User, Phone } from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";

export default function UserLogin() {
  return (
    <Suspense fallback={null}>
      <UserLoginContent />
    </Suspense>
  );
}

function UserLoginContent() {
  const searchParams = useSearchParams();
  const error = searchParams.get("error");
  const { t } = useTranslation();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (error === "AccessDenied") {
      toast.error("Access denied. Please check your permissions or try again.");
    } else if (error === "OAuthAccountNotLinked") {
      toast.error("Account already exists with a different login provider.");
    } else if (error) {
      toast.error(`Authentication error: ${error}`);
    }
  }, [error]);

  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [mobile, setMobile] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    setLoading(false);

    if (res?.error) {
      toast.error("Invalid email or password");
    } else {
      toast.success("Successfully logged in!");
      window.location.href = "/dashboard";
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: fullName,
          email,
          password,
          mobileNumber: mobile,
        }),
      });

      const payload = await res.json();
      if (!res.ok) {
        toast.error(payload.error || payload.message || "Failed to create account");
        setLoading(false);
        return;
      }

      toast.success("Account created! Logging you in...");
      const signInRes = await signIn("credentials", {
        email,
        password,
        redirect: false,
        callbackUrl: "/dashboard",
      });

      setLoading(false);

      if (signInRes?.error) {
        toast.error("Account created but failed to login automatically");
      } else {
        window.location.href = "/dashboard";
      }
    } catch (error) {
      toast.error("An unexpected error occurred");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gradient-to-br from-secondary via-white to-white flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-100 p-8">
          <h2 className="text-2xl font-bold text-foreground mb-2 text-center">
            {mounted ? (isLogin ? t("Welcome Back") : t("Create Account")) : ""}
          </h2>
          <p className="text-muted-foreground text-center mb-8">
            {mounted ? (isLogin
              ? t("Sign in to your Zenxity account")
              : t("Join Zenxity to book farming services")) : ""}
          </p>

          {isLogin ? (
            <>
              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <Label htmlFor="email" className="text-foreground">{mounted ? t("Email ID") : ""}</Label>
                  <div className="relative mt-2">
                    <Mail className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
                    <Input id="email" type="email" placeholder="your@email.com" className="pl-10" value={email} onChange={(e) => setEmail(e.target.value)} required />
                  </div>
                </div>
                <div>
                  <Label htmlFor="password" className="text-foreground">{mounted ? t("Password") : ""}</Label>
                  <div className="relative mt-2">
                    <Lock className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
                    <Input id="password" type="password" placeholder="••••••••" className="pl-10" value={password} onChange={(e) => setPassword(e.target.value)} required />
                  </div>
                </div>
                <Button type="submit" className="w-full mt-6" disabled={loading}>
                  {mounted ? (loading ? t("Signing in...") : t("Sign In")) : ""}
                </Button>
              </form>
              <div className="my-3 flex items-center justify-center gap-2">
                <div className="mt-1 h-[1.5px] flex-grow rounded bg-[#1F1D3923]"></div>
                <p className="text-sm w-fit text-[#1F1D39]">{mounted ? t("or") : ""}</p>
                <div className="mt-1 h-[1.5px] flex-grow rounded bg-[#1F1D3923]"></div>
              </div>
              <button
                type="button"
                onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
                className="font-roboto flex w-full items-center justify-center gap-3 rounded-md border border-[#1f1d398f] py-3 font-medium text-[#1F1D39] hover:cursor-pointer hover:bg-black/5"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="24px" height="24px">
                  <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
                  <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
                  <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
                  <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
                </svg>
                <p>{mounted ? t("Continue with Google") : ""}</p>
              </button>
            </>
          ) : (
            <>
              <form onSubmit={handleSignup} className="space-y-4">
                <div>
                  <Label htmlFor="fullName" className="text-foreground">{mounted ? t("Full Name") : ""}</Label>
                  <div className="relative mt-2">
                    <User className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
                    <Input id="fullName" type="text" placeholder="John Doe" className="pl-10" value={fullName} onChange={(e) => setFullName(e.target.value)} required />
                  </div>
                </div>
                <div>
                  <Label htmlFor="mobile" className="text-foreground">{mounted ? t("Mobile Number") : ""}</Label>
                  <div className="relative mt-2">
                    <Phone className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
                    <Input id="mobile" type="tel" placeholder="9876543210" className="pl-10" value={mobile} onChange={(e) => setMobile(e.target.value)} required />
                  </div>
                </div>
                <div>
                  <Label htmlFor="signupEmail" className="text-foreground">{mounted ? t("Email ID") : ""}</Label>
                  <div className="relative mt-2">
                    <Mail className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
                    <Input id="signupEmail" type="email" placeholder="your@email.com" className="pl-10" value={email} onChange={(e) => setEmail(e.target.value)} required />
                  </div>
                </div>
                <div>
                  <Label htmlFor="signupPassword" className="text-foreground">{mounted ? t("Create Password") : ""}</Label>
                  <div className="relative mt-2">
                    <Lock className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
                    <Input id="signupPassword" type="password" placeholder="Enter a strong password" className="pl-10" value={password} onChange={(e) => setPassword(e.target.value)} required />
                  </div>
                </div>
                <Button type="submit" className="w-full mt-6" disabled={loading}>
                  {mounted ? (loading ? t("Creating Account...") : t("Create Account")) : ""}
                </Button>
              </form>
              <div className="my-3 flex items-center justify-center gap-2">
                <div className="mt-1 h-[1.5px] flex-grow rounded bg-[#1F1D3923]"></div>
                <p className="text-sm w-fit text-[#1F1D39]">{mounted ? t("or") : ""}</p>
                <div className="mt-1 h-[1.5px] flex-grow rounded bg-[#1F1D3923]"></div>
              </div>
              <button
                type="button"
                onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
                className="font-roboto flex w-full items-center justify-center gap-3 rounded-md border border-[#1f1d398f] py-3 font-medium text-[#1F1D39] hover:cursor-pointer hover:bg-black/5"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="24px" height="24px">
                  <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
                  <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
                  <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
                  <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
                </svg>
                <p>{mounted ? t("Continue with Google") : ""}</p>
              </button>
            </>
          )}

          <div className="mt-6 text-center">
            <p className="text-muted-foreground text-sm">
              {mounted ? (isLogin ? t("Don't have an account?") : t("Already have an account?")) : ""}{" "}
              <button
                onClick={() => {
                  setIsLogin(!isLogin);
                  setEmail("");
                  setPassword("");
                  setFullName("");
                  setMobile("");
                }}
                className="text-primary font-semibold hover:underline"
              >
                {mounted ? (isLogin ? t("Sign Up") : t("Sign In")) : ""}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
