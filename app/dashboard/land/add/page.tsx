"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useTranslation } from "@/hooks/useTranslation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

export default function AddLandPage() {
  const { t } = useTranslation();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    landSize: "",
    preferredLanguage: "English",
    landAddress: "",
    notes: "",
    surveyNo: "",
    pattaNo: "",
    legalInfo: "",
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.landSize || !formData.landAddress) {
      toast.error(t("Please fill in all required fields"));
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/land-requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || t("Failed to submit land request"));
      }

      toast.success(t("Land request submitted successfully!"));
      router.push("/dashboard/land");
      router.refresh();
    } catch (error: any) {
      toast.error(error.message || t("An unexpected error occurred"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-8 max-w-2xl">
      <Link href="/dashboard/land" className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-primary transition-colors mb-2">
        <ArrowLeft className="w-4 h-4 mr-2" />
        {mounted ? t("Back to My Land") : ""}
      </Link>

      <div>
        <h1 className="text-2xl font-bold text-foreground mb-1">{mounted ? t("Register New Land") : ""}</h1>
        <p className="text-muted-foreground text-sm">{mounted ? t("Provide details about your land for farming assessment.") : ""}</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-100 p-8 space-y-6">
        <div className="space-y-2">
          <Label htmlFor="landSize" className="text-foreground font-semibold">
            {mounted ? t("Land Size (Acres)") : ""} <span className="text-red-500">*</span>
          </Label>
          <Input 
            id="landSize" 
            type="number" 
            step="0.1" 
            min="0.1"
            placeholder="e.g., 5.5"
            value={formData.landSize}
            onChange={(e) => setFormData({ ...formData, landSize: e.target.value })}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="landAddress" className="text-foreground font-semibold">
            {mounted ? t("Land Location / Address") : ""} <span className="text-red-500">*</span>
          </Label>
          <Input 
            id="landAddress" 
            type="text" 
            placeholder="e.g., Coimbatore, Tamil Nadu"
            value={formData.landAddress}
            onChange={(e) => setFormData({ ...formData, landAddress: e.target.value })}
            required
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="surveyNo" className="text-foreground font-semibold">
              {mounted ? t("Survey Number") : ""}
            </Label>
            <Input 
              id="surveyNo" 
              type="text" 
              placeholder="e.g., 123/4A"
              value={formData.surveyNo}
              onChange={(e) => setFormData({ ...formData, surveyNo: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="pattaNo" className="text-foreground font-semibold">
              {mounted ? t("Patta Number") : ""}
            </Label>
            <Input 
              id="pattaNo" 
              type="text" 
              placeholder="e.g., 8872"
              value={formData.pattaNo}
              onChange={(e) => setFormData({ ...formData, pattaNo: e.target.value })}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="legalInfo" className="text-foreground font-semibold">
            {mounted ? t("Additional Legal Information") : ""}
          </Label>
          <Input 
            id="legalInfo" 
            type="text" 
            placeholder="e.g., Encumbrance Free, Clear Title"
            value={formData.legalInfo}
            onChange={(e) => setFormData({ ...formData, legalInfo: e.target.value })}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="preferredLanguage" className="text-foreground font-semibold">
            {mounted ? t("Preferred Communication Language") : ""} <span className="text-red-500">*</span>
          </Label>
          <select 
            id="preferredLanguage"
            className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring"
            value={formData.preferredLanguage}
            onChange={(e) => setFormData({ ...formData, preferredLanguage: e.target.value })}
          >
            <option value="English">English</option>
            <option value="Tamil">தமிழ் (Tamil)</option>
          </select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="notes" className="text-foreground font-semibold">
            {mounted ? t("Additional Notes (Optional)") : ""}
          </Label>
          <textarea 
            id="notes" 
            placeholder="Mention any specific details, water availability, soil type, etc."
            className="w-full min-h-[100px] rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 resize-none"
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
          />
        </div>

        <Button type="submit" className="w-full gap-2" disabled={loading}>
          {loading && <Loader2 className="w-4 h-4 animate-spin" />}
          {mounted ? t("Submit Land Request") : ""}
        </Button>
      </form>
    </div>
  );
}
