import { Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <div className="flex h-screen w-full flex-col items-center justify-center bg-background gap-4">
      <Loader2 className="h-10 w-10 animate-spin text-primary" />
      <span className="text-muted-foreground font-medium animate-pulse">Loading Zenxity...</span>
    </div>
  );
}
