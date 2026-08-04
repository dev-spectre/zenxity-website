"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User, Phone, Mail, Building, Edit2, Save, X } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useTranslation } from "@/hooks/useTranslation";

interface UserData {
  name: string;
  email: string;
  mobileNumber: string | null;
  bankName: string | null;
  accountNumber: string | null;
  ifscCode: string | null;
}

export function ProfileEditManager({ initialUser }: { initialUser: UserData }) {
  const { t } = useTranslation();
  const router = useRouter();
  
  const [isEditingInfo, setIsEditingInfo] = useState(false);
  const [isEditingBank, setIsEditingBank] = useState(false);
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const [formData, setFormData] = useState({
    name: initialUser.name,
    mobileNumber: initialUser.mobileNumber || "",
    bankName: initialUser.bankName || "",
    accountNumber: initialUser.accountNumber || "",
    ifscCode: initialUser.ifscCode || "",
  });

  const handleSave = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/user/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || t("Failed to update profile"));
      }

      toast.success(t("Profile updated successfully!"));
      setIsEditingInfo(false);
      setIsEditingBank(false);
      router.refresh();
    } catch (err: any) {
      toast.error(err.message || t("An error occurred"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid gap-6 md:grid-cols-2">
      {/* Personal Information */}
      <div className="bg-white rounded-xl border p-6 space-y-6 shadow-sm">
        <div className="flex items-center justify-between border-b pb-2">
          <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
            <User className="w-5 h-5 text-primary" />
            {mounted ? t("Personal Information") : ""}
          </h2>
          {!isEditingInfo ? (
            <Button variant="ghost" size="sm" onClick={() => setIsEditingInfo(true)} className="h-8 px-2">
              <Edit2 className="w-4 h-4 mr-1" /> {mounted ? t("Edit") : ""}
            </Button>
          ) : (
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" disabled={loading} onClick={handleSave} className="h-8 px-2 text-primary">
                <Save className="w-4 h-4 mr-1" /> {mounted ? t("Save") : ""}
              </Button>
              <Button variant="ghost" size="sm" onClick={() => {
                setFormData({ ...formData, name: initialUser.name, mobileNumber: initialUser.mobileNumber || "" });
                setIsEditingInfo(false);
              }} className="h-8 px-2 text-red-500">
                <X className="w-4 h-4" />
              </Button>
            </div>
          )}
        </div>
        
        <div className="space-y-4">
          <div>
            <Label className="text-sm text-muted-foreground flex items-center gap-2 mb-1">
              <User className="w-4 h-4" /> {mounted ? t("Full Name") : ""}
            </Label>
            {isEditingInfo ? (
              <Input 
                type="text" 
                value={formData.name} 
                onChange={(e) => setFormData({ ...formData, name: e.target.value })} 
                className="h-9" 
              />
            ) : (
              <p className="font-medium text-foreground">{formData.name}</p>
            )}
          </div>
          
          <div>
            <Label className="text-sm text-muted-foreground flex items-center gap-2 mb-1">
              <Phone className="w-4 h-4" /> {mounted ? t("Phone Number") : ""}
            </Label>
            {isEditingInfo ? (
              <Input 
                type="text" 
                value={formData.mobileNumber} 
                onChange={(e) => setFormData({ ...formData, mobileNumber: e.target.value })} 
                className="h-9" 
              />
            ) : (
              <p className="font-medium text-foreground">{formData.mobileNumber || (mounted ? t("Not Added") : "")}</p>
            )}
          </div>
          
          <div>
            <Label className="text-sm text-muted-foreground flex items-center gap-2 mb-1">
              <Mail className="w-4 h-4" /> {mounted ? t("Email Address") : ""}
            </Label>
            <p className="font-medium text-muted-foreground">{initialUser.email} <span className="text-xs">({mounted ? t("Private") : ""})</span></p>
          </div>
        </div>
      </div>

      {/* Bank Details */}
      <div className="bg-white rounded-xl border p-6 space-y-6 shadow-sm">
        <div className="flex items-center justify-between border-b pb-2">
          <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
            <Building className="w-5 h-5 text-primary" />
            {mounted ? t("Bank Details") : ""}
          </h2>
          {!isEditingBank ? (
            <Button variant="ghost" size="sm" onClick={() => setIsEditingBank(true)} className="h-8 px-2">
              <Edit2 className="w-4 h-4 mr-1" /> {mounted ? t("Edit") : ""}
            </Button>
          ) : (
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" disabled={loading} onClick={handleSave} className="h-8 px-2 text-primary">
                <Save className="w-4 h-4 mr-1" /> {mounted ? t("Save") : ""}
              </Button>
              <Button variant="ghost" size="sm" onClick={() => {
                setFormData({ ...formData, bankName: initialUser.bankName || "", accountNumber: initialUser.accountNumber || "", ifscCode: initialUser.ifscCode || "" });
                setIsEditingBank(false);
              }} className="h-8 px-2 text-red-500">
                <X className="w-4 h-4" />
              </Button>
            </div>
          )}
        </div>
        
        <div className="space-y-4">
          <div>
            <Label className="text-sm text-muted-foreground mb-1">{mounted ? t("Bank Name") : ""}</Label>
            {isEditingBank ? (
              <Input 
                type="text" 
                placeholder={mounted ? t("e.g. State Bank of India") : ""}
                value={formData.bankName} 
                onChange={(e) => setFormData({ ...formData, bankName: e.target.value })} 
                className="h-9" 
              />
            ) : (
              <p className="font-medium text-foreground">{formData.bankName || (mounted ? t("Not Added") : "")}</p>
            )}
          </div>
          
          <div>
            <Label className="text-sm text-muted-foreground mb-1">{mounted ? t("Account Number") : ""}</Label>
            {isEditingBank ? (
              <Input 
                type="text" 
                placeholder={mounted ? t("e.g. 1234567890") : ""}
                value={formData.accountNumber} 
                onChange={(e) => setFormData({ ...formData, accountNumber: e.target.value })} 
                className="h-9" 
              />
            ) : (
              <p className="font-medium text-foreground tracking-wide">{formData.accountNumber || (mounted ? t("Not Added") : "")}</p>
            )}
          </div>
          
          <div>
            <Label className="text-sm text-muted-foreground mb-1">{mounted ? t("IFSC Code") : ""}</Label>
            {isEditingBank ? (
              <Input 
                type="text" 
                placeholder={mounted ? t("e.g. SBIN0001234") : ""}
                value={formData.ifscCode} 
                onChange={(e) => setFormData({ ...formData, ifscCode: e.target.value })} 
                className="h-9" 
              />
            ) : (
              <p className="font-medium text-foreground">{formData.ifscCode || (mounted ? t("Not Added") : "")}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
