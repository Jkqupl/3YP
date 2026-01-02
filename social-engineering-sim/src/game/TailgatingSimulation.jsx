import React, { useEffect, useRef } from "react";
import Phaser from "phaser";
import TailgatingScene from "./scenes/tailgating/TailgatingScene";

export default function TailgatingSimulation() {
  const containerRef = useRef(null);
  const gameRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const config = {
      type: Phaser.AUTO,
      parent: containerRef.current,
      width: containerRef.current.clientWidth,
      height: containerRef.current.clientHeight,
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

    const ro = new ResizeObserver(() => {
      const w = containerRef.current?.clientWidth ?? 800;
      const h = containerRef.current?.clientHeight ?? 600;
      gameRef.current?.scale.resize(w, h);
    });

    ro.observe(containerRef.current);

    return () => {
      ro.disconnect();
      gameRef.current?.destroy(true);
      gameRef.current = null;
    };
  }, []);

  return <div ref={containerRef} className="w-full h-full" />;
}
