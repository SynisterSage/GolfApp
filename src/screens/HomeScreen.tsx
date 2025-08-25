// screens/HomeScreen.tsx
import React, { useEffect, useMemo, useState } from "react";
import { View, Text, StyleSheet, ScrollView, Pressable } from "react-native";
import { useNavigation } from "@react-navigation/native";
import Svg, { Path, Circle, Defs, LinearGradient, Stop, Rect } from "react-native-svg";

/* ───────────────────────────── Types + Mock Data ───────────────────────────── */

type RoundSummary = {
  id: string;
  date: string;          // ISO date
  course: string;
  par: number;
  score: number;
  netVsHcp?: number;
  firPct: number;        // 0..1
  girPct: number;        // 0..1
  longestDrive?: number; // yards
  bestClub?: string;
};

const MOCK_LAST_ROUND: RoundSummary = {
  id: "r_001",
  date: "2025-08-19T12:00:00.000Z",
  course: "Packanack GC",
  par: 72,
  score: 67,
  netVsHcp: -17,
  firPct: 0.36,
  girPct: 0.72,
  longestDrive: 287,
  bestClub: "5i",
};

const MOCK_TIP = {
  title: "Sharpen GIR with mid‑irons",
  goal: "Lift GIR from 72% → 78% over next 3 rounds",
  teaser:
    "Your approach dispersion tightens when you commit to a 3‑second pre‑shot routine. Practice 10x balls with a 7‑iron: aim small, 75% tempo, hold finish.",
};

/* ───────────────────────────── Icons / UI helpers ──────────────────────────── */

const ArrowRight = ({ size = 18, color = "#0a7d36" }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M8 4l8 8-8 8" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const FlagPole = ({ color = "rgba(10,125,54,0.25)" }) => (
  <Svg width={44} height={44} viewBox="0 0 48 48" fill="none">
    <Path d="M16 8v32" stroke={color} strokeWidth={2} />
    <Path d="M16 10h16l-4 5 4 5H16" fill={color} />
    <Circle cx="16" cy="42" r="3.5" stroke={color} />
  </Svg>
);

function SmallIconButton({
  onPress,
  bg = "#0a7d36",
  style,
}: {
  onPress?: () => void;
  bg?: string;
  style?: any;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.iconBtn,
        { backgroundColor: bg },
        style,
        pressed && { opacity: 0.85 },
      ]}
    >
      <ArrowRight color="#fff" size={16} />
    </Pressable>
  );
}

function DonutStat({ label, pct }: { label: string; pct: number }) {
  const size = 74;
  const stroke = 10;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const clamped = Math.max(0, Math.min(1, pct));
  const dash = clamped * c;

  return (
    <View style={styles.donut}>
      <Svg width={size} height={size}>
        <Circle cx={size / 2} cy={size / 2} r={r} stroke="#E6EFE7" strokeWidth={stroke} fill="none" />
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          stroke="#0a7d36"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={`${dash}, ${c - dash}`}
          rotation={-90}
          originX={size / 2}
          originY={size / 2}
          fill="none"
        />
      </Svg>
      <View style={styles.donutCenter}>
        <Text style={styles.donutValue}>{Math.round(clamped * 100)}%</Text>
        <Text style={styles.donutLabel}>{label}</Text>
      </View>
    </View>
  );
}

/* ───────────────────────────────── Screen ─────────────────────────────────── */

type Nav = ReturnType<typeof useNavigation>;

export default function HomeScreen() {
  const nav = useNavigation<Nav>();
  const lastRound = useMemo(() => MOCK_LAST_ROUND, []);
  const tip = useMemo(() => MOCK_TIP, []);

  // live local time (updates every 30s)
  const [time, setTime] = useState(
    new Date().toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })
  );
  useEffect(() => {
    const id = setInterval(() => {
      setTime(new Date().toLocaleTimeString([], { hour: "numeric", minute: "2-digit" }));
    }, 30 * 1000);
    return () => clearInterval(id);
  }, []);

  const onStartRound = () => {
    // @ts-ignore
    nav.navigate("Play", { mode: "gps" });
  };
  const openRound = (r?: RoundSummary) => {
    if (!r) return;
    // @ts-ignore
    nav.navigate("Stats", { roundId: r.id });
  };
  const openPractice = () => {
    // @ts-ignore
    nav.navigate("Practice");
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      {/* Page header */}
      <View style={styles.pageHeader}>
        <Text style={styles.welcome}>Welcome back!</Text>
        <Text style={styles.timeNow}>{time}</Text>
      </View>

      {/* HERO — Start Round */}
      <Pressable onPress={onStartRound} style={({ pressed }) => [styles.hero, pressed && styles.pressed]}>
        {/* gradient "pill" band */}
        <View style={styles.heroBand}>
          <Svg pointerEvents="none" width="100%" height="100%" style={StyleSheet.absoluteFill}>
            <Defs>
              {/* left-to-right gradient so it looks like your mock */}
              <LinearGradient id="heroBandGradient" x1="0" y1="0" x2="1" y2="0">
                <Stop offset="0%" stopColor="#2FA66A" stopOpacity="1" />
                <Stop offset="70%" stopColor="#2FA66A" stopOpacity="0.45" />
                <Stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
              </LinearGradient>
            </Defs>
            <Rect x="0" y="0" width="100%" height="100%" rx={14} ry={14} fill="url(#heroBandGradient)" />
          </Svg>

          <View style={styles.heroContent}>
            <FlagPole />
            <View style={{ marginLeft: 12 }}>
              <Text style={styles.heroTitle}>Start Round</Text>
              {/* visible subtitle (white, not ultra-faint green) */}
              <Text style={styles.heroSub}>GPS auto-detect or search course</Text>
            </View>
          </View>
        </View>

        {/* CTA button floats on the right edge of the hero */}
        <SmallIconButton
          onPress={onStartRound}
          style={styles.heroCta}
        />
      </Pressable>

      {/* Section: Your golf today */}
      <Text style={styles.sectionTitle}>Your golf today</Text>

      {/* Grid: Last Played (left) + Practice (right) */}
      <View style={styles.grid}>
        <Pressable onPress={() => openRound(lastRound)} style={({ pressed }) => [styles.card, styles.half, pressed && styles.pressed]}>
          <Text style={styles.cardTitle}>{lastRound.course}</Text>
          <Text style={styles.dateText}>{new Date(lastRound.date).toLocaleDateString()}</Text>

          <View style={styles.metaRow}>
            <Text style={styles.metaKey}>Par</Text>
            <Text style={styles.metaVal}>{lastRound.par}</Text>
            <View style={styles.metaDot} />
            <Text style={styles.metaKey}>Score</Text>
            <Text style={styles.metaValEm}>{lastRound.score}</Text>
          </View>

          <View style={styles.metaRow}>
            <Text style={styles.metaKey}>Longest Drive</Text>
            <Text style={styles.metaValEm}>{`${lastRound.longestDrive} yds`}</Text>
          </View>

          <View style={styles.metaRow}>
            <Text style={styles.metaKey}>Best Club</Text>
            <Text style={styles.metaVal}>{lastRound.bestClub}</Text>
          </View>
        </Pressable>

        <Pressable
          onPress={openPractice}
          style={({ pressed }) => [styles.card, styles.half, styles.practiceSquare, pressed && styles.pressed]}
        >
          <Text style={styles.cardTitle}>Practice Mode</Text>
          <Text style={styles.subtle}>Jump into standalone training tools</Text>
          <View style={styles.rightArrowHolder}>
            <SmallIconButton onPress={openPractice} />
          </View>
        </Pressable>
      </View>

      {/* Section: Round snapshot */}
      <Text style={[styles.sectionTitle, { marginTop: 18 }]}>Round snapshot</Text>

      {/* Stats + merged Quick Highlights */}
      <View style={[styles.card, styles.cardLg]}>
        <View style={styles.statHeader}>
          <Text style={styles.subtle}>
            {`${new Date(lastRound.date).toLocaleDateString()} • ${lastRound.course} • Net ${(lastRound.netVsHcp ?? 0) >= 0 ? "+" : ""}${lastRound.netVsHcp}`}
          </Text>
          <Text style={styles.scoreText}>Score {lastRound.score}</Text>
        </View>

        <View style={styles.donutRow}>
          <DonutStat label="FIR" pct={lastRound.firPct} />
          <DonutStat label="GIR" pct={lastRound.girPct} />
          <DonutStat label="Par" pct={0.45} />
        </View>

        <View style={styles.hlRow}>
          <View style={{ flex: 1 }}>
            <Text style={styles.hlTitle}>Quick Highlights</Text>
            <Text style={styles.subtle}>Learn more about your last round</Text>
          </View>
          <SmallIconButton onPress={() => openRound(lastRound)} />
        </View>
      </View>

      {/* Section: Tips */}
      <Text style={[styles.sectionTitle, { marginTop: 18 }]}>Tips for you</Text>

      {/* Tips + CTA to Practice */}
      <View style={[styles.card, styles.tipsCard]}>
        <Text style={styles.tipTitle}>{tip.title}</Text>
        <Text style={styles.subtle}>{tip.goal}</Text>
        <Text style={styles.tipBody}>{tip.teaser}</Text>

        <View style={styles.tipCtaRow}>
          <Pressable onPress={openPractice} style={({ pressed }) => [styles.tipBtn, pressed && { opacity: 0.9 }]}>
            <Text style={styles.tipBtnText}>Open Practice</Text>
            <ArrowRight size={16} color="#fff" />
          </Pressable>
        </View>
      </View>

      <View style={{ height: 28 }} />
    </ScrollView>
  );
}

/* ───────────────────────────────── Styles ─────────────────────────────────── */

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#ffffff" },
  content: { padding: 16 },
  pressed: { opacity: 0.9 },

  /* Page header */
  pageHeader: {
    paddingBottom: 6,
    marginBottom: 8,
    flexDirection: "row",
    alignItems: "baseline",
    justifyContent: "space-between",
  },
  welcome: { fontSize: 22, fontWeight: "800", color: "#0B3A1E" },
  timeNow: { fontSize: 14, color: "#6b7280", fontWeight: "600" },

  /* HERO container */
  hero: {
    position: "relative",
    borderRadius: 16,
    padding: 12,                 // tighter so the inner band sizes perfectly
    marginBottom: 16,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "#CFE8D9",
    backgroundColor: "#E7F4EC",  // soft surface around the band
    elevation: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 1,
  },

  /* gradient "pill" band */
  heroBand: {
    height: 56,                  // controls the band height
    borderRadius: 14,
    overflow: "hidden",
    paddingHorizontal: 12,       // text padding inside the band
    justifyContent: "center",
    marginRight: 56,             // leave room for the round CTA button on the right
  },
  heroContent: { flexDirection: "row", alignItems: "center" },

  /* CTA button pinned on the right edge, centered vertically */
  heroCta: {
    position: "absolute",
    right: 12,
    top: 12 + (56 - 34) / 2,     // align with band vertically (hero has 12px padding)
  },

  heroTitle: { fontSize: 18, fontWeight: "800", color: "#0B3A1E" },
  heroSub: { marginTop: 2, color: "rgba(255,255,255,0.92)" }, // visible on the band

  iconBtn: {
    width: 34,
    height: 34,
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#0a7d36",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
  },

  /* Section titles */
  sectionTitle: {
    fontSize: 14,
    color: "#6b7280",
    fontWeight: "700",
    paddingHorizontal: 2,
    marginBottom: 10,
    textTransform: "uppercase",
    letterSpacing: 0.6,
  },

  /* Grid */
  grid: { flexDirection: "row", flexWrap: "wrap", gap: 12 },
  half: { flexBasis: "48%", flexGrow: 1 },

  /* Shared gray card look */
  card: {
    backgroundColor: "#F7F8FA",
    borderRadius: 14,
    padding: 14,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "#E3E5E8",
    elevation: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 1,
  },
  cardLg: {
    padding: 16,
    borderRadius: 16,
    marginTop: 2,
  },

  cardTitle: { fontSize: 16, fontWeight: "800", color: "#0B3A1E", marginBottom: 2 },
  dateText: { color: "#6A7D71", marginBottom: 8, fontSize: 12 },

  metaRow: { flexDirection: "row", alignItems: "center", marginBottom: 4 },
  metaKey: { color: "#667085" },
  metaVal: { color: "#0B3A1E", fontWeight: "700", marginLeft: 6 },
  metaValEm: { color: "#0B3A1E", fontWeight: "800", marginLeft: 6 },
  metaDot: { width: 4, height: 4, borderRadius: 2, backgroundColor: "#C8D6CE", marginHorizontal: 10 },

  practiceSquare: { minHeight: 148, paddingBottom: 48 },
  rightArrowHolder: { position: "absolute", right: 12, bottom: 12 },

  /* Stats / Quick Highlights merged */
  statHeader: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  scoreText: { fontSize: 14, fontWeight: "800", color: "#0B3A1E" },

  donutRow: { flexDirection: "row", justifyContent: "space-between", marginTop: 14 },
  donut: { width: 100, alignItems: "center", justifyContent: "center" },
  donutCenter: { position: "absolute", alignItems: "center", justifyContent: "center" },
  donutValue: { fontWeight: "800", fontSize: 16, color: "#0B3A1E" },
  donutLabel: { color: "#6b7280", fontSize: 12, marginTop: 2 },

  hlRow: {
    marginTop: 14,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: "#E3E5E8",
    paddingTop: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  hlTitle: { fontSize: 16, fontWeight: "800", color: "#0B3A1E" },

  /* Tips */
  tipsCard: { marginTop: 2, paddingBottom: 16 },
  tipTitle: { fontSize: 16, fontWeight: "800", color: "#0B3A1E" },
  tipBody: { marginTop: 8, lineHeight: 20, color: "#374151" },
  tipCtaRow: { marginTop: 12, alignItems: "flex-start" },
  tipBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "#0a7d36",
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 999,
  },
  tipBtnText: { color: "#fff", fontWeight: "800" },

  subtle: { color: "#6b7280" },
});
