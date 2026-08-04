"use client";

import { FileText, Eye, Trash2, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useTranslation } from "@/hooks/useTranslation";
import { cn } from "@/lib/utils";

interface Document {
  id: string;
  name: string;
  fileUrl: string;
  status: string;
}

export function DocumentList({ documents }: { documents: Document[] }) {
  const { t } = useTranslation();
  const router = useRouter();
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm(t("Are you sure you want to delete this document?"))) return;

    setDeletingId(id);
    try {
      const res = await fetch(`/api/documents/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || t("Failed to delete document"));
      }

      toast.success(t("Document deleted successfully"));
      router.refresh();
    } catch (error: any) {
      toast.error(error.message || t("An unexpected error occurred"));
    } finally {
      setDeletingId(null);
    }
  };

  if (documents.length === 0) {
    return (
      <div className="col-span-full text-center py-8 bg-gray-50/50 rounded-2xl border-2 border-dashed border-gray-100">
        <FileText className="w-8 h-8 text-gray-300 mx-auto mb-2" />
        <p className="text-sm text-muted-foreground">
          {mounted ? t("No uploaded documents found.") : ""}
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {documents.map((doc) => (
        <div 
          key={doc.id} 
          className="group flex items-center justify-between p-4 rounded-2xl border border-gray-100 bg-white hover:border-primary/20 hover:shadow-sm transition-all duration-300"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gray-50 rounded-lg group-hover:bg-primary/5 transition-colors">
              <FileText className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
            </div>
            <div>
              <p className="font-semibold text-sm text-foreground">{doc.name}</p>
              <p className={cn(
                "text-[10px] uppercase tracking-wider font-bold",
                doc.status === 'Verified' ? 'text-green-600' : 'text-yellow-600'
              )}>
                {mounted ? t(doc.status) : ""}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <a 
              href={doc.fileUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="p-2 rounded-xl text-muted-foreground hover:text-primary hover:bg-primary/5 transition-all"
              title={mounted ? t("View Document") : ""}
            >
              <Eye className="w-4 h-4" />
            </a>
            <button
              onClick={() => handleDelete(doc.id)}
              disabled={deletingId === doc.id}
              className="p-2 rounded-xl text-muted-foreground hover:text-red-600 hover:bg-red-50 transition-all disabled:opacity-50"
              title={mounted ? t("Delete Document") : ""}
            >
              {deletingId === doc.id ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Trash2 className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
