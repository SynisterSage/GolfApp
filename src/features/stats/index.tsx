import { TrendsSnapshot } from "../../types";
import { getRecentRounds } from "../rounds";

export function getTrendsSnapshot(): TrendsSnapshot | null {
  const last3 = getRecentRounds(3);
  if (last3.length < 2) return null;

  const firFirst = last3[last3.length - 1].firPct;
  const firLast = last3[0].firPct;
  const diff = Math.round((firLast - firFirst) * 100);

  const girDiff = Math.round((last3[0].girPct - last3[last3.length - 1].girPct) * 100);

  const headline =
    Math.abs(diff) >= Math.abs(girDiff)
      ? `Driving accuracy ${diff >= 0 ? "↑" : "↓"} ${Math.abs(diff)}% last ${last3.length} rounds`
      : `GIR ${girDiff >= 0 ? "↑" : "↓"} ${Math.abs(girDiff)}% last ${last3.length} rounds`;

  const details = `FIR: ${(last3[0].firPct * 100).toFixed(0)}% • GIR: ${(last3[0].girPct * 100).toFixed(0)}% (most recent)`;

  return { headline, details };
}
