import { Round, RoundSummary } from "../../types";

const sampleRounds: Round[] = [
  {
    id: "r3",
    date: "2025-08-20",
    course: "Packanack GC",
    tees: "White",
    holes: Array.from({ length: 18 }).map((_, i) => {
      const isPar3 = [3, 8, 12, 16].includes(i + 1);
      return {
        hole: i + 1,
        fairwayHit: isPar3 ? null : Math.random() > 0.35,
        greenInReg: Math.random() > 0.45,
        putts: Math.random() > 0.6 ? 2 : 1,
        score: 3 + Math.floor(Math.random() * 3),
      };
    }),
    playerHcp: 12,
  },
  {
    id: "r2",
    date: "2025-08-12",
    course: "Wayne CC",
    holes: Array.from({ length: 18 }).map((_, i) => ({
      hole: i + 1,
      fairwayHit: [3, 7, 11, 15].includes(i + 1) ? null : Math.random() > 0.4,
      greenInReg: Math.random() > 0.5,
      putts: Math.random() > 0.55 ? 2 : 1,
      score: 3 + Math.floor(Math.random() * 3),
    })),
    playerHcp: 12,
  },
  {
    id: "r1",
    date: "2025-08-02",
    course: "Preakness Valley",
    holes: Array.from({ length: 18 }).map((_, i) => ({
      hole: i + 1,
      fairwayHit: [2, 6, 13, 17].includes(i + 1) ? null : Math.random() > 0.48,
      greenInReg: Math.random() > 0.55,
      putts: Math.random() > 0.5 ? 2 : 1,
      score: 3 + Math.floor(Math.random() * 3),
    })),
    playerHcp: 13,
  },
];

function summarize(round: Round): RoundSummary {
  const holes = round.holes.length;
  let fairwayAttempts = 0, fairwayHits = 0, gir = 0, putts = 0, strokes = 0;

  round.holes.forEach(h => {
    if (h.fairwayHit !== null) {
      fairwayAttempts += 1;
      if (h.fairwayHit) fairwayHits += 1;
    }
    if (h.greenInReg) gir += 1;
    putts += h.putts;
    strokes += h.score;
  });

  const firPct = fairwayAttempts ? fairwayHits / fairwayAttempts : 0;
  const girPct = gir / holes;
  const score = strokes;

  const netVsHcp = typeof round.playerHcp === "number"
    ? score - (72 + (round.playerHcp ?? 0)) // crude net vs par+hcp
    : undefined;

  return {
    id: round.id,
    date: round.date,
    course: round.course,
    holes,
    firPct,
    girPct,
    putts,
    score,
    netVsHcp,
  };
}

export function getRecentRounds(limit = 5): RoundSummary[] {
  return sampleRounds
    .slice()
    .sort((a, b) => a.date < b.date ? 1 : -1)
    .slice(0, limit)
    .map(summarize);
}

export function getRoundById(id: string): Round | undefined {
  return sampleRounds.find(r => r.id === id);
}

export function getLastRound(): RoundSummary | null {
  const list = getRecentRounds(1);
  return list.length ? list[0] : null;
}
