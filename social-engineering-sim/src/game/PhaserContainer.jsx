import React from "react";
import { useEffect, useRef } from "react";
import Phaser from "phaser";
import baseConfig from "./config/phaserConfig";
import IntroScene from "./scenes/phishing/IntroScene";
import InboxScene from "./scenes/phishing/InboxScene";
import EmailScene from "./scenes/phishing/EmailScene";
import FakeGmailScene from "./scenes/phishing/FakeGmailScene";
import FakeAmazonScene from "./scenes/phishing/FakeAmazonScene";
import DanceSiteScene from "./scenes/phishing/DanceSiteScene";
import EndingFailScene from "./scenes/phishing/EndingFailScene";

export default function PhaserContainer({ scene }) {
  const gameRef = useRef(null);

  useEffect(() => {
    const config = {
      ...baseConfig,
      parent: "phaser-root",
      scene: [
        IntroScene,
        InboxScene,
        EmailScene,
        FakeGmailScene,
        FakeAmazonScene,
        DanceSiteScene,
        EndingFailScene,
      ],
    };

    gameRef.current = new Phaser.Game(config);

    return () => {
      if (gameRef.current) {
        gameRef.current.destroy(true);
      }
    };
  }, [scene]);

  return <div id="phaser-root" className="w-full h-full" />;
}
