import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import { FileText } from "lucide-react";
import { Metadata } from "next";
import { DocumentUploadForm } from "@/components/dashboard/DocumentUploadForm";
import { ProfileEditManager } from "@/components/dashboard/ProfileEditManager";
import { DocumentList } from "@/components/dashboard/DocumentList";

import { getServerTranslation } from "@/lib/i18n";
import { withPrismaFallback } from "@/lib/prisma-safe";

export const metadata: Metadata = {
  title: "Profile - Zenxity",
  description: "View your profile, bank details, and uploaded documents.",
};

export default async function ProfilePage() {
  const { t } = await getServerTranslation();
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/login");
  }
  
  const user = await withPrismaFallback(
    () => prisma.user.findUnique({
      where: { id: session.user.id },
    }),
    null
  );

  const safeUser = user ?? {
    name: "",
    email: "",
    mobileNumber: null,
    bankName: null,
    accountNumber: null,
    ifscCode: null,
  };

  const realDocuments = await withPrismaFallback(
    () => prisma.document.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" },
    }),
    []
  );

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-8 max-w-4xl">
      <div>
        <h1 className="text-2xl font-bold text-foreground mb-1">{t("My Profile")}</h1>
        <p className="text-muted-foreground text-sm">{t("View your personal information and documents.")}</p>
      </div>

      <ProfileEditManager 
        initialUser={{
          name: safeUser.name,
          email: safeUser.email,
          mobileNumber: safeUser.mobileNumber,
          bankName: safeUser.bankName,
          accountNumber: safeUser.accountNumber,
          ifscCode: safeUser.ifscCode
        }} 
      />

        {/* Uploaded Documents */}
        <div className="form-container space-y-6">
          <h2 className="text-lg font-bold text-foreground flex items-center gap-2 border-b border-gray-100 pb-3">
            <div className="p-2 bg-primary/5 rounded-lg">
              <FileText className="w-5 h-5 text-primary" />
            </div>
            {t("Uploaded Documents")}
          </h2>
          
          <DocumentList documents={realDocuments} />

          <div className="mt-8 pt-6 border-t border-gray-100">
            <h3 className="text-sm font-bold text-foreground mb-4 uppercase tracking-wider text-muted-foreground">{t("Upload New Document")}</h3>
            <div className="max-w-md">
              <DocumentUploadForm />
            </div>
          </div>
        </div>
    </div>
  );
}
