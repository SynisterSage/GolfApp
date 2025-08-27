// src/features/rounds/filters.ts
import type { Round } from "./types";

export type Filters = {
  query?: string;          // search by course name
  courses?: string[];      // exact match names
  dateFrom?: string;       // ISO
  dateTo?: string;         // ISO
  tees?: string[];         // labels
  holes?: number;          // 9 | 18
  matchType?: string[];    // Stroke/Match/Skins/Practice
  result?: string[];       // Win/Loss/Tie/N/A
  scoreMin?: number;
  scoreMax?: number;
  netMin?: number;
  netMax?: number;
  firMin?: number; firMax?: number; // 0..1
  girMin?: number; girMax?: number; // 0..1
  puttsMin?: number; puttsMax?: number;
  par?: number[];          // 70/71/72
};

export type SortKey = "date" | "score";
export type SortDir = "asc" | "desc";
export type SortSpec = { key: SortKey; dir: SortDir };

export function filterRounds(rounds: Round[], f: Filters): Round[] {
  return rounds.filter(r => {
    if (f.query && !r.course.toLowerCase().includes(f.query.toLowerCase())) return false;
    if (f.courses?.length && !f.courses.includes(r.course)) return false;

    if (f.dateFrom && new Date(r.date) < new Date(f.dateFrom)) return false;
    if (f.dateTo && new Date(r.date) > new Date(f.dateTo)) return false;

    if (typeof f.holes === "number" && r.holes !== f.holes) return false;
    if (f.tees?.length && (!r.tees || !f.tees.includes(r.tees))) return false;

    if (f.matchType?.length && (!r.matchType || !f.matchType.includes(r.matchType))) return false;
    if (f.result?.length && (!r.result || !f.result.includes(r.result))) return false;

    if (f.scoreMin != null && r.score < f.scoreMin) return false;
    if (f.scoreMax != null && r.score > f.scoreMax) return false;

    if (f.netMin != null && (r.netVsHcp ?? 0) < f.netMin) return false;
    if (f.netMax != null && (r.netVsHcp ?? 0) > f.netMax) return false;

    if (f.firMin != null && r.firPct < f.firMin) return false;
    if (f.firMax != null && r.firPct > f.firMax) return false;

    if (f.girMin != null && r.girPct < f.girMin) return false;
    if (f.girMax != null && r.girPct > f.girMax) return false;

    if (f.puttsMin != null && r.putts < f.puttsMin) return false;
    if (f.puttsMax != null && r.putts > f.puttsMax) return false;

    if (f.par?.length && !f.par.includes(r.par)) return false;

    return true;
  });
}

export function sortRounds(rounds: Round[], sort: SortSpec): Round[] {
  const arr = [...rounds];
  arr.sort((a, b) => {
    if (sort.key === "date") {
      const da = +new Date(a.date), db = +new Date(b.date);
      return sort.dir === "asc" ? da - db : db - da;
    }
    if (sort.key === "score") {
      return sort.dir === "asc" ? a.score - b.score : b.score - a.score;
    }
    return 0;
  });
  return arr;
}

export function countActiveFilters(f: Filters): number {
  const keys: (keyof Filters)[] = [
    "query","courses","dateFrom","dateTo","tees","holes","matchType","result",
    "scoreMin","scoreMax","netMin","netMax","firMin","firMax","girMin","girMax",
    "puttsMin","puttsMax","par"
  ];
  return keys.reduce((n, k) => {
    const v = f[k];
    if (Array.isArray(v)) return n + (v.length ? 1 : 0);
    if (typeof v === "string") return n + (v.trim() ? 1 : 0);
    if (typeof v === "number") return n + 1;
    if (v != null) return n + 1;
    return n;
  }, 0);
}
