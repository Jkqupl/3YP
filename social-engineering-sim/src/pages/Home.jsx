import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ModuleCard from "../components/ModuleCard";
import { modules } from "../data/modules";

function TerminalCursor() {
  const [visible, setVisible] = useState(true);
  useEffect(() => {
    const t = setInterval(() => setVisible((v) => !v), 530);
    return () => clearInterval(t);
  }, []);
  return (
    <span
      style={{
        display: "inline-block",
        width: "0.55em",
        height: "1.1em",
        background: visible ? "var(--neon)" : "transparent",
        verticalAlign: "text-bottom",
        marginLeft: "2px",
        borderRadius: "1px",
      }}
    />
  );
}

export default function Home() {
  return (
    <>
      <div aria-hidden="true" className="scanlines" />

      <div style={{ minHeight: "100vh", position: "relative" }}>
        <div className="top-bar" />

        <nav className="app-nav fade-up">
          <span
            className="mono"
            style={{
              color: "var(--neon)",
              fontSize: "0.75rem",
              letterSpacing: "0.12em",
            }}
          >
            <span style={{ opacity: 0.5 }}>~/</span>SE-SIM
          </span>
          <div className="threat-badge">TRAINING ENV</div>
        </nav>

        <div className="home-container">
          {/* HERO */}
          <section
            className="fade-up d1"
            style={{
              textAlign: "center",
              paddingBottom: "clamp(32px,5vw,64px)",
            }}
          >
            <div className="section-label" style={{ marginBottom: "16px" }}>
              // SOCIAL ENGINEERING EDUCATION PLATFORM
            </div>

            <h1
              className="glitch-text"
              data-text="Social Engineering Simulator"
              style={{
                fontFamily: "'Rajdhani', sans-serif",
                fontSize: "clamp(2rem, 6vw, 4rem)",
                fontWeight: 700,
                color: "var(--neon)",
                letterSpacing: "0.02em",
                lineHeight: 1.1,
                margin: "0 0 20px",
                textShadow: "0 0 30px rgba(34,255,224,0.25)",
              }}
            >
              Social Engineering Simulator
              <TerminalCursor />
            </h1>

            <p
              style={{
                maxWidth: "600px",
                margin: "0 auto 28px",
                color: "var(--text)",
                fontSize: "clamp(0.95rem, 2.5vw, 1.1rem)",
                lineHeight: 1.65,
                opacity: 0.85,
              }}
            >
              An interactive learning platform exploring real-world social
              engineering through guided scenarios and hands-on decision-making.
              Build intuition for how attacks work — and how to respond safely.
            </p>

            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "12px",
                justifyContent: "center",
              }}
            >
              <Link
                to={modules?.[0]?.route ?? "/"}
                className="btn-primary"
                style={{ fontSize: "0.8rem", letterSpacing: "0.12em" }}
              >
                ▶ START MODULE
              </Link>
              <a href="#about" className="btn-ghost">
                WHAT YOU'LL PRACTISE
              </a>
            </div>
          </section>

          <hr
            className="neon-divider fade-up d2"
            style={{ marginBottom: "clamp(32px,5vw,56px)" }}
          />

          {/* SKILLS STRIP */}
          <section
            id="about"
            className="fade-up d2"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
              gap: "16px",
              marginBottom: "clamp(32px,5vw,64px)",
            }}
          >
            {[
              {
                icon: "◈",
                title: "Recognise",
                body: "Spot manipulation patterns, pressure tactics, and credibility cues across different scenarios.",
              },
              {
                icon: "◉",
                title: "Respond",
                body: "Make choices under uncertainty and learn safer habits that reduce risk in real situations.",
              },
              {
                icon: "◎",
                title: "Reflect",
                body: "Get clear feedback on outcomes and understand which signals mattered most.",
              },
            ].map((x) => (
              <div key={x.title} className="skill-card">
                <div
                  className="mono"
                  style={{
                    color: "var(--neon)",
                    fontSize: "1.4rem",
                    marginBottom: "8px",
                    opacity: 0.8,
                  }}
                >
                  {x.icon}
                </div>
                <div
                  style={{
                    fontFamily: "'Rajdhani', sans-serif",
                    fontWeight: 700,
                    fontSize: "1rem",
                    color: "#e8f4f0",
                    letterSpacing: "0.08em",
                    marginBottom: "6px",
                    textTransform: "uppercase",
                  }}
                >
                  {x.title}
                </div>
                <div
                  style={{
                    color: "var(--text)",
                    fontSize: "0.88rem",
                    lineHeight: 1.6,
                    opacity: 0.75,
                  }}
                >
                  {x.body}
                </div>
              </div>
            ))}
          </section>

          {/* MODULES */}
          <section className="fade-up d3">
            <div
              style={{
                display: "flex",
                alignItems: "flex-end",
                justifyContent: "space-between",
                flexWrap: "wrap",
                gap: "8px",
                marginBottom: "20px",
              }}
            >
              <div>
                <div className="section-label" style={{ marginBottom: "4px" }}>
                  // AVAILABLE MODULES
                </div>
                <h2
                  style={{
                    fontFamily: "'Rajdhani', sans-serif",
                    fontSize: "clamp(1.1rem,2.5vw,1.4rem)",
                    fontWeight: 700,
                    color: "#e8f4f0",
                    margin: 0,
                    letterSpacing: "0.05em",
                  }}
                >
                  Choose a scenario to begin
                </h2>
              </div>
              <div
                className="mono"
                style={{ color: "var(--text-dim)", fontSize: "0.7rem" }}
              >
                {modules.length} MODULE{modules.length !== 1 ? "S" : ""}{" "}
                AVAILABLE
              </div>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
                gap: "clamp(12px,2.5vw,20px)",
              }}
            >
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

          {/* FOOTER */}
          <footer className="page-footer fade-up d4">
            <div className="page-footer__text">
              © SE-SIM — FOR EDUCATIONAL USE ONLY
            </div>
            <div className="page-footer__text">
              session active<span className="session-dot">●</span>
            </div>
          </footer>
        </div>
      </div>
    </>
  );
}
