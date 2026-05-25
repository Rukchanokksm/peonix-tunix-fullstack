"use client";
import { useState } from "react";
import { calculateFH6Tune } from "@/lib/calculator";
import type {
  CalcInput,
  TuneResult,
  Drivetrain,
  Discipline,
} from "@/lib/calculator";
import { AdUnit } from "@/components/ads/AdUnit";
import { useLanguage } from "@/lib/i18n/LanguageProvider";

const clamp = (v: number, mn: number, mx: number) =>
  Math.max(mn, Math.min(mx, v));

function SectionTitle({ icon, title }: { icon: string; title: string }) {
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

function Row({
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
            style={{
              fontSize: "11px",
              color: "#64748b",
              marginLeft: "3px",
            }}
          >
            {unit}
          </span>
        )}
      </span>
    </div>
  );
}

function BarRow({
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

function RideHeightBar({ pct }: { pct: number }) {
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

function ChipSelect<T extends string>({
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

const numInput: React.CSSProperties = {
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
const labelSt: React.CSSProperties = {
  display: "block",
  fontSize: "11px",
  fontWeight: 600,
  letterSpacing: "0.07em",
  textTransform: "uppercase",
  color: "#64748b",
  marginBottom: "6px",
};

export default function CalculatorPage() {
  const { t } = useLanguage();
  const C = t.calc;

  const [form, setForm] = useState<CalcInput>({
    balanceFront: 50,
    drivetrain: "RWD",
    discipline: "track",
    weightKg: 1400,
    powerHp: 400,
  });
  const [result, setResult] = useState<TuneResult | null>(null);

  const set = <K extends keyof CalcInput>(k: K, v: CalcInput[K]) =>
    setForm((f) => ({ ...f, [k]: v }));

  const handleCalc = () => {
    setResult(calculateFH6Tune(form));
  };

  const DRIVETRAIN: { value: Drivetrain; label: string }[] = [
    { value: "AWD", label: "AWD" },
    { value: "FWD", label: "FWD" },
    { value: "RWD", label: "RWD" },
  ];
  const DISCIPLINE: { value: Discipline; label: string; color: string }[] = [
    { value: "street", label: "Street", color: "#c084fc" },
    { value: "track", label: "Track", color: "#60a5fa" },
    { value: "offroad", label: "Offroad", color: "#4ade80" },
    { value: "rally", label: "Rally", color: "#fb923c" },
    { value: "drift", label: "Drift", color: "#facc15" },
    { value: "drag", label: "Drag", color: "#f87171" },
  ];

  return (
    <div
      style={{
        background: "#0d0f14",
        minHeight: "100vh",
        color: "#e2e8f0",
      }}
    >
      <div
        style={{
          maxWidth: "1180px",
          margin: "0 auto",
          padding: "40px 24px",
        }}
      >
        {/* Header */}
        <div style={{ marginBottom: "32px" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              marginBottom: "6px",
            }}
          >
            <h1
              style={{
                fontSize: "26px",
                fontWeight: 800,
                margin: 0,
                color: "#f1f5f9",
              }}
            >
              {C.title}
            </h1>
            <span
              style={{
                fontSize: "10px",
                fontWeight: 700,
                letterSpacing: "0.1em",
                padding: "3px 8px",
                borderRadius: "5px",
                background: "rgba(250,204,21,0.1)",
                border: "1px solid rgba(250,204,21,0.25)",
                color: "#facc15",
              }}
            >
              FH6 · v2.0
            </span>
          </div>
          <p
            style={{
              margin: 0,
              fontSize: "14px",
              color: "#64748b",
            }}
          >
            {C.subtitle}
          </p>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "360px 1fr",
            gap: "20px",
            alignItems: "start",
          }}
        >
          {/* ── FORM ── */}
          <div
            style={{
              background: "#13151c",
              border: "1px solid rgba(255,255,255,0.07)",
              borderRadius: "14px",
              padding: "24px",
              display: "flex",
              flexDirection: "column",
              gap: "20px",
            }}
          >
            {/* Balance Front */}
            <div>
              <label style={labelSt}>
                {C.balanceFront}
                <span
                  style={{
                    float: "right",
                    color: "#facc15",
                    fontWeight: 800,
                  }}
                >
                  {form.balanceFront}%
                </span>
              </label>
              <input
                type="range"
                min={30}
                max={70}
                step={1}
                value={form.balanceFront}
                onChange={(e) => set("balanceFront", Number(e.target.value))}
                style={{
                  width: "100%",
                  accentColor: "#facc15",
                  cursor: "pointer",
                }}
              />
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  fontSize: "10px",
                  color: "#475569",
                  marginTop: "3px",
                }}
              >
                <span>{C.rearHeavy}</span>
                <span>{C.neutral}</span>
                <span>{C.frontHeavy}</span>
              </div>
            </div>

            {/* Drivetrain */}
            <div>
              <label style={labelSt}>{C.drivetrain}</label>
              <ChipSelect
                options={DRIVETRAIN}
                value={form.drivetrain}
                onChange={(v) => set("drivetrain", v)}
                accent="#60a5fa"
              />
            </div>

            {/* Discipline */}
            <div>
              <label style={labelSt}>{C.discipline}</label>
              <ChipSelect
                options={DISCIPLINE}
                value={form.discipline}
                onChange={(v) => set("discipline", v)}
                accent="#facc15"
              />
            </div>

            {/* Weight + Torque */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "12px",
              }}
            >
              <div>
                <label style={labelSt}>{C.weight}</label>
                <div style={{ position: "relative" }}>
                  <input
                    type="number"
                    min={600}
                    max={3000}
                    step={10}
                    value={form.weightKg}
                    onChange={(e) => set("weightKg", Number(e.target.value))}
                    style={numInput}
                  />
                  <span
                    style={{
                      position: "absolute",
                      right: "10px",
                      top: "50%",
                      transform: "translateY(-50%)",
                      fontSize: "11px",
                      color: "#475569",
                    }}
                  >
                    kg
                  </span>
                </div>
              </div>
              <div>
                <label style={labelSt}>{C.power}</label>
                <div style={{ position: "relative" }}>
                  <input
                    type="number"
                    min={80}
                    max={1600}
                    step={10}
                    value={form.powerHp}
                    onChange={(e) => set("powerHp", Number(e.target.value))}
                    style={numInput}
                  />
                  <span
                    style={{
                      position: "absolute",
                      right: "10px",
                      top: "50%",
                      transform: "translateY(-50%)",
                      fontSize: "11px",
                      color: "#475569",
                    }}
                  >
                    hp
                  </span>
                </div>
              </div>
            </div>

            {/* T/W ratio */}
            <div
              style={{
                fontSize: "12px",
                color: "#475569",
                padding: "8px 12px",
                background: "rgba(255,255,255,0.03)",
                borderRadius: "7px",
                lineHeight: 1.5,
              }}
            >
              Power/Weight:{" "}
              <span
                style={{
                  color: "#94a3b8",
                  fontFamily: "monospace",
                }}
              >
                {(form.powerHp / (form.weightKg / 1000)).toFixed(1)}
              </span>{" "}
              hp/t
            </div>

            {/* Calculate button */}
            <button
              onClick={handleCalc}
              style={{
                padding: "13px",
                borderRadius: "9px",
                border: "none",
                background: "#facc15",
                color: "#0d0f14",
                fontWeight: 800,
                fontSize: "15px",
                cursor: "pointer",
                transition: "opacity 0.15s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.opacity = "0.85";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.opacity = "1";
              }}
            >
              {C.calculate}
            </button>
            <AdUnit
              slot="calculator-form-bottom"
              format="rectangle"
              style={{ alignSelf: "center" }}
            />
          </div>

          {/* ── RESULTS ── */}
          {!result ? (
            <div
              style={{
                background: "#13151c",
                border: "1px solid rgba(255,255,255,0.07)",
                borderRadius: "14px",
                padding: "60px 24px",
                textAlign: "center",
                color: "#475569",
              }}
            >
              <div
                style={{
                  fontSize: "48px",
                  marginBottom: "14px",
                }}
              >
                🏎
              </div>
              <p style={{ margin: 0, fontSize: "14px" }}>{C.noResultHint}</p>
              <p
                style={{
                  margin: "6px 0 0",
                  fontSize: "12px",
                  color: "#334155",
                }}
              >
                {C.noResultSub}
              </p>
            </div>
          ) : (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "16px",
              }}
            >
              {/* Summary */}
              <div
                style={{
                  background: "rgba(250,204,21,0.07)",
                  border: "1px solid rgba(250,204,21,0.2)",
                  borderRadius: "10px",
                  padding: "12px 18px",
                  fontSize: "13px",
                  color: "#fbbf24",
                  display: "flex",
                  gap: "16px",
                  flexWrap: "wrap",
                }}
              >
                <span>
                  ⚖️ Balance <strong>{form.balanceFront}% F</strong>
                </span>
                <span>🔧 {form.drivetrain}</span>
                <span
                  style={{
                    color: DISCIPLINE.find((d) => d.value === form.discipline)
                      ?.color,
                  }}
                >
                  {form.discipline.toUpperCase()}
                </span>
                <span>⚖️ {form.weightKg} kg</span>
                <span>⚡ {form.powerHp} hp</span>
              </div>

              {/* Grid 2 cols */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "16px",
                }}
              >
                {/* TIRES */}
                <div
                  style={{
                    background: "#13151c",
                    border: "1px solid rgba(255,255,255,0.07)",
                    borderRadius: "12px",
                    padding: "18px",
                  }}
                >
                  <SectionTitle icon="🏎" title="Tires" />
                  <BarRow
                    label="Pressure Front"
                    value={result.tires.pressureF}
                    min={1.0}
                    max={3.8}
                    unit="bar"
                    color="#4ade80"
                  />
                  <BarRow
                    label="Pressure Rear"
                    value={result.tires.pressureR}
                    min={1.0}
                    max={3.8}
                    unit="bar"
                    color="#4ade80"
                  />
                </div>

                {/* GEAR */}
                <div
                  style={{
                    background: "#13151c",
                    border: "1px solid rgba(255,255,255,0.07)",
                    borderRadius: "12px",
                    padding: "18px",
                  }}
                >
                  <SectionTitle icon="🔄" title="Gear" />
                  <Row
                    label="Final Drive"
                    value={result.gear.finalDrive.toFixed(2)}
                  />
                  <p
                    style={{
                      margin: "10px 0 0",
                      fontSize: "11px",
                      color: "#475569",
                      lineHeight: 1.5,
                    }}
                  >
                    {form.discipline === "drag" ? C.gearDragNote : C.gearNote}
                  </p>
                </div>

                {/* ALIGNMENT */}
                <div
                  style={{
                    background: "#13151c",
                    border: "1px solid rgba(255,255,255,0.07)",
                    borderRadius: "12px",
                    padding: "18px",
                  }}
                >
                  <SectionTitle icon="📐" title="Alignment" />
                  <Row
                    label="Camber Front"
                    value={result.alignment.camberF}
                    unit="°"
                  />
                  <Row
                    label="Camber Rear"
                    value={result.alignment.camberR}
                    unit="°"
                  />
                  <Row
                    label="Toe Front"
                    value={result.alignment.toeF}
                    unit="°"
                  />
                  <Row
                    label="Toe Rear"
                    value={result.alignment.toeR}
                    unit="°"
                  />
                  <Row
                    label="Front Caster"
                    value={result.alignment.caster}
                    unit="°"
                  />
                  {result.alignment.caster >= 6.5 && (
                    <p
                      style={{
                        margin: "10px 0 0",
                        fontSize: "11px",
                        color: "#475569",
                        lineHeight: 1.5,
                      }}
                    >
                      {C.casterNote}
                    </p>
                  )}
                </div>

                {/* ANTIROLL BARS */}
                <div
                  style={{
                    background: "#13151c",
                    border: "1px solid rgba(255,255,255,0.07)",
                    borderRadius: "12px",
                    padding: "18px",
                  }}
                >
                  <SectionTitle icon="🔩" title="Antiroll Bars" />
                  <BarRow
                    label="Front ARB"
                    value={result.arb.front}
                    min={1}
                    max={65}
                    unit=""
                    color="#c084fc"
                  />
                  <BarRow
                    label="Rear ARB"
                    value={result.arb.rear}
                    min={1}
                    max={65}
                    unit=""
                    color="#c084fc"
                  />
                  <p
                    style={{
                      margin: "10px 0 0",
                      fontSize: "11px",
                      color: "#475569",
                      lineHeight: 1.5,
                    }}
                  >
                    {form.drivetrain === "AWD" && C.arbNoteAWD}
                    {form.drivetrain === "RWD" && C.arbNoteRWD}
                    {form.drivetrain === "FWD" && C.arbNoteFWD}
                  </p>
                </div>

                {/* SPRINGS */}
                <div
                  style={{
                    background: "#13151c",
                    border: "1px solid rgba(255,255,255,0.07)",
                    borderRadius: "12px",
                    padding: "18px",
                  }}
                >
                  <SectionTitle icon="🌀" title="Springs" />
                  <BarRow
                    label="Spring Rate Front"
                    value={result.springs.rateF}
                    min={10}
                    max={600}
                    unit="N/mm"
                    color="#fb923c"
                    midMark
                  />
                  <BarRow
                    label="Spring Rate Rear"
                    value={result.springs.rateR}
                    min={10}
                    max={600}
                    unit="N/mm"
                    color="#fb923c"
                    midMark
                  />
                  <RideHeightBar pct={result.springs.rideHeightPct} />
                </div>

                {/* DAMPING */}
                <div
                  style={{
                    background: "#13151c",
                    border: "1px solid rgba(255,255,255,0.07)",
                    borderRadius: "12px",
                    padding: "18px",
                  }}
                >
                  <SectionTitle icon="🧲" title="Damping" />
                  <BarRow
                    label="Rebound Front"
                    value={result.damping.reboundF}
                    min={1}
                    max={20}
                    unit=""
                    color="#60a5fa"
                  />
                  <BarRow
                    label="Rebound Rear"
                    value={result.damping.reboundR}
                    min={1}
                    max={20}
                    unit=""
                    color="#60a5fa"
                  />
                  <BarRow
                    label="Bump Front"
                    value={result.damping.bumpF}
                    min={1}
                    max={20}
                    unit=""
                    color="#38bdf8"
                  />
                  <BarRow
                    label="Bump Rear"
                    value={result.damping.bumpR}
                    min={1}
                    max={20}
                    unit=""
                    color="#38bdf8"
                  />
                </div>

                {/* AERO */}
                <div
                  style={{
                    background: "#13151c",
                    border: "1px solid rgba(255,255,255,0.07)",
                    borderRadius: "12px",
                    padding: "18px",
                  }}
                >
                  <SectionTitle icon="✈️" title="Aero — Downforce" />
                  <BarRow
                    label="Front Downforce"
                    value={result.aero.front}
                    min={0}
                    max={100}
                    unit="%"
                    color="#f472b6"
                  />
                  <BarRow
                    label="Rear Downforce"
                    value={result.aero.rear}
                    min={0}
                    max={100}
                    unit="%"
                    color="#f472b6"
                  />
                  <Row
                    label="Aero Balance"
                    value={result.aero.balance.toFixed(2)}
                  />
                  {result.aero.front === 0 && (
                    <p
                      style={{
                        margin: "8px 0 0",
                        fontSize: "11px",
                        color: "#475569",
                      }}
                    >
                      {C.driftNote}
                    </p>
                  )}
                </div>

                {/* BRAKE */}
                <div
                  style={{
                    background: "#13151c",
                    border: "1px solid rgba(255,255,255,0.07)",
                    borderRadius: "12px",
                    padding: "18px",
                  }}
                >
                  <SectionTitle icon="🛑" title="Brake" />
                  <BarRow
                    label="Brake Bias Front"
                    value={result.brakes.biasFront}
                    min={0}
                    max={100}
                    unit="%"
                    color="#f87171"
                  />
                  <div
                    style={{
                      fontSize: "11px",
                      color: "#475569",
                      margin: "4px 0 8px",
                      textAlign: "right",
                    }}
                  >
                    Rear: {(100 - result.brakes.biasFront).toFixed(1)}%
                  </div>
                  <BarRow
                    label="Brake Pressure"
                    value={result.brakes.pressure}
                    min={0}
                    max={200}
                    unit="%"
                    color="#fbbf24"
                  />
                </div>
              </div>

              {/* DIFFERENTIAL — full width */}
              <div
                style={{
                  background: "#13151c",
                  border: "1px solid rgba(255,255,255,0.07)",
                  borderRadius: "12px",
                  padding: "18px",
                }}
              >
                <SectionTitle
                  icon="⚙️"
                  title={`Differential (${form.drivetrain})`}
                />
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns:
                      form.drivetrain === "AWD" ? "1fr 1fr 1fr" : "1fr 1fr",
                    gap: "20px",
                  }}
                >
                  {(form.drivetrain === "AWD" || form.drivetrain === "FWD") && (
                    <div>
                      <p
                        style={{
                          margin: "0 0 8px",
                          fontSize: "12px",
                          fontWeight: 700,
                          color: "#60a5fa",
                          letterSpacing: "0.05em",
                        }}
                      >
                        FRONT
                      </p>
                      <BarRow
                        label="Acceleration"
                        value={result.diff.frontAccel ?? 0}
                        min={0}
                        max={100}
                        unit="%"
                        color="#60a5fa"
                      />
                      <BarRow
                        label="Deceleration"
                        value={result.diff.frontDecel ?? 0}
                        min={0}
                        max={100}
                        unit="%"
                        color="#38bdf8"
                      />
                    </div>
                  )}
                  {(form.drivetrain === "AWD" || form.drivetrain === "RWD") && (
                    <div>
                      <p
                        style={{
                          margin: "0 0 8px",
                          fontSize: "12px",
                          fontWeight: 700,
                          color: "#fb923c",
                          letterSpacing: "0.05em",
                        }}
                      >
                        REAR
                      </p>
                      <BarRow
                        label="Acceleration"
                        value={result.diff.rearAccel ?? 0}
                        min={0}
                        max={100}
                        unit="%"
                        color="#fb923c"
                      />
                      <BarRow
                        label="Deceleration"
                        value={result.diff.rearDecel ?? 0}
                        min={0}
                        max={100}
                        unit="%"
                        color="#fbbf24"
                      />
                    </div>
                  )}
                  {form.drivetrain === "AWD" && (
                    <div>
                      <p
                        style={{
                          margin: "0 0 8px",
                          fontSize: "12px",
                          fontWeight: 700,
                          color: "#c084fc",
                          letterSpacing: "0.05em",
                        }}
                      >
                        CENTER
                      </p>
                      <BarRow
                        label="Balance F↔R"
                        value={result.diff.center ?? 0}
                        min={0}
                        max={100}
                        unit="%"
                        color="#c084fc"
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Footer */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "12px 16px",
                  background: "rgba(255,255,255,0.02)",
                  border: "1px solid rgba(255,255,255,0.05)",
                  borderRadius: "8px",
                }}
              >
                <p
                  style={{
                    margin: 0,
                    fontSize: "11px",
                    color: "#334155",
                    lineHeight: 1.5,
                  }}
                >
                  {C.warningNote}
                </p>
                <span
                  style={{
                    fontSize: "11px",
                    fontFamily: "monospace",
                    color: "#334155",
                    background: "rgba(255,255,255,0.04)",
                    padding: "3px 8px",
                    borderRadius: "4px",
                    whiteSpace: "nowrap",
                  }}
                >
                  Calc Engine v{result.version}
                </span>
              </div>

              <AdUnit slot="calculator-result-bottom" format="horizontal" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
