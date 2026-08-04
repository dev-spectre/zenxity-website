import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Map, IndianRupee, TrendingUp, ClipboardList, PlusCircle, FileText, Phone } from "lucide-react";
import { StatCard } from "@/components/dashboard/StatCard";
import { UpdateFeedCard } from "@/components/dashboard/UpdateFeedCard";
import { Metadata } from "next";

import { getServerTranslation } from "@/lib/i18n";
import { withPrismaFallback } from "@/lib/prisma-safe";

export const metadata: Metadata = {
  title: "Dashboard Home - Zenxity",
  description: "Your farming dashboard overview.",
};

export default async function DashboardHomePage() {
  const { t } = await getServerTranslation();
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/login");
  }
  const userId = session.user.id;

  const [requests, updates, user, financialRecords, allOffers] = await Promise.all([
    withPrismaFallback(
      () => prisma.farmingRequest.findMany({
        where: { userId },
        select: { id: true, landSize: true, status: true, landAddress: true },
      }),
      []
    ),
    withPrismaFallback(
      () => prisma.farmingUpdates.findMany({
        where: { request: { userId } },
        orderBy: { createdAt: "desc" },
        take: 3,
      }),
      []
    ),
    withPrismaFallback(
      () => userId ? prisma.user.findUnique({
        where: { id: userId },
        select: { bankName: true, accountNumber: true, ifscCode: true }
      }) : Promise.resolve(null),
      null
    ),
    withPrismaFallback(
      () => prisma.financialRecord.findMany({
        where: { userId }
      }),
      []
    ),
    withPrismaFallback(
      () => prisma.offer.findMany({
        orderBy: { createdAt: "desc" },
        take: 4
      }),
      []
    )
  ]);

  const offers = allOffers;


  const activeProjectsCount = requests.filter(r => r.status === "APPROVED").length;

  // Calculate total land size (assuming landSize is stored as a string number)
  const totalLandSize = requests.reduce((acc, req) => {
    const size = parseFloat(req.landSize) || 0;
    return acc + size;
  }, 0);

  // Real financial data from DB
  const totalEarnings = financialRecords.reduce((acc, rec) => acc + rec.amount, 0);
  const seasonProfit = totalEarnings; // Using total earnings as profit metric for dashboard simplicity

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      maximumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-foreground mb-2">{t("Dashboard Overview")}</h1>
        <p className="text-muted-foreground">{t("Welcome back, here is what is happening with your land.")}</p>
      </div>

      {/* Bank details alert */}
      {(!user?.bankName || !user?.accountNumber || !user?.ifscCode) && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-start gap-3">
            <IndianRupee className="w-5 h-5 text-yellow-600 mt-0.5" />
            <div>
              <p className="font-semibold text-yellow-800">{t("Bank Details Missing")}</p>
              <p className="text-sm text-yellow-700">{t("Please add your bank details to ensure seamless profit withdrawals.")}</p>
            </div>
          </div>
          <Link href="/dashboard/profile">
            <Button className="bg-yellow-600 hover:bg-yellow-700 text-white gap-2 text-sm shrink-0">
              {t("Add Bank Details")}
            </Button>
          </Link>
        </div>
      )}

      {/* Quick Actions */}
      <div className="flex flex-wrap gap-4">
        <Link href="/dashboard/land">
          <Button className="gap-2"><PlusCircle className="w-4 h-4" /> {t("Land")}</Button>
        </Link>
        <Link href="/dashboard/earnings">
          <Button variant="outline" className="gap-2 bg-white"><FileText className="w-4 h-4" /> {t("Earnings")}</Button>
        </Link>
        <Link href="/dashboard/support">
          <Button variant="outline" className="gap-2 hidden sm:flex bg-white"><Phone className="w-4 h-4" /> {t("Contact Support")}</Button>
        </Link>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title={t("Total Land")}
          value={`${totalLandSize} ${t("Acres")}`}
          icon={Map}
        />
        <StatCard
          title={t("Total Earnings")}
          value={`₹${formatCurrency(totalEarnings)}`}
          icon={IndianRupee}
        />
        <StatCard
          title={t("This Season Profit")}
          value={`₹${formatCurrency(seasonProfit)}`}
          icon={TrendingUp}
          className="border-primary/20 bg-primary/5"
        />
        <StatCard
          title={t("Active Projects")}
          value={activeProjectsCount}
          icon={ClipboardList}
        />
      </div>

      {/* Special Offers */}
      {offers.length > 0 && (
        <section className="animate-in fade-in slide-in-from-bottom-4 duration-700 delay-150">
          <div className="flex items-center gap-2 mb-6">
            <h2 className="text-xl font-bold text-foreground">{t("Special Offers & Benefits")}</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {offers.map((offer) => (
              <div key={offer.id} className="group bg-white rounded-2xl border border-gray-100 p-5 hover:shadow-xl hover:shadow-gray-200/50 transition-all duration-300 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-2 opacity-10 group-hover:opacity-20 transition-opacity">
                  <TrendingUp className="w-12 h-12 text-primary rotate-12" />
                </div>
                <div className="space-y-3 relative z-10">
                  <div className="flex justify-between items-start">
                    <h3 className="font-bold text-foreground leading-tight group-hover:text-primary transition-colors">{offer.title}</h3>
                  </div>
                  <p className="text-xs text-muted-foreground line-clamp-2">{offer.description}</p>
                  <div className="pt-2 flex items-center justify-between">
                    <span className="text-[10px] font-bold text-primary uppercase tracking-wider bg-primary/5 px-2 py-1 rounded">
                      {t("Valid Until")}: {offer.validUntil}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Recent Updates */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-foreground">{t("Recent Updates")}</h2>
          <Link href="/dashboard/updates" className="text-sm font-semibold text-primary hover:underline">
            {t("View All")}
          </Link>
        </div>

        {updates.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {updates.map((update) => (
              <UpdateFeedCard
                key={update.id}
                title={update.title}
                description={update.description || undefined}
                imgUrl={update.img || undefined}
                date={update.activityDate || update.createdAt.toLocaleDateString()}
                time={update.activityTime || undefined}
              />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-lg border p-8 text-center">
            <p className="text-muted-foreground">{t("No recent updates available for your projects.")}</p>
          </div>
        )}
      </section>
    </div>
  );
}
