import { cn } from "@/lib/utils";

type SuggestedQuestionsProps = {
  questions: readonly string[];
  onSelect: (question: string) => void;
  className?: string;
};

export function SuggestedQuestions({ questions, onSelect, className }: SuggestedQuestionsProps) {
  return (
    <div className={cn("flex flex-wrap gap-2", className)}>
      {questions.map((q) => (
        <button
          key={q}
          type="button"
          onClick={() => onSelect(q)}
          className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-left text-xs text-zinc-300 transition hover:border-emerald-500/30 hover:bg-emerald-500/10 hover:text-emerald-200"
        >
          {q}
        </button>
      ))}
    </div>
  );
}
