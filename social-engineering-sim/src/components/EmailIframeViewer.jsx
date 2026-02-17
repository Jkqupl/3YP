import React, { useEffect, useMemo, useRef, useState } from "react";

export default function EmailIframeViewer({
  html,
  onLoad,
  onLinkHover,
  onLinkClick,

  // new props
  desktopWidth = 760,
  initialFit = true, // fit-to-width on first load
}) {
  const [loaded, setLoaded] = useState(false);

  const viewportRef = useRef(null);
  const iframeRef = useRef(null);

  // transform state
  const [scale, setScale] = useState(1);
  const [tx, setTx] = useState(0);
  const [ty, setTy] = useState(0);

  // pointer state for pan + pinch
  const pointers = useRef(new Map());
  const lastPinch = useRef(null);
  const lastPan = useRef(null);

  const scaleRef = useRef(1);
  const txRef = useRef(0);
  const tyRef = useRef(0);
  const contentHRef = useRef(1400); // default, update later if you want

  // Reset loader when switching emails
  useEffect(() => {
    setLoaded(false);
  }, [html]);

  useEffect(() => {
    function handler(e) {
      if (e.data?.type === "EMAIL_LINK_HOVER") {
        onLinkHover?.({ href: e.data.href });
      }
      if (e.data?.type === "EMAIL_LINK_CLICK") {
        onLinkClick?.({ href: e.data.href });
      }
      if (
        e.data?.type === "EMAIL_HEIGHT" &&
        typeof e.data.height === "number"
      ) {
        contentHRef.current = Math.max(600, e.data.height);
        // After height update, re-clamp current position so bounds are correct
        const { tx: nextTx, ty: nextTy } = clampTransform(
          txRef.current,
          tyRef.current,
          scaleRef.current,
        );
        setTransform(nextTx, nextTy, scaleRef.current);
      }
    }

    window.addEventListener("message", handler);
    return () => window.removeEventListener("message", handler);
  }, [onLinkHover, onLinkClick]);

  // window.addEventListener("click", (e) => {
  //   const a = e.target.closest("a");
  //   if (!a) return;

  //   e.preventDefault();
  //   onLinkClick({ href: a.href });
  // });

  const srcDoc = useMemo(() => {
    if (!html) return "<!doctype html><html><body></body></html>";

    const desktopCss = `
<style>
  html, body { margin: 0; padding: 0; background: #ffffff; }
  #email-root {
    width: ${desktopWidth}px;
    margin: 0 auto;
    background: #ffffff;
    overflow-x: hidden;
  }
    table[width="600"] {
  margin: 0 auto !important;
}

  /* Prevent common table-based overflow */
  table { max-width: 100% !important; }
  img { max-width: 100% !important; height: auto !important; }
  td, th { max-width: 100% !important; }
</style>
`;

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

  function postHeight() {
    var h = Math.max(
      document.body.scrollHeight,
      document.documentElement.scrollHeight
    );
    window.parent.postMessage({ type: 'EMAIL_HEIGHT', height: h }, '*');
  }

  window.addEventListener('load', postHeight);
  setTimeout(postHeight, 50);
  setTimeout(postHeight, 300);
</script>
`;

    const baseTag = `<base target="_blank" />`;
    const wrappedBody = `<div id="email-root">${html}</div>`;

    const hasHead = /<head[\s>]/i.test(html);
    const hasBody = /<body[\s>]/i.test(html);

    if (hasHead) {
      let out = html.replace(
        /<head[^>]*>/i,
        (m) =>
          `${m}\n<meta charset="utf-8" />\n${baseTag}\n${desktopCss}\n${interceptScript}\n`,
      );

      if (hasBody) {
        out = out.replace(/<body[^>]*>/i, (m) => `${m}\n<div id="email-root">`);
        out = out.replace(/<\/body>/i, `</div>\n</body>`);
        return out;
      }

      return out;
    }

    return `<!doctype html>
<html>
<head>
<meta charset="utf-8" />
${baseTag}
${desktopCss}
${interceptScript}
</head>
<body>
${wrappedBody}
</body>
</html>`;
  }, [html, desktopWidth]);

  function clamp(v, min, max) {
    return Math.max(min, Math.min(max, v));
  }

  function buildEmailDoc(html) {
    return `
  <html>
  <head>
    <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1">
    <style>
     body{
  margin:0;
  background:#eef1f4;
  font-family: Arial, Helvetica, sans-serif;
  padding:24px 12px; /* simulate inbox reading area */
}

/* email container */
body > *{
  max-width:600px;
  margin:0 auto;
  box-shadow:0 2px 8px rgba(0,0,0,0.08);
}


      img{max-width:100%!important;height:auto!important}
      table{max-width:100%!important}
      a,button{min-height:44px}

    </style>

    <script>
function findLink(el){
  while(el && el !== document){
    if(el.tagName === 'A') return el;
    el = el.parentNode;
  }
  return null;
}

function send(type, href){
  window.parent.postMessage({type, href}, '*');
}

document.addEventListener('pointerdown', e=>{
  const a = findLink(e.target);
  if(!a) return;

  e.preventDefault();
  e.stopImmediatePropagation();

  const href = a.getAttribute('href') || '';
  send('EMAIL_LINK_CLICK', href);
}, true);

/* hover preview */
document.addEventListener('mouseover', e=>{
  const a = findLink(e.target);
  if(!a) return;
  send('EMAIL_LINK_HOVER', a.getAttribute('href') || '');
}, true);

/* block ALL navigation attempts */
document.addEventListener('click', e=>{
  if(findLink(e.target)) e.preventDefault();
}, true);
</script>

  </head>
  <body>${html}</body>
  </html>`;
  }

  function getBounds(nextScale = scaleRef.current) {
    const vp = viewportRef.current;
    if (!vp) return { minTx: 0, maxTx: 0, minTy: 0, maxTy: 0 };

    const vpW = vp.clientWidth;
    const vpH = vp.clientHeight;

    const contentW = desktopWidth * nextScale;
    const contentH = contentHRef.current * nextScale;

    // If content smaller than viewport, allow centring
    const maxTx = contentW <= vpW ? (vpW - contentW) / 2 : 0;
    const minTx = contentW <= vpW ? maxTx : vpW - contentW;

    const maxTy = contentH <= vpH ? (vpH - contentH) / 2 : 0;
    const minTy = contentH <= vpH ? maxTy : vpH - contentH;

    return { minTx, maxTx, minTy, maxTy };
  }

  function clampTransform(nextTx, nextTy, nextScale = scaleRef.current) {
    const { minTx, maxTx, minTy, maxTy } = getBounds(nextScale);
    return {
      tx: clamp(nextTx, minTx, maxTx),
      ty: clamp(nextTy, minTy, maxTy),
    };
  }

  function fitToWidth() {
    const vp = viewportRef.current;
    if (!vp) return;

    const vpW = vp.clientWidth;
    const nextScale = clamp(vpW / desktopWidth, 0.35, 2.5);

    // Centre X when fitted
    const contentW = desktopWidth * nextScale;
    const nextTx = contentW <= vpW ? (vpW - contentW) / 2 : 0;

    const { tx: clampedTx, ty: clampedTy } = clampTransform(
      nextTx,
      0,
      nextScale,
    );
    setTransform(clampedTx, clampedTy, nextScale);
  }

  function setTransform(nextTx, nextTy, nextScale) {
    txRef.current = nextTx;
    tyRef.current = nextTy;
    scaleRef.current = nextScale;
    setTx(nextTx);
    setTy(nextTy);
    setScale(nextScale);
  }

  // Fit on first load or when viewport changes size
  useEffect(() => {
    if (!initialFit) return;

    const vp = viewportRef.current;
    if (!vp) return;

    const ro = new ResizeObserver(() => {
      // only refit if user has not interacted much
      // simple rule: if tx/ty are still near zero, refit
      if (Math.abs(tx) < 2 && Math.abs(ty) < 2) fitToWidth();
    });

    ro.observe(vp);
    return () => ro.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialFit, desktopWidth]);

  function onPointerDown(e) {
    // capture so we keep getting move events
    e.currentTarget.setPointerCapture(e.pointerId);
    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });

    if (pointers.current.size === 1) {
      lastPan.current = {
        x: e.clientX,
        y: e.clientY,
        tx: txRef.current,
        ty: tyRef.current,
      };
    }

    if (pointers.current.size === 2) {
      const pts = Array.from(pointers.current.values());
      const dx = pts[0].x - pts[1].x;
      const dy = pts[0].y - pts[1].y;
      lastPinch.current = { dist: Math.hypot(dx, dy), scale: scaleRef.current };
    }
  }

  function onPointerMove(e) {
    if (!pointers.current.has(e.pointerId)) return;
    e.preventDefault();

    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });

    // pinch zoom
    if (pointers.current.size === 2 && lastPinch.current) {
      const pts = Array.from(pointers.current.values());
      const dx = pts[0].x - pts[1].x;
      const dy = pts[0].y - pts[1].y;
      const dist = Math.hypot(dx, dy);

      const ratio = dist / lastPinch.current.dist;
      const nextScale = clamp(lastPinch.current.scale * ratio, 0.35, 2.5);

      // Keep current translation but clamp to new bounds
      const { tx: nextTx, ty: nextTy } = clampTransform(
        txRef.current,
        tyRef.current,
        nextScale,
      );
      setTransform(nextTx, nextTy, nextScale);
      return;
    }

    // pan
    if (pointers.current.size === 1 && lastPan.current) {
      const dx = e.clientX - lastPan.current.x;
      const dy = e.clientY - lastPan.current.y;

      const rawTx = lastPan.current.tx + dx;
      const rawTy = lastPan.current.ty + dy;

      const { tx: nextTx, ty: nextTy } = clampTransform(rawTx, rawTy);
      setTransform(nextTx, nextTy, scaleRef.current);
    }
  }

  function onPointerUp(e) {
    pointers.current.delete(e.pointerId);
    if (pointers.current.size < 2) lastPinch.current = null;
    if (pointers.current.size === 0) lastPan.current = null;
  }

  function resetView() {
    lastPan.current = null;
    lastPinch.current = null;
    pointers.current.clear();
    fitToWidth();
  }

  return (
    <div className="relative w-full h-full bg-slate-100">
      {!loaded && <div className="absolute inset-0 animate-pulse bg-white" />}

      <iframe
        ref={iframeRef}
        className="w-full h-full border-0"
        srcDoc={buildEmailDoc(html)}
        onLoad={() => setLoaded(true)}
        sandbox="allow-scripts"
        style={{
          overflowY: "auto",
          WebkitOverflowScrolling: "touch",
          background: "#f3f4f6",
        }}
      />
    </div>
  );
}
