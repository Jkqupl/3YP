import React, { useEffect, useMemo, useState } from "react";

export default function EmailIframeViewer({ html, onLoad }) {
  const [loaded, setLoaded] = useState(false);

  // Reset loader when switching emails
  useEffect(() => {
    setLoaded(false);
  }, [html]);

  const srcDoc = useMemo(() => {
    if (!html) return "<!doctype html><html><body></body></html>";

    const interceptScript = `
<script>
  document.addEventListener("click", function (e) {
    e.preventDefault();
    e.stopPropagation();
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
