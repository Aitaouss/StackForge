import { RenderBotMessage } from "@/lib/chatbot/render-message";
import { cn } from "@/lib/utils";

export type ChatMessageRole = "user" | "assistant" | "system";

export type ChatMessageData = {
  id: string;
  role: ChatMessageRole;
  content: string;
};

type ChatMessageProps = {
  message: ChatMessageData;
};

export function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === "user";

  return (
    <div
      className={cn("flex", isUser ? "justify-end" : "justify-start")}
      role="listitem"
    >
      <div
        className={cn(
          "max-w-[92%] rounded-xl px-3 py-2",
          isUser
            ? "border border-emerald-500/25 bg-emerald-500/10 text-zinc-100"
            : "border border-white/10 bg-zinc-900/80 text-zinc-300",
        )}
      >
        {isUser ? (
          <p className="text-sm leading-relaxed">{message.content}</p>
        ) : (
          <RenderBotMessage content={message.content} />
        )}
      </div>
    </div>
  );
}
