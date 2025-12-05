import React, { useState } from "react";
import PhaserContainer from "../game/PhaserContainer";
import PhishingScene from "../game/scenes/phishing/PhishingScene";

export default function PhishingModule() {
  const [play, setPlay] = useState(false);

  return (
    <div className="max-w-4xl mx-auto px-6 py-12 space-y-10">
      <h1 className="text-3xl font-bold">Phishing Attack</h1>

      <div className="space-y-4">
        <p>
          Phishing attacks attempt to trick individuals into revealing sensitive
          information through imitation of legitimate services, urgency and
          emotional manipulation.
        </p>

        <ul className="list-disc pl-6 text-slate-300">
          <li>Suspicious email domains</li>
          <li>Urgent language and threats</li>
          <li>Fake login portals</li>
        </ul>

        <p>
          Always verify the source and never submit credentials through
          untrusted links.
        </p>
      </div>

      <button
        onClick={() => setPlay(true)}
        className="px-6 py-3 bg-blue-600 rounded-lg hover:bg-blue-700 transition"
      >
        Start Simulation
      </button>

      {play && (
        <div className="w-[960px] h-[540px] border border-slate-700 rounded-lg overflow-hidden">
          <PhaserContainer scene={PhishingScene} />
        </div>
      )}
    </div>
  );
}
