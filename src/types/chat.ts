export interface ChatImage {
  id: string;
  url: string;
  name: string;
  size: number;
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  images?: ChatImage[];
  timestamp: Date;
}
