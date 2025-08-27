// src/features/rounds/rounds.ts
import type { Round, RoundSummary } from "./types";

const MOCK_ROUNDS: Round[] = [
  {
    id: "r_006",
    date: "2025-08-23T14:10:00.000Z",
    course: "Packanack GC",
    holes: 18,
    par: 72,
    score: 86,
    putts: 32,
    firPct: 0.61,
    girPct: 0.44,
    netVsHcp: -1,
    notes: "Solid back nine; wedges felt great.",
  },
  {
    id: "r_005",
    date: "2025-08-17T13:30:00.000Z",
    course: "Bethpage Red",
    holes: 18,
    par: 71,
    score: 92,
    putts: 35,
    firPct: 0.50,
    girPct: 0.33,
    netVsHcp: +2,
  },
  // ...more mock rounds...
];

export function getRecentRounds(limit = 10): RoundSummary[] {
  return [...MOCK_ROUNDS]
    .sort((a, b) => +new Date(b.date) - +new Date(a.date))
    .slice(0, limit);
}

export function getRoundById(id: string): Round | null {
  return MOCK_ROUNDS.find(r => r.id === id) ?? null;
}
