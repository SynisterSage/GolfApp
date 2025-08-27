// src/features/rounds/types.ts
export type RoundSummary = {
  id: string;
  date: string;         // ISO date
  course: string;
  holes: number;        // 9 | 18
  par: number;
  score: number;
  putts: number;
  firPct: number;       // 0..1
  girPct: number;       // 0..1
  netVsHcp?: number;    // e.g., -2, 0, +3
};

export type Round = RoundSummary & {
  courseImage?: string; // thumb url or require(...) later
  tees?: string;        // e.g., Blue / White / Black
  matchType?: "Stroke" | "Match" | "Skins" | "Practice";
  result?: "Win" | "Loss" | "Tie" | "N/A";
  longestDrive?: number; // yards
  bestClub?: string;
  notes?: string;
};
