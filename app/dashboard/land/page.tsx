import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { PlusCircle, MapPin, Maximize, ArrowRight } from "lucide-react";
import { Metadata } from "next";

import { getServerTranslation } from "@/lib/i18n";
import { withPrismaFallback } from "@/lib/prisma-safe";

export const metadata: Metadata = {
  title: "My Land - Zenxity",
  description: "Manage your registered land and see its status.",
};

export default async function MyLandPage() {
  const { t } = await getServerTranslation();
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/login");
  }
  const userId = session.user.id;

  const requests = await withPrismaFallback(
    () => prisma.farmingRequest.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    }),
    []
  );

  const getStatusDisplay = (status: string) => {
    if (status === "APPROVED") return { label: t("Active"), classes: "bg-green-100 text-green-800 border-green-300" };
    if (status === "PENDING") return { label: t("Pending Approval"), classes: "bg-yellow-100 text-yellow-800 border-yellow-300" };
    return { label: t("Inactive"), classes: "bg-red-100 text-red-800 border-red-300" };
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground mb-1">{t("My Land")}</h1>
          <p className="text-muted-foreground text-sm">{t("View and manage all your registered properties.")}</p>
        </div>
        
        <Link href="/dashboard/land/add" className="sm:w-auto w-full">
          <Button className="gap-2 w-full">
            <PlusCircle className="w-4 h-4" /> {t("Add New Land")}
          </Button>
        </Link>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {requests.map((req) => {
          const status = getStatusDisplay(req.status);
          
          return (
            <div key={req.id} className="bg-white rounded-xl border p-6 flex flex-col justify-between hover:shadow-md transition-shadow">
              <div className="space-y-4">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <MapPin className="w-4 h-4" />
                    <span className="font-medium text-foreground">{req.landAddress}</span>
                  </div>
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${status.classes}`}>
                    {status.label}
                  </span>
                </div>
                
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Maximize className="w-4 h-4" />
                  <span>{req.landSize} {t("Acres")}</span>
                </div>

                {req.notes && (
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {req.notes}
                  </p>
                )}
              </div>

              <div className="mt-6 pt-6 border-t border-gray-100">
                <Link href={`/dashboard/land/${req.id}`}>
                  <Button variant="outline" className="w-full gap-2 group">
                    {t("View Details")} 
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
              </div>
            </div>
          );
        })}

        {requests.length === 0 && (
          <div className="col-span-full bg-white rounded-xl border p-12 text-center flex flex-col items-center justify-center space-y-4">
            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-2">
              <MapPin className="w-8 h-8 text-gray-300" />
            </div>
            <h3 className="text-lg font-bold text-foreground">{t("No land registered yet")}</h3>
            <p className="text-muted-foreground max-w-sm">
              {t("You haven't added any properties to your Zenxity dashboard. Click 'Add New Land' to get started.")}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
