// ─── FH5 Auto Tune Calculator — Engine v1.0 ──────────────────────────────────
//
// Restored from c3388c4~2 (commit 619e012). Keeps FH5 physics and the simpler
// torque/single-aero model that's accurate for Forza Horizon 5's tuning UI.

import type { Drivetrain } from "./calculator";

export type DisciplineFH5 = "street" | "track" | "offroad" | "rally" | "drift";

export interface CalcInputFH5 {
  balanceFront: number; // % 0–100
  drivetrain: Drivetrain;
  discipline: DisciplineFH5;
  weightKg: number;
  torqueNm: number;
}

export interface TireResultFH5 {
  pressureF: number;
  pressureR: number;
}
export interface AlignmentResultFH5 {
  camberF: number;
  camberR: number;
  toeF: number;
  toeR: number;
  caster: number;
}
export interface ArbResultFH5 {
  front: number;
  rear: number;
}
export interface SpringResultFH5 {
  rateF: number;
  rateR: number;
  rideHeightPct: number;
}
export interface DampingResultFH5 {
  reboundF: number;
  reboundR: number;
  bumpF: number;
  bumpR: number;
}
export interface AeroResultFH5 {
  pct: number;
}
export interface BrakeResultFH5 {
  biasFront: number;
  pressure: number;
}
export interface DiffResultFH5 {
  frontAccel?: number;
  frontDecel?: number;
  rearAccel?: number;
  rearDecel?: number;
  center?: number;
}

export interface TuneResultFH5 {
  tires: TireResultFH5;
  alignment: AlignmentResultFH5;
  arb: ArbResultFH5;
  springs: SpringResultFH5;
  damping: DampingResultFH5;
  aero: AeroResultFH5;
  brakes: BrakeResultFH5;
  diff: DiffResultFH5;
  version: string;
}

const clamp = (v: number, mn: number, mx: number) =>
  Math.max(mn, Math.min(mx, v));
const r1 = (n: number) => Math.round(n * 10) / 10;

function calcTires({ drivetrain, discipline }: CalcInputFH5): TireResultFH5 {
  if (discipline === "drift") {
    const D: Record<Drivetrain, [number, number]> = {
      AWD: [1.6, 2.8],
      RWD: [1.0, 3.8],
      FWD: [3.0, 1.0],
    };
    const [f, r] = D[drivetrain];
    return { pressureF: f, pressureR: r };
  }
  const BASE: Record<Drivetrain, [number, number]> = {
    AWD: [2.2, 2.2],
    RWD: [2.0, 2.4],
    FWD: [2.4, 2.0],
  };
  const OFF: Record<DisciplineFH5, number> = {
    street: 0,
    track: 0.2,
    offroad: -1.0,
    rally: -0.8,
    drift: 0,
  };
  const [bf, br] = BASE[drivetrain];
  const adj = OFF[discipline];
  return {
    pressureF: r1(clamp(bf + adj, 1.0, 3.8)),
    pressureR: r1(clamp(br + adj, 1.0, 3.8)),
  };
}

function calcAlignment({ discipline }: CalcInputFH5): AlignmentResultFH5 {
  const CAMBER: Record<DisciplineFH5, [number, number]> = {
    street: [-1.5, -1.0],
    track: [-2.0, -1.5],
    rally: [-0.4, -0.2],
    offroad: [0, 0],
    drift: [-5.0, -1.0],
  };
  const TOE: Record<DisciplineFH5, [number, number]> = {
    street: [0.0, 0.1],
    track: [0.0, 0.2],
    rally: [0.1, 0.3],
    offroad: [0.0, 0.2],
    drift: [0.3, -0.3],
  };
  const CASTER: Record<DisciplineFH5, number> = {
    street: 5.0,
    track: 6.0,
    offroad: 3.0,
    rally: 4.0,
    drift: 7.0,
  };
  const [camberF, camberR] = CAMBER[discipline];
  const [toeF, toeR] = TOE[discipline];
  return { camberF, camberR, toeF, toeR, caster: CASTER[discipline] };
}

function calcArb({
  drivetrain,
  discipline,
  balanceFront,
}: CalcInputFH5): ArbResultFH5 {
  if (discipline === "drift") return { front: 10.0, rear: 65.0 };
  const BASE: Record<Drivetrain, [number, number]> = {
    AWD: [0.46, 0.5],
    RWD: [0.89, 0.25],
    FWD: [0.45, 0.7],
  };
  const [pF, pR] = BASE[drivetrain];
  let front = pF * 65;
  let rear = pR * 65;
  const balAdj = (balanceFront - 50) * 0.12;
  front += balAdj;
  rear -= balAdj;
  if (discipline === "offroad" || discipline === "rally") {
    front *= 0.6;
    rear *= 0.6;
    if (drivetrain === "RWD") front += 8;
  } else if (discipline === "track") {
    front *= 1.08;
    rear *= 1.05;
  }
  return { front: r1(clamp(front, 1, 65)), rear: r1(clamp(rear, 1, 65)) };
}

function calcSprings({
  weightKg,
  balanceFront,
  discipline,
  drivetrain,
  torqueNm,
}: CalcInputFH5): SpringResultFH5 {
  const STIFF: Record<DisciplineFH5, number> = {
    street: 1.0,
    track: 1.5,
    rally: 0.7,
    offroad: 0.5,
    drift: 1.1,
  };
  const RIDE: Record<DisciplineFH5, number> = {
    street: 20,
    track: 0,
    rally: 60,
    offroad: 100,
    drift: 0,
  };
  const base = (weightKg / 8) * STIFF[discipline];
  let rateF = base * (balanceFront / 50);
  let rateR = base * ((100 - balanceFront) / 50);
  const tqBonus = Math.min((torqueNm / 2000) * 30, 30);
  if (drivetrain === "RWD") rateR += tqBonus;
  if (drivetrain === "AWD") {
    rateR += tqBonus * 0.5;
    rateF += tqBonus * 0.3;
  }
  return {
    rateF: r1(Math.max(10, rateF)),
    rateR: r1(Math.max(10, rateR)),
    rideHeightPct: RIDE[discipline],
  };
}

function calcDamping(
  sp: SpringResultFH5,
  { discipline }: CalcInputFH5,
): DampingResultFH5 {
  const RB_MULT: Record<DisciplineFH5, number> = {
    street: 1.0,
    track: 1.1,
    rally: 0.75,
    offroad: 0.65,
    drift: 0.9,
  };
  const m = RB_MULT[discipline];
  const rF = r1(clamp(sp.rateF * 0.055 * m, 1, 20));
  const rR = r1(clamp(sp.rateR * 0.055 * m, 1, 20));
  return {
    reboundF: rF,
    reboundR: rR,
    bumpF: r1(clamp(rF * 0.65, 1, 20)),
    bumpR: r1(clamp(rR * 0.65, 1, 20)),
  };
}

function calcAero({ discipline }: CalcInputFH5): AeroResultFH5 {
  const PCT: Record<DisciplineFH5, number> = {
    street: 100,
    track: 100,
    offroad: 50,
    rally: 50,
    drift: 0,
  };
  return { pct: PCT[discipline] };
}

function calcBrakes({
  balanceFront,
  discipline,
}: CalcInputFH5): BrakeResultFH5 {
  const biasFront = r1(clamp(50 + (balanceFront - 50) * 0.4, 40, 70));
  const PRESSURE: Record<DisciplineFH5, number> = {
    street: 100,
    track: 130,
    rally: 85,
    offroad: 75,
    drift: 75,
  };
  return { biasFront, pressure: PRESSURE[discipline] };
}

function calcDiff({
  drivetrain,
  discipline,
  torqueNm,
}: CalcInputFH5): DiffResultFH5 {
  type DB = { fA: number; fD: number; rA: number; rD: number; ctr: number };
  const D: Record<DisciplineFH5, DB> = {
    street: { fA: 35, fD: 25, rA: 45, rD: 30, ctr: 50 },
    track: { fA: 40, fD: 30, rA: 55, rD: 35, ctr: 55 },
    offroad: { fA: 70, fD: 55, rA: 80, rD: 60, ctr: 65 },
    rally: { fA: 65, fD: 50, rA: 75, rD: 55, ctr: 60 },
    drift: { fA: 20, fD: 15, rA: 85, rD: 20, ctr: 40 },
  };
  const d = D[discipline];
  const tqB = Math.min((torqueNm / 2000) * 15, 15);
  const rA = Math.min(100, Math.round(d.rA + tqB));
  const fA = Math.min(100, Math.round(d.fA + tqB * 0.5));
  switch (drivetrain) {
    case "RWD":
      return { rearAccel: rA, rearDecel: d.rD };
    case "FWD":
      return { frontAccel: fA, frontDecel: d.fD };
    case "AWD":
      return {
        frontAccel: fA,
        frontDecel: d.fD,
        rearAccel: rA,
        rearDecel: d.rD,
        center: d.ctr,
      };
  }
}

export function calculateFH5Tune(input: CalcInputFH5): TuneResultFH5 {
  const springs = calcSprings(input);
  return {
    tires: calcTires(input),
    alignment: calcAlignment(input),
    arb: calcArb(input),
    springs,
    damping: calcDamping(springs, input),
    aero: calcAero(input),
    brakes: calcBrakes(input),
    diff: calcDiff(input),
    version: "1.0",
  };
}
