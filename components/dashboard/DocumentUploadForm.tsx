"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { UploadCloud, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useTranslation } from "@/hooks/useTranslation";
import { cn } from "@/lib/utils";

export function DocumentUploadForm({ requestId }: { requestId?: string }) {
  const { t } = useTranslation();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !name) {
      toast.error(t("Please provide both a document name and a file"));
      return;
    }

    if (file.size > 20 * 1024 * 1024) {
      toast.error(t("File size must be less than 20MB"));
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("name", name);
      if (requestId) {
        formData.append("requestId", requestId);
      }

      const res = await fetch("/api/documents", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || t("Failed to upload document"));
      }

      toast.success(t("Document uploaded successfully!"));
      setName("");
      setFile(null);
      router.refresh();
    } catch (error: any) {
      toast.error(error.message || t("An unexpected error occurred"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleUpload} className="form-container !p-6 space-y-5">
      <div className="flex items-center gap-2 border-b border-gray-100 pb-3 mb-4">
        <div className="p-2 bg-green-50 rounded-lg">
          <UploadCloud className="w-5 h-5 text-green-600" />
        </div>
        <h3 className="font-bold text-foreground text-lg">{mounted ? t("Upload New Document") : ""}</h3>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="doc-name" className="premium-label">{mounted ? t("Document Name") : ""}</Label>
        <Input 
          id="doc-name" 
          type="text" 
          placeholder={mounted ? t("e.g. Aadhaar Card, Land Patta") : ""} 
          value={name} 
          onChange={(e) => setName(e.target.value)}
          required 
        />
      </div>

      <div className="space-y-2">
        <Label className="premium-label">{mounted ? t("Select File") : ""}</Label>
        <div 
          className={cn(
            "relative group cursor-pointer transition-all duration-300",
            "border-2 border-dashed border-gray-200 rounded-2xl bg-gray-50/50 p-8 text-center",
            "hover:border-green-600/50 hover:bg-green-50/30",
            file ? "border-green-600/50 bg-green-50/30" : ""
          )}
          onClick={() => document.getElementById("doc-file")?.click()}
        >
          <input 
            id="doc-file" 
            type="file" 
            accept=".pdf,.jpg,.jpeg,.png" 
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            className="hidden"
            required 
          />
          
          <div className="flex flex-col items-center justify-center gap-3">
            <div className={cn(
              "p-4 rounded-full bg-white shadow-sm transition-transform duration-300 group-hover:scale-110",
              file ? "text-green-600" : "text-gray-400"
            )}>
              <UploadCloud className="w-8 h-8" />
            </div>
            
            <div className="space-y-1">
              <p className="font-semibold text-foreground">
                {file ? file.name : mounted ? t("Click to upload or drag and drop") : ""}
              </p>
              <p className="text-xs text-muted-foreground">
                {mounted ? t("Supported formats: PDF, JPG, PNG (Max 20MB)") : ""}
              </p>
            </div>
          </div>
        </div>
      </div>

      <Button type="submit" className="w-full h-12 text-base font-semibold shadow-lg shadow-green-600/20" disabled={loading}>
        {loading ? (
          <Loader2 className="w-5 h-5 animate-spin" />
        ) : (
          <div className="flex items-center gap-2">
            <UploadCloud className="w-5 h-5" />
            {mounted ? t("Upload Document") : ""}
          </div>
        )}
      </Button>
    </form>
  );
}
