import { useState, useRef, useEffect } from "react";
import { ChatMessage, ChatImage } from "@/types/chat";
import { ChatMessageBubble } from "./ChatMessageBubble";
import { ChatInput } from "./ChatInput";
import { ScrollArea } from "@/components/ui/scroll-area";

const WELCOME_MESSAGE: ChatMessage = {
  id: "welcome",
  role: "assistant",
  content:
    "Hello! I'm your SparkLend assistant. You can send me messages and attach images — I'll do my best to help. Try uploading an image using the image button below!",
  timestamp: new Date(),
};

const ASSISTANT_REPLIES: string[] = [
  "Thanks for sharing that! I can see the image you uploaded.",
  "Got it! The image has been received. Is there anything specific you'd like to discuss about it?",
  "Great image! How can I help you further with this?",
  "I've received your message and the attached image(s). What would you like to know?",
  "Understood. I'm processing what you've sent. Feel free to ask any follow-up questions!",
];

export const ChatInterface = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([WELCOME_MESSAGE]);
  const [inputValue, setInputValue] = useState("");
  const [pendingImages, setPendingImages] = useState<ChatImage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  // Track all object URLs so we can revoke them when the component unmounts
  const objectUrlsRef = useRef<string[]>([]);

  useEffect(() => {
    return () => {
      objectUrlsRef.current.forEach((url) => URL.revokeObjectURL(url));
    };
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleImagesChange = (images: ChatImage[]) => {
    // Register any new URLs so they can be cleaned up later
    images.forEach((img) => {
      if (!objectUrlsRef.current.includes(img.url)) {
        objectUrlsRef.current.push(img.url);
      }
    });
    setPendingImages(images);
  };

  const handleSubmit = () => {
    const trimmedValue = inputValue.trim();
    if (!trimmedValue && pendingImages.length === 0) return;

    const userMessage: ChatMessage = {
      id: crypto.randomUUID(),
      role: "user",
      content: trimmedValue,
      images: pendingImages.length > 0 ? [...pendingImages] : undefined,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setPendingImages([]);
    setIsLoading(true);

    // Simulate an assistant reply after a short delay
    const delay = 800 + Math.random() * 800;
    setTimeout(() => {
      const replyText =
        ASSISTANT_REPLIES[Math.floor(Math.random() * ASSISTANT_REPLIES.length)];
      const assistantMessage: ChatMessage = {
        id: crypto.randomUUID(),
        role: "assistant",
        content: replyText,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, assistantMessage]);
      setIsLoading(false);
    }, delay);
  };

  return (
    <div className="flex flex-col h-screen bg-background">
      {/* Header */}
      <div className="flex items-center gap-3 px-6 py-4 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="w-9 h-9 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-sm font-bold">
          SL
        </div>
        <div>
          <h1 className="font-semibold text-foreground leading-none">
            SparkLend Assistant
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            {isLoading ? "Typing…" : "Online"}
          </p>
        </div>
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 px-4 py-2">
        <div className="max-w-3xl mx-auto">
          {messages.map((message) => (
            <ChatMessageBubble key={message.id} message={message} />
          ))}

          {isLoading && (
            <div className="flex justify-start gap-3 py-2">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-sm font-semibold">
                AI
              </div>
              <div className="bg-muted rounded-2xl rounded-bl-sm px-4 py-3">
                <div className="flex gap-1 items-center h-5">
                  <span className="w-2 h-2 rounded-full bg-muted-foreground/50 animate-bounce [animation-delay:0ms]" />
                  <span className="w-2 h-2 rounded-full bg-muted-foreground/50 animate-bounce [animation-delay:150ms]" />
                  <span className="w-2 h-2 rounded-full bg-muted-foreground/50 animate-bounce [animation-delay:300ms]" />
                </div>
              </div>
            </div>
          )}

          <div ref={bottomRef} />
        </div>
      </ScrollArea>

      {/* Input */}
      <div className="max-w-3xl w-full mx-auto">
        <ChatInput
          value={inputValue}
          images={pendingImages}
          isLoading={isLoading}
          onChange={setInputValue}
          onImagesChange={handleImagesChange}
          onSubmit={handleSubmit}
        />
      </div>
    </div>
  );
};
