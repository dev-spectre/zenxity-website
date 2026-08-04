import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import { UpdateFeedCard } from "@/components/dashboard/UpdateFeedCard";
import { UpdatesFilterWrapper } from "@/components/dashboard/UpdatesFilterWrapper";
import { Activity } from "lucide-react";
import { Metadata } from "next";

import { getServerTranslation } from "@/lib/i18n";
import { withPrismaFallback } from "@/lib/prisma-safe";

export const metadata: Metadata = {
  title: "Live Updates - Zenxity",
  description: "Chronological feed of your farm's activities.",
};

export default async function LiveUpdatesPage() {
  const { t } = await getServerTranslation();
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/login");
  }
  const userId = session.user.id;

  const [updates, lands] = await Promise.all([
    withPrismaFallback(
      () => prisma.farmingUpdates.findMany({
        where: { request: { userId } },
        orderBy: { createdAt: "desc" },
      }),
      []
    ),
    withPrismaFallback(
      () => prisma.farmingRequest.findMany({
        where: { userId },
        select: { id: true, landAddress: true }
      }),
      []
    )
  ]);

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-foreground mb-1">{t("Live Updates")}</h1>
        <p className="text-muted-foreground text-sm">{t("Track the day-to-day progress of your active projects.")}</p>
      </div>

      <UpdatesFilterWrapper updates={updates} lands={lands} />
    </div>
  );
}
