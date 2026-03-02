import React, { useEffect, useRef } from "react";
import Phaser from "phaser";
import TailgatingScene from "./scenes/tailgating/TailgatingScene";

export default function TailgatingSimulation() {
  const containerRef = useRef(null);
  const gameRef = useRef(null);

  useEffect(() => {
    let rafId;
    let ro;

    function bootPhaser() {
      const el = containerRef.current;
      if (!el) return;

      const w = el.clientWidth;
      const h = el.clientHeight;

      // Retry next frame if the container hasn't been sized yet
      if (w === 0 || h === 0) {
        rafId = requestAnimationFrame(bootPhaser);
        return;
      }

      const config = {
        type: Phaser.AUTO,
        parent: el,
        width: w,
        height: h,
        backgroundColor: "#0b0f14",
        physics: {
          default: "arcade",
          arcade: { debug: false },
        },
        scene: [TailgatingScene],
        scale: {
          mode: Phaser.Scale.RESIZE,
          autoCenter: Phaser.Scale.CENTER_BOTH,
        },
      };

      gameRef.current = new Phaser.Game(config);

      // Keep Phaser in sync when the container is resized
      ro = new ResizeObserver(() => {
        const cw = containerRef.current?.clientWidth;
        const ch = containerRef.current?.clientHeight;
        if (cw && ch) {
          gameRef.current?.scale.resize(cw, ch);
        }
      });
      ro.observe(el);
    }

    // One rAF so the browser has painted the fixed-position container
    // and resolved its pixel dimensions before Phaser reads them
    rafId = requestAnimationFrame(bootPhaser);

    return () => {
      cancelAnimationFrame(rafId);
      ro?.disconnect();
      gameRef.current?.destroy(true);
      gameRef.current = null;
    };
  }, []);

  /*
    The parent div is position:fixed with an explicit calc() height.
    This div fills it 100% — no percentage ambiguity.
  */
  return (
    <div
      ref={containerRef}
      style={{ width: "100%", height: "100%", display: "block" }}
    />
  );
}
