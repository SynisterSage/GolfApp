export type HoleStat = {
  hole: number;
  fairwayHit: boolean | null; // null for par 3
  greenInReg: boolean;
  putts: number;
  score: number; // strokes
};

export type Round = {
  id: string;
  date: string;        // ISO
  course: string;
  tees?: string;
  slope?: number;
  rating?: number;
  holes: HoleStat[];   // length 9 or 18
  playerHcp?: number;  // course handicap at time of round
};

export type RoundSummary = {
  id: string;
  date: string;
  course: string;
  holes: number;
  firPct: number;  // 0..1
  girPct: number;  // 0..1
  putts: number;
  score: number;   // total strokes
  netVsHcp?: number; // strokes vs course handicap (negative is better)
};

export type TrendsSnapshot = {
  headline: string;         // e.g., "Driving accuracy ↑ 8% last 3 rounds"
  details?: string;
};

export type Drill = {
  id: string;
  title: string;
  goal: string;             // what this improves
  teaser: string;           // 1–2 sentence free teaser
  premiumDetails?: string;  // hidden for free tier
};
