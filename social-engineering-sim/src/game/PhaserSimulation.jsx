import React, { useEffect, useRef } from "react";
import Phaser from "phaser";
import { GmailSimScene } from "./scenes/phishing/GmailSimScene";
import { AmazonSimScene } from "./scenes/phishing/AmazonSimScene";
import { DanceSimScene } from "./scenes/phishing/DanceSimScene";

export default function PhaserSimulation({ mode }) {
  const containerRef = useRef(null);
  const gameRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    const width = container.clientWidth;
    const height = container.clientHeight;

    const config = {
      type: Phaser.AUTO,
      scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        parent: container,
        width: 640,
        height: 360,
      },
      backgroundColor: "#0f172a", // slate-900 to match your UI
      scene: [],
    };

    if (mode === "gmail") config.scene = [GmailSimScene];
    if (mode === "amazon") config.scene = [AmazonSimScene];
    if (mode === "dance") config.scene = [DanceSimScene];

    const game = new Phaser.Game(config);
    gameRef.current = game;

    // Resize listener
    const resizeObserver = new ResizeObserver(() => {
      if (game.scale) {
        game.scale.resize(container.clientWidth, container.clientHeight);
      }
    });

    resizeObserver.observe(container);

    return () => {
      resizeObserver.disconnect();
      game.destroy(true);
      gameRef.current = null;
    };
  }, [mode]);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 overflow-hidden rounded-lg bg-slate-900"
    />
  );
}
