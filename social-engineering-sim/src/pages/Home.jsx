import React from "react";
import { Link } from "react-router-dom";
import ModuleCard from "../components/ModuleCard";

export default function Home() {
  return (
    <div className="max-w-6xl mx-auto px-6 py-16 space-y-16">
      <section className="text-center space-y-6">
        <h1 className="text-4xl font-bold">Social Engineering Simulator</h1>
        <p className="text-lg text-slate-300">
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
  );
}
