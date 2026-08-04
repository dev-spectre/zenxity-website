import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft, MapPin, Maximize, FileText, CheckCircle, Clock, Download, Activity } from "lucide-react";
import { TimelineBar } from "@/components/dashboard/TimelineBar";
import { DeleteLandButton } from "@/components/dashboard/DeleteLandButton";
import { DocumentUploadForm } from "@/components/dashboard/DocumentUploadForm";
import { UpdateFeedCard } from "@/components/dashboard/UpdateFeedCard";
import { Metadata } from "next";

import { getServerTranslation } from "@/lib/i18n";
import { withPrismaFallback } from "@/lib/prisma-safe";

export const metadata: Metadata = {
  title: "Land Details - Zenxity",
  description: "Detailed view of your registered land.",
};

export default async function LandDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { t } = await getServerTranslation();
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/login");
  }
  
  const resolvedParams = await params;
  const reqId = resolvedParams.id;
  
  const [landRequest, documents, landUpdates] = await Promise.all([
    withPrismaFallback(
      () => prisma.farmingRequest.findUnique({
        where: { id: reqId, userId: session.user.id },
      }),
      null
    ),
    withPrismaFallback(
      () => prisma.document.findMany({
        where: { requestId: reqId },
        orderBy: { createdAt: "desc" }
      }),
      []
    ),
    withPrismaFallback(
      () => prisma.farmingUpdates.findMany({
        where: { requestId: reqId },
        orderBy: { createdAt: "desc" }
      }),
      []
    )
  ]);

  if (!landRequest) {
    redirect("/dashboard/land");
  }

  const surveyNo = landRequest.surveyNo || "Not Provided";
  const pattaNo = landRequest.pattaNo || "Not Provided";
  const legalInfo = landRequest.legalInfo || "None";
  
  const stages = landRequest.milestones 
    ? landRequest.milestones.split(",").map(m => m.trim())
    : [t("Planning"), t("Growing"), t("Harvest"), t("Completed")];
    
  let currentStageIndex = 0;
  if (landRequest.status === "APPROVED") {
    const stageCount = stages.length;
    if (landRequest.progress >= 100) {
      currentStageIndex = stageCount - 1;
    } else {
      currentStageIndex = Math.min(
        Math.floor((landRequest.progress / 100) * stageCount), 
        stageCount - 1
      );
    }
  } 
  
  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-8 max-w-4xl">
      <Link href="/dashboard/land" className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-primary transition-colors mb-2">
        <ArrowLeft className="w-4 h-4 mr-2" />
        {t("Back to My Land")}
      </Link>

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
            {landRequest.landAddress}
            {landRequest.status === "APPROVED" && <CheckCircle className="w-6 h-6 text-green-500" />}
            {landRequest.status === "PENDING" && <Clock className="w-6 h-6 text-yellow-500" />}
          </h1>
          <div className="flex flex-wrap gap-4 mt-2 text-muted-foreground">
            <span className="flex items-center gap-1.5 text-sm">
              <MapPin className="w-4 h-4" /> {landRequest.landAddress}
            </span>
            <span className="flex items-center gap-1.5 text-sm">
              <Maximize className="w-4 h-4" /> {landRequest.landSize} {t("Acres")}
            </span>
          </div>
        </div>
        {landRequest.progress === 100 && (
          <DeleteLandButton requestId={reqId} />
        )}
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Legal Info Card */}
        <div className="bg-white rounded-xl border p-6">
          <h2 className="text-lg font-bold text-foreground mb-4 border-b pb-2">{t("Legal Information")}</h2>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground">{t("Survey Number")}</p>
              <p className="font-medium">{surveyNo}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">{t("Patta Number")}</p>
              <p className="font-medium">{pattaNo}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">{t("Legal Information")}</p>
              <p className="font-medium">{legalInfo}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">{t("Preferred Language")}</p>
              <p className="font-medium">{landRequest.preferredLanguage}</p>
            </div>
          </div>
        </div>

        {/* Documents Card */}
        <div className="bg-white rounded-xl border p-6 flex flex-col justify-between">
          <div>
            <h2 className="text-lg font-bold text-foreground mb-4 border-b pb-2">{t("Documents")}</h2>
            <div className="space-y-3 max-h-[200px] overflow-y-auto mb-4">
              {documents.length > 0 ? documents.map((doc) => (
                <a key={doc.id} href={doc.fileUrl} target="_blank" rel="noreferrer" className="w-full">
                  <Button variant="outline" className="w-full justify-between gap-3 bg-gray-50 hover:bg-gray-100 text-sm">
                    <span className="flex items-center gap-2 truncate">
                      <FileText className="w-4 h-4 text-primary flex-shrink-0" />
                      <span className="truncate">{doc.name}</span>
                    </span>
                    <Download className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                  </Button>
                </a>
              )) : (
                <p className="text-sm text-muted-foreground text-center py-4">{t("No documents uploaded yet.")}</p>
              )}
            </div>
          </div>
          
          <DocumentUploadForm requestId={reqId} />
        </div>
      </div>

      {/* Progress Timeline */}
      <div className="bg-white rounded-xl border p-6 sm:p-8 overflow-x-auto">
        <h2 className="text-lg font-bold text-foreground mb-6">{t("Project Timeline")}</h2>
        <div className="min-w-[400px]">
          <TimelineBar stages={stages} currentStageIndex={currentStageIndex} />
        </div>
      </div>
      
      {/* Additional Notes */}
      {landRequest.notes && (
        <div className="bg-white rounded-xl border p-6">
          <h2 className="text-lg font-bold text-foreground mb-2">{t("Additional Notes")}</h2>
          <p className="text-muted-foreground">{landRequest.notes}</p>
        </div>
      )}

      {/* Live Updates for This Land */}
      <div className="bg-white rounded-xl border p-6 space-y-6">
        <h2 className="text-lg font-bold text-foreground border-b pb-2 flex items-center gap-2">
          <Activity className="w-5 h-5 text-primary" />
          {t("Live Land Updates")}
        </h2>
        
        {landUpdates.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {landUpdates.map((update) => (
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
          <p className="text-sm text-muted-foreground py-4 text-center">{t("No updates logged for this land yet.")}</p>
        )}
      </div>
    </div>
  );
}
