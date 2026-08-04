import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import { ClipboardList, CheckCircle } from "lucide-react";
import { Metadata } from "next";

import { getServerTranslation } from "@/lib/i18n";
import { withPrismaFallback } from "@/lib/prisma-safe";

export const metadata: Metadata = {
  title: "Projects - Zenxity",
  description: "Track your active and completed farming projects.",
};

export default async function ProjectsPage() {
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

  // Extract active and completed projects directly from user's approved requests
  const activeProjects = requests.filter(r => r.status === "APPROVED" && r.progress < 100).map(req => ({
    id: req.id,
    name: `${req.landAddress} Farming`,
    status: t("In Progress"),
    progress: req.progress,
  }));

  const completedProjects = requests.filter(r => r.status === "APPROVED" && r.progress === 100).map(req => ({
    id: req.id,
    name: `${req.landAddress} Farming`,
    status: t("Completed"),
    progress: 100,
  }));

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-10">
      <div>
        <h1 className="text-2xl font-bold text-foreground mb-1">{t("Projects")}</h1>
        <p className="text-muted-foreground text-sm">{t("Track your active and completed farming projects.")}</p>
      </div>

      <section>
        <h2 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
          <ClipboardList className="w-5 h-5 text-primary" />
          {t("Active Projects")}
        </h2>
        
        {activeProjects.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {activeProjects.map((project) => (
              <div key={project.id} className="bg-white rounded-xl border p-6 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="font-bold text-lg text-foreground line-clamp-1" title={project.name}>{project.name}</h3>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold border bg-blue-50 text-blue-700 border-blue-200 whitespace-nowrap">
                    {project.status}
                  </span>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">{t("Progress")}</span>
                    <span className="font-medium">{project.progress}%</span>
                  </div>
                  <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-primary rounded-full transition-all duration-500" 
                      style={{ width: `${project.progress}%` }} 
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-xl border p-8 text-center">
            <p className="text-muted-foreground">{t("No active projects at the moment.")}</p>
          </div>
        )}
      </section>

      <section>
        <h2 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
          <CheckCircle className="w-5 h-5 text-green-600" />
          {t("Completed Projects")}
        </h2>
        
        {completedProjects.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {completedProjects.map((project) => (
              <div key={project.id} className="bg-white/50 rounded-xl border p-6 grayscale-[30%] hover:grayscale-0 transition-all">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="font-bold text-lg text-foreground line-clamp-1">{project.name}</h3>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold border bg-green-50 text-green-700 border-green-200 whitespace-nowrap">
                    {project.status}
                  </span>
                </div>
                
                <div className="space-y-2 opacity-70">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">{t("Progress")}</span>
                    <span className="font-medium">{project.progress}%</span>
                  </div>
                  <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-green-500 rounded-full" style={{ width: `${project.progress}%` }} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-xl border p-8 text-center">
            <p className="text-muted-foreground">{t("No completed projects yet.")}</p>
          </div>
        )}
      </section>
    </div>
  );
}
