"use client";

import { Anvil, Bot, MessageSquare, X } from "lucide-react";
import { useCallback, useEffect, useId, useRef, useState } from "react";
import { CHATBOT_GREETING, SUGGESTED_QUESTIONS } from "@/data/stackforge-chatbot";
import { findChatbotAnswer } from "@/lib/chatbot/find-chatbot-answer";
import { cn } from "@/lib/utils";
import { ChatInput } from "./chat-input";
import { ChatMessage, type ChatMessageData } from "./chat-message";
import { SuggestedQuestions } from "./suggested-questions";
import { TypingIndicator } from "./typing-indicator";

function createId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

export function StackForgeChatbot() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const [messages, setMessages] = useState<ChatMessageData[]>([]);
  const [extraSuggestions, setExtraSuggestions] = useState<readonly string[]>([]);
  const [greeted, setGreeted] = useState(false);
  const [hintVisible, setHintVisible] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);
  const panelId = useId();

  const openChat = useCallback(() => {
    setHintVisible(false);
    setOpen(true);
  }, []);

  const scrollToBottom = useCallback(() => {
    requestAnimationFrame(() => {
      scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
    });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, typing, extraSuggestions, scrollToBottom]);

  useEffect(() => {
    if (open && !greeted) {
      setMessages([{ id: createId(), role: "assistant", content: CHATBOT_GREETING }]);
      setGreeted(true);
    }
  }, [open, greeted]);

  useEffect(() => {
    if (open) return;

    const hideHint = () => setHintVisible(false);
    const timeout = window.setTimeout(hideHint, 6000);
    window.addEventListener("scroll", hideHint, { passive: true });

    return () => {
      window.clearTimeout(timeout);
      window.removeEventListener("scroll", hideHint);
    };
  }, [open]);

  const submitQuestion = useCallback(
    (question: string) => {
      const trimmed = question.trim();
      if (!trimmed || typing) return;

      setExtraSuggestions([]);
      setMessages((prev) => [...prev, { id: createId(), role: "user", content: trimmed }]);
      setInput("");
      setTyping(true);

      const delay = 300 + Math.floor(Math.random() * 301);
      window.setTimeout(() => {
        const result = findChatbotAnswer(trimmed);
        setMessages((prev) => [
          ...prev,
          { id: createId(), role: "assistant", content: result.answer },
        ]);
        if (result.isFallback && result.suggestions.length) {
          setExtraSuggestions(result.suggestions);
        }
        setTyping(false);
      }, delay);
    },
    [typing],
  );

  const handleSend = useCallback(() => {
    submitQuestion(input);
  }, [input, submitQuestion]);

  return (
    <>
      {!open && (
        <div
          className="fixed bottom-4 right-4 z-30 flex max-w-[calc(100vw-2rem)] items-end gap-3 sm:bottom-10 sm:right-8"
          role="group"
          aria-label="StackForge chatbot launcher"
        >
          {hintVisible && (
            <div className="relative mb-1 hidden max-w-[220px] animate-fade-in sm:block">
              <div className="glass rounded-2xl rounded-br-md border border-white/60 bg-zinc-950/80 px-3.5 py-2.5 shadow-glow-sm backdrop-blur-md">
                <div className="flex items-start gap-2">
                  <Bot className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" aria-hidden />
                  <div className="min-w-0 pr-5">
                    <p className="text-xs font-semibold text-zinc-100">StackForge chatbot</p>
                    <p className="mt-0.5 text-[11px] leading-snug text-zinc-400">
                      Ask about the CLI, stack, Docker, and setup.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setHintVisible(false)}
                    aria-label="Dismiss chat hint"
                    className="absolute right-2 top-2 rounded p-0.5 text-zinc-500 transition hover:bg-white/5 hover:text-zinc-300"
                  >
                    <X className="h-3 w-3" aria-hidden />
                  </button>
                </div>
              </div>
              <span
                className="absolute -bottom-1.5 right-3 h-3 w-3 rotate-45 border-b border-r border-emerald-500/20 bg-zinc-900/90"
                aria-hidden
              />
            </div>
          )}

          <div className="relative shrink-0">
            {hintVisible && (
              <p className="pointer-events-none absolute bottom-full right-0 mb-2 max-w-[11rem] text-right text-[11px] font-medium leading-snug text-emerald-300/90 sm:hidden">
                Tap to open the StackForge chatbot
              </p>
            )}
            <span
              className="pointer-events-none absolute -inset-1 rounded-2xl border border-emerald-400/25 shadow-glow-sm"
              aria-hidden
            />
            <button
              type="button"
              onClick={openChat}
              aria-label="Open StackForge chatbot assistant"
              title="Open chatbot"
              className="relative flex h-14 w-14 flex-col items-center justify-center gap-0.5 rounded-2xl border border-emerald-500/30 bg-emerald-500/15 text-emerald-300 shadow-glow-sm transition hover:scale-105 hover:border-emerald-400/50 hover:bg-emerald-500/25 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-500"
            >
              <MessageSquare className="h-5 w-5" aria-hidden />
              <span className="text-[9px] font-semibold uppercase tracking-wide text-emerald-200/90">
                Chat
              </span>
            </button>
          </div>
        </div>
      )}

      <div
        id={panelId}
        role="dialog"
        aria-label="StackForge Assistant"
        aria-hidden={!open}
        className={cn(
          "fixed z-50 flex flex-col border border-white/10 bg-zinc-950/95 shadow-glow backdrop-blur-md transition-all duration-300 ease-out",
          open
            ? "pointer-events-auto translate-y-0 opacity-100"
            : "pointer-events-none translate-y-4 opacity-0",
          "inset-x-0 bottom-0 h-[min(85vh,640px)] rounded-t-2xl sm:inset-auto sm:bottom-28 sm:right-8 sm:h-[560px] sm:w-[400px] sm:rounded-2xl sm:border-white/60",
        )}
      >
        <header className="flex items-center gap-3 border-b border-white/10 px-4 py-3">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg border border-emerald-500/30 bg-emerald-500/10 text-emerald-400">
            <Anvil className="h-4 w-4" aria-hidden />
          </span>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-zinc-50">StackForge Assistant</p>
            <p className="truncate text-xs text-zinc-500">Ask me about StackForge</p>
          </div>
          <button
            type="button"
            onClick={() => setOpen(false)}
            aria-label="Close chat"
            className="rounded-lg border border-white/10 p-2 text-zinc-400 transition hover:bg-white/5 hover:text-zinc-200"
          >
            <X className="h-4 w-4" aria-hidden />
          </button>
        </header>

        <div
          ref={scrollRef}
          className="myscroll flex-1 space-y-3 overflow-y-auto px-3 py-4"
          role="log"
          aria-live="polite"
          aria-relevant="additions"
        >
          {messages.map((msg) => (
            <ChatMessage key={msg.id} message={msg} />
          ))}
          {typing && (
            <div className="flex justify-start">
              <TypingIndicator />
            </div>
          )}
          {open && greeted && messages.length <= 1 && !typing && (
            <SuggestedQuestions
              questions={SUGGESTED_QUESTIONS}
              onSelect={submitQuestion}
              className="pt-1"
            />
          )}
          {extraSuggestions.length > 0 && !typing && (
            <SuggestedQuestions questions={extraSuggestions} onSelect={submitQuestion} />
          )}
        </div>

        <ChatInput value={input} onChange={setInput} onSend={handleSend} disabled={typing} />
      </div>
    </>
  );
}
