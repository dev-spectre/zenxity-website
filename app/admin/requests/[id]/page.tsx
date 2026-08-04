"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Clipboard,
  FileText,
  IndianRupee,
  Upload,
  Image as ImageIcon,
  Video as VideoIcon,
  MapPin,
  Calendar,
  Timer,
  ArrowLeft,
  Eye,
  Plus,
  LayoutDashboard
} from "lucide-react";

const t = (key: string) => key;

export default function AdminProjectDetail() {
  const params = useParams();
  const router = useRouter();
  const { data: session } = useSession();
  const [project, setProject] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Form States for Financials
  const [financialData, setFinancialData] = useState({ description: "", amount: "" });
  const [financialLoading, setFinancialLoading] = useState(false);

  // Form States for Farming Updates
  const [uploadData, setUploadData] = useState({ title: "", description: "", landInfo: "", activityDate: "", activityTime: "" });
  const [selectedImageFiles, setSelectedImageFiles] = useState<File[]>([]);
  const [selectedVideoFile, setSelectedVideoFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  const [showAddUpdateForm, setShowAddUpdateForm] = useState(false);
  const [showAddFinancialForm, setShowAddFinancialForm] = useState(false);

  const id = params?.id;

  const fetchProject = async () => {
    try {
      const res = await fetch(`/api/land-requests/${id}`);
      if (!res.ok) throw new Error("Failed to fetch project");
      const data = await res.json();
      setProject(data.farmingRequest);
    } catch (err) {
      console.error(err);
      toast.error("Error loading project details");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) fetchProject();
  }, [id]);

  if (loading) return <div className="p-8 text-center font-semibold text-muted-foreground">Loading Project Details...</div>;
  if (!project) return <div className="p-8 text-center font-semibold text-red-600">Project not found.</div>;

  const handleAddFinancial = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!financialData.description || !financialData.amount) return;
    setFinancialLoading(true);
    try {
      const res = await fetch("/api/financial-records", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          userId: project.userId, 
          description: financialData.description, 
          amount: financialData.amount 
        }),
      });
      if (res.ok) {
        toast.success("Financial record added!");
        setFinancialData({ description: "", amount: "" });
        fetchProject();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setFinancialLoading(false);
    }
  };

  const uploadToCloudinary = async (file: File, resourceType: "image" | "video"): Promise<string> => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "zenxity");
    const res = await fetch(`https://api.cloudinary.com/v1_1/dzcbyadrb/${resourceType}/upload`, { method: "POST", body: formData });
    if (!res.ok) throw new Error(`${resourceType} upload failed`);
    const data = await res.json();
    return data.secure_url;
  };

  const handleUploadUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadData.title) return;

    // Size check (20MB)
    const MAX_SIZE = 20 * 1024 * 1024;
    for (const file of selectedImageFiles) {
      if (file.size > MAX_SIZE) {
        toast.error(`Image ${file.name} is too large (max 20MB)`);
        return;
      }
    }
    if (selectedVideoFile && selectedVideoFile.size > MAX_SIZE) {
      toast.error(`Video ${selectedVideoFile.name} is too large (max 20MB)`);
      return;
    }

    setUploading(true);
    try {
      let imgUrl = "";
      let videoUrl = "";
      if (selectedImageFiles.length > 0) imgUrl = await uploadToCloudinary(selectedImageFiles[0], "image");
      if (selectedVideoFile) videoUrl = await uploadToCloudinary(selectedVideoFile, "video");

      await fetch("/api/updates/", { 
        method: "POST", 
        headers: { "Content-Type": "application/json" }, 
        body: JSON.stringify({ 
          requestId: id, 
          title: uploadData.title, 
          description: uploadData.description, 
          img: imgUrl || undefined, 
          video: videoUrl || undefined, 
          landInfo: uploadData.landInfo || undefined, 
          activityDate: uploadData.activityDate || undefined, 
          activityTime: uploadData.activityTime || undefined 
        }) 
      });

      toast.success("Farming update posted!");
      setUploadData({ title: "", description: "", landInfo: "", activityDate: "", activityTime: "" });
      setSelectedImageFiles([]);
      setSelectedVideoFile(null);
      fetchProject();
    } catch (error) {
      console.error("Error uploading update:", error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background p-4 md:p-8 space-y-8">
      
      {/* Navigation Row */}
      <div className="flex items-center justify-between">
        <Button asChild variant="ghost" className="gap-2">
          <Link href="/admin/dashboard">
            <ArrowLeft className="w-4 h-4" /> Back to Admin Dashboard
          </Link>
        </Button>
      </div>

      {/* Details Header */}
      <div className="grid lg:grid-cols-3 gap-8 items-start">
        
        {/* Left Column: Overview, Milestones & Documents */}
        <div className="space-y-8">

          {/* User Information */}
          <div className="bg-white p-6 rounded-xl border border-border space-y-3 shadow-sm">
            <h4 className="font-bold text-primary text-base border-b pb-2 flex items-center gap-2">
              <LayoutDashboard className="w-4 h-4" /> User Information
            </h4>
            <div>
              <span className="text-xs text-muted-foreground block">Full Name</span>
              <span className="font-medium text-foreground">{project.user?.name}</span>
            </div>
            <div>
              <span className="text-xs text-muted-foreground block">Email Address</span>
              <span className="font-medium text-foreground">{project.user?.email}</span>
            </div>
            <div>
              <span className="text-xs text-muted-foreground block">Mobile Number</span>
              <span className="font-medium text-foreground">{project.user?.mobileNumber || "None"}</span>
            </div>
            {project.user?.bankName && (
              <div className="mt-3 pt-3 border-t border-dashed text-xs space-y-1 bg-yellow-50/50 p-3 rounded">
                <p className="font-bold text-gray-700">Bank: {project.user.bankName}</p>
                <p className="text-gray-600">A/C: {project.user.accountNumber}</p>
                <p className="text-gray-600">IFSC: {project.user.ifscCode}</p>
              </div>
            )}
          </div>

          {/* Land Details */}
          <div className="bg-white p-6 rounded-xl border border-border space-y-3 shadow-sm">
            <h4 className="font-bold text-primary text-base border-b pb-2 flex items-center gap-2">
              <MapPin className="w-4 h-4" /> Land Details
            </h4>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <span className="text-xs text-muted-foreground block">Land Size</span>
                <span className="font-medium text-foreground">{project.landSize} Acres</span>
              </div>
              <div>
                <span className="text-xs text-muted-foreground block">Survey No</span>
                <span className="font-medium text-foreground">{project.surveyNo || "None"}</span>
              </div>
              <div>
                <span className="text-xs text-muted-foreground block">Patta No</span>
                <span className="font-medium text-foreground">{project.pattaNo || "None"}</span>
              </div>
              <div>
                <span className="text-xs text-muted-foreground block">Language</span>
                <span className="font-medium text-foreground">{project.preferredLanguage}</span>
              </div>
            </div>
            <div className="pt-2 border-t">
              <span className="text-xs text-muted-foreground block">Legal Verification Info</span>
              <span className="text-sm text-foreground font-medium">{project.legalInfo || "Clear Title"}</span>
            </div>
          </div>

          {/* Milestones Configuration */}
          <div className="bg-white p-6 rounded-xl border space-y-4 shadow-sm">
            <h4 className="font-bold text-foreground text-base flex items-center gap-2 border-b pb-2">
              <Clipboard className="w-4 h-4 text-primary" /> Timeline & Progress
            </h4>
            <div className="grid gap-4">
              <div className="space-y-1">
                <Label className="text-xs text-muted-foreground font-semibold">Timeline Steps (Comma-separated)</Label>
                <Input 
                  type="text" 
                  placeholder="Planning, Tilling, Sowing, Harvest, Completed" 
                  defaultValue={project.milestones || "Planning, Growing, Harvest, Completed"}
                  onBlur={async (e) => {
                    const res = await fetch("/api/land-requests/progress", {
                      method: "PUT",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({ reqId: project.id, milestones: e.target.value })
                    });
                    if (res.ok) {
                      toast.success("Timeline milestones updated!");
                      setProject({ ...project, milestones: e.target.value });
                    }
                  }}
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs text-muted-foreground font-semibold">Total Progress (%)</Label>
                <Input 
                  type="number"
                  min="0"
                  max="100" 
                  defaultValue={project.progress || 0}
                  onBlur={async (e) => {
                    const val = parseInt(e.target.value);
                    if (isNaN(val)) return;
                    const res = await fetch("/api/land-requests/progress", {
                      method: "PUT",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({ reqId: project.id, progress: val })
                    });
                    if (res.ok) {
                      toast.success("Progress percentage updated.");
                      setProject({ ...project, progress: val });
                    }
                  }}
                />
              </div>
            </div>
          </div>

          {/* Uploaded Documents */}
          <div className="bg-white p-6 rounded-xl border space-y-3 shadow-sm">
            <h4 className="font-bold text-foreground text-sm border-b pb-2 flex items-center gap-2">
              <FileText className="w-4 h-4 text-primary" /> Uploaded Documents
            </h4>
            {project.documents && project.documents.length > 0 ? (
              <div className="space-y-2 max-h-[200px] overflow-y-auto pr-1">
                {project.documents.map((doc: any) => (
                  <a key={doc.id} href={doc.fileUrl} target="_blank" rel="noreferrer" className="flex items-center justify-between p-3 text-xs bg-gray-50 hover:bg-gray-100 border rounded-lg transition">
                    <span className="truncate font-medium text-foreground">{doc.name}</span>
                    <FileText className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                  </a>
                ))}
              </div>
            ) : (
              <p className="text-xs text-muted-foreground text-center py-6">No documents uploaded yet.</p>
            )}
          </div>

        </div>

        {/* Middle Column: Activity Updates & Adding Updates */}
        <div className="space-y-6 bg-white p-6 rounded-xl border shadow-sm flex flex-col max-h-[85vh]">
          <div className="flex items-center justify-between border-b pb-2">
            <h4 className="font-bold text-foreground text-base flex items-center gap-2">
              <Upload className="w-4 h-4 text-primary" /> Farming Updates
            </h4>
            <Button 
              size="sm" 
              variant="outline" 
              className="gap-1 shadow-sm border-primary/30 text-primary hover:bg-primary/5"
              onClick={() => setShowAddUpdateForm(!showAddUpdateForm)}
            >
              <Plus className={`w-4 h-4 transition-transform duration-200 ${showAddUpdateForm ? "rotate-45" : ""}`} /> 
              {showAddUpdateForm ? "Close" : "Add"}
            </Button>
          </div>

          {showAddUpdateForm && (
            <form onSubmit={handleUploadUpdate} className="space-y-4 bg-gray-50 p-4 rounded-lg border border-dashed border-gray-200">
              <div>
                <Label className="text-xs font-semibold flex items-center gap-2"><FileText className="w-3.5 h-3.5" />Title</Label>
                <Input type="text" placeholder="Update title..." value={uploadData.title} onChange={(e) => setUploadData({ ...uploadData, title: e.target.value })} required className="h-8 text-xs" />
              </div>
              <div>
                <Label className="text-xs font-semibold flex items-center gap-2"><MapPin className="w-3.5 h-3.5" />Location</Label>
                <Input type="text" placeholder="e.g. Plot A" value={uploadData.landInfo} onChange={(e) => setUploadData({ ...uploadData, landInfo: e.target.value })} className="h-8 text-xs" />
              </div>
              <div>
                <Label className="text-xs font-semibold"><FileText className="w-3.5 h-3.5 inline mr-1" />Description</Label>
                <textarea placeholder="Detail your activity..." className="w-full px-3 py-2 border border-border rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-primary resize-none" rows={2} value={uploadData.description} onChange={(e) => setUploadData({ ...uploadData, description: e.target.value })} />
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <div 
                  className={cn(
                    "p-4 border-2 border-dashed rounded-xl text-center cursor-pointer transition-all duration-200",
                    selectedImageFiles.length > 0 ? "bg-green-50 border-green-600/30" : "bg-white border-gray-200 hover:border-primary/50 hover:bg-primary/5"
                  )}
                  onClick={() => document.getElementById("page-image")?.click()}
                >
                  <input type="file" accept="image/*" className="hidden" id="page-image" onChange={(e) => setSelectedImageFiles(Array.from(e.target.files || []))} />
                  <ImageIcon className={cn("w-6 h-6 mx-auto mb-2", selectedImageFiles.length > 0 ? "text-green-600" : "text-primary")} />
                  <p className="text-[11px] font-bold text-foreground">{selectedImageFiles.length > 0 ? t("Photo Selected") : t("Add Photo")}</p>
                  {selectedImageFiles.length > 0 && <p className="text-[10px] text-green-700 truncate mt-1 px-1">{selectedImageFiles[0].name}</p>}
                </div>

                <div 
                  className={cn(
                    "p-4 border-2 border-dashed rounded-xl text-center cursor-pointer transition-all duration-200",
                    selectedVideoFile ? "bg-green-50 border-green-600/30" : "bg-white border-gray-200 hover:border-primary/50 hover:bg-primary/5"
                  )}
                  onClick={() => document.getElementById("page-video")?.click()}
                >
                  <input type="file" accept="video/*" className="hidden" id="page-video" onChange={(e) => setSelectedVideoFile(e.target.files?.[0] || null)} />
                  <VideoIcon className={cn("w-6 h-6 mx-auto mb-2", selectedVideoFile ? "text-green-600" : "text-primary")} />
                  <p className="text-[11px] font-bold text-foreground">{selectedVideoFile ? t("Video Selected") : t("Add Video")}</p>
                  {selectedVideoFile && <p className="text-[10px] text-green-700 truncate mt-1 px-1">{selectedVideoFile.name}</p>}
                </div>
              </div>

              <Button type="submit" disabled={uploading} size="sm" className="w-full h-8 text-xs">
                {uploading ? "Uploading..." : "Post Update"}
              </Button>
            </form>
          )}

          <div className="space-y-3 overflow-y-auto flex-1 pr-1">
            {project.updates && project.updates.length > 0 ? (
              project.updates.map((up: any) => (
                <div key={up.id} className="p-3 bg-gray-50 border rounded-lg space-y-1 text-xs hover:shadow-sm transition-shadow">
                  <p className="font-bold text-primary">{up.title}</p>
                  {up.landInfo && <span className="text-[10px] text-gray-500 block">Location: {up.landInfo}</span>}
                  {up.description && <p className="text-muted-foreground text-[11px] mt-1">{up.description}</p>}
                  <span className="text-[9px] text-gray-400 block text-right mt-2">{new Date(up.createdAt).toLocaleDateString()}</span>
                </div>
              ))
            ) : (
              <p className="text-xs text-muted-foreground text-center py-6">No activities tracked yet.</p>
            )}
          </div>
        </div>

        {/* Right Column: Financial Breakdown & Payouts */}
        <div className="space-y-6 bg-white p-6 rounded-xl border shadow-sm flex flex-col max-h-[85vh]">
          <div className="flex items-center justify-between border-b pb-2">
            <h4 className="font-bold text-foreground text-base flex items-center gap-2">
              <IndianRupee className="w-4 h-4 text-primary" /> Financial Records
            </h4>
            <Button 
              size="sm" 
              variant="outline" 
              className="gap-1 shadow-sm border-primary/30 text-primary hover:bg-primary/5"
              onClick={() => setShowAddFinancialForm(!showAddFinancialForm)}
            >
              <Plus className={`w-4 h-4 transition-transform duration-200 ${showAddFinancialForm ? "rotate-45" : ""}`} /> 
              {showAddFinancialForm ? "Close" : "Add"}
            </Button>
          </div>

          {showAddFinancialForm && (
            <form onSubmit={handleAddFinancial} className="space-y-3 bg-gray-50 p-4 rounded-lg border border-dashed border-gray-200">
              <div>
                <Label className="text-xs font-semibold">Description</Label>
                <Input type="text" placeholder="e.g. ROI Payout" value={financialData.description} onChange={(e) => setFinancialData({ ...financialData, description: e.target.value })} required className="h-8 text-xs" />
              </div>
              <div>
                <Label className="text-xs font-semibold">Amount (INR)</Label>
                <Input type="number" placeholder="Amount in ₹" value={financialData.amount} onChange={(e) => setFinancialData({ ...financialData, amount: e.target.value })} required className="h-8 text-xs" />
              </div>
              <Button type="submit" disabled={financialLoading} size="sm" className="w-full h-8 text-xs bg-green-600 hover:bg-green-700">
                {financialLoading ? "Saving..." : "Add Earnings Payout"}
              </Button>
            </form>
          )}

          <div className="space-y-3 overflow-y-auto flex-1 pr-1">
            {project.user?.financialRecords && project.user.financialRecords.length > 0 ? (
              project.user.financialRecords.map((fin: any) => (
                <div key={fin.id} className="flex justify-between items-center p-3 bg-gray-50 border rounded-lg text-xs hover:shadow-sm transition-shadow">
                  <span className="font-medium text-foreground">{fin.description}</span>
                  <span className="font-bold text-green-700">₹{fin.amount.toLocaleString('en-IN')}</span>
                </div>
              ))
            ) : (
              <p className="text-xs text-muted-foreground text-center py-6">No payouts recorded yet.</p>
            )}
          </div>
      </div>
    </div>
  </div>
  );
}
