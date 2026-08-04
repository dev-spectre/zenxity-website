"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Trash2, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useTranslation } from "@/hooks/useTranslation";

export function DeleteLandButton({ requestId }: { requestId: string }) {
  const { t } = useTranslation();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleDelete = async () => {
    if (!confirm(t("Are you sure you want to delete this land request?"))) return;

    setLoading(true);
    try {
      const res = await fetch(`/api/land-requests/${requestId}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || t("Failed to delete land"));
      }

      toast.success(t("Land deleted successfully!"));
      router.push("/dashboard/land");
      router.refresh();
    } catch (error: any) {
      toast.error(error.message || t("An unexpected error occurred"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button 
      variant="destructive" 
      size="sm" 
      className="gap-2" 
      disabled={loading} 
      onClick={handleDelete}
    >
      {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
      {mounted ? t("Delete Land") : ""}
    </Button>
  );
}
