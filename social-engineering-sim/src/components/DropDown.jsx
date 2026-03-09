import React, { useState } from "react";

export default function DropdownItem({ title, children }) {
  const [open, setOpen] = useState(false);

  return (
    <div
      style={{
        borderBottom: "1px solid rgba(255,255,255,0.05)",
        paddingBottom: "8px",
      }}
    >
      <button
        onClick={() => setOpen(!open)}
        style={{
          background: "none",
          border: "none",
          width: "100%",
          textAlign: "left",
          display: "flex",
          gap: "10px",
          cursor: "pointer",
          color: "var(--text)",
          fontSize: "0.9rem",
          lineHeight: 1.6,
          padding: "6px 0",
        }}
      >
        <span
          className="checklist-icon"
          style={{
            transform: open ? "rotate(90deg)" : "rotate(0deg)",
            transition: "transform 0.2s ease",
          }}
        >
          ›
        </span>
        <span>{title}</span>
      </button>

      {open && (
        <div
          style={{
            marginLeft: "20px",
            marginTop: "4px",
            fontSize: "0.82rem",
            lineHeight: 1.7,
            color: "var(--text)",
            opacity: 0.75,
          }}
        >
          {children}
        </div>
      )}
    </div>
  );
}
