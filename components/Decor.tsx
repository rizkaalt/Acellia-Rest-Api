export function WitchHat({ className = "w-10 h-10" }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden="true">
      <path d="M32 4c4 10 6 20 8 30l-16 0c2-10 4-20 8-30z" fill="rgb(var(--md-tertiary))" />
      <path d="M26 30h12v5H26z" fill="rgb(var(--md-secondary))" />
      <ellipse cx="32" cy="42" rx="26" ry="8" fill="rgb(var(--md-tertiary))" />
      <ellipse cx="32" cy="40" rx="14" ry="3" fill="rgb(var(--md-primary))" opacity=".5" />
    </svg>
  );
}

export function MagicCircle({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 200 200" className={className} aria-hidden="true" fill="none" stroke="rgb(var(--md-primary))" strokeWidth="1.2">
      <circle cx="100" cy="100" r="92" opacity=".5" />
      <circle cx="100" cy="100" r="76" strokeDasharray="4 6" opacity=".6" />
      <polygon points="100,26 164,137 36,137" opacity=".7" />
      <polygon points="100,174 36,63 164,63" opacity=".7" />
      <circle cx="100" cy="100" r="18" stroke="rgb(var(--md-secondary))" strokeWidth="1.6" />
    </svg>
  );
}
