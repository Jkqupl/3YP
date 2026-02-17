import React from "react";

const ACCENTS = {
  correct: {
    ring: "ring-2 ring-emerald-400/60",
    border: "border-emerald-400/40",
    bg: "bg-emerald-500/10",
    title: "text-emerald-200",
    badge: "bg-emerald-500/15 text-emerald-200 border-emerald-400/30",
  },
  incorrect: {
    ring: "ring-2 ring-amber-400/60",
    border: "border-amber-400/40",
    bg: "bg-amber-500/10",
    title: "text-amber-200",
    badge: "bg-amber-500/15 text-amber-200 border-amber-400/30",
  },
  info: {
    ring: "ring-2 ring-cyan-400/60",
    border: "border-cyan-400/40",
    bg: "bg-cyan-500/10",
    title: "text-cyan-200",
    badge: "bg-cyan-500/15 text-cyan-100 border-cyan-400/30",
  },
};

/**
 * FeedbackOverlay
 *
 * Props:
 * - open: boolean
 * - variant: "correct" | "incorrect" | "info"
 * - title: string
 * - message?: string
 * - bullets?: string[]
 * - onClose: () => void
 * - primaryLabel?: string (default "Continue")
 * - secondaryLabel?: string (default "Review email")
 * - onSecondary?: () => void
 * - showSecondary?: boolean (default true)
 *
 * Behaviour:
 * - Click backdrop closes (optional: remove if you want forced reading)
 * - Esc closes
 */
export default function FeedbackOverlay({
  open,
  variant = "info",
  title,
  message,
  bullets = [],
  onClose,
  primaryLabel = "Continue",
  secondaryLabel = "Review email",
  onSecondary,
  showSecondary = true,
}) {
  React.useEffect(() => {
    if (!open) return;
    const onKeyDown = (e) => {
      if (e.key === "Escape") onClose?.();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  const a = ACCENTS[variant] ?? ACCENTS.info;

  return (
    <div
      className="fixed inset-0 z-50"
      aria-modal="true"
      role="dialog"
      aria-label="Feedback"
    >
      {/* Backdrop */}
      <button
        type="button"
        aria-label="Close feedback"
        onClick={onClose}
        className="absolute inset-0 w-full h-full bg-black/60"
      />

      {/* Panel wrapper */}
      <div className="absolute inset-0 flex items-center justify-center p-4">
        <div
          className={[
            "w-full max-w-lg",
            "rounded-2xl border shadow-2xl",
            "bg-slate-950/90 backdrop-blur",
            "relative overflow-hidden",
            a.border,
            a.ring,
          ].join(" ")}
        >
          {/* Top accent bar */}
          <div className={["h-1.5 w-full", a.bg].join(" ")} />

          <div className="p-5 sm:p-6">
            {/* Header */}
            <div className="flex items-start gap-3">
              <div
                className={[
                  "mt-0.5 shrink-0 rounded-xl border px-2.5 py-1 text-xs font-semibold",
                  a.badge,
                ].join(" ")}
              >
                {variant === "correct"
                  ? "Correct"
                  : variant === "incorrect"
                    ? "Not quite"
                    : "Hint"}
              </div>

              <div className="min-w-0">
                <h3 className={["text-lg font-semibold", a.title].join(" ")}>
                  {title}
                </h3>
                {message ? (
                  <p className="mt-1 text-sm text-slate-200/90 leading-relaxed">
                    {message}
                  </p>
                ) : null}
              </div>

              <button
                type="button"
                onClick={onClose}
                className="ml-auto rounded-lg border border-slate-700 bg-slate-900/60 px-2 py-1 text-xs text-slate-200 hover:bg-slate-900"
              >
                Close
              </button>
            </div>

            {/* Bullets */}
            {bullets?.length ? (
              <div className="mt-4">
                <div className="text-xs uppercase tracking-wide text-slate-400">
                  What to notice
                </div>
                <ul className="mt-2 space-y-2">
                  {bullets.map((b, i) => (
                    <li
                      key={i}
                      className="flex gap-2 text-sm text-slate-200/90"
                    >
                      <span className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full bg-slate-400" />
                      <span className="leading-relaxed">{b}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}

            {/* Actions */}
            <div className="mt-6 flex flex-col-reverse sm:flex-row sm:justify-end gap-2">
              {showSecondary ? (
                <button
                  type="button"
                  onClick={onSecondary}
                  className="w-full sm:w-auto px-4 py-2 rounded-xl border border-slate-700 bg-slate-900/50 text-slate-100 text-sm hover:bg-slate-900"
                >
                  {secondaryLabel}
                </button>
              ) : null}

              <button
                type="button"
                onClick={onClose}
                className="w-full sm:w-auto px-4 py-2 rounded-xl bg-cyan-400 text-slate-950 font-semibold text-sm hover:bg-cyan-300"
              >
                {primaryLabel}
              </button>
            </div>

            {/* Tiny footer tip */}
            <div className="mt-3 text-[11px] text-slate-500">
              Tip: focus on sender domain, link domain, urgency, and wording.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
