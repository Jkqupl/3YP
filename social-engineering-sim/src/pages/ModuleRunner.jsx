import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";

import SurveyPanel from "../components/SurveyPanel";
import PhishingModule from "./PhishingModule";
import TailgatingModule from "./TailgatingModule";
import PretextingModule from "./PretextingModule";

import { SURVEY_SCHEMAS } from "../data/surveySchemas";
import { useSurveyStore } from "../state/useSurveyStore";
import { useGameStore } from "../state/useGameStore";
import { useTailgatingStore } from "../state/useTailgatingStore";
import { usePretextingStore } from "../state/usePretextingStore";

/*
  Steps:
    "intro"       — module info page + pre-survey combined (scrollable)
    "preSurvey"   — standalone pre-survey before sim starts
    "playing"     — the actual simulation (no nav change)
    "postSurvey"  — post-survey after sim completes
    "done"        — thank you / submission confirmation
*/

const VALID_MODULES = ["phishing", "tailgating", "pretexting"];

/* Pull relevant game metrics from the correct store */
function getModuleMetrics(moduleId) {
  if (moduleId === "tailgating") {
    const s = useTailgatingStore.getState();
    return {
      ending: s.ending,
      securityRisk: s.securityRisk,
      socialPressure: s.socialPressure,
      maxPressure: s.maxPressure,
      breachOccurred: s.breachOccurred,
      incidents: s.incidents,
    };
  }
  if (moduleId === "pretexting") {
    const s = usePretextingStore.getState();
    return {
      ending: s.computeEnding(),
      secureRounds: s.stats.secureRounds,
      correctVerification: s.stats.correctVerification,
      totalRounds: s.totalRounds,
    };
  }
  if (moduleId === "phishing") {
    const s = useGameStore.getState();
    const score = s.getScore();
    return {
      correct: score.correct,
      total: score.total,
      percent: score.percent,
    };
  }
  return {};
}

export default function ModuleRunner() {
  const { moduleId } = useParams();
  const navigate = useNavigate();

  const [step, setStep] = useState("preSurvey"); // preSurvey | playing | postSurvey | done

  const {
    beginModule,
    preDraft,
    postDraft,
    setPreAnswer,
    setPostAnswer,
    submitResponse,
    isPreComplete,
    isPostComplete,
    saving,
    saveError,
  } = useSurveyStore();

  /* Redirect if unknown module */
  useEffect(() => {
    if (!VALID_MODULES.includes(moduleId)) {
      navigate("/", { replace: true });
    }
  }, [moduleId, navigate]);

  /* Register the module start in the survey store */
  useEffect(() => {
    if (VALID_MODULES.includes(moduleId)) {
      beginModule(moduleId);
      setStep("preSurvey");
    }
  }, [moduleId]); // intentionally only re-runs if moduleId changes

  const schema = SURVEY_SCHEMAS[moduleId];
  if (!schema) return null;

  /* ── Navigation ── */
  const goPlaying = () => setStep("playing");
  const goPostSurvey = () => setStep("postSurvey");

  const handleSubmit = async () => {
    const metrics = getModuleMetrics(moduleId);
    const ok = await submitResponse(metrics);
    if (ok) setStep("done");
  };

  /* ── Shared chrome ── */
  const moduleBadge = moduleId?.toUpperCase();

  const Chrome = () => (
    <>
      <div className="top-bar" style={{ position: "relative", zIndex: 10 }} />
      <nav
        className="app-nav"
        style={{
          flexShrink: 0,
          height: "48px",
          padding: "0 24px",
          boxSizing: "border-box",
          position: "relative",
          zIndex: 10,
        }}
      >
        <Link
          to="/"
          className="mono"
          style={{
            color: "var(--neon)",
            fontSize: "0.75rem",
            letterSpacing: "0.12em",
            textDecoration: "none",
          }}
        >
          <span style={{ opacity: 0.5 }}>~/</span>SE-SIM
        </Link>
        <div className="module-badge">MODULE: {moduleBadge}</div>
      </nav>
    </>
  );

  /* ─────────────────────────────────
     PRE-SURVEY
  ───────────────────────────────── */
  if (step === "preSurvey") {
    return (
      <div style={{ minHeight: "100vh", background: "var(--bg)" }}>
        <Chrome />
        <div style={{ paddingBottom: "60px" }}>
          <div
            className="page-container"
            style={{ maxWidth: "680px", paddingTop: "24px" }}
          >
            <div className="breadcrumb fade-up">
              <Link to="/">~/home</Link>
              <span className="breadcrumb__sep">/</span>
              <span className="breadcrumb__current">{moduleId}-module</span>
            </div>
          </div>

          <SurveyPanel
            title="Before you begin"
            description="Answer a few quick questions before starting the simulation. This is anonymous and takes about 1 minute."
            schema={schema.pre}
            answers={preDraft}
            onAnswer={setPreAnswer}
            onSubmit={goPlaying}
            submitLabel="Start simulation →"
            isComplete={isPreComplete(schema.pre)}
          />
        </div>
      </div>
    );
  }

  /* ─────────────────────────────────
     PLAYING  — render the module, never navigate
  ───────────────────────────────── */
  if (step === "playing") {
    const sharedProps = { onComplete: goPostSurvey };

    if (moduleId === "phishing") return <PhishingModule {...sharedProps} />;
    if (moduleId === "tailgating") return <TailgatingModule {...sharedProps} />;
    if (moduleId === "pretexting") return <PretextingModule {...sharedProps} />;
  }

  /* ─────────────────────────────────
     POST-SURVEY
  ───────────────────────────────── */
  if (step === "postSurvey") {
    return (
      <div style={{ minHeight: "100vh", background: "var(--bg)" }}>
        <Chrome />
        <div style={{ paddingBottom: "60px" }}>
          <SurveyPanel
            title="How did that go?"
            description="Your answers help us understand how well the simulation worked. This takes about 1 minute and is completely anonymous."
            schema={schema.post}
            answers={postDraft}
            onAnswer={setPostAnswer}
            onSubmit={handleSubmit}
            submitLabel="Submit answers"
            disabled={saving}
            isComplete={isPostComplete(schema.post)}
          />
          {saveError && (
            <div
              style={{
                maxWidth: "680px",
                margin: "16px auto 0",
                padding: "10px 16px",
                background: "rgba(255,64,64,0.08)",
                border: "1px solid rgba(255,64,64,0.3)",
                borderRadius: "4px",
                color: "rgba(255,64,64,0.85)",
                fontSize: "0.85rem",
                fontFamily: "'Share Tech Mono', monospace",
              }}
            >
              Save failed: {saveError}. Please try again.
            </div>
          )}
        </div>
      </div>
    );
  }

  /* ─────────────────────────────────
     DONE
  ───────────────────────────────── */
  if (step === "done") {
    return (
      <div style={{ minHeight: "100vh", background: "var(--bg)" }}>
        <Chrome />
        <div className="page-container" style={{ maxWidth: "680px" }}>
          <div
            className="fade-up"
            style={{
              marginTop: "clamp(40px,8vw,80px)",
              textAlign: "center",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "16px",
            }}
          >
            <div
              className="mono"
              style={{ color: "var(--neon)", fontSize: "2rem", opacity: 0.8 }}
            >
              ✓
            </div>
            <h2
              style={{
                fontFamily: "'Rajdhani', sans-serif",
                fontSize: "clamp(1.4rem,4vw,2rem)",
                fontWeight: 700,
                color: "var(--neon)",
                margin: 0,
              }}
            >
              Responses saved
            </h2>
            <p
              style={{
                color: "var(--text)",
                fontSize: "0.95rem",
                lineHeight: 1.7,
                opacity: 0.8,
                maxWidth: "460px",
                margin: 0,
              }}
            >
              Thank you — your anonymous responses have been recorded. They will
              be used only for research purposes and cannot be traced back to
              you.
            </p>

            <div
              style={{
                display: "flex",
                gap: "12px",
                flexWrap: "wrap",
                justifyContent: "center",
                marginTop: "8px",
              }}
            >
              <Link
                to="/"
                className="btn-primary"
                style={{ fontSize: "0.8rem", letterSpacing: "0.1em" }}
              >
                ← Back to home
              </Link>
              {/* Let them try another module */}
              {VALID_MODULES.filter((m) => m !== moduleId).map((m) => (
                <Link
                  key={m}
                  to={`/module/${m}`}
                  className="btn-ghost"
                  style={{ fontSize: "0.75rem", letterSpacing: "0.08em" }}
                >
                  Try {m}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
