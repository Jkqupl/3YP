import React, { useState } from "react";
import { Link } from "react-router-dom";
import MonitorFrame from "../components/MonitorFrame";
import { useGameStore } from "../state/useGameStore";

export default function PhishingModule({ onComplete } = {}) {
  const [started, setStarted] = useState(Boolean(onComplete));
  const resetGame = useGameStore((state) => state.resetGame);

  const handleStart = () => {
    resetGame();
    setStarted(true);
    setTimeout(() => {
      const el = document.getElementById("phishing-simulator");
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 50);
  };

  const handleFinish = () => {
    if (onComplete) {
      onComplete();
    } else {
      resetGame();
      setStarted(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh" }}>
      <div className="top-bar" />

      <nav className="app-nav">
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
        <div className="module-badge">MODULE: PHISHING</div>
      </nav>

      <div className="page-container">
        {/* Breadcrumb */}
        <div className="breadcrumb fade-up">
          <Link to="/">~/home</Link>
          <span className="breadcrumb__sep">/</span>
          <span className="breadcrumb__current">phishing-module</span>
        </div>

        {/* HERO */}
        <section
          className="fade-up d1"
          style={{ marginBottom: "clamp(28px,4vw,48px)" }}
        >
          <div className="section-label" style={{ marginBottom: "10px" }}>
            // THREAT VECTOR 01
          </div>
          <h1
            style={{
              fontFamily: "'Rajdhani', sans-serif",
              fontSize: "clamp(1.8rem,5vw,3rem)",
              fontWeight: 700,
              color: "var(--neon)",
              margin: "0 0 16px",
              letterSpacing: "0.02em",
              textShadow: "0 0 30px rgba(34,255,224,0.2)",
              lineHeight: 1.1,
            }}
          >
            What is Phishing?
          </h1>
          <p
            style={{
              color: "var(--text)",
              fontSize: "clamp(0.9rem,2.2vw,1rem)",
              lineHeight: 1.75,
              maxWidth: "700px",
              opacity: 0.85,
              margin: 0,
            }}
          >
            Phishing is a type of cyber attack where someone pretends to be a
            trusted organisation or person in order to trick you into giving
            away sensitive information — login details, bank information, or
            one-time passcodes.
          </p>
        </section>

        <hr
          className="neon-divider fade-up d1"
          style={{ marginBottom: "clamp(28px,4vw,48px)" }}
        />

        {/* BODY */}
        <section
          className="fade-up d2"
          style={{ marginBottom: "clamp(28px,4vw,48px)" }}
        >
          <p
            style={{
              color: "var(--text)",
              fontSize: "0.95rem",
              lineHeight: 1.8,
              opacity: 0.82,
            }}
          >
            Phishing attacks often try to create a sense of urgency or
            importance. For example, an email might claim that your account will
            be locked, a payment has failed, or suspicious activity has been
            detected.
          </p>
          <p
            style={{
              color: "var(--text)",
              fontSize: "0.95rem",
              lineHeight: 1.8,
              opacity: 0.82,
              marginTop: "14px",
            }}
          >
            The goal is to pressure you into acting quickly before you have time
            to think. Most phishing attacks rely on fake links or fake login
            pages designed to look almost identical to real websites. Once you
            enter your details, the attacker can use them to access your account
            or commit fraud.
          </p>
          <p
            style={{
              color: "var(--text)",
              fontSize: "0.95rem",
              lineHeight: 1.8,
              opacity: 0.82,
              marginTop: "14px",
            }}
          >
            Phishing doesn't only happen through email. It can also occur
            through text messages, social media, phone calls, and even QR codes.
          </p>
        </section>

        {/* LEARNING OBJECTIVES */}
        <section
          className="fade-up d2"
          style={{ marginBottom: "clamp(28px,4vw,48px)" }}
        >
          <div className="section-label" style={{ marginBottom: "12px" }}>
            // LEARNING OBJECTIVES
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(230px, 1fr))",
              gap: "14px",
            }}
          >
            {[
              {
                num: "01",
                title: "Recognise phishing emails",
                body: "Spot subtle signals — urgency, weird requests, and mismatched sender details.",
              },
              {
                num: "02",
                title: "Identify fake login pages",
                body: "Verify URLs and security indicators before entering passwords on any site.",
              },
              {
                num: "03",
                title: "Respond safely",
                body: "Practice closing suspicious pages, deleting emails, and using official channels to verify activity.",
              },
            ].map((o) => (
              <div key={o.num} className="obj-card">
                <div
                  className="mono"
                  style={{
                    fontSize: "0.65rem",
                    color: "var(--neon)",
                    opacity: 0.6,
                    marginBottom: "6px",
                  }}
                >
                  {o.num}
                </div>
                <div
                  style={{
                    fontWeight: 600,
                    fontSize: "0.9rem",
                    color: "#e0f0ec",
                    marginBottom: "6px",
                    letterSpacing: "0.03em",
                  }}
                >
                  {o.title}
                </div>
                <div
                  style={{
                    fontSize: "0.82rem",
                    color: "var(--text)",
                    lineHeight: 1.6,
                    opacity: 0.75,
                  }}
                >
                  {o.body}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* WHAT TO DO */}
        <section
          className="fade-up d3"
          style={{ marginBottom: "clamp(28px,4vw,48px)" }}
        >
          <div className="section-label" style={{ marginBottom: "12px" }}>
            // DEFENSIVE POSTURE
          </div>
          <h2
            style={{
              fontFamily: "'Rajdhani', sans-serif",
              fontWeight: 700,
              fontSize: "1.2rem",
              color: "#e0f0ec",
              margin: "0 0 16px",
              letterSpacing: "0.05em",
            }}
          >
            What to do
          </h2>
          <div className="info-card">
            {[
              "Check the sender address and hover over links before clicking — mismatched domains are a major red flag.",
              "Beware of urgency or fear-based language. Legitimate organisations rarely pressure users to act instantly.",
              "Never provide passwords, full card details, or one-time passcodes through links or messages.",
              "If unsure, go directly to the organisation's official website rather than clicking any provided link.",
              "Enable multi-factor authentication and keep devices up to date to reduce risk.",
            ].map((item, i) => (
              <div key={i} className="checklist-item">
                <span className="checklist-icon">›</span>
                <span>{item}</span>
              </div>
            ))}
          </div>
        </section>

        {/* SCENARIO OVERVIEW */}
        <section
          className="fade-up d4"
          style={{ marginBottom: "clamp(28px,4vw,48px)" }}
        >
          <div className="section-label" style={{ marginBottom: "12px" }}>
            // SCENARIO OVERVIEW
          </div>
          <div className="info-card">
            <p
              style={{
                color: "var(--text)",
                fontSize: "0.92rem",
                lineHeight: 1.75,
                opacity: 0.85,
                margin: "0 0 16px",
              }}
            >
              You will receive a mix of legitimate and malicious emails —
              account confirmations, password resets, invoices, shared
              documents, and crypto wallet alerts. Your task is to decide
              whether each email is safe or a phishing attempt.
            </p>
            {[
              "Inspect links by clicking them to reveal the full destination URL.",
              "Check sender addresses for unusual spellings, mismatched domains, or odd formatting.",
              "Look for pressure tactics, inconsistencies, and grammar or formatting mistakes.",
            ].map((item, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  gap: "10px",
                  alignItems: "flex-start",
                }}
              >
                <span
                  className="mono"
                  style={{
                    color: "var(--neon)",
                    fontSize: "0.7rem",
                    marginTop: "3px",
                    opacity: 0.7,
                  }}
                >
                  ▸
                </span>
                <span
                  style={{
                    color: "var(--text)",
                    fontSize: "0.88rem",
                    lineHeight: 1.6,
                    opacity: 0.8,
                  }}
                >
                  {item}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section
          className="fade-up d5"
          style={{ marginBottom: "clamp(28px,4vw,48px)" }}
        >
          <div className="section-label" style={{ marginBottom: "12px" }}>
            // INITIATE SIMULATION
          </div>
          <div className="info-card" style={{ background: "var(--surface2)" }}>
            <p
              style={{
                color: "var(--text)",
                fontSize: "0.92rem",
                lineHeight: 1.7,
                opacity: 0.85,
                margin: "0 0 20px",
              }}
            >
              When you start, a simulated terminal will appear below. Work
              through your inbox as you would in a real job. At the end you will
              receive a summary of your outcome.
            </p>
            <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
              <button onClick={handleStart} className="btn-primary">
                {started ? "▶ RESTART SIMULATION" : "▶ PLAY SIMULATION"}
              </button>
              {started && (
                <button className="btn-exit" onClick={handleFinish}>
                  {onComplete ? "✓ FINISH" : "✕ RESET"}
                </button>
              )}
            </div>
          </div>
        </section>

        {/* SIMULATOR */}
        <section id="phishing-simulator" className="fade-up d6">
          {started ? (
            <div className="terminal-chrome">
              <div className="terminal-chrome__bar">
                <span
                  className="terminal-dot"
                  style={{ background: "var(--red)" }}
                />
                <span
                  className="terminal-dot"
                  style={{ background: "var(--amber)" }}
                />
                <span
                  className="terminal-dot"
                  style={{ background: "var(--neon)" }}
                />
                <span className="terminal-chrome__title">
                  phishing-sim — inbox
                </span>
              </div>
              <MonitorFrame />
            </div>
          ) : (
            <div
              className="mono"
              style={{
                color: "var(--text-dim)",
                fontSize: "0.7rem",
                padding: "20px",
                textAlign: "center",
                opacity: 0.5,
              }}
            >
              [ simulation will appear here after you click PLAY SIMULATION ]
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
