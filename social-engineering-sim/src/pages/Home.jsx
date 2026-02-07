import React from "react";
import { Link } from "react-router-dom";
import ModuleCard from "../components/ModuleCard";
import { modules } from "../data/modules";

export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 px-4 py-10">
      <div
        className="
          w-full max-w-5xl mx-auto
          border border-cyan-500/80
          bg-slate-900/90
          shadow-xl
          rounded-xl
          p-8 sm:p-10
          space-y-12
        "
      >
        <header className="text-center space-y-5">
          <p className="text-sm tracking-widest text-cyan-300/80">
            SOCIAL ENGINEERING EDUCATION
          </p>

          <h1 className="text-4xl sm:text-5xl font-bold text-cyan-300">
            Social Engineering Simulator
          </h1>

          <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
            An interactive learning platform exploring real-world social
            engineering through guided scenarios and hands-on decision-making.
            Build intuition for how attacks work, and how to respond safely in
            everyday situations.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <Link
              to={modules?.[0]?.route ?? "/"}
              className="
                inline-flex items-center justify-center
                px-5 py-2.5 rounded-lg
                bg-cyan-500/15 text-cyan-200
                border border-cyan-400/60
                hover:bg-cyan-500/20
                transition
              "
            >
              Start a module
            </Link>

            <a
              href="#about"
              className="
                inline-flex items-center justify-center
                px-5 py-2.5 rounded-lg
                bg-slate-950/40 text-slate-200
                border border-slate-700
                hover:bg-slate-950/60
                transition
              "
            >
              What you will practise
            </a>
          </div>
        </header>

        <section id="about" className="grid md:grid-cols-3 gap-4">
          {[
            {
              title: "Recognise",
              body: "Spot manipulation patterns, pressure tactics, and credibility cues across different scenarios.",
            },
            {
              title: "Respond",
              body: "Make choices under uncertainty and learn safer habits that reduce risk.",
            },
            {
              title: "Reflect",
              body: "Get clear feedback on outcomes and what signals mattered most.",
            },
          ].map((x) => (
            <div
              key={x.title}
              className="
                rounded-xl border border-slate-800
                bg-slate-950/40
                p-4
              "
            >
              <div className="text-cyan-200 font-semibold">{x.title}</div>
              <div className="text-slate-300 text-sm mt-1 leading-relaxed">
                {x.body}
              </div>
            </div>
          ))}
        </section>

        <section className="space-y-4">
          <div className="flex items-end justify-between gap-4 flex-wrap">
            <div>
              <h2 className="text-xl font-semibold text-slate-100">Modules</h2>
              <p className="text-sm text-slate-400">
                Choose a scenario to begin. Each module focuses on a different
                style of social engineering.
              </p>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-10">
            {modules.map((module) => (
              <ModuleCard
                key={module.route}
                title={module.title}
                description={module.description}
                link={module.route}
              />
            ))}
          </div>
        </section>

        <footer className="text-center text-xs text-slate-500 pt-2">
          Educational simulator only. No real messages are sent.
        </footer>
      </div>
    </div>
  );
}
