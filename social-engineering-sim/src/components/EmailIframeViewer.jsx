import React, { useEffect, useMemo, useState } from "react";

export default function EmailIframeViewer({
  html,
  onLoad,
  onLinkHover,
  onLinkClick,
}) {
  const [loaded, setLoaded] = useState(false);

  // Reset loader when switching emails
  useEffect(() => {
    function handler(e) {
      if (e.data?.type === "EMAIL_LINK_EVENT") {
        onLinkHover?.({ href: e.data.href });
        onLinkClick?.({ href: e.data.href });
      }
    }

    window.addEventListener("message", handler);
    return () => window.removeEventListener("message", handler);
  }, [onLinkHover, onLinkClick]);

  const srcDoc = useMemo(() => {
    if (!html) return "<!doctype html><html><body></body></html>";

    const interceptScript = `
<script>
  function sendLinkInfo(e) {
    const a = e.target.closest('a');
    if (!a) return;

    const href = a.getAttribute('href') || '';

    window.parent.postMessage(
      { type: 'EMAIL_LINK_EVENT', href: href },
      '*'
    );
  }

  document.addEventListener('mouseover', function(e) {
    const a = e.target.closest('a');
    if (!a) return;
    sendLinkInfo(e);
  });

  document.addEventListener('click', function(e) {
    const a = e.target.closest('a');
    if (!a) return;
    e.preventDefault();
    e.stopPropagation();
    sendLinkInfo(e);
  }, true);
</script>
`;

    const baseTag = `<base target="_blank" />`;
    const hasHead = /<head[\\s>]/i.test(html);

    if (hasHead) {
      return html.replace(
        /<head[^>]*>/i,
        (m) => `${m}\n${baseTag}\n${interceptScript}\n`,
      );
    }

    return `<!doctype html>
<html>
<head>
<meta charset="utf-8" />
${baseTag}
${interceptScript}
</head>
<body>
${html}
</body>
</html>`;
  }, [html]);

  return (
    <div className="relative w-full h-full">
      {!loaded && <div className="absolute inset-0 animate-pulse bg-white" />}
      <iframe
        title="Email viewer"
        srcDoc={srcDoc}
        className="w-full h-full bg-white"
        sandbox="allow-scripts"
        onLoad={() => {
          setLoaded(true);
          onLoad?.();
        }}
      />
    </div>
  );
}
