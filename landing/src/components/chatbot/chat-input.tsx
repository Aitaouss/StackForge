"use client";

import { Send } from "lucide-react";
import { useCallback, type KeyboardEvent } from "react";
import { cn } from "@/lib/utils";

type ChatInputProps = {
  value: string;
  onChange: (value: string) => void;
  onSend: () => void;
  disabled?: boolean;
};

export function ChatInput({ value, onChange, onSend, disabled }: ChatInputProps) {
  const handleKeyDown = useCallback(
    (e: KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        onSend();
      }
    },
    [onSend],
  );

  return (
    <div className="flex items-end gap-2 border-t border-white/10 p-3">
      <label htmlFor="stackforge-chat-input" className="sr-only">
        Message StackForge Assistant
      </label>
      <textarea
        id="stackforge-chat-input"
        rows={2}
        value={value}
        disabled={disabled}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Ask about the CLI, stack, Docker…"
        className={cn(
          "max-h-28 min-h-[2.75rem] flex-1 resize-none rounded-lg border border-white/10 bg-zinc-950/80 px-3 py-2 text-sm text-zinc-100 placeholder:text-zinc-500",
          "focus:border-emerald-500/40 focus:outline-none focus:ring-1 focus:ring-emerald-500/30",
          disabled && "opacity-60",
        )}
      />
      <button
        type="button"
        onClick={onSend}
        disabled={disabled || !value.trim()}
        aria-label="Send message"
        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-emerald-500/30 bg-emerald-500/15 text-emerald-300 transition hover:bg-emerald-500/25 disabled:cursor-not-allowed disabled:opacity-40"
      >
        <Send className="h-4 w-4" aria-hidden />
      </button>
    </div>
  );
}
