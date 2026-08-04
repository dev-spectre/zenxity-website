"use client";

import { useEffect, useState } from "react";
import { UpdateFeedCard } from "./UpdateFeedCard";
import { Activity } from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";

interface RequestData {
  id: string;
  landAddress: string;
}

interface UpdateData {
  id: string;
  title: string;
  description: string | null;
  img: string | null;
  activityDate: string | null;
  activityTime: string | null;
  requestId: string;
  createdAt: Date;
}

interface UpdatesFilterWrapperProps {
  updates: UpdateData[];
  lands: RequestData[];
}

export function UpdatesFilterWrapper({ updates, lands }: UpdatesFilterWrapperProps) {
  const { t } = useTranslation();
  const [selectedLand, setSelectedLand] = useState<string>("all");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const filteredUpdates = selectedLand === "all" 
    ? updates 
    : updates.filter(u => u.requestId === selectedLand);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4 max-w-xs">
        <select
          value={selectedLand}
          onChange={(e) => setSelectedLand(e.target.value)}
          className="w-full h-10 rounded-md border border-input bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary text-black"
        >
          <option value="all">{mounted ? t("All Lands") : ""}</option>
          {lands.map((land) => (
            <option key={land.id} value={land.id}>
              {land.landAddress}
            </option>
          ))}
        </select>
      </div>

      {filteredUpdates.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredUpdates.map((update) => (
            <UpdateFeedCard 
              key={update.id}
              title={update.title}
              description={update.description || undefined}
              imgUrl={update.img || undefined}
              date={update.activityDate || new Date(update.createdAt).toLocaleDateString()}
              time={update.activityTime || undefined}
            />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-xl border p-12 text-center flex flex-col items-center justify-center space-y-4">
          <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-2">
            <Activity className="w-8 h-8 text-gray-300" />
          </div>
          <h3 className="text-lg font-bold text-foreground">{mounted ? t("No updates yet") : ""}</h3>
          <p className="text-muted-foreground max-w-sm">
            {mounted ? t("There are no live updates for this specific land at this time.") : ""}
          </p>
        </div>
      )}
    </div>
  );
}
