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
      if (e.data?.type === "EMAIL_LINK_HOVER") {
        onLinkHover?.({ href: e.data.href });
      }
      if (e.data?.type === "EMAIL_LINK_CLICK") {
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
  function findLink(target) {
    return target && target.closest ? target.closest('a') : null;
  }

  function post(type, href) {
    window.parent.postMessage({ type, href }, '*');
  }

  document.addEventListener('mouseover', function(e) {
    const a = findLink(e.target);
    if (!a) return;
    const href = a.getAttribute('href') || '';
    post('EMAIL_LINK_HOVER', href);
  }, true);

  document.addEventListener('click', function(e) {
    const a = findLink(e.target);
    if (!a) return;
    e.preventDefault();
    e.stopPropagation();
    const href = a.getAttribute('href') || '';
    post('EMAIL_LINK_CLICK', href);
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
