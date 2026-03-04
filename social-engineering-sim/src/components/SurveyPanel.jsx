import React from "react";

/*
  SurveyPanel
  ───────────
  Props:
    title       : string           — panel heading
    description : string           — subtitle / instruction line
    schema      : Question[]       — from surveySchemas.js
    answers     : object           — current draft { [questionId]: value }
    onAnswer    : (id, value) => void
    onSubmit    : () => void
    submitLabel : string           — button label
    disabled    : boolean          — disables submit (used while saving)
    isComplete  : boolean          — controls whether submit button is active
*/

export default function SurveyPanel({
  title,
  description,
  schema,
  answers,
  onAnswer,
  onSubmit,
  submitLabel = "Continue →",
  disabled = false,
  isComplete = false,
}) {
  return (
    <div className="page-container" style={{ maxWidth: "680px" }}>
      {/* Header */}
      <div className="fade-up" style={{ marginBottom: "clamp(24px,4vw,40px)" }}>
        <div className="section-label" style={{ marginBottom: "8px" }}>
          // SURVEY
        </div>
        <h2
          style={{
            fontFamily: "'Rajdhani', sans-serif",
            fontSize: "clamp(1.4rem,4vw,2rem)",
            fontWeight: 700,
            color: "var(--neon)",
            margin: "0 0 10px",
            letterSpacing: "0.02em",
          }}
        >
          {title}
        </h2>
        {description && (
          <p
            style={{
              color: "var(--text)",
              fontSize: "0.9rem",
              lineHeight: 1.65,
              opacity: 0.75,
              margin: 0,
              maxWidth: "560px",
            }}
          >
            {description}
          </p>
        )}
      </div>

      <hr
        className="neon-divider"
        style={{ marginBottom: "clamp(20px,3vw,32px)" }}
      />

      {/* Questions */}
      <div style={{ display: "flex", flexDirection: "column", gap: "28px" }}>
        {schema.map((q, i) => (
          <div key={q.id} className={`fade-up d${Math.min(i + 1, 5)}`}>
            <QuestionBlock
              question={q}
              value={answers[q.id]}
              onChange={(val) => onAnswer(q.id, val)}
            />
          </div>
        ))}
      </div>

      {/* Submit */}
      <div
        style={{
          marginTop: "36px",
          display: "flex",
          alignItems: "center",
          gap: "16px",
          flexWrap: "wrap",
        }}
      >
        <button
          onClick={onSubmit}
          disabled={disabled || !isComplete}
          className="btn-primary"
          style={{
            opacity: disabled || !isComplete ? 0.45 : 1,
            cursor: disabled || !isComplete ? "not-allowed" : "pointer",
          }}
        >
          {disabled ? "Saving..." : submitLabel}
        </button>
        {!isComplete && (
          <span
            className="mono"
            style={{
              color: "var(--text-dim)",
              fontSize: "0.68rem",
              letterSpacing: "0.08em",
            }}
          >
            ANSWER ALL REQUIRED QUESTIONS TO CONTINUE
          </span>
        )}
      </div>
    </div>
  );
}

/* ── Individual question renderer ── */
function QuestionBlock({ question, value, onChange }) {
  const labelStyle = {
    fontFamily: "'Rajdhani', sans-serif",
    fontWeight: 600,
    fontSize: "0.95rem",
    color: "#e0f0ec",
    lineHeight: 1.5,
    marginBottom: "12px",
    display: "block",
  };

  const requiredMark = question.required ? (
    <span style={{ color: "var(--neon)", marginLeft: "4px", opacity: 0.7 }}>
      *
    </span>
  ) : null;

  if (question.type === "scale") {
    return (
      <div>
        <span style={labelStyle}>
          {question.text}
          {requiredMark}
        </span>
        <ScaleInput
          low={question.low}
          high={question.high}
          value={value}
          onChange={onChange}
        />
      </div>
    );
  }

  if (question.type === "radio") {
    return (
      <div>
        <span style={labelStyle}>
          {question.text}
          {requiredMark}
        </span>
        <RadioInput
          options={question.options}
          value={value}
          onChange={onChange}
        />
      </div>
    );
  }

  if (question.type === "text") {
    return (
      <div>
        <span style={labelStyle}>
          {question.text}
          {question.required && requiredMark}
          {!question.required && (
            <span
              style={{
                color: "var(--text-dim)",
                fontWeight: 400,
                fontSize: "0.8rem",
                marginLeft: "6px",
              }}
            >
              optional
            </span>
          )}
        </span>
        <textarea
          value={value ?? ""}
          onChange={(e) => onChange(e.target.value)}
          rows={3}
          style={{
            width: "100%",
            background: "var(--surface)",
            border: "1px solid var(--border)",
            borderRadius: "4px",
            color: "var(--text)",
            fontFamily: "'Rajdhani', sans-serif",
            fontSize: "0.9rem",
            padding: "10px 12px",
            resize: "vertical",
            outline: "none",
            boxSizing: "border-box",
            lineHeight: 1.6,
          }}
          onFocus={(e) =>
            (e.target.style.borderColor = "rgba(34,255,224,0.45)")
          }
          onBlur={(e) => (e.target.style.borderColor = "var(--border)")}
          placeholder="Your thoughts..."
        />
      </div>
    );
  }

  return null;
}

/* ── 1–5 Scale ── */
function ScaleInput({ low, high, value, onChange }) {
  return (
    <div>
      <div
        style={{
          display: "flex",
          gap: "8px",
          alignItems: "center",
          flexWrap: "wrap",
        }}
      >
        {[1, 2, 3, 4, 5].map((n) => {
          const selected = value === n;
          return (
            <button
              key={n}
              onClick={() => onChange(n)}
              style={{
                width: "44px",
                height: "44px",
                borderRadius: "4px",
                border: selected
                  ? "2px solid var(--neon)"
                  : "1px solid var(--border)",
                background: selected
                  ? "rgba(34,255,224,0.12)"
                  : "var(--surface)",
                color: selected ? "var(--neon)" : "var(--text)",
                fontFamily: "'Share Tech Mono', monospace",
                fontSize: "0.9rem",
                fontWeight: selected ? 700 : 400,
                cursor: "pointer",
                transition: "border-color 0.15s, background 0.15s, color 0.15s",
                flexShrink: 0,
              }}
              onMouseEnter={(e) => {
                if (!selected)
                  e.currentTarget.style.borderColor = "rgba(34,255,224,0.35)";
              }}
              onMouseLeave={(e) => {
                if (!selected)
                  e.currentTarget.style.borderColor = "var(--border)";
              }}
            >
              {n}
            </button>
          );
        })}
      </div>
      {(low || high) && (
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginTop: "6px",
            maxWidth: "268px",
          }}
        >
          <span style={{ color: "var(--text-dim)", fontSize: "0.7rem" }}>
            {low}
          </span>
          <span style={{ color: "var(--text-dim)", fontSize: "0.7rem" }}>
            {high}
          </span>
        </div>
      )}
    </div>
  );
}

/* ── Radio options ── */
function RadioInput({ options, value, onChange }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
      {options.map((opt) => {
        const selected = value === opt.value;
        return (
          <button
            key={opt.value}
            onClick={() => onChange(opt.value)}
            style={{
              textAlign: "left",
              padding: "10px 14px",
              borderRadius: "4px",
              border: selected
                ? "1px solid var(--neon)"
                : "1px solid var(--border)",
              background: selected ? "rgba(34,255,224,0.08)" : "var(--surface)",
              color: selected ? "#e8f4f0" : "var(--text)",
              fontFamily: "'Rajdhani', sans-serif",
              fontSize: "0.9rem",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "10px",
              transition: "border-color 0.15s, background 0.15s",
            }}
            onMouseEnter={(e) => {
              if (!selected)
                e.currentTarget.style.borderColor = "rgba(34,255,224,0.35)";
            }}
            onMouseLeave={(e) => {
              if (!selected)
                e.currentTarget.style.borderColor = "var(--border)";
            }}
          >
            <span
              style={{
                width: "14px",
                height: "14px",
                borderRadius: "50%",
                border: selected
                  ? "2px solid var(--neon)"
                  : "2px solid var(--border)",
                background: selected ? "var(--neon)" : "transparent",
                flexShrink: 0,
                transition: "background 0.15s, border-color 0.15s",
              }}
            />
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}
