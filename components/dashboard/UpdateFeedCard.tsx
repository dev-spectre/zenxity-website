import { Calendar, Timer, Image as ImageIcon } from "lucide-react";

interface UpdateFeedCardProps {
  title: string;
  description?: string;
  imgUrl?: string;
  date: string;
  time?: string;
}

export function UpdateFeedCard({ title, description, imgUrl, date, time }: UpdateFeedCardProps) {
  return (
    <div className="bg-white rounded-lg border overflow-hidden hover:shadow-sm transition-shadow">
      <div className="relative h-48 bg-gray-100 flex items-center justify-center">
        {imgUrl ? (
          <img src={imgUrl} alt={title} className="w-full h-full object-cover" />
        ) : (
          <ImageIcon className="text-gray-300 w-12 h-12" />
        )}
      </div>
      <div className="p-4 space-y-2">
        <div className="flex flex-wrap gap-4 text-xs text-muted-foreground">
          <span className="flex gap-1 items-center">
            <Calendar className="w-3 h-3" /> {date}
          </span>
          {time && (
            <span className="flex gap-1 items-center">
              <Timer className="w-3 h-3" /> {time}
            </span>
          )}
        </div>
        <h3 className="font-bold text-foreground line-clamp-1">{title}</h3>
        {description && (
          <p className="text-sm text-muted-foreground line-clamp-2">{description}</p>
        )}
      </div>
    </div>
  );
}
