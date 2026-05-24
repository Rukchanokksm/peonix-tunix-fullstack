// ─── FH6 Auto Tune Calculator — Engine v2.0 ──────────────────────────────────

export type Drivetrain = "AWD" | "FWD" | "RWD";
export type Discipline =
  | "street"
  | "track"
  | "offroad"
  | "rally"
  | "drift"
  | "drag";

export interface CalcInput {
  balanceFront: number; // % 0–100 (front weight share)
  drivetrain: Drivetrain;
  discipline: Discipline;
  weightKg: number;
  powerHp: number; // in-game FH6 garage power unit is hp
}

export interface TireResult {
  pressureF: number; // bar
  pressureR: number; // bar
}
export interface AlignmentResult {
  camberF: number;
  camberR: number;
  toeF: number;
  toeR: number;
  caster: number;
}
export interface ArbResult {
  front: number;
  rear: number;
}
export interface SpringResult {
  rateF: number;
  rateR: number;
  rideHeightPct: number;
}
export interface DampingResult {
  reboundF: number;
  reboundR: number;
  bumpF: number;
  bumpR: number;
}
export interface AeroResult {
  front: number; // % of slider max
  rear: number; // % of slider max
  balance: number; // FH6 aero balance stat, target 0.40–0.50
}
export interface BrakeResult {
  biasFront: number;
  pressure: number;
}
export interface DiffResult {
  frontAccel?: number;
  frontDecel?: number;
  rearAccel?: number;
  rearDecel?: number;
  center?: number;
}
export interface GearResult {
  finalDrive: number;
}

export interface TuneResult {
  tires: TireResult;
  alignment: AlignmentResult;
  arb: ArbResult;
  springs: SpringResult;
  damping: DampingResult;
  aero: AeroResult;
  brakes: BrakeResult;
  diff: DiffResult;
  gear: GearResult;
  version: string;
}

const clamp = (v: number, mn: number, mx: number) =>
  Math.max(mn, Math.min(mx, v));
const r1 = (n: number) => Math.round(n * 10) / 10;
const r2 = (n: number) => Math.round(n * 100) / 100;

// ── TIRES ─────────────────────────────────────────────────────────────────────
// Guide authors pressures in PSI; the UI displays bar (psi / 14.504).
function calcTires({ drivetrain, discipline }: CalcInput): TireResult {
  const PSI_TO_BAR = 1 / 14.504;
  // [front PSI, rear PSI]
  const PSI: Record<Discipline, [number, number]> = {
    street: [30, 30],
    track: [31, 31],
    rally: [27, 27],
    offroad: [27, 27],
    drift: [31, 38], // high rear pressure to break grip
    drag: [30, 30],
  };
  const [pf, pr] = PSI[discipline];
  // Drag: lower rear pressure on driven-rear cars helps the launch squat.
  const rearPsi = discipline === "drag" && drivetrain !== "FWD" ? 22 : pr;
  return {
    pressureF: r1(clamp(pf * PSI_TO_BAR, 1.0, 3.8)),
    pressureR: r1(clamp(rearPsi * PSI_TO_BAR, 1.0, 3.8)),
  };
}

// ── ALIGNMENT ─────────────────────────────────────────────────────────────────
// Toe stays 0 everywhere — the toe slider is buggy/unpredictable in Horizon.
function calcAlignment({ discipline }: CalcInput): AlignmentResult {
  const CAMBER: Record<Discipline, [number, number]> = {
    street: [-1.8, -1.0],
    track: [-2.3, -1.5],
    rally: [-0.8, -0.6],
    offroad: [-0.5, -0.3],
    drift: [-4.0, -1.5],
    drag: [0.0, 0.0],
  };
  const CASTER: Record<Discipline, number> = {
    street: 6.0,
    track: 6.3,
    rally: 5.5,
    offroad: 5.5,
    drift: 7.0,
    drag: 6.0,
  };
  const [camberF, camberR] = CAMBER[discipline];
  return { camberF, camberR, toeF: 0, toeR: 0, caster: CASTER[discipline] };
}

// ── ANTIROLL BARS ─────────────────────────────────────────────────────────────
// Discipline baseline + ±0.5 per 1% weight-distribution deviation from 50% front.
function calcArb({
  drivetrain,
  discipline,
  balanceFront,
}: CalcInput): ArbResult {
  if (discipline === "drift") return { front: 55, rear: 2 };
  if (discipline === "drag") return { front: 2, rear: 2 };
  // [front, rear] mid-class baseline
  const BASE: Record<Discipline, [number, number]> = {
    street: [26, 28],
    track: [32, 34],
    rally: [12, 12],
    offroad: [11, 11],
    drift: [55, 2], // unused (early return above)
    drag: [2, 2], // unused (early return above)
  };
  let [front, rear] = BASE[discipline];
  // Drivetrain spread
  if (drivetrain === "RWD") {
    front += 4;
    rear -= 2;
  } else if (drivetrain === "FWD") {
    front -= 2;
    rear += 4;
  }
  // Weight-distribution adjustment
  const dev = balanceFront - 50;
  front += dev * 0.5;
  rear -= dev * 0.5;
  return { front: r1(clamp(front, 1, 65)), rear: r1(clamp(rear, 1, 65)) };
}

// ── SPRINGS ───────────────────────────────────────────────────────────────────
function calcSprings({
  weightKg,
  balanceFront,
  discipline,
  drivetrain,
  powerHp,
}: CalcInput): SpringResult {
  const STIFF: Record<Discipline, number> = {
    street: 1.0,
    track: 1.5,
    rally: 0.7,
    offroad: 0.5,
    drift: 1.1,
    drag: 0.8,
  };
  const RIDE: Record<Discipline, number> = {
    street: 20,
    track: 0,
    rally: 60,
    offroad: 100,
    drift: 0,
    drag: 0,
  };
  const base = (weightKg / 8) * STIFF[discipline];
  let rateF = base * (balanceFront / 50);
  let rateR = base * ((100 - balanceFront) / 50);
  // Power-driven axle stiffening (hp). Modest — absolute spring values are
  // not meaningful in Forza; ratio/balance matter. 1475 hp ≈ 1100 kW cap.
  const pwBonus = Math.min((powerHp / 1475) * 28, 28);
  if (drivetrain === "RWD") rateR += pwBonus;
  if (drivetrain === "AWD") {
    rateR += pwBonus * 0.5;
    rateF += pwBonus * 0.3;
  }
  // Drift: stiff front, soft rear. Drag: firm front, soft rear (squat).
  if (discipline === "drift") {
    rateF *= 1.25;
    rateR *= 0.7;
  } else if (discipline === "drag") {
    rateF *= 1.2;
    rateR *= 0.6;
  }
  return {
    rateF: r1(Math.max(10, rateF)),
    rateR: r1(Math.max(10, rateR)),
    rideHeightPct: RIDE[discipline],
  };
}

// ── DAMPING ───────────────────────────────────────────────────────────────────
// Bump ≈ 2/3 of rebound. Drag uses an inverted profile.
function calcDamping(
  sp: SpringResult,
  { discipline }: CalcInput,
): DampingResult {
  const RB_MULT: Record<Discipline, number> = {
    street: 1.0,
    track: 1.1,
    rally: 0.75,
    offroad: 0.65,
    drift: 0.9,
    drag: 0.9,
  };
  const m = RB_MULT[discipline];
  const rF = r1(clamp(sp.rateF * 0.055 * m, 1, 20));
  const rR = r1(clamp(sp.rateR * 0.055 * m, 1, 20));
  if (discipline === "drag") {
    // Stiff front bump + stiff rear rebound, soft opposite corners.
    return {
      reboundF: r1(clamp(rF * 0.45, 1, 20)),
      reboundR: r1(clamp(rR * 0.95, 1, 20)),
      bumpF: r1(clamp(rF * 0.95, 1, 20)),
      bumpR: r1(clamp(rR * 0.45, 1, 20)),
    };
  }
  return {
    reboundF: rF,
    reboundR: rR,
    bumpF: r1(clamp(rF * 0.65, 1, 20)),
    bumpR: r1(clamp(rR * 0.65, 1, 20)),
  };
}

// ── AERO ──────────────────────────────────────────────────────────────────────
// FH6 aero balance stat = rear share of downforce; target 0.40–0.50.
function calcAero({ discipline }: CalcInput): AeroResult {
  const AERO: Record<Discipline, [number, number]> = {
    street: [80, 62],
    track: [100, 78],
    rally: [30, 22],
    offroad: [25, 18],
    drift: [100, 0],
    drag: [0, 0],
  };
  const [front, rear] = AERO[discipline];
  const total = front + rear;
  const balance = total > 0 ? r2(rear / total) : 0;
  return { front, rear, balance };
}

// ── BRAKES ────────────────────────────────────────────────────────────────────
// FH6 brake-balance slider is corrected (right = front).
function calcBrakes({ balanceFront, discipline }: CalcInput): BrakeResult {
  const BIAS: Record<Discipline, number> = {
    street: 52,
    track: 53,
    rally: 60,
    offroad: 60,
    drift: 85,
    drag: 55,
  };
  const biasFront = r1(
    clamp(BIAS[discipline] + (balanceFront - 50) * 0.25, 40, 100),
  );
  const PRESSURE: Record<Discipline, number> = {
    street: 100,
    track: 100,
    rally: 95,
    offroad: 90,
    drift: 90,
    drag: 100,
  };
  return { biasFront, pressure: PRESSURE[discipline] };
}

// ── DIFFERENTIAL ──────────────────────────────────────────────────────────────
function calcDiff({ drivetrain, discipline, powerHp }: CalcInput): DiffResult {
  type DB = { fA: number; fD: number; rA: number; rD: number; ctr: number };
  const D: Record<Discipline, DB> = {
    street: { fA: 45, fD: 15, rA: 50, rD: 18, ctr: 55 },
    track: { fA: 48, fD: 18, rA: 55, rD: 20, ctr: 60 },
    offroad: { fA: 70, fD: 25, rA: 78, rD: 25, ctr: 65 },
    rally: { fA: 60, fD: 20, rA: 70, rD: 22, ctr: 60 },
    drift: { fA: 20, fD: 15, rA: 100, rD: 85, ctr: 85 },
    drag: { fA: 100, fD: 0, rA: 100, rD: 0, ctr: 70 },
  };
  const d = D[discipline];
  const pwB = Math.min((powerHp / 1475) * 12, 12);
  const rA = Math.min(100, Math.round(d.rA + pwB));
  const fA = Math.min(100, Math.round(d.fA + pwB * 0.5));
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

// ── GEAR ──────────────────────────────────────────────────────────────────────
// Guide formula: final drive 4.25 at 400 hp, −0.01 per 6 hp.
function calcGear({ powerHp }: CalcInput): GearResult {
  const finalDrive = clamp(4.25 - ((powerHp - 400) / 6) * 0.01, 2.5, 5.5);
  return { finalDrive: r2(finalDrive) };
}

// ── MAIN ──────────────────────────────────────────────────────────────────────
export function calculateFH6Tune(input: CalcInput): TuneResult {
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
    gear: calcGear(input),
    version: "2.0",
  };
}
