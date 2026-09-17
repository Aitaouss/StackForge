export function TypingIndicator() {
  return (
    <div
      className="inline-flex items-center gap-1 rounded-xl border border-white/10 bg-zinc-900/80 px-3 py-2"
      aria-label="Assistant is typing"
    >
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400/80"
          style={{ animationDelay: `${i * 150}ms` }}
        />
      ))}
    </div>
  );
}
