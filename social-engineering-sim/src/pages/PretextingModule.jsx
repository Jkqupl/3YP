import React, { useState } from "react";
import { Link } from "react-router-dom";
import PretextingBuilder from "../components/pretexting/PretextingBuilder";
import { usePretextingStore } from "../state/usePretextingStore";
import { useSurveyStore } from "../state/useSurveyStore";

export default function PretextingModule({ onComplete } = {}) {
  const [started, setStarted] = useState(false);
  const computeEnding = usePretextingStore((s) => s.computeEnding);

  const onStart = () => {
    usePretextingStore.getState().resetGame();
    setStarted(true);
  };
  const onExit = () => {
    if (onComplete) {
      const s = usePretextingStore.getState();
      useSurveyStore.getState().snapshotMetrics({
        ending: s.computeEnding(),
        secureRounds: s.stats.secureRounds,
        correctVerification: s.stats.correctVerification,
        totalRounds: s.totalRounds,
      });
    }
    usePretextingStore.getState().resetGame();
    if (onComplete) {
      onComplete();
    } else {
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
        <div className="module-badge">MODULE: PRETEXTING</div>
      </nav>

      {!started ? (
        <div className="page-container">
          {/* Breadcrumb */}
          <div className="breadcrumb fade-up">
            <Link to="/">~/home</Link>
            <span className="breadcrumb__sep">/</span>
            <span className="breadcrumb__current">pretexting-module</span>
          </div>

          {/* HERO */}
          <section
            className="fade-up d1"
            style={{ marginBottom: "clamp(28px,4vw,48px)" }}
          >
            <div className="section-label" style={{ marginBottom: "10px" }}>
              // THREAT VECTOR 02
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
              Pretexting
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
              Pretexting is a type of cyber attack where someone invents a fake
              story or role in order to trick you into giving them sensitive
              information — login details, personal data, security answers, or
              physical access.
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
              Unlike phishing, which often relies on emails and fake websites,
              pretexting usually involves direct interaction — phone calls,
              messages, or face-to-face conversations. Attackers often sound
              confident and prepared, and may already know basic information
              about you or your organisation, which helps make the story feel
              real.
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
              By building trust first, they lower your guard before making their
              request. Pretexting works because it targets human behaviour
              rather than technology — it relies on trust, authority, and the
              natural instinct to be helpful.
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
                  title: "Understand what pretexting is",
                  body: "Learn how attackers use believable stories to get information or access without hacking anything.",
                },
                {
                  num: "02",
                  title: "Spot common scenarios",
                  body: "Recognise roles like IT support, delivery, HR, and contractors — and the red flags that come with them.",
                },
                {
                  num: "03",
                  title: "Respond safely",
                  body: "Practice simple verification steps that stop most attempts without getting dragged into the story.",
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
                "Stop and think before giving sensitive information to anyone, even if their story sounds convincing.",
                "Never share passwords, one-time passcodes, or personal info just because someone asks.",
                "Use a trusted method to verify the request — official contact details, not anything they give you.",
                "Check with a colleague or supervisor if you're unsure about an unusual request.",
                "Report suspicious calls or messages to Action Fraud so patterns can be identified.",
              ].map((item, i) => (
                <div key={i} className="checklist-item">
                  <span className="checklist-icon">›</span>
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </section>

          {/* SIMULATION BRIEF */}
          <section
            className="fade-up d4"
            style={{ marginBottom: "clamp(28px,4vw,48px)" }}
          >
            <div className="section-label" style={{ marginBottom: "12px" }}>
              // SIMULATION BRIEF
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
                To help you understand what makes pretexting effective, you'll
                try to be an attacker and build your own pretexts. In each round
                you will:
              </p>
              {[
                "Build a realistic pretext scenario",
                "Apply pressure using authority or urgency",
                "Learn why each decision succeeds or fails",
                "Choose the safest response",
              ].map((item, i, arr) => (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    gap: "10px",
                    alignItems: "flex-start",
                    padding: "7px 0",
                    borderBottom:
                      i < arr.length - 1
                        ? "1px solid rgba(34,255,224,0.06)"
                        : "none",
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
            <div className="warning-banner" style={{ marginBottom: "20px" }}>
              <span
                className="mono"
                style={{
                  color: "rgba(255,64,64,0.8)",
                  fontSize: "0.75rem",
                  marginTop: "2px",
                }}
              >
                ⚠
              </span>
              <span
                style={{
                  color: "rgba(255,64,64,0.75)",
                  fontSize: "0.85rem",
                  lineHeight: 1.5,
                }}
              >
                Training exercise only. In real life, pretexting is illegal and
                unethical.
              </span>
            </div>
            <button onClick={onStart} className="btn-primary">
              ▶ START SIMULATION
            </button>
            <div
              className="mono"
              style={{
                color: "var(--text-dim)",
                fontSize: "0.68rem",
                marginTop: "10px",
                letterSpacing: "0.06em",
              }}
            >
              5 SHORT SCENARIOS · INSTANT FEEDBACK ON EACH
            </div>
          </section>

          {/* Sources */}
          <div className="sources fade-up d5">
            <div className="sources__label">// SOURCES</div>
            <div>UK NCSC: Social engineering guidance</div>
            <div>Action Fraud: Social engineering and reporting advice</div>
          </div>
        </div>
      ) : (
        /* SIMULATION VIEW */
        <div
          style={{
            height: "calc(100vh - 50px)",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <div style={{ flex: 1, overflow: "auto" }}>
            <PretextingBuilder
              onFinish={() => {
                onExit();
              }}
            />
          </div>
          <div className="sim-bar">
            <button onClick={onExit} className="btn-exit">
              ✕ EXIT SIMULATION
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
