"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, Scale, Gavel, CheckCircle, AlertCircle } from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";

export default function TermsOfService() {
  const { t } = useTranslation();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <Link href="/" className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-primary mb-8 transition-colors">
          <ArrowLeft className="w-4 h-4 mr-2" />
          {mounted ? t("Back to Home") : ""}
        </Link>

        <div className="bg-white rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-100 p-8 md:p-12">
          <div className="flex items-center gap-4 mb-8">
            <div className="p-3 bg-green-50 rounded-2xl">
              <Scale className="w-8 h-8 text-green-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-foreground">{mounted ? t("Terms of Service") : ""}</h1>
              <p className="text-muted-foreground">{mounted ? t("Last updated: April 2026") : ""}</p>
            </div>
          </div>

          <div className="prose prose-green max-w-none space-y-8 text-gray-600">
            <section className="space-y-4">
              <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
                <Gavel className="w-5 h-5 text-green-600" /> {mounted ? t("1. Agreement to Terms") : ""}
              </h2>
              <p>{mounted ? t("By accessing the Zenxity platform and registering your land for farming services, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our services.") : ""}</p>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-600" /> {mounted ? t("2. Land Ownership & Eligibility") : ""}
              </h2>
              <p>{mounted ? t("To use our services, you must:") : ""}</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>{mounted ? t("Be the legal owner of the land or have explicit legal authorization to manage it.") : ""}</li>
                <li>{mounted ? t("Provide accurate land records, including Survey Numbers and Patta details.") : ""}</li>
                <li>{mounted ? t("Ensure the land is free from active legal disputes that would prevent farming activities.") : ""}</li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-green-600" /> {mounted ? t("3. Service Scope") : ""}
              </h2>
              <p>{mounted ? t("Zenxity acts as a farming management partner. While we strive for maximum productivity, agricultural yields are subject to environmental factors, including weather and soil conditions. We provide:") : ""}</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>{mounted ? t("Professional land assessment and crop planning.") : ""}</li>
                <li>{mounted ? t("End-to-end management of tilling, sowing, and harvesting.") : ""}</li>
                <li>{mounted ? t("Transparent financial reporting and profit sharing as per individual land agreements.") : ""}</li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
                <Scale className="w-5 h-5 text-green-600" /> {mounted ? t("4. Payments and Payouts") : ""}
              </h2>
              <p>{mounted ? t("Earnings from farming activities are calculated based on market rates and harvested yields. Payouts are transferred to your registered bank account within the timelines specified in your project dashboard. Zenxity reserves the right to withhold payouts if bank details are incorrect or if ownership disputes arise.") : ""}</p>
            </section>

            <section className="space-y-4 border-t pt-8">
              <h2 className="text-xl font-bold text-foreground">{mounted ? t("Termination") : ""}</h2>
              <p>{mounted ? t("Either party may terminate the agreement as per the conditions laid out in the specific farming contract signed for each project. Upon termination, a final financial settlement will be conducted based on the current crop cycle status.") : ""}</p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
