import { Mail, MessageSquare, Phone } from "lucide-react";
import { Metadata } from "next";

import { getServerTranslation } from "@/lib/i18n";

export const metadata: Metadata = {
  title: "Support - Zenxity",
  description: "Get help and support for your farming projects.",
};

export default async function SupportPage() {
  const { t } = await getServerTranslation();
  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-8 max-w-3xl mx-auto">
      <div className="lg:text-center mb-10">
        <h1 className="text-3xl font-bold text-foreground mb-4">{t("How can we help you?")}</h1>
        <p className="text-muted-foreground text-lg">{t("Reach out to the Zenxity support team for any queries regarding your land, projects, or earnings.")}</p>
      </div>

      <div className="grid gap-6">
        {/* Phone Support */}
        <a 
          href="tel:+919042359210" 
          className="bg-white rounded-xl border p-6 flex items-center gap-6 hover:shadow-md hover:border-primary/30 transition-all group"
        >
          <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center shrink-0 group-hover:bg-blue-100 transition-colors">
            <Phone className="w-8 h-8 text-blue-600" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-foreground mb-1">{t("Call Us")}</h2>
            <p className="text-muted-foreground mb-2">{t("Available Mon-Sat, 9am to 6pm")}</p>
            <span className="font-semibold text-primary">+91 90423 59210</span>
          </div>
        </a>

        {/* WhatsApp Support */}
        <a 
          href="https://wa.me/919042359210" 
          target="_blank"
          rel="noopener noreferrer"
          className="bg-white rounded-xl border p-6 flex items-center gap-6 hover:shadow-md hover:border-primary/30 transition-all group"
        >
          <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center shrink-0 group-hover:bg-green-100 transition-colors">
            <MessageSquare className="w-8 h-8 text-green-600" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-foreground mb-1">{t("WhatsApp")}</h2>
            <p className="text-muted-foreground mb-2">{t("Quick support via WhatsApp messages")}</p>
            <span className="font-semibold text-primary">{t("Message Us")}</span>
          </div>
        </a>

        {/* Email Support */}
        <a 
          href="mailto:support@zenxity.com" 
          className="bg-white rounded-xl border p-6 flex items-center gap-6 hover:shadow-md hover:border-primary/30 transition-all group"
        >
          <div className="w-16 h-16 bg-orange-50 rounded-full flex items-center justify-center shrink-0 group-hover:bg-orange-100 transition-colors">
            <Mail className="w-8 h-8 text-orange-600" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-foreground mb-1">{t("Email Support")}</h2>
            <p className="text-muted-foreground mb-2">{t("For detailed queries and documentation")}</p>
            <span className="font-semibold text-primary">support@zenxity.in</span>
          </div>
        </a>
      </div>
    </div>
  );
}
