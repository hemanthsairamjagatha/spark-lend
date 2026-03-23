import { useRef, KeyboardEvent } from "react";
import { ImagePlus, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ChatImage } from "@/types/chat";
import { ImageUploadPreview } from "./ImageUploadPreview";
import { useToast } from "@/hooks/use-toast";

const MAX_FILE_SIZE_MB = 10;
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/gif", "image/webp"];

interface ChatInputProps {
  value: string;
  images: ChatImage[];
  isLoading: boolean;
  onChange: (value: string) => void;
  onImagesChange: (images: ChatImage[]) => void;
  onSubmit: () => void;
}

export const ChatInput = ({
  value,
  images,
  isLoading,
  onChange,
  onImagesChange,
  onSubmit,
}: ChatInputProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    if (files.length === 0) return;

    const newImages: ChatImage[] = [];
    const errors: string[] = [];

    for (const file of files) {
      if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
        errors.push(`"${file.name}" is not a supported image type.`);
        continue;
      }
      if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
        errors.push(`"${file.name}" exceeds the ${MAX_FILE_SIZE_MB}MB size limit.`);
        continue;
      }
      newImages.push({
        id: crypto.randomUUID(),
        url: URL.createObjectURL(file),
        name: file.name,
        size: file.size,
      });
    }

    if (errors.length > 0) {
      toast({
        title: "Some images could not be added",
        description: errors.join(" "),
        variant: "destructive",
      });
    }

    if (newImages.length > 0) {
      onImagesChange([...images, ...newImages]);
    }

    // Reset file input so the same file can be re-selected
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleRemoveImage = (id: string) => {
    const removed = images.find((img) => img.id === id);
    if (removed) {
      URL.revokeObjectURL(removed.url);
    }
    onImagesChange(images.filter((img) => img.id !== id));
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (!isLoading && (value.trim() || images.length > 0)) {
        onSubmit();
      }
    }
  };

  const canSubmit = !isLoading && (value.trim().length > 0 || images.length > 0);

  return (
    <div className="border-t border-border bg-background">
      <ImageUploadPreview images={images} onRemove={handleRemoveImage} />
      <div className="flex items-end gap-2 p-4">
        <input
          ref={fileInputRef}
          type="file"
          accept={ACCEPTED_IMAGE_TYPES.join(",")}
          multiple
          className="hidden"
          onChange={handleImageSelect}
          aria-label="Upload images"
        />
        <Button
          variant="ghost"
          size="icon"
          className="flex-shrink-0 text-muted-foreground hover:text-foreground"
          onClick={() => fileInputRef.current?.click()}
          disabled={isLoading}
          aria-label="Attach images"
          title="Attach images"
        >
          <ImagePlus className="w-5 h-5" />
        </Button>
        <Textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Message… (Shift+Enter for new line)"
          className="flex-1 min-h-[44px] max-h-40 resize-none rounded-xl"
          rows={1}
          disabled={isLoading}
        />
        <Button
          size="icon"
          className="flex-shrink-0 rounded-xl"
          onClick={onSubmit}
          disabled={!canSubmit}
          aria-label="Send message"
          title="Send message"
        >
          <Send className="w-4 h-4" />
        </Button>
      </div>
      <p className="text-center text-xs text-muted-foreground pb-3">
        Supports JPEG, PNG, GIF and WebP up to {MAX_FILE_SIZE_MB}MB per image.
      </p>
    </div>
  );
};
