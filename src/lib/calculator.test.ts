import { describe, expect, it } from "vitest";
import {
  calculateFH6Tune,
  type CalcInput,
  type Discipline,
  type Drivetrain,
} from "./calculator";

const DRIVETRAINS: Drivetrain[] = ["AWD", "FWD", "RWD"];
const DISCIPLINES: Discipline[] = [
  "street",
  "track",
  "offroad",
  "rally",
  "drift",
  "drag",
];

const baseInput = (overrides: Partial<CalcInput> = {}): CalcInput => ({
  balanceFront: 50,
  drivetrain: "RWD",
  discipline: "track",
  weightKg: 1400,
  powerHp: 400,
  ...overrides,
});

describe("calculateFH6Tune", () => {
  describe("smoke — every discipline × drivetrain combination", () => {
    for (const discipline of DISCIPLINES) {
      for (const drivetrain of DRIVETRAINS) {
        it(`${discipline} / ${drivetrain} returns a valid TuneResult`, () => {
          const result = calculateFH6Tune(
            baseInput({ discipline, drivetrain }),
          );
          expect(result.version).toBe("2.0");
          expect(result.tires.pressureF).toBeGreaterThan(0);
          expect(result.gear.finalDrive).toBeGreaterThan(0);
          expect(result.springs.rateF).toBeGreaterThan(0);
          expect(result.springs.rateR).toBeGreaterThan(0);
        });
      }
    }
  });

  describe("gear — finalDrive matches FH6 guide values", () => {
    it("powerHp=400 → finalDrive ≈ 4.25", () => {
      const result = calculateFH6Tune(baseInput({ powerHp: 400 }));
      expect(result.gear.finalDrive).toBeCloseTo(4.25, 2);
    });

    it("powerHp=600 → finalDrive ≈ 3.92", () => {
      const result = calculateFH6Tune(baseInput({ powerHp: 600 }));
      expect(result.gear.finalDrive).toBeCloseTo(3.92, 2);
    });
  });

  describe("invariants", () => {
    for (const discipline of DISCIPLINES) {
      for (const drivetrain of DRIVETRAINS) {
        it(`${discipline} / ${drivetrain}: toe is always 0`, () => {
          const result = calculateFH6Tune(
            baseInput({ discipline, drivetrain }),
          );
          expect(result.alignment.toeF).toBe(0);
          expect(result.alignment.toeR).toBe(0);
        });

        it(`${discipline} / ${drivetrain}: tire pressures stay in [1.0, 3.8] bar`, () => {
          const result = calculateFH6Tune(
            baseInput({ discipline, drivetrain }),
          );
          expect(result.tires.pressureF).toBeGreaterThanOrEqual(1.0);
          expect(result.tires.pressureF).toBeLessThanOrEqual(3.8);
          expect(result.tires.pressureR).toBeGreaterThanOrEqual(1.0);
          expect(result.tires.pressureR).toBeLessThanOrEqual(3.8);
        });
      }
    }

    it("aero.balance is 0 for drag (both downforce sliders are 0)", () => {
      const result = calculateFH6Tune(baseInput({ discipline: "drag" }));
      expect(result.aero.front).toBe(0);
      expect(result.aero.rear).toBe(0);
      expect(result.aero.balance).toBe(0);
    });
  });

  describe("drag — RWD/AWD use lower rear pressure for squat", () => {
    it("RWD drag: pressureR < pressureF", () => {
      const result = calculateFH6Tune(
        baseInput({ discipline: "drag", drivetrain: "RWD" }),
      );
      expect(result.tires.pressureR).toBeLessThan(result.tires.pressureF);
    });

    it("AWD drag: pressureR < pressureF", () => {
      const result = calculateFH6Tune(
        baseInput({ discipline: "drag", drivetrain: "AWD" }),
      );
      expect(result.tires.pressureR).toBeLessThan(result.tires.pressureF);
    });

    it("FWD drag: pressureR === pressureF (no squat tuning)", () => {
      const result = calculateFH6Tune(
        baseInput({ discipline: "drag", drivetrain: "FWD" }),
      );
      expect(result.tires.pressureR).toBe(result.tires.pressureF);
    });
  });

  describe("aero balance — track is in [0.40, 0.50]", () => {
    for (const drivetrain of DRIVETRAINS) {
      it(`${drivetrain} track`, () => {
        const result = calculateFH6Tune(
          baseInput({ discipline: "track", drivetrain }),
        );
        expect(result.aero.balance).toBeGreaterThanOrEqual(0.4);
        expect(result.aero.balance).toBeLessThanOrEqual(0.5);
      });
    }
  });
});
