"use client";

import { useState } from "react";
import type { Drivetrain } from "@/lib/calculator";
import {
  calculateFH5Tune,
  type CalcInputFH5,
  type DisciplineFH5,
  type TuneResultFH5,
} from "@/lib/calculator-fh5";
import { AdUnit } from "@/components/ads/AdUnit";
import { useLanguage } from "@/lib/i18n/LanguageProvider";
import {
  BarRow,
  ChipSelect,
  RideHeightBar,
  Row,
  SectionTitle,
  labelSt,
  numInput,
} from "./parts";

export function CalculatorFH5() {
  const { t } = useLanguage();
  const C = t.calc;

  const [form, setForm] = useState<CalcInputFH5>({
    balanceFront: 50,
    drivetrain: "RWD",
    discipline: "track",
    weightKg: 1400,
    torqueNm: 400,
  });
  const [result, setResult] = useState<TuneResultFH5 | null>(null);

  const set = <K extends keyof CalcInputFH5>(k: K, v: CalcInputFH5[K]) =>
    setForm((f) => ({ ...f, [k]: v }));

  const handleCalc = () => {
    setResult(calculateFH5Tune(form));
  };

  const DRIVETRAIN: { value: Drivetrain; label: string }[] = [
    { value: "AWD", label: "AWD" },
    { value: "FWD", label: "FWD" },
    { value: "RWD", label: "RWD" },
  ];
  const DISCIPLINE: {
    value: DisciplineFH5;
    label: string;
    color: string;
  }[] = [
    { value: "street", label: "Street", color: "#c084fc" },
    { value: "track", label: "Track", color: "#60a5fa" },
    { value: "offroad", label: "Offroad", color: "#4ade80" },
    { value: "rally", label: "Rally", color: "#fb923c" },
    { value: "drift", label: "Drift", color: "#facc15" },
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
        style={{ maxWidth: "1180px", margin: "0 auto", padding: "40px 24px" }}
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
                background: "rgba(96,165,250,0.1)",
                border: "1px solid rgba(96,165,250,0.25)",
                color: "#60a5fa",
              }}
            >
              FH5 · v1.0
            </span>
          </div>
          <p style={{ margin: 0, fontSize: "14px", color: "#64748b" }}>
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
            <div>
              <label style={labelSt}>
                {C.balanceFront}
                <span
                  style={{
                    float: "right",
                    color: "#60a5fa",
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
                  accentColor: "#60a5fa",
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

            <div>
              <label style={labelSt}>{C.drivetrain}</label>
              <ChipSelect
                options={DRIVETRAIN}
                value={form.drivetrain}
                onChange={(v) => set("drivetrain", v)}
                accent="#60a5fa"
              />
            </div>

            <div>
              <label style={labelSt}>{C.discipline}</label>
              <ChipSelect
                options={DISCIPLINE}
                value={form.discipline}
                onChange={(v) => set("discipline", v)}
                accent="#60a5fa"
              />
            </div>

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
                <label style={labelSt}>{C.torque}</label>
                <div style={{ position: "relative" }}>
                  <input
                    type="number"
                    min={100}
                    max={2500}
                    step={10}
                    value={form.torqueNm}
                    onChange={(e) => set("torqueNm", Number(e.target.value))}
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
                    Nm
                  </span>
                </div>
              </div>
            </div>

            <button
              onClick={handleCalc}
              style={{
                padding: "13px",
                borderRadius: "9px",
                border: "none",
                background: "#60a5fa",
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
              <div style={{ fontSize: "48px", marginBottom: "14px" }}>🏁</div>
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
              <div
                style={{
                  background: "rgba(96,165,250,0.07)",
                  border: "1px solid rgba(96,165,250,0.2)",
                  borderRadius: "10px",
                  padding: "12px 18px",
                  fontSize: "13px",
                  color: "#93c5fd",
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
                <span>⚡ {form.torqueNm} Nm</span>
              </div>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "16px",
                }}
              >
                <Card>
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
                </Card>

                <Card>
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
                </Card>

                <Card>
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
                </Card>

                <Card>
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
                </Card>

                <Card>
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
                </Card>

                <Card>
                  <SectionTitle icon="✈️" title="Aero — Downforce" />
                  <BarRow
                    label="Downforce"
                    value={result.aero.pct}
                    min={0}
                    max={100}
                    unit="%"
                    color="#f472b6"
                  />
                  {result.aero.pct === 0 && (
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
                </Card>

                <Card>
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
                </Card>
              </div>

              <Card>
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
                      <p style={diffLabelStyle("#60a5fa")}>FRONT</p>
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
                      <p style={diffLabelStyle("#fb923c")}>REAR</p>
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
                      <p style={diffLabelStyle("#c084fc")}>CENTER</p>
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
              </Card>

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

function Card({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        background: "#13151c",
        border: "1px solid rgba(255,255,255,0.07)",
        borderRadius: "12px",
        padding: "18px",
      }}
    >
      {children}
    </div>
  );
}

function diffLabelStyle(color: string): React.CSSProperties {
  return {
    margin: "0 0 8px",
    fontSize: "12px",
    fontWeight: 700,
    color,
    letterSpacing: "0.05em",
  };
}
