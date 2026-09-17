import {
  CHATBOT_FALLBACK_ANSWER,
  FALLBACK_SUGGESTIONS,
  stackforgeKnowledge,
  type ChatbotKnowledgeItem,
} from "@/data/stackforge-chatbot";
import { normalizeInput } from "./normalize-input";

const MIN_SCORE = 3;

function scoreItem(normalized: string, item: ChatbotKnowledgeItem): number {
  let score = 0;
  const words = new Set(normalized.split(" ").filter(Boolean));

  for (const keyword of item.keywords) {
    const nk = normalizeInput(keyword);
    if (!nk) continue;
    if (normalized.includes(nk)) {
      score += nk.includes(" ") ? 4 : 2;
    } else {
      const kwWords = nk.split(" ");
      if (kwWords.every((w) => words.has(w))) {
        score += 3;
      }
    }
  }

  if (item.questions) {
    for (const q of item.questions) {
      const nq = normalizeInput(q);
      if (normalized === nq) {
        score += 12;
      } else if (normalized.includes(nq) || nq.includes(normalized)) {
        score += 6;
      } else {
        const qWords = nq.split(" ").filter((w) => w.length > 2);
        const overlap = qWords.filter((w) => words.has(w)).length;
        score += overlap * 2;
      }
    }
  }

  return score;
}

export type ChatbotMatchResult = {
  answer: string;
  itemId: string | null;
  isFallback: boolean;
  suggestions: readonly string[];
};

export function findChatbotAnswer(rawInput: string): ChatbotMatchResult {
  const normalized = normalizeInput(rawInput);
  if (!normalized) {
    return {
      answer: CHATBOT_FALLBACK_ANSWER,
      itemId: null,
      isFallback: true,
      suggestions: FALLBACK_SUGGESTIONS,
    };
  }

  let best: ChatbotKnowledgeItem | null = null;
  let bestScore = 0;

  for (const item of stackforgeKnowledge) {
    const score = scoreItem(normalized, item);
    if (score > bestScore) {
      bestScore = score;
      best = item;
    }
  }

  if (best && bestScore >= MIN_SCORE) {
    return {
      answer: best.answer,
      itemId: best.id,
      isFallback: false,
      suggestions: [],
    };
  }

  return {
    answer: CHATBOT_FALLBACK_ANSWER,
    itemId: null,
    isFallback: true,
    suggestions: FALLBACK_SUGGESTIONS,
  };
}
