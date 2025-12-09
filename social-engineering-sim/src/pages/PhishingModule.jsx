import React, { useState } from "react";
import { Link } from "react-router-dom";
import MonitorFrame from "../components/MonitorFrame";
import { useGameStore } from "../state/useGameStore";

export default function PhishingModule() {
  const [started, setStarted] = useState(false);
  const resetGame = useGameStore((state) => state.resetGame);

  const handleStart = () => {
    resetGame();
    setStarted(true);
    // optional: scroll to the simulator
    setTimeout(() => {
      const el = document.getElementById("phishing-simulator");
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }, 50);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="max-w-5xl mx-auto px-6 py-10 space-y-12">
        {/* Breadcrumb / back link */}
        <div className="text-sm text-slate-400">
          <Link to="/" className="text-cyan-400 hover:text-cyan-300">
            Home
          </Link>
          <span className="mx-1">/</span>
          <span>Phishing module</span>
        </div>

        {/* Intro section */}
        <section className="space-y-4">
          <h1 className="text-3xl font-bold text-cyan-300">
            Phishing Attacks and Credential Funnels
          </h1>
          <p className="text-slate-300">
            This module explains how attackers use phishing emails and fake
            login pages to steal credentials or deliver malware. You will first
            review the key concepts, then complete an interactive simulation
            that recreates a realistic workplace scenario.
          </p>
        </section>

        {/* Learning objectives */}
        <section className="grid md:grid-cols-3 gap-6">
          <div className="bg-slate-900/80 border border-cyan-800 rounded-lg p-4">
            <h2 className="text-sm font-semibold text-cyan-300 mb-2">
              Recognise phishing emails
            </h2>
            <p className="text-xs text-slate-300">
              Learn to spot subtle signals in email content such as urgency,
              abnormal requests, and mismatched sender details.
            </p>
          </div>
          <div className="bg-slate-900/80 border border-cyan-800 rounded-lg p-4">
            <h2 className="text-sm font-semibold text-cyan-300 mb-2">
              Identify fake login pages
            </h2>
            <p className="text-xs text-slate-300">
              Understand how attackers replicate login portals and how to verify
              URLs and security indicators before entering passwords.
            </p>
          </div>
          <div className="bg-slate-900/80 border border-cyan-800 rounded-lg p-4">
            <h2 className="text-sm font-semibold text-cyan-300 mb-2">
              Respond safely
            </h2>
            <p className="text-xs text-slate-300">
              Practice safe responses such as closing suspicious pages, deleting
              emails, and using official channels to verify activity.
            </p>
          </div>
        </section>

        {/* Explanation of scenario */}
        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-cyan-300">
            Scenario overview
          </h2>
          <p className="text-sm text-slate-300">
            You will play as an employee using a corporate inbox. During the
            scenario you will receive a mix of legitimate and malicious emails:
            a real dance competition registration, a fake Gmail security alert,
            and a suspicious Amazon receipt. Your decisions determine whether
            your account stays secure or is compromised.
          </p>
          <ul className="text-sm text-slate-300 list-disc list-inside space-y-1">
            <li>Correctly handle the legitimate dance email.</li>
            <li>Avoid entering credentials on fake login pages.</li>
            <li>
              Check order numbers and details before downloading attachments.
            </li>
          </ul>
        </section>

        {/* Call to action */}
        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-cyan-300">
            Ready to try the simulation?
          </h2>
          <p className="text-sm text-slate-300">
            When you start, a simulated terminal will appear below. Work through
            your inbox as you would in a real job. At the end you will receive a
            summary of your outcome.
          </p>

          <button
            onClick={handleStart}
            className="mt-2 px-6 py-3 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-semibold rounded"
          >
            {started ? "Restart simulation" : "Play simulation"}
          </button>
        </section>

        {/* Simulation mount point */}
        <section id="phishing-simulator" className="pt-6">
          {started && <MonitorFrame />}
          {!started && (
            <p className="text-xs text-slate-500">
              Simulation will appear here after you click Play simulation.
            </p>
          )}
        </section>
      </div>
    </div>
  );
}
