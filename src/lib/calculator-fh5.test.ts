import { describe, expect, it } from "vitest";
import type { Drivetrain } from "./calculator";
import {
  calculateFH5Tune,
  type CalcInputFH5,
  type DisciplineFH5,
} from "./calculator-fh5";

const DRIVETRAINS: Drivetrain[] = ["AWD", "FWD", "RWD"];
const DISCIPLINES: DisciplineFH5[] = [
  "street",
  "track",
  "offroad",
  "rally",
  "drift",
];

const baseInput = (overrides: Partial<CalcInputFH5> = {}): CalcInputFH5 => ({
  balanceFront: 50,
  drivetrain: "RWD",
  discipline: "track",
  weightKg: 1400,
  torqueNm: 400,
  ...overrides,
});

describe("calculateFH5Tune", () => {
  for (const discipline of DISCIPLINES) {
    for (const drivetrain of DRIVETRAINS) {
      it(`${discipline} / ${drivetrain} returns a valid TuneResultFH5`, () => {
        const result = calculateFH5Tune(baseInput({ discipline, drivetrain }));
        expect(result.version).toBe("1.0");
        expect(result.tires.pressureF).toBeGreaterThan(0);
        expect(result.springs.rateF).toBeGreaterThan(0);
        expect(result.springs.rateR).toBeGreaterThan(0);
        expect(result.brakes.biasFront).toBeGreaterThanOrEqual(40);
        expect(result.brakes.biasFront).toBeLessThanOrEqual(70);
        expect(result.aero.pct).toBeGreaterThanOrEqual(0);
        expect(result.aero.pct).toBeLessThanOrEqual(100);
      });
    }
  }

  it("drift mode produces asymmetric tire pressures for RWD", () => {
    const r = calculateFH5Tune(
      baseInput({ discipline: "drift", drivetrain: "RWD" }),
    );
    expect(r.tires.pressureF).toBe(1.0);
    expect(r.tires.pressureR).toBe(3.8);
  });

  it("RWD diff only sets rear, AWD sets both + center", () => {
    const rwd = calculateFH5Tune(baseInput({ drivetrain: "RWD" }));
    expect(rwd.diff.rearAccel).toBeDefined();
    expect(rwd.diff.frontAccel).toBeUndefined();
    expect(rwd.diff.center).toBeUndefined();

    const awd = calculateFH5Tune(baseInput({ drivetrain: "AWD" }));
    expect(awd.diff.frontAccel).toBeDefined();
    expect(awd.diff.rearAccel).toBeDefined();
    expect(awd.diff.center).toBeDefined();
  });
});
