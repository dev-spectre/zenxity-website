import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

interface TimelineBarProps {
  stages: string[];
  currentStageIndex: number;
  className?: string;
}

export function TimelineBar({ stages, currentStageIndex, className }: TimelineBarProps) {
  return (
    <div className={cn("py-6", className)}>
      <div className="relative flex items-center justify-between">
        {/* Background Track */}
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-gray-200 rounded-full" />
        
        {/* Active Track */}
        <div 
          className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-primary rounded-full transition-all duration-500"
          style={{ width: `${(currentStageIndex / (stages.length - 1)) * 100}%` }}
        />

        {stages.map((stage, index) => {
          const isCompleted = index < currentStageIndex;
          const isActive = index === currentStageIndex;

          return (
            <div key={stage} className="relative flex flex-col items-center group">
              <div 
                className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center border-2 transition-colors z-10 bg-white",
                  isCompleted ? "bg-primary border-primary text-white" : 
                  isActive ? "border-primary text-primary" : 
                  "border-gray-300 text-gray-400"
                )}
              >
                {isCompleted ? <Check className="w-4 h-4" /> : <span className="text-xs font-bold">{index + 1}</span>}
              </div>
              <span 
                className={cn(
                  "absolute top-10 text-sm font-medium whitespace-nowrap",
                  isActive ? "text-primary" : "text-muted-foreground"
                )}
              >
                {stage}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
