import React, { useState, useRef } from "react";
import { useGameStore } from "../state/useGameStore";
import EmailIframeViewer from "./EmailIframeViewer";

export default function EmailPanel() {
  const decideAndNext = useGameStore((s) => s.decideAndNext);
  const setDecision = useGameStore((s) => s.setDecision);
  const userDecisions = useGameStore((s) => s.userDecisions);
  const getScore = useGameStore((s) => s.getScore);
  const previewTimeout = useRef(null);

  const emails = useGameStore((s) => s.emails);
  const currentEmailId = useGameStore((s) => s.currentEmailId);

  const [urlPreview, setUrlPreview] = useState(null);

  const allAnswered = emails.every((e) => userDecisions[e.id]);

  const email = emails.find((e) => e.id === currentEmailId);
  const handleLinkHover = () => {};

  const handleLinkClick = (info) => {
    setUrlPreview(info);

    if (previewTimeout.current) {
      clearTimeout(previewTimeout.current);
    }

    previewTimeout.current = setTimeout(() => {
      setUrlPreview(null);
    }, 2000);
  };

  if (!email) {
    return (
      <div className="h-full flex items-center justify-center text-slate-400">
        Select an email
      </div>
    );
  }
  const decision = userDecisions[email.id];

  return (
    <div className="h-full flex flex-col gap-3 p-4">
      <div className="flex items-start justify-between gap-4">
        {/* LEFT: Subject + sender */}
        <div className="min-w-0">
          <div className="text-slate-100 font-semibold truncate">
            {email.subject}
          </div>
          <div className="text-sm text-slate-400">
            {email.fromName} &lt;{email.fromEmail}&gt;
            {email.replyTo && email.replyTo !== email.fromEmail ? (
              <> • Reply-To: {email.replyTo}</>
            ) : null}{" "}
            • {email.time}
          </div>
        </div>

        {/* RIGHT: Buttons + URL preview */}
        <div className="flex items-start gap-3">
          <div className="flex gap-2">
            <button
              onClick={() => decideAndNext(email.id, "phish")}
              className={[
                "px-4 py-2 rounded-lg text-sm font-semibold transition select-none",
                "border shadow-sm active:scale-95",
                decision === "phish"
                  ? "bg-red-600 text-white border-red-300 ring-2 ring-red-300 ring-offset-2 ring-offset-slate-950"
                  : "bg-red-500/90 text-white border-red-500 hover:bg-red-500",
              ].join(" ")}
            >
              {decision === "phish" ? "✓ Malicious" : "Malicious"}
            </button>

            <button
              onClick={() => decideAndNext(email.id, "real")}
              className={[
                "px-4 py-2 rounded-lg text-sm font-semibold transition select-none",
                "border shadow-sm active:scale-95",
                decision === "real"
                  ? "bg-green-600 text-white border-green-300 ring-2 ring-green-300 ring-offset-2 ring-offset-slate-950"
                  : "bg-green-500/90 text-white border-green-500 hover:bg-green-500",
              ].join(" ")}
            >
              {decision === "real" ? "✓ Safe" : "Safe"}
            </button>
          </div>

          {urlPreview?.href ? (
            <div className="text-xs bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 max-w-md">
              <div className="text-slate-400">URL preview</div>
              <div className="break-all">{urlPreview.href}</div>
            </div>
          ) : null}
        </div>
      </div>

      {allAnswered &&
        (() => {
          const s = getScore();
          return (
            <div className="border border-cyan-500/40 bg-slate-950/60 rounded-xl p-4">
              <div className="flex items-end justify-between gap-4">
                <div>
                  <div className="text-cyan-200 font-semibold">Results</div>
                  <div className="text-slate-300 text-sm">
                    You flagged {s.correct} out of {s.total} correctly
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-3xl font-extrabold text-slate-100 leading-none">
                    {s.percent}%
                  </div>
                  <div className="text-xs text-slate-400">accuracy</div>
                </div>
              </div>

              <div className="mt-3 h-2 w-full rounded-full bg-slate-800 overflow-hidden">
                <div
                  className="h-full rounded-full bg-cyan-400"
                  style={{ width: `${s.percent}%` }}
                />
              </div>

              <div className="mt-3 flex flex-wrap gap-2">
                <span className="text-xs px-2 py-1 rounded-full border border-slate-700 bg-slate-900 text-slate-200">
                  {Object.keys(userDecisions).length}/{emails.length} decisions
                </span>
              </div>
            </div>
          );
        })()}

      <div className="flex-1 min-h-0 border border-slate-800 rounded-lg overflow-hidden bg-white">
        <EmailIframeViewer
          html={email.html}
          onLinkHover={handleLinkHover}
          onLinkClick={handleLinkClick}
        />
      </div>
    </div>
  );
}
