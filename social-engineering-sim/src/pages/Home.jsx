import React from "react";
import { Link } from "react-router-dom";
import ModuleCard from "../components/ModuleCard";

export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950">
      <div
        className="
          w-full max-w-5xl mx-auto 
          border border-cyan-500 
          bg-slate-900/90 
          shadow-xl 
          rounded-xl 
          p-10 
          space-y-16
        "
      >
        <section className="text-center space-y-6">
          <h1 className="text-4xl font-bold text-cyan-300">
            Social Engineering Simulator
          </h1>

          <p className="text-lg text-slate-300 max-w-2xl mx-auto">
            An interactive learning platform exploring real world social
            engineering attacks through guided explanations and immersive
            simulations.
          </p>
        </section>

        <section className="grid md:grid-cols-3 gap-10">
          <ModuleCard
            title="Phishing Attacks"
            description="Identify malicious emails and deceptive login pages"
            link="/module/phishing"
          />
        </section>
      </div>
    </div>
  );
}
