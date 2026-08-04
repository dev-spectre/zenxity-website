"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const t = (key: string) => key;
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Menu,
  X,
  LogOut,
  LayoutDashboard,
  Clipboard,
  Upload,
  Megaphone,
  ChevronDown,
  User,
  Trash2,
  CheckCircle,
  XCircle,
  Clock,
  Plus,
  Image as ImageIcon,
  Video as VideoIcon,
  MapPin,
  Calendar,
  Timer,
  FileText,
  Eye,
  IndianRupee,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface FarmingRequest {
  id: string;
  userName: string;
  status: string;
  notes: string;
  createdAt: string;
}

interface Offer {
  id: string;
  title: string;
  description: string;
  validity: string;
  img?: string;
}

interface FarmingUpdate {
  id: string;
  title: string;
  content?: string;
  description?: string;
  img?: string;
  video?: string;
  landInfo?: string;
  activityDate?: string;
  activityTime?: string;
  createdAt: string;
}

export default function AdminDashboard() {
  const [activeSection, setActiveSection] = useState("dashboard");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [requests, setRequests] = useState<any[]>([]);
  const [offers, setOffers] = useState<Offer[]>([]);
  const [newOffer, setNewOffer] = useState({ title: "", description: "", validity: "", img: "" });
  const [showAddOfferForm, setShowAddOfferForm] = useState(false);
  const router = useRouter();

  // Upload Updates state
  const [uploadData, setUploadData] = useState({ requestId: "", title: "", description: "", landInfo: "", activityDate: "", activityTime: "" });
  const [selectedImageFiles, setSelectedImageFiles] = useState<File[]>([]);
  const [selectedVideoFile, setSelectedVideoFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  // Update history state
  const [updateHistory, setUpdateHistory] = useState<FarmingUpdate[]>([]);
  const [expandedUpdateId, setExpandedUpdateId] = useState<string | null>(null);

  // Financial breakdown state
  // Direct project creation state
  const [showAddProjectForm, setShowAddProjectForm] = useState(false);
  const [projectData, setProjectData] = useState({ userId: "", landSize: "", landAddress: "", notes: "" });
  const [projectLoading, setProjectLoading] = useState(false);
  const [selectedProject, setSelectedProject] = useState<any>(null);

  const handleAddProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!projectData.userId || !projectData.landAddress || !projectData.landSize) return;
    setProjectLoading(true);
    try {
      const res = await fetch("/api/land-requests/create-approved", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(projectData)
      });
      if (res.ok) {
        const data = await res.json();
        setRequests([data.farmingRequest, ...requests]);
        setProjectData({ userId: "", landSize: "", landAddress: "", notes: "" });
        setShowAddProjectForm(false);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setProjectLoading(false);
    }
  };

  const [financialData, setFinancialData] = useState({ userId: "", description: "", amount: "" });
  const [financialLoading, setFinancialLoading] = useState(false);

  const handleAddFinancial = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!financialData.userId || !financialData.description || !financialData.amount) return;
    setFinancialLoading(true);
    try {
      const res = await fetch("/api/financial-records", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(financialData),
      });
      if (res.ok) {
        setFinancialData({ userId: "", description: "", amount: "" });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setFinancialLoading(false);
    }
  };

  const authHeaders = () => ({
    "Content-Type": "application/json",
  });

  const handleRequestAction = async (id: string, action: "accept" | "reject") => {
    setRequests(requests.map((req) => req.id === id ? { ...req, status: action === "accept" ? "accepted" : "rejected" } : req));
    await fetch("/api/land-requests/admin", { method: "PUT", headers: authHeaders(), body: JSON.stringify({ reqId: id, status: action }) });
  };

  const handleAddOffer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newOffer.title && newOffer.description) {
      const offer: Offer = { id: (offers.length + 1).toString(), title: newOffer.title, description: newOffer.description, validity: newOffer.validity, img: newOffer.img };
      setOffers([...offers, offer]);
      await fetch("/api/offer/", { method: "POST", headers: authHeaders(), body: JSON.stringify({ title: offer.title, description: offer.description, validUntil: offer.validity, img: offer.img }) });
      setNewOffer({ title: "", description: "", validity: "", img: "" });
      setShowAddOfferForm(false);
    }
  };

  const handleDeleteOffer = async (id: string) => {
    setOffers(offers.filter((offer) => offer.id !== id));
    await fetch("/api/offer/delete", { method: "POST", headers: authHeaders(), body: JSON.stringify({ id }) });
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
    if (!uploadData.requestId || !uploadData.title) return;

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
      await fetch("/api/updates/", { method: "POST", headers: authHeaders(), body: JSON.stringify({ requestId: uploadData.requestId, title: uploadData.title, description: uploadData.description, img: imgUrl || undefined, video: videoUrl || undefined, landInfo: uploadData.landInfo || undefined, activityDate: uploadData.activityDate || undefined, activityTime: uploadData.activityTime || undefined }) });
      setUploadData({ requestId: uploadData.requestId, title: "", description: "", landInfo: "", activityDate: "", activityTime: "" });
      setSelectedImageFiles([]);
      setSelectedVideoFile(null);
      if (uploadData.requestId) fetchUpdateHistory(uploadData.requestId);
    } catch (error) {
      console.error("Error uploading update:", error);
    } finally {
      setUploading(false);
    }
  };

  const fetchUpdateHistory = async (requestId: string) => {
    try {
      const res = await fetch(`/api/updates/by-request/${requestId}`, { method: "GET", headers: authHeaders() });
      const data = await res.json();
      setUpdateHistory(data.updates || []);
    } catch (err) {
      console.error("Error fetching update history:", err);
    }
  };

  useEffect(() => {
    if (uploadData.requestId) fetchUpdateHistory(uploadData.requestId);
  }, [uploadData.requestId]);

  const acceptedRequests = requests.filter((r) => r.status?.toLowerCase() === "accepted" || r.status?.toLowerCase() === "approved");
  const pendingRequests = requests.filter((r) => r.status?.toLowerCase() === "pending");

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case "pending": return "bg-yellow-100 text-yellow-800 border-yellow-300";
      case "accepted": case "approved": return "bg-green-100 text-green-800 border-green-300";
      case "rejected": case "declined": return "bg-red-100 text-red-800 border-red-300";
      default: return "bg-gray-100 text-gray-800 border-gray-300";
    }
  };

  const sidebarItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "requests", label: "Farming Requests", icon: Clipboard },
    { id: "uploads", label: "Upload Updates", icon: Upload },
    { id: "offers", label: "Offers Management", icon: Megaphone },
    { id: "financials", label: "Financials", icon: IndianRupee },
  ];

  useEffect(() => {
    fetch("/api/land-requests/admin", { method: "GET", headers: authHeaders() })
      .then((res) => {
        if (!res.ok) {
          if (res.status === 401 || res.status === 403) {
            router.replace("/admin/login");
            return null;
          }
        }
        return res.json();
      })
      .then((data) => { if (data?.farmingRequests) setRequests(data.farmingRequests); })
      .catch((err) => console.log(err));

    fetch("/api/offer/all", { method: "GET", headers: authHeaders() })
      .then((res) => res.json())
      .then((data) => { setOffers((data.offers || []).map((offer: any) => ({ ...offer, validity: offer.validUntil })) || []); });
  }, []);

  return (
    <div className="min-h-screen bg-background flex flex-col md:flex-row">
      {/* Mobile Backdrop */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={cn(
        "bg-white border-r border-border fixed inset-y-0 left-0 z-50 w-64 transform transition-transform duration-300 md:relative md:translate-x-0",
        isSidebarOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="h-full flex flex-col">
          <div className="h-16 flex items-center justify-between border-b border-border px-6">
            <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition">
              <img src="/logo-transparent.png" alt="" className="w-10 h-10" />
              <span className="font-bold text-primary">Zenxity</span>
            </Link>
            <button className="md:hidden text-muted-foreground" onClick={() => setIsSidebarOpen(false)}>
              <X className="w-6 h-6" />
            </button>
          </div>
          <nav className="flex-1 py-4 overflow-y-auto">
            {sidebarItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveSection(item.id);
                    setIsSidebarOpen(false);
                  }}
                  className={cn(
                    "w-full flex items-center gap-3 px-6 py-3 text-left transition",
                    activeSection === item.id ? "bg-secondary text-primary border-r-4 border-primary" : "text-muted-foreground hover:bg-secondary/50"
                  )}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                </button>
              );
            })}
          </nav>
          <div className="border-t border-border p-4">
            <Button 
              variant="ghost" 
              className="w-full justify-start gap-2 text-red-600 hover:bg-red-50"
              onClick={() => signOut({ callbackUrl: '/' })}
            >
              <LogOut className="w-5 h-5" />
              <span>Logout</span>
            </Button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <nav className="bg-white border-b border-border sticky top-0 z-40">
          <div className="px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden"
                onClick={() => setIsSidebarOpen(true)}
              >
                <Menu className="w-6 h-6" />
              </Button>
              <h1 className="text-xl md:text-2xl font-bold text-foreground truncate">Dashboard</h1>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="gap-2">
                  <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center"><User className="w-5 h-5 text-primary" /></div>
                  <ChevronDown className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => signOut({ callbackUrl: '/' })}><LogOut className="w-4 h-4 mr-2" />Logout</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </nav>

        <div className="p-4 sm:p-6 lg:p-8">
          {/* Dashboard Overview */}
          {activeSection === "dashboard" && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-foreground">Dashboard Overview</h2>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-white rounded-lg border border-border p-6">
                  <div className="flex items-center justify-between mb-2"><h3 className="text-muted-foreground text-sm font-medium">Total Requests</h3><Clipboard className="w-5 h-5 text-primary" /></div>
                  <p className="text-3xl font-bold text-foreground">{requests.length}</p>
                </div>
                <div className="bg-white rounded-lg border border-border p-6">
                  <div className="flex items-center justify-between mb-2"><h3 className="text-muted-foreground text-sm font-medium">Pending</h3><Clock className="w-5 h-5 text-yellow-600" /></div>
                  <p className="text-3xl font-bold text-yellow-600">{pendingRequests.length}</p>
                </div>
                <div className="bg-white rounded-lg border border-border p-6">
                  <div className="flex items-center justify-between mb-2"><h3 className="text-muted-foreground text-sm font-medium">Accepted</h3><CheckCircle className="w-5 h-5 text-green-600" /></div>
                  <p className="text-3xl font-bold text-green-600">{acceptedRequests.length}</p>
                </div>
                <div className="bg-white rounded-lg border border-border p-6">
                  <div className="flex items-center justify-between mb-2"><h3 className="text-muted-foreground text-sm font-medium">Active Offers</h3><Megaphone className="w-5 h-5 text-primary" /></div>
                  <p className="text-3xl font-bold text-foreground">{offers.length}</p>
                </div>
              </div>
              <div className="bg-white rounded-lg border border-border p-6">
                <h3 className="text-xl font-bold text-foreground mb-4">Recent Requests</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="border-b border-border">
                      <tr>
                        <th className="text-left py-3 px-2 text-muted-foreground font-semibold">User</th>
                        <th className="text-left py-3 px-2 text-muted-foreground font-semibold hidden sm:table-cell">Size</th>
                        <th className="text-left py-3 px-2 text-muted-foreground font-semibold">City</th>
                        <th className="text-left py-3 px-2 text-muted-foreground font-semibold">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {requests.slice(0, 5).map((req) => (
                        <tr key={req.id} className="border-b border-border hover:bg-gray-50">
                          <td className="py-3 px-2 text-foreground whitespace-nowrap">{req.user?.name}</td>
                          <td className="py-3 px-2 text-muted-foreground hidden sm:table-cell">{req.landSize}</td>
                          <td className="py-3 px-2 text-foreground font-medium whitespace-nowrap">{req.landAddress}</td>
                          <td className="py-3 px-2">
                            <span className={cn(
                              "px-2 py-1 rounded-full border text-[10px] sm:text-xs font-semibold whitespace-nowrap",
                              getStatusColor(req.status)
                            )}>
                              {req.status?.charAt(0).toUpperCase() + req.status?.slice(1).toLowerCase()}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Requests Management */}
          {activeSection === "requests" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between flex-wrap gap-3">
                <h2 className="text-2xl font-bold text-foreground">Farming Requests Management</h2>
                <Button onClick={() => setShowAddProjectForm(!showAddProjectForm)} className="gap-2">
                  <Plus className="w-4 h-4" /> Direct Add Project
                </Button>
              </div>

              {showAddProjectForm && (
                <div className="bg-white rounded-lg border border-border p-8 max-w-xl">
                  <h3 className="text-lg font-bold text-foreground mb-6">Create Approved Project</h3>
                  <form onSubmit={handleAddProject} className="space-y-4">
                    <div>
                      <Label className="text-foreground font-semibold mb-2">Select User</Label>
                      <select
                        value={projectData.userId}
                        onChange={(e) => setProjectData({ ...projectData, userId: e.target.value })}
                        className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-black"
                        required
                      >
                        <option value="">-- Choose a User --</option>
                        {Array.from(new Map(requests.map(r => [r.user?.id, r.user])).values())
                          .filter(u => u && u.id)
                          .map((u: any) => (
                            <option key={u.id} value={u.id}>{u.name} ({u.email})</option>
                          ))
                        }
                      </select>
                    </div>
                    <div>
                      <Label className="text-foreground font-semibold mb-2">Land Size (Acres)</Label>
                      <Input
                        type="text"
                        placeholder="e.g. 5"
                        value={projectData.landSize}
                        onChange={(e) => setProjectData({ ...projectData, landSize: e.target.value })}
                        required
                      />
                    </div>
                    <div>
                      <Label className="text-foreground font-semibold mb-2">Location (City/Address)</Label>
                      <Input
                        type="text"
                        placeholder="e.g., Coimbatore"
                        value={projectData.landAddress}
                        onChange={(e) => setProjectData({ ...projectData, landAddress: e.target.value })}
                        required
                      />
                    </div>
                    <div>
                      <Label className="text-foreground font-semibold mb-2">Notes (Optional)</Label>
                      <Input
                        type="text"
                        placeholder="e.g., Organic Tomato Farming"
                        value={projectData.notes}
                        onChange={(e) => setProjectData({ ...projectData, notes: e.target.value })}
                      />
                    </div>
                    <div className="flex gap-4">
                      <Button type="submit" disabled={projectLoading}>
                        {projectLoading ? "Creating..." : "Create Project"}
                      </Button>
                      <Button type="button" variant="outline" onClick={() => setShowAddProjectForm(false)}>Cancel</Button>
                    </div>
                  </form>
                </div>
              )}
              <div className="bg-white rounded-xl border border-border overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm text-left min-w-[900px] border-collapse">
                    <thead className="bg-gray-50 border-b border-border">
                      <tr>
                        <th className="py-4 px-4 sm:px-6 text-muted-foreground font-semibold whitespace-nowrap">{t("User")}</th>
                        <th className="py-4 px-4 sm:px-6 text-muted-foreground font-semibold hidden md:table-cell">{t("Size")}</th>
                        <th className="py-4 px-4 sm:px-6 text-muted-foreground font-semibold whitespace-nowrap">{t("City")}</th>
                        <th className="py-4 px-4 sm:px-6 text-muted-foreground font-semibold">{t("Status & Progress")}</th>
                        <th className="py-4 px-4 sm:px-6 text-muted-foreground font-semibold">{t("Action")}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {requests.map((req) => (
                        <tr key={req.id} className="hover:bg-gray-50 transition-colors">
                          <td className="py-4 px-4 sm:px-6">
                            <p className="text-foreground font-semibold whitespace-nowrap">{req.user?.name}</p>
                            <p className="text-xs text-muted-foreground truncate max-w-[120px]">{req.user?.email}</p>
                          </td>
                          <td className="py-4 px-4 sm:px-6 text-muted-foreground hidden md:table-cell whitespace-nowrap">{req.landSize} {t("Acres")}</td>
                          <td className="py-4 px-4 sm:px-6 text-foreground whitespace-nowrap">{req.landAddress}</td>
                          <td className="py-4 px-4 sm:px-6">
                            <div className="flex flex-col gap-2 max-w-[140px]">
                              <span className={`px-2.5 py-1 rounded-full border text-xs font-semibold text-center ${getStatusColor(req.status)}`}>
                                {req.status?.charAt(0).toUpperCase() + req.status?.slice(1).toLowerCase()}
                              </span>
                              {(req.status === "APPROVED" || req.status?.toLowerCase() === "accepted") && (
                                <div className="flex items-center gap-2 bg-gray-50 px-2 py-1 rounded border border-gray-200">
                                  <input
                                    type="number"
                                    min="0"
                                    max="100"
                                    defaultValue={req.progress || 0}
                                    onBlur={async (e) => {
                                      const val = parseInt(e.target.value);
                                      if (isNaN(val)) return;
                                      await fetch("/api/land-requests/progress", {
                                        method: "PUT",
                                        headers: { "Content-Type": "application/json" },
                                        body: JSON.stringify({ reqId: req.id, progress: val })
                                      });
                                    }}
                                    className="w-12 text-center font-bold py-0.5 text-sm bg-transparent border-none outline-none text-black [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                  />
                                  <span className="text-xs text-muted-foreground font-medium">%</span>
                                </div>
                              )}
                            </div>
                          </td>
                          <td className="py-4 px-6">
                            {req.status?.toLowerCase() === "pending" ? (
                              <div className="flex gap-2">
                                <Button
                                  size="sm"
                                  className="bg-green-600 hover:bg-green-700 text-white gap-1 shadow-sm"
                                  onClick={() => handleRequestAction(req.id, "accept")}
                                >
                                  <CheckCircle className="w-4 h-4" /> {t("Accept")}
                                </Button>
                                <Button
                                  size="sm"
                                  variant="destructive"
                                  className="gap-1 shadow-sm"
                                  onClick={() => handleRequestAction(req.id, "reject")}
                                >
                                  <XCircle className="w-4 h-4" /> {t("Reject")}
                                </Button>
                              </div>
                            ) : (
                              <div className="flex flex-col gap-2">
                                <span className="text-muted-foreground text-xs font-medium px-2 py-1 bg-gray-100 rounded text-center">
                                  {req.status?.toLowerCase() === "accepted" || req.status?.toLowerCase() === "approved"
                                    ? t("Processed")
                                    : t("Closed")}
                                </span>
                              </div>
                            )}
                            <Button
                              asChild
                              size="sm"
                              variant="outline"
                              className="mt-2 gap-1 shadow-sm border-primary/30 hover:border-primary text-primary hover:text-primary flex"
                            >
                              <Link href={`/admin/requests/${req.id}`}>
                                <Eye className="w-4 h-4" /> {t("Manage")}
                              </Link>
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Grouped Project Detail Modal/Drawer */}
              {false && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
                  <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto flex flex-col border">

                    {/* Modal Header */}
                    <div className="p-6 border-b flex items-center justify-between bg-gray-50">
                      <div>
                        <h3 className="text-xl font-bold text-foreground">{t("Manage Farming Project")}</h3>
                        <p className="text-sm text-muted-foreground">{selectedProject.landAddress}</p>
                      </div>
                      <Button variant="ghost" size="sm" onClick={() => setSelectedProject(null)} className="text-muted-foreground hover:text-foreground font-bold text-lg">✕</Button>
                    </div>

                    {/* Modal Body */}
                    <div className="p-6 space-y-8 flex-1">

                      {/* Grid Split: User Info & Project Legal Details */}
                      <div className="grid md:grid-cols-2 gap-6">

                        <div className="bg-gray-50 p-4 rounded-lg border border-gray-100 space-y-3">
                          <h4 className="font-bold text-primary text-sm border-b pb-1">{t("User Information")}</h4>
                          <div>
                            <span className="text-xs text-muted-foreground block">{t("Full Name")}</span>
                            <span className="font-medium text-foreground">{selectedProject.user?.name}</span>
                          </div>
                          <div>
                            <span className="text-xs text-muted-foreground block">{t("Email ID")}</span>
                            <span className="font-medium text-foreground">{selectedProject.user?.email}</span>
                          </div>
                          <div>
                            <span className="text-xs text-muted-foreground block">{t("Mobile Number")}</span>
                            <span className="font-medium text-foreground">{selectedProject.user?.mobileNumber || "None"}</span>
                          </div>
                          {selectedProject.user?.bankName && (
                            <div className="mt-2 pt-2 border-t border-dashed text-xs">
                              <p className="font-semibold text-gray-700">{t("Bank:")} {selectedProject.user.bankName}</p>
                              <p className="text-gray-600">{t("A/C:")} {selectedProject.user.accountNumber}</p>
                              <p className="text-gray-600">{t("IFSC:")} {selectedProject.user.ifscCode}</p>
                            </div>
                          )}
                        </div>

                        <div className="bg-gray-50 p-4 rounded-lg border border-gray-100 space-y-3">
                          <h4 className="font-bold text-primary text-sm border-b pb-1">{t("Land & Legal Information")}</h4>
                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <span className="text-xs text-muted-foreground block">{t("Land Size")}</span>
                              <span className="font-medium text-foreground">{selectedProject.landSize} {t("Acres")}</span>
                            </div>
                            <div>
                              <span className="text-xs text-muted-foreground block">{t("Survey No")}</span>
                              <span className="font-medium text-foreground">{selectedProject.surveyNo || "None"}</span>
                            </div>
                            <div>
                              <span className="text-xs text-muted-foreground block">{t("Patta No")}</span>
                              <span className="font-medium text-foreground">{selectedProject.pattaNo || "None"}</span>
                            </div>
                            <div>
                              <span className="text-xs text-muted-foreground block">{t("Language")}</span>
                              <span className="font-medium text-foreground">{selectedProject.preferredLanguage}</span>
                            </div>
                          </div>
                          <div className="pt-2">
                            <span className="text-xs text-muted-foreground block">{t("Legal Details")}</span>
                            <span className="text-sm text-foreground font-medium">{selectedProject.legalInfo || "Clear Title"}</span>
                          </div>
                        </div>

                      </div>

                      {/* Milestones & Progress Configuration */}
                      <div className="bg-white p-4 rounded-lg border space-y-4 shadow-sm">
                        <h4 className="font-bold text-foreground text-sm flex items-center gap-2">
                          <Clipboard className="w-4 h-4 text-primary" /> {t("Timeline & Progress Config")}
                        </h4>
                        <div className="grid md:grid-cols-3 gap-4 items-end">
                          <div className="md:col-span-2 space-y-1">
                            <Label className="text-xs text-muted-foreground">{t("Milestone Steps (Comma-separated)")}</Label>
                            <Input
                              type="text"
                              placeholder="e.g., Planning, Tilling, Sowing, Harvest, Completed"
                              defaultValue={selectedProject.milestones || "Planning, Growing, Harvest, Completed"}
                              onBlur={async (e) => {
                                const res = await fetch("/api/land-requests/progress", {
                                  method: "PUT",
                                  headers: { "Content-Type": "application/json" },
                                  body: JSON.stringify({ reqId: selectedProject.id, milestones: e.target.value })
                                });
                                if (res.ok) {
                                  toast.success(t("Milestones updated successfully"));
                                  const updated = { ...selectedProject, milestones: e.target.value };
                                  setSelectedProject(updated);
                                  setRequests(requests.map(r => r.id === selectedProject.id ? updated : r));
                                }
                              }}
                            />
                          </div>
                          <div className="space-y-1">
                            <Label className="text-xs text-muted-foreground">{t("Overall Completion (%)")}</Label>
                            <Input
                              type="number"
                              min="0"
                              max="100"
                              defaultValue={selectedProject.progress || 0}
                              onBlur={async (e) => {
                                const val = parseInt(e.target.value);
                                if (isNaN(val)) return;
                                const res = await fetch("/api/land-requests/progress", {
                                  method: "PUT",
                                  headers: { "Content-Type": "application/json" },
                                  body: JSON.stringify({ reqId: selectedProject.id, progress: val })
                                });
                                if (res.ok) {
                                  toast.success(t("Progress updated"));
                                  const updated = { ...selectedProject, progress: val };
                                  setSelectedProject(updated);
                                  setRequests(requests.map(r => r.id === selectedProject.id ? updated : r));
                                }
                              }}
                            />
                          </div>
                        </div>
                      </div>

                      {/* Deep Grouping: Documents & Updates & Financials */}
                      <div className="grid md:grid-cols-3 gap-6">

                        {/* Documents Column */}
                        <div className="bg-white p-4 rounded-lg border space-y-3 max-h-[300px] overflow-y-auto shadow-sm">
                          <h4 className="font-bold text-foreground text-sm border-b pb-1">{t("Uploaded Documents")}</h4>
                          {selectedProject.documents && selectedProject.documents.length > 0 ? (
                            selectedProject.documents.map((doc: any) => (
                              <a key={doc.id} href={doc.fileUrl} target="_blank" rel="noreferrer" className="flex items-center justify-between p-2 text-xs bg-gray-50 hover:bg-gray-100 border rounded transition truncate">
                                <span className="truncate font-medium">{doc.name}</span>
                                <FileText className="w-4 h-4 text-muted-foreground flex-shrink-0 ml-2" />
                              </a>
                            ))
                          ) : (
                            <p className="text-xs text-muted-foreground text-center py-6">{t("No documents uploaded.")}</p>
                          )}
                        </div>

                        {/* Activity Updates Column */}
                        <div className="bg-white p-4 rounded-lg border space-y-3 max-h-[300px] overflow-y-auto shadow-sm">
                          <h4 className="font-bold text-foreground text-sm border-b pb-1">{t("Farming Updates")}</h4>
                          {selectedProject.updates && selectedProject.updates.length > 0 ? (
                            selectedProject.updates.map((up: any) => (
                              <div key={up.id} className="p-2 bg-gray-50 border rounded space-y-1 text-xs">
                                <p className="font-bold text-primary">{up.title}</p>
                                {up.description && <p className="text-muted-foreground text-[11px] line-clamp-2">{up.description}</p>}
                                <span className="text-[10px] text-gray-400 block text-right">{new Date(up.createdAt).toLocaleDateString()}</span>
                              </div>
                            ))
                          ) : (
                            <p className="text-xs text-muted-foreground text-center py-6">{t("No updates tracked.")}</p>
                          )}
                        </div>

                        {/* Financial Breakdown Column */}
                        <div className="bg-white p-4 rounded-lg border space-y-3 max-h-[300px] overflow-y-auto shadow-sm">
                          <h4 className="font-bold text-foreground text-sm border-b pb-1">{t("Financial Breakdown")}</h4>
                          {selectedProject.user?.financialRecords && selectedProject.user.financialRecords.length > 0 ? (
                            selectedProject.user.financialRecords.map((fin: any) => (
                              <div key={fin.id} className="flex justify-between items-center p-2 bg-gray-50 border rounded text-xs">
                                <span className="font-medium">{fin.description}</span>
                                <span className="font-bold text-green-700 ml-2 flex-shrink-0">₹{fin.amount}</span>
                              </div>
                            ))
                          ) : (
                            <p className="text-xs text-muted-foreground text-center py-6">{t("No financial records.")}</p>
                          )}
                        </div>

                      </div>

                    </div>

                  </div>
                </div>
              )}
            </div>
          )}

          {/* Upload Updates */}
          {activeSection === "uploads" && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-foreground">Post Farming Updates</h2>
              <div className="bg-white rounded-3xl border border-border p-8">
                <p className="text-muted-foreground mb-6">Post rich updates with photos, videos, and details for accepted farming requests.</p>
                {acceptedRequests.length > 0 ? (
                  <form onSubmit={handleUploadUpdate} className="form-container !p-6 space-y-4 bg-gray-50 border-dashed">
                    <div>
                      <Label className="premium-label">Select Request / User</Label>
                      <select value={uploadData.requestId} onChange={(e) => setUploadData({ ...uploadData, requestId: e.target.value })} className="premium-input w-full" required>
                        <option value="">-- Choose a request --</option>
                        {acceptedRequests.map((req) => (<option className="text-black" key={req.id} value={req.id}>{`${req.user?.name} | ${req.landAddress} | ${req.landSize} Acres`}</option>))}
                      </select>
                    </div>
                    <div>
                      <Label className="text-foreground font-semibold mb-2 flex items-center gap-2"><FileText className="w-4 h-4" />Title</Label>
                      <Input type="text" placeholder="e.g., Land Preparation Completed" value={uploadData.title} onChange={(e) => setUploadData({ ...uploadData, title: e.target.value })} required />
                    </div>
                    <div>
                      <Label className="text-foreground font-semibold mb-2 flex items-center gap-2"><FileText className="w-4 h-4" />Description</Label>
                      <textarea placeholder="Describe the farming activity in detail..." className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary resize-none" rows={4} value={uploadData.description} onChange={(e) => setUploadData({ ...uploadData, description: e.target.value })} />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <Label className="premium-label flex items-center gap-2"><ImageIcon className="w-4 h-4" />Upload Photo</Label>
                        <div 
                          className={cn(
                            "border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all duration-300",
                            selectedImageFiles.length > 0 ? "bg-green-50 border-green-600/30" : "bg-gray-50 border-gray-200 hover:border-primary/50 hover:bg-primary/5"
                          )}
                          onClick={() => document.getElementById("image-upload")?.click()}
                        >
                          <input type="file" accept="image/*" onChange={(e) => setSelectedImageFiles(Array.from(e.target.files || []))} className="hidden" id="image-upload" />
                          <div className="flex flex-col items-center gap-2">
                            <ImageIcon className={cn("w-10 h-10", selectedImageFiles.length > 0 ? "text-green-600" : "text-gray-400")} />
                            <p className="text-foreground font-bold text-sm">{selectedImageFiles.length > 0 ? t("Photos Selected") : t("Click to upload photo")}</p>
                            <p className="text-muted-foreground text-xs">{t("PNG, JPG up to 20MB")}</p>
                          </div>
                          {selectedImageFiles.length > 0 && (
                            <div className="mt-4 pt-4 border-t border-green-600/10 text-left">
                              <ul className="text-xs text-green-700 space-y-1">
                                {selectedImageFiles.map((file) => <li key={file.name} className="flex items-center gap-1"><CheckCircle className="w-3 h-3" /> {file.name}</li>)}
                              </ul>
                            </div>
                          )}
                        </div>
                      </div>
                      <div>
                        <Label className="premium-label flex items-center gap-2"><VideoIcon className="w-4 h-4" />Upload Video</Label>
                        <div 
                          className={cn(
                            "border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all duration-300",
                            selectedVideoFile ? "bg-green-50 border-green-600/30" : "bg-gray-50 border-gray-200 hover:border-primary/50 hover:bg-primary/5"
                          )}
                          onClick={() => document.getElementById("video-upload")?.click()}
                        >
                          <input type="file" accept="video/*" onChange={(e) => setSelectedVideoFile(e.target.files?.[0] || null)} className="hidden" id="video-upload" />
                          <div className="flex flex-col items-center gap-2">
                            <VideoIcon className={cn("w-10 h-10", selectedVideoFile ? "text-green-600" : "text-gray-400")} />
                            <p className="text-foreground font-bold text-sm">{selectedVideoFile ? t("Video Selected") : t("Click to upload video")}</p>
                            <p className="text-muted-foreground text-xs">{t("MP4, MOV up to 20MB")}</p>
                          </div>
                          {selectedVideoFile && (
                            <div className="mt-4 pt-4 border-t border-green-600/10 text-left">
                              <p className="text-xs text-green-700 flex items-center gap-1"><CheckCircle className="w-3 h-3" /> {selectedVideoFile.name}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div><Label className="text-foreground font-semibold mb-2 flex items-center gap-2"><MapPin className="w-4 h-4" />Land / Field Info</Label><Input type="text" placeholder="e.g., Plot A - North section" value={uploadData.landInfo} onChange={(e) => setUploadData({ ...uploadData, landInfo: e.target.value })} /></div>
                      <div><Label className="text-foreground font-semibold mb-2 flex items-center gap-2"><Calendar className="w-4 h-4" />Activity Date</Label><Input type="date" value={uploadData.activityDate} onChange={(e) => setUploadData({ ...uploadData, activityDate: e.target.value })} /></div>
                      <div><Label className="text-foreground font-semibold mb-2 flex items-center gap-2"><Timer className="w-4 h-4" />Activity Time</Label><Input type="time" value={uploadData.activityTime} onChange={(e) => setUploadData({ ...uploadData, activityTime: e.target.value })} /></div>
                    </div>
                    <Button type="submit" size="lg" className="w-full md:w-auto" disabled={uploading}><Upload className="w-4 h-4 mr-2" />{uploading ? "Uploading..." : "Post Update"}</Button>
                  </form>
                ) : (
                  <div className="text-center py-8"><p className="text-muted-foreground">No accepted requests available. Accept requests first to upload updates.</p></div>
                )}
              </div>

              {/* Update History */}
              {uploadData.requestId && (
                <div className="bg-white rounded-lg border border-border p-6">
                  <h3 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
                    <Clock className="w-5 h-5" />Update History
                    {updateHistory.length > 0 && <span className="text-sm font-normal text-muted-foreground">({updateHistory.length} update{updateHistory.length !== 1 ? "s" : ""})</span>}
                  </h3>
                  {updateHistory.length > 0 ? (
                    <div className="space-y-4">
                      {updateHistory.map((update) => (
                        <div key={update.id} className="border border-border rounded-lg overflow-hidden hover:shadow-sm transition">
                          <div className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50" onClick={() => setExpandedUpdateId(expandedUpdateId === update.id ? null : update.id)}>
                            <div className="flex items-center gap-3">
                              <div className="flex gap-1">{update.img && <ImageIcon className="w-4 h-4 text-green-600" />}{update.video && <VideoIcon className="w-4 h-4 text-green-600" />}</div>
                              <div>
                                <h4 className="font-semibold text-foreground">{update.title}</h4>
                                <p className="text-xs text-muted-foreground">{new Date(update.createdAt).toLocaleDateString()} {update.activityDate && `• Activity: ${update.activityDate}`} {update.activityTime && `at ${update.activityTime}`}</p>
                              </div>
                            </div>
                            <Eye className="w-4 h-4 text-muted-foreground" />
                          </div>
                          {expandedUpdateId === update.id && (
                            <div className="border-t border-border p-4 bg-gray-50 space-y-3">
                              {update.description && <p className="text-sm text-foreground">{update.description}</p>}
                              {update.landInfo && <p className="text-xs text-muted-foreground flex items-center gap-1"><MapPin className="w-3 h-3" /> {update.landInfo}</p>}
                              <div className="flex gap-4 flex-wrap">
                                {update.img && <img src={update.img} alt={update.title} className="w-48 h-32 object-cover rounded-lg border" />}
                                {update.video && <video src={update.video} controls className="w-48 h-32 object-cover rounded-lg border" />}
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted-foreground text-sm text-center py-4">No updates posted yet for this request.</p>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Offers Management */}
          {activeSection === "offers" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-foreground">Offers Management</h2>
                <Button onClick={() => setShowAddOfferForm(!showAddOfferForm)} className="gap-2"><Plus className="w-4 h-4" />Add Offer</Button>
              </div>
              {showAddOfferForm && (
                <div className="form-container">
                  <h3 className="text-lg font-bold text-foreground mb-6">Create New Offer</h3>
                  <form onSubmit={handleAddOffer} className="space-y-4">
                    <div><Label className="premium-label">Offer Title</Label><Input type="text" placeholder="e.g., Plowing & Tilling" value={newOffer.title} onChange={(e) => setNewOffer({ ...newOffer, title: e.target.value })} required /></div>
                    <div><Label className="premium-label">Description</Label><textarea placeholder="Describe the offer..." className="premium-input" rows={3} value={newOffer.description} onChange={(e) => setNewOffer({ ...newOffer, description: e.target.value })} required /></div>
                    <div><Label className="premium-label">Validity Period</Label><Input type="text" placeholder="e.g., Valid till Mar 31" value={newOffer.validity} onChange={(e) => setNewOffer({ ...newOffer, validity: e.target.value })} /></div>
                    <div><Label className="premium-label">Background Image</Label><Input type="text" placeholder="e.g., https://cloudinary.com/image.jpg" value={newOffer.img} onChange={(e) => setNewOffer({ ...newOffer, img: e.target.value })} /></div>
                    <div className="flex gap-4"><Button type="submit">Save Offer</Button><Button type="button" variant="outline" onClick={() => { setShowAddOfferForm(false); setNewOffer({ title: "", description: "", validity: "", img: "" }); }}>Cancel</Button></div>
                  </form>
                </div>
              )}
              <div className="grid gap-4">
                {offers.map((offer) => (
                  <div key={offer.id} className="bg-white rounded-lg border border-border p-6 hover:shadow-md transition">
                    <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-primary mb-2">{offer.title}</h3>
                        <p className="text-muted-foreground mb-3">{offer.description}</p>
                        <p className="text-xs font-semibold text-green-700 bg-green-50 px-3 py-1 rounded-full w-fit">{offer.validity}</p>
                      </div>
                      <div className="flex gap-2"><Button size="sm" variant="destructive" onClick={() => handleDeleteOffer(offer.id)}><Trash2 className="w-4 h-4" /></Button></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Financials Management */}
          {activeSection === "financials" && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-foreground">Manage Financial Breakdown</h2>
              <div className="form-container max-w-xl">
                <p className="text-muted-foreground mb-6">Add a new financial record for a user's earnings breakdown.</p>
                <form onSubmit={handleAddFinancial} className="space-y-4">
                  <div>
                    <Label className="premium-label">Select User</Label>
                    <select
                      value={financialData.userId}
                      onChange={(e) => setFinancialData({ ...financialData, userId: e.target.value })}
                      className="premium-input text-black"
                      required
                    >
                      <option value="">-- Choose a User --</option>
                      {Array.from(new Map(requests.map(r => [r.user?.id, r.user])).values())
                        .filter(u => u && u.id)
                        .map((u: any) => (
                          <option key={u.id} value={u.id}>{u.name} ({u.email})</option>
                        ))
                      }
                    </select>
                  </div>
                  <div>
                    <Label className="premium-label">Description</Label>
                    <Input
                      type="text"
                      placeholder="e.g., Organic Carrot Harvest Profit"
                      value={financialData.description}
                      onChange={(e) => setFinancialData({ ...financialData, description: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Label className="text-foreground font-semibold mb-2 flex items-center gap-2">Amount (₹)</Label>
                    <Input
                      type="number"
                      placeholder="e.g. 25000"
                      value={financialData.amount}
                      onChange={(e) => setFinancialData({ ...financialData, amount: e.target.value })}
                      required
                    />
                  </div>
                  <Button type="submit" className="w-full" disabled={financialLoading}>
                    {financialLoading ? "Adding..." : "Add Financial Record"}
                  </Button>
                </form>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
