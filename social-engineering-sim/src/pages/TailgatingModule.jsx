import React, { useState } from "react";
import { Link } from "react-router-dom";
import TailgatingSimulation from "../game/TailgatingSimulation";
import { useTailgatingStore } from "../state/useTailgatingStore";
import { useSurveyStore } from "../state/useSurveyStore";
import DropdownItem from "../components/DropDown";

const NAV_H = 48;
const BAR_H = 2;
const SIMBAR_H = 48;
const CHROME_H = BAR_H + NAV_H; // 50px total above the canvas

export default function TailgatingModule({ onComplete } = {}) {
  const [started, setStarted] = useState(false);
  const ending = useTailgatingStore((s) => s.ending);

  const onStart = () => {
    useTailgatingStore.getState().resetGame();
    setStarted(true);
  };
  const onExit = () => {
    if (onComplete) {
      // Snapshot metrics BEFORE reset so they survive into the post-survey
      const s = useTailgatingStore.getState();
      useSurveyStore.getState().snapshotMetrics({
        ending: s.ending,
        securityRisk: s.securityRisk,
        socialPressure: s.socialPressure,
        maxPressure: s.maxPressure,
        breachOccurred: s.breachOccurred,
        incidents: s.incidents,
      });
    }
    useTailgatingStore.getState().resetGame();
    if (onComplete) {
      onComplete();
    } else {
      setStarted(false);
    }
  };

  return (
    <>
      {/* ── Chrome (always visible) ── */}
      <div className="top-bar" style={{ position: "relative", zIndex: 10 }} />
      <nav
        className="app-nav"
        style={{
          flexShrink: 0,
          height: `${NAV_H}px`,
          padding: "0 24px",
          boxSizing: "border-box",
          position: "relative",
          zIndex: 10,
        }}
      >
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
        <div className="module-badge">MODULE: TAILGATING</div>
      </nav>

      {/* ── Info page ── */}
      {!started && (
        <div style={{ minHeight: "100vh", background: "var(--bg)" }}>
          <div className="page-container">
            <div className="breadcrumb fade-up">
              <Link to="/">~/home</Link>
              <span className="breadcrumb__sep">/</span>
              <span className="breadcrumb__current">tailgating-module</span>
            </div>

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
                What is Tailgating?
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
                Tailgating is a social engineering attack that takes advantage
                of normal human behaviour — politeness, trust, and the desire to
                avoid awkward situations. It occurs when an attacker gains
                physical access to a restricted area by following closely behind
                an authorised person.
              </p>
            </section>

            <hr
              className="neon-divider fade-up d1"
              style={{ marginBottom: "clamp(28px,4vw,48px)" }}
            />

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
                Instead of hacking a system, tailgating targets people.
                Attackers may pretend to be employees, delivery drivers,
                contractors, or visitors who simply forgot their access card. By
                blending in and appearing legitimate, they rely on others to
                hold doors open or bypass security checks on their behalf.
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
                Because tailgating often feels harmless or polite, it can easily
                go unnoticed. However, once inside a restricted area, an
                attacker may be able to steal equipment, access confidential
                information, or cause physical or digital damage.
              </p>
            </section>

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
                    title: "Understand tailgating",
                    body: "Learn how physical access attacks exploit social norms and polite behaviour.",
                  },
                  {
                    num: "02",
                    title: "Identify attempts",
                    body: "Recognise common props and tactics — fake deliveries, staged confusion, authority pressure.",
                  },
                  {
                    num: "03",
                    title: "Respond correctly",
                    body: "Practice consistent, safe responses that don't compromise security — even under social pressure.",
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
                  {
                    title:
                      "Only allow access to people who can verify authorisation",
                    body: "Attackers may wear convincing uniforms or carry equipment to appear legitimate. Always confirm identity and permission before granting access.",
                  },
                  {
                    title:
                      "Direct unverified individuals to reception or security",
                    body: "Reception staff or security teams are responsible for verifying visitors. Redirecting unknown individuals ensures proper procedures are followed.",
                  },
                  {
                    title: "Do not feel pressured by urgency or authority",
                    body: "Social engineers often pretend to be senior staff or claim emergencies to bypass procedures. Security rules apply regardless of rank or urgency.",
                  },
                  {
                    title: "Be consistent with security procedures",
                    body: "Attackers exploit small exceptions. Following the same rules every time prevents them from identifying weak points in the process.",
                  },
                  {
                    title: "Take a moment to verify before allowing access",
                    body: "A quick check can prevent unauthorised entry and protect sensitive systems or information inside the organisation.",
                  },
                ].map((item, i) => (
                  <DropdownItem key={i} title={item.title}>
                    {item.body}
                  </DropdownItem>
                ))}
              </div>
              <div className="note-banner" style={{ marginTop: "14px" }}>
                <span
                  className="mono"
                  style={{
                    color: "var(--neon)",
                    fontSize: "0.72rem",
                    opacity: 0.7,
                  }}
                >
                  NOTE &nbsp;
                </span>
                <span
                  style={{
                    color: "var(--text)",
                    fontSize: "0.85rem",
                    opacity: 0.75,
                  }}
                >
                  Challenging someone politely is not rude — it's your
                  responsibility.
                </span>
              </div>
            </section>

            <section
              className="fade-up d4"
              style={{ marginBottom: "clamp(28px,4vw,48px)" }}
            >
              <div className="section-label" style={{ marginBottom: "12px" }}>
                // SIMULATION BRIEF
              </div>
              <div className="info-card" style={{ marginBottom: "20px" }}>
                <p
                  style={{
                    color: "var(--text)",
                    fontSize: "0.92rem",
                    lineHeight: 1.75,
                    opacity: 0.85,
                    margin: "0 0 14px",
                  }}
                >
                  You will face 5 encounters at a secured entrance. Each
                  scenario tests your ability to stay calm under pressure and
                  make consistent, safe decisions.
                </p>
                {[
                  "Recognising tailgating attempts",
                  "Managing social pressure without backing down",
                  "Asking quick, effective verification questions",
                  "Making safe decisions consistently across all encounters",
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
              <button onClick={onStart} className="btn-primary">
                ▶ PLAY SIMULATION
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
                5 ENCOUNTERS · PRESSURE AND RISK PERSIST ACROSS ROUNDS
              </div>
            </section>
          </div>
        </div>
      )}

      {/* ── Simulation overlay ──
          position:fixed takes it completely out of normal flow.
          The canvas gets a guaranteed pixel size from the start.
      ── */}
      {started && (
        <div
          style={{
            position: "fixed",
            top: `${CHROME_H}px` /* sit below the 2px bar + 48px nav */,
            left: 0,
            right: 0,
            bottom: 0,
            display: "flex",
            flexDirection: "column",
            background: "var(--bg)",
            zIndex: 5,
          }}
        >
          {/* Canvas area — explicit pixel height, no % involved */}
          <div
            style={{
              flex: 1,
              overflow: "hidden",
              /* height is viewport minus chrome minus sim-bar */
              height: `calc(100vh - ${CHROME_H + SIMBAR_H}px)`,
            }}
          >
            <TailgatingSimulation />
          </div>

          {/* Sim bar */}
          <div
            className="sim-bar"
            style={{
              flexShrink: 0,
              height: `${SIMBAR_H}px`,
              boxSizing: "border-box",
            }}
          >
            {ending ? (
              <>
                <div className="result-banner" style={{ flex: 1 }}>
                  <span
                    className="mono"
                    style={{
                      color: "var(--text-dim)",
                      fontSize: "0.68rem",
                      letterSpacing: "0.1em",
                    }}
                  >
                    RESULT &nbsp;
                  </span>
                  <span
                    style={{
                      fontWeight: 600,
                      color: "var(--neon)",
                      fontSize: "0.9rem",
                    }}
                  >
                    {ending}
                  </span>
                </div>
                {onComplete && (
                  <button
                    onClick={onExit}
                    className="btn-primary"
                    style={{ fontSize: "0.75rem", letterSpacing: "0.08em" }}
                  >
                    Continue to survey →
                  </button>
                )}
              </>
            ) : (
              <button onClick={onExit} className="btn-exit">
                {onComplete ? "✓ FINISH SIMULATION" : "✕ EXIT SIMULATION"}
              </button>
            )}
          </div>
        </div>
      )}
    </>
  );
}
