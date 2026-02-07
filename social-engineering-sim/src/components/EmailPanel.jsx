import React, { useState } from "react";
import { useGameStore } from "../state/useGameStore";
import EmailIframeViewer from "./EmailIframeViewer";

export default function EmailPanel() {
  const emails = useGameStore((s) => s.emails);
  const currentEmailId = useGameStore((s) => s.currentEmailId);

  const [urlPreview, setUrlPreview] = useState(null);

  const email = emails.find((e) => e.id === currentEmailId);

  if (!email) {
    return (
      <div className="h-full flex items-center justify-center text-slate-400">
        Select an email
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col gap-3 p-4">
      <div className="flex items-start justify-between gap-4">
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

        {urlPreview?.href ? (
          <div className="text-xs bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 max-w-md">
            <div className="text-slate-400">URL preview</div>
            <div className="break-all">{urlPreview.href}</div>
          </div>
        ) : null}
      </div>

      <div className="flex-1 min-h-0 border border-slate-800 rounded-lg overflow-hidden bg-white">
        <EmailIframeViewer
          html={email.html}
          onLinkHover={(info) => setUrlPreview(info)}
          onLinkClick={(info) => setUrlPreview(info)}
        />
      </div>
    </div>
  );
}
