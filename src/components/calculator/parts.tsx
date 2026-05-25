"use client";

import { useLanguage } from "@/lib/i18n/LanguageProvider";

export const clamp = (v: number, mn: number, mx: number) =>
  Math.max(mn, Math.min(mx, v));

export function SectionTitle({ icon, title }: { icon: string; title: string }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "8px",
        marginBottom: "14px",
        paddingBottom: "8px",
        borderBottom: "1px solid rgba(255,255,255,0.07)",
      }}
    >
      <span style={{ fontSize: "15px" }}>{icon}</span>
      <span
        style={{
          fontSize: "12px",
          fontWeight: 700,
          letterSpacing: "0.08em",
          textTransform: "uppercase",
          color: "#64748b",
        }}
      >
        {title}
      </span>
    </div>
  );
}

export function Row({
  label,
  value,
  unit,
}: {
  label: string;
  value: string | number;
  unit?: string;
}) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "7px 0",
        borderBottom: "1px solid rgba(255,255,255,0.04)",
      }}
    >
      <span style={{ fontSize: "13px", color: "#94a3b8" }}>{label}</span>
      <span
        style={{
          fontSize: "14px",
          fontWeight: 700,
          fontFamily: "monospace",
          color: "#e2e8f0",
        }}
      >
        {value}
        {unit && (
          <span
            style={{ fontSize: "11px", color: "#64748b", marginLeft: "3px" }}
          >
            {unit}
          </span>
        )}
      </span>
    </div>
  );
}

export function BarRow({
  label,
  value,
  min,
  max,
  unit,
  color = "#facc15",
  midMark = false,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  unit: string;
  color?: string;
  midMark?: boolean;
}) {
  const pct = clamp(((value - min) / (max - min)) * 100, 0, 100);
  return (
    <div
      style={{
        padding: "7px 0",
        borderBottom: "1px solid rgba(255,255,255,0.04)",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: "5px",
        }}
      >
        <span style={{ fontSize: "13px", color: "#94a3b8" }}>{label}</span>
        <span
          style={{
            fontSize: "14px",
            fontWeight: 700,
            fontFamily: "monospace",
            color: "#e2e8f0",
          }}
        >
          {value}{" "}
          <span style={{ fontSize: "11px", color: "#64748b" }}>{unit}</span>
        </span>
      </div>
      <div
        style={{
          position: "relative",
          height: "5px",
          background: "rgba(255,255,255,0.07)",
          borderRadius: "3px",
          overflow: "visible",
        }}
      >
        <div
          style={{
            width: `${pct}%`,
            height: "100%",
            background: color,
            borderRadius: "3px",
            transition: "width 0.4s ease",
          }}
        />
        {midMark && (
          <div
            style={{
              position: "absolute",
              left: "50%",
              top: "-4px",
              transform: "translateX(-50%)",
              width: "2px",
              height: "13px",
              background: "rgba(255,255,255,0.35)",
              borderRadius: "1px",
            }}
          />
        )}
      </div>
    </div>
  );
}

export function RideHeightBar({ pct }: { pct: number }) {
  const { t } = useLanguage();
  const C = t.calc;
  const labels: Record<number, string> = {
    0: C.rideHeightLowest,
    20: C.rideHeightLow,
    60: C.rideHeightMid,
    100: C.rideHeightHigh,
  };
  return (
    <div
      style={{
        padding: "7px 0",
        borderBottom: "1px solid rgba(255,255,255,0.04)",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: "5px",
        }}
      >
        <span style={{ fontSize: "13px", color: "#94a3b8" }}>Ride Height</span>
        <span style={{ fontSize: "13px", color: "#60a5fa" }}>
          {labels[pct] ?? `${pct}%`}
        </span>
      </div>
      <div
        style={{
          height: "5px",
          background: "rgba(255,255,255,0.07)",
          borderRadius: "3px",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            width: `${pct}%`,
            height: "100%",
            background: "#60a5fa",
            borderRadius: "3px",
            transition: "width 0.4s ease",
          }}
        />
      </div>
    </div>
  );
}

export function ChipSelect<T extends string>({
  options,
  value,
  onChange,
  accent = "#facc15",
}: {
  options: { value: T; label: string; color?: string }[];
  value: T;
  onChange: (v: T) => void;
  accent?: string;
}) {
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
      {options.map((o) => {
        const active = value === o.value;
        const c = o.color ?? accent;
        return (
          <button
            key={o.value}
            type="button"
            onClick={() => onChange(o.value)}
            style={{
              padding: "7px 16px",
              borderRadius: "7px",
              fontSize: "13px",
              fontWeight: 700,
              cursor: "pointer",
              border: `1px solid ${active ? c : c + "44"}`,
              background: active ? c : c + "18",
              color: active ? "#0d0f14" : c,
              transition: "all 0.12s",
            }}
          >
            {o.label}
          </button>
        );
      })}
    </div>
  );
}

export const numInput: React.CSSProperties = {
  width: "100%",
  background: "rgba(255,255,255,0.05)",
  border: "1px solid rgba(255,255,255,0.1)",
  borderRadius: "8px",
  padding: "9px 12px",
  color: "#e2e8f0",
  fontSize: "14px",
  outline: "none",
  boxSizing: "border-box",
};

export const labelSt: React.CSSProperties = {
  display: "block",
  fontSize: "11px",
  fontWeight: 600,
  letterSpacing: "0.07em",
  textTransform: "uppercase",
  color: "#64748b",
  marginBottom: "6px",
};
