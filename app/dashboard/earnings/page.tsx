import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { IndianRupee, Table, TrendingUp } from "lucide-react";
import { Metadata } from "next";
import prisma from "@/lib/prisma";

import { getServerTranslation } from "@/lib/i18n";
import { withPrismaFallback } from "@/lib/prisma-safe";

export const metadata: Metadata = {
  title: "Earnings - Zenxity",
  description: "View your farming earnings and profit splits.",
};

export default async function EarningsPage() {
  const { t } = await getServerTranslation();
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/login");
  }

  const financialRecords = await withPrismaFallback(
    () => prisma.financialRecord.findMany({
      where: { userId: session.user.id },
      orderBy: { date: "desc" },
    }),
    []
  );

  const totalSeasonEarnings = financialRecords.reduce((acc, rec) => acc + rec.amount, 0);


  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-8 max-w-5xl">
      <div>
        <h1 className="text-2xl font-bold text-foreground mb-1">{t("Earnings & Profits")}</h1>
        <p className="text-muted-foreground text-sm">{t("Track your seasonal earnings and profit sharing.")}</p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Main Season Summary Card */}
        <div className="md:col-span-3 bg-gradient-to-br from-primary/10 to-primary/5 rounded-2xl border border-primary/20 p-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-6">
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm">
              <TrendingUp className="w-8 h-8 text-primary" />
            </div>
            <div>
              <p className="text-sm font-semibold text-primary/80 mb-1">{t("This Season Total Earnings")}</p>
              <h2 className="text-4xl sm:text-5xl font-bold text-foreground tracking-tight">
                {formatCurrency(totalSeasonEarnings)}
              </h2>
            </div>
          </div>
        </div>

        {/* Financial Breakdown Table */}
        <div className="md:col-span-3">
          <h2 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
            <Table className="w-5 h-5 text-primary" />
            {t("Financial Breakdown")}
          </h2>
          
          <div className="bg-white rounded-xl border overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-gray-50 border-b text-muted-foreground font-semibold">
                  <tr>
                    <th className="py-4 px-6">{t("Date")}</th>
                    <th className="py-4 px-6">{t("Description")}</th>
                    <th className="py-4 px-6 text-right">{t("Amount")}</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {financialRecords.map((record) => (
                    <tr key={record.id} className="hover:bg-gray-50 transition-colors">
                      <td className="py-4 px-6 text-muted-foreground">
                        {new Date(record.date).toLocaleDateString('en-IN')}
                      </td>
                      <td className="py-4 px-6 font-medium text-foreground">
                        {record.description}
                      </td>
                      <td className="py-4 px-6 text-right font-bold text-green-700">
                        {formatCurrency(record.amount)}
                      </td>
                    </tr>
                  ))}
                  
                  {financialRecords.length === 0 && (
                    <tr>
                      <td colSpan={3} className="py-8 px-6 text-center text-muted-foreground">
                        {t("No financial breakdowns generated for this season yet.")}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

