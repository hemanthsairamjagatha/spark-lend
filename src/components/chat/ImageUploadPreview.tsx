import { X } from "lucide-react";
import { ChatImage } from "@/types/chat";
import { Button } from "@/components/ui/button";

interface ImageUploadPreviewProps {
  images: ChatImage[];
  onRemove: (id: string) => void;
}

export const ImageUploadPreview = ({
  images,
  onRemove,
}: ImageUploadPreviewProps) => {
  if (images.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-2 px-4 pt-3">
      {images.map((image) => (
        <div key={image.id} className="relative group">
          <img
            src={image.url}
            alt={image.name}
            className="w-16 h-16 object-cover rounded-lg border border-border"
          />
          <Button
            variant="destructive"
            size="icon"
            className="absolute -top-2 -right-2 w-5 h-5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={() => onRemove(image.id)}
            aria-label={`Remove ${image.name}`}
          >
            <X className="w-3 h-3" />
          </Button>
        </div>
      ))}
    </div>
  );
};
