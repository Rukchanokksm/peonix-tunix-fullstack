"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { CalculatorFH5 } from "@/components/calculator/CalculatorFH5";
import { CalculatorFH6 } from "@/components/calculator/CalculatorFH6";

function CalculatorDispatcher() {
  const params = useSearchParams();
  const game = params.get("game");
  if (game === "fh5") return <CalculatorFH5 />;
  return <CalculatorFH6 />;
}

export default function CalculatorPage() {
  return (
    <Suspense fallback={null}>
      <CalculatorDispatcher />
    </Suspense>
  );
}
