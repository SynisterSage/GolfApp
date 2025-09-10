// src/screens/HomeScreen.tsx
import React, { useEffect, useMemo, useState } from "react";
import { View, Text, StyleSheet, ScrollView, Pressable } from "react-native";
import { useNavigation } from "@react-navigation/native";
import Svg, { Path, Circle, Defs, LinearGradient, Stop, Rect } from "react-native-svg";
import { useTheme } from "../theme";

/* ───────────────────────────── Types + Mock Data ───────────────────────────── */
type RoundSummary = {
  id: string;
  date: string; // ISO date
  course: string;
  par: number;
  score: number;
  netVsHcp?: number;
  firPct: number; // 0..1
  girPct: number; // 0..1
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
  title: "Sharpen GIR with mid-irons",
  goal: "Lift GIR from 72% → 78% over next 3 rounds",
  teaser:
    "Your approach dispersion tightens when you commit to a 3-second pre-shot routine. Practice 10x balls with a 7-iron: aim small, 75% tempo, hold finish.",
};

/* ───────────────────────────── Icons / UI helpers ──────────────────────────── */
function ArrowRight({ size = 18, color = "#000" }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M8 4l8 8-8 8" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

function FlagPole({ color }: { color: string }) {
  return (
    <Svg width={44} height={44} viewBox="0 0 48 48" fill="none">
      <Path d="M16 8v32" stroke={color} strokeWidth={2} />
      <Path d="M16 10h16l-4 5 4 5H16" fill={color} />
      <Circle cx="16" cy="42" r="3.5" stroke={color} />
    </Svg>
  );
}

function GolfBagIcon({ color, size = 24 }: { color: string; size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M8 4h8v16l-4 2-4-2V4z" stroke={color} strokeWidth={2} strokeLinejoin="round" />
      <Path d="M6 6h12" stroke={color} strokeWidth={2} strokeLinecap="round" />
      <Path d="M10 2v4M14 2v4" stroke={color} strokeWidth={2} strokeLinecap="round" />
    </Svg>
  );
}

function SmallIconButton({
  onPress,
  bg,
  fg = "#fff",
  style,
}: {
  onPress?: () => void;
  bg: string;
  fg?: string;
  style?: any;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        {
          width: 34,
          height: 34,
          borderRadius: 999,
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: bg,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.12,
          shadowRadius: 6,
          elevation: 2,
        },
        style,
        pressed && { opacity: 0.85 },
      ]}
    >
      <ArrowRight color={fg} size={16} />
    </Pressable>
  );
}

function DonutStat({
  label,
  pct,
  ring,
  track,
  text,
  muted,
}: {
  label: string;
  pct: number;
  ring: string;
  track: string;
  text: string;
  muted: string;
}) {
  const size = 74;
  const stroke = 10;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const clamped = Math.max(0, Math.min(1, pct));
  const dash = clamped * c;

  return (
    <View style={{ width: 100, alignItems: "center", justifyContent: "center" }}>
      <Svg width={size} height={size}>
        <Circle cx={size / 2} cy={size / 2} r={r} stroke={track} strokeWidth={stroke} fill="none" />
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          stroke={ring}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={`${dash}, ${c - dash}`}
          rotation={-90}
          originX={size / 2}
          originY={size / 2}
          fill="none"
        />
      </Svg>
      <View style={{ position: "absolute", alignItems: "center", justifyContent: "center" }}>
        <Text style={{ fontWeight: "800", fontSize: 16, color: text }}>{Math.round(clamped * 100)}%</Text>
        <Text style={{ color: muted, fontSize: 12, marginTop: 2 }}>{label}</Text>
      </View>
    </View>
  );
}

/* ───────────────────────────────── Screen ─────────────────────────────────── */
type Nav = ReturnType<typeof useNavigation>;

export default function HomeScreen() {
  const nav = useNavigation<Nav>();
  const { theme } = useTheme();
  const s = getStyles(theme);

  const lastRound = useMemo(() => MOCK_LAST_ROUND, []);
  const tip = useMemo(() => MOCK_TIP, []);

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
  const openBag = () => {
    // @ts-ignore
    nav.navigate("BagView");
  };

  return (
    <ScrollView
      style={s.container}
      contentContainerStyle={[s.content, { paddingBottom: theme.space(6) }]}
      showsVerticalScrollIndicator={false}
    >
      {/* Page header */}
      <View style={s.pageHeader}>
        <Text style={s.welcome}>Welcome back!</Text>
        <Text style={s.timeNow}>{time}</Text>
      </View>

      {/* HERO — Start Round (gradient-only, no image) */}
      <Pressable onPress={onStartRound} style={({ pressed }) => [s.hero, pressed && s.pressed]}>
        <Svg pointerEvents="none" width="100%" height="100%" style={StyleSheet.absoluteFillObject}>
          <Defs>
            <LinearGradient id="heroGrad" x1="0" y1="0" x2="1" y2="0">
              <Stop offset="0%" stopColor={theme.colors.tint} stopOpacity={1} />
              <Stop offset="70%" stopColor={theme.colors.tint} stopOpacity={0.6} />
              <Stop offset="100%" stopColor={theme.colors.tint} stopOpacity={0.6} />
            </LinearGradient>
          </Defs>
          <Rect x="0" y="0" width="100%" height="100%" rx={16} ry={16} fill="url(#heroGrad)" />
        </Svg>

        <View style={s.heroInner}>
          <View style={s.heroContent}>
            <FlagPole color={theme.colors.text} />
            <View style={{ marginLeft: 12 }}>
              <Text style={s.heroTitle}>Start Round</Text>
              <Text style={s.heroSub}>GPS auto-detect or search course</Text>
            </View>
          </View>

          <SmallIconButton onPress={onStartRound} bg={theme.colors.tint} style={s.heroCta} />
        </View>
      </Pressable>

      {/* Section: Your golf today */}
      <Text style={s.sectionTitle}>Your golf today</Text>

      {/* Grid: Last Played, Practice, Your Bag */}
      <View style={s.grid}>
        <Pressable onPress={() => openRound(lastRound)} style={({ pressed }) => [s.card, s.half, pressed && s.pressed]}>
          <Text style={s.cardTitle}>{lastRound.course}</Text>
          <Text style={s.dateText}>{new Date(lastRound.date).toLocaleDateString()}</Text>

          <View style={s.metaRow}>
            <Text style={s.metaKey}>Par</Text>
            <Text style={s.metaVal}>{lastRound.par}</Text>
            <View style={s.metaDot} />
            <Text style={s.metaKey}>Score</Text>
            <Text style={s.metaValEm}>{lastRound.score}</Text>
          </View>

          <View style={s.metaRow}>
            <Text style={s.metaKey}>Longest Drive</Text>
            <Text style={s.metaValEm}>{`${lastRound.longestDrive} yds`}</Text>
          </View>

          <View style={s.metaRow}>
            <Text style={s.metaKey}>Best Club</Text>
            <Text style={s.metaVal}>{lastRound.bestClub}</Text>
          </View>
        </Pressable>

        <Pressable
          onPress={openPractice}
          style={({ pressed }) => [s.card, s.half, s.practiceSquare, pressed && s.pressed]}
        >
          <Text style={s.cardTitle}>Practice Mode</Text>
          <Text style={s.subtle}>Jump into standalone training tools</Text>
          <View style={s.rightArrowHolder}>
            <SmallIconButton onPress={openPractice} bg={theme.colors.tint} />
          </View>
        </Pressable>
      </View>

      {/* NEW: Your Bag card - full width */}
      <Pressable onPress={openBag} style={({ pressed }) => [s.card, s.bagCard, pressed && s.pressed]}>
        <View style={s.bagContent}>
          <GolfBagIcon color={theme.colors.tint} size={32} />
          <View style={{ marginLeft: 12, flex: 1 }}>
            <Text style={s.cardTitle}>Your Bag</Text>
            <Text style={s.subtle}>View and manage your 14 clubs</Text>
          </View>
          <SmallIconButton onPress={openBag} bg={theme.colors.tint} />
        </View>
      </Pressable>

      {/* Section: Round snapshot */}
      <Text style={[s.sectionTitle, { marginTop: 18 }]}>Round snapshot</Text>

      <View style={[s.card, s.cardLg]}>
        <View style={s.statHeader}>
          <Text style={s.subtle}>
            {`${new Date(lastRound.date).toLocaleDateString()} • ${lastRound.course} • Net ${(lastRound.netVsHcp ?? 0) >= 0 ? "+" : ""}${lastRound.netVsHcp}`}
          </Text>
          <Text style={s.scoreText}>Score {lastRound.score}</Text>
        </View>

        <View style={s.donutRow}>
          <DonutStat label="FIR" pct={lastRound.firPct} ring={theme.colors.tint} track={theme.colors.surfaceAlt} text={theme.colors.text} muted={theme.colors.muted} />
          <DonutStat label="GIR" pct={lastRound.girPct} ring={theme.colors.tint} track={theme.colors.surfaceAlt} text={theme.colors.text} muted={theme.colors.muted} />
          <DonutStat label="Par" pct={0.45} ring={theme.colors.tint} track={theme.colors.surfaceAlt} text={theme.colors.text} muted={theme.colors.muted} />
        </View>

        <View style={s.hlRow}>
          <View style={{ flex: 1 }}>
            <Text style={s.hlTitle}>Quick Highlights</Text>
            <Text style={s.subtle}>Learn more about your last round</Text>
          </View>
          <SmallIconButton onPress={() => openRound(lastRound)} bg={theme.colors.tint} />
        </View>
      </View>

      {/* Section: Tips */}
      <Text style={[s.sectionTitle, { marginTop: 18 }]}>Tips for you</Text>

      <View style={[s.card, s.tipsCard]}>
        <Text style={s.tipTitle}>{tip.title}</Text>
        <Text style={s.subtle}>{tip.goal}</Text>
        <Text style={s.tipBody}>{tip.teaser}</Text>

        <View style={s.tipCtaRow}>
          <Pressable onPress={openPractice} style={({ pressed }) => [s.tipBtn, pressed && { opacity: 0.9 }]}>
            <Text style={s.tipBtnText}>Open Practice</Text>
            <ArrowRight size={16} color={"#fff"} />
          </Pressable>
        </View>
      </View>
    </ScrollView>
  );
}

/* ───────────────────────────────── Styles ─────────────────────────────────── */
function getStyles(theme: ReturnType<typeof useTheme>["theme"]) {
  const s = theme.space;
  const r = theme.radius;
  return StyleSheet.create({
    container: { flex: 1, backgroundColor: theme.colors.bg },
    content: { padding: s(4) },
    pressed: { opacity: 0.9 },

    pageHeader: {
      paddingBottom: s(1.5),
      marginBottom: s(2),
      flexDirection: "row",
      alignItems: "baseline",
      justifyContent: "space-between",
    },
    welcome: { fontSize: 22, fontWeight: "800", color: theme.colors.text },
    timeNow: { fontSize: 14, color: theme.colors.muted, fontWeight: "600" },

    hero: {
      position: "relative",
      borderRadius: r.lg,
      marginBottom: s(4),
      overflow: "hidden",
      backgroundColor: "transparent",
      shadowOpacity: 0,
      elevation: 0,
      height: 72, // comfortable height like before
    },
    heroInner: {
      padding: 12,
      minHeight: 72,
      backgroundColor: "transparent",
    },
    heroContent: { flexDirection: "row", alignItems: "center", justifyContent: "flex-start" },
    heroCta: { position: "absolute", right: 12, top: 12 + (72 - 34) / 2 },
    heroTitle: { fontSize: 18, fontWeight: "800", color: theme.colors.text },
    heroSub: { marginTop: 2, color: theme.colors.text },

    sectionTitle: {
      fontSize: 14,
      color: theme.colors.muted,
      fontWeight: "700",
      paddingHorizontal: 2,
      marginBottom: 10,
      textTransform: "uppercase",
      letterSpacing: 0.6,
    },

    grid: { flexDirection: "row", flexWrap: "wrap", gap: 12 },
    half: { flexBasis: "48%", flexGrow: 1 },

    card: {
      backgroundColor: theme.colors.card,
      borderRadius: 14,
      padding: 14,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: theme.colors.border,
      elevation: 1,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: theme.mode === "dark" ? 0.18 : 0.06,
      shadowRadius: 1,
    },
    cardLg: { padding: 16, borderRadius: 16, marginTop: 2 },

    // NEW: Bag card styles
    bagCard: {
      marginTop: 12,
      padding: 16,
    },
    bagContent: {
      flexDirection: "row",
      alignItems: "center",
    },

    cardTitle: { fontSize: 16, fontWeight: "800", color: theme.colors.text, marginBottom: 2 },
    dateText: { color: theme.colors.muted, marginBottom: 8, fontSize: 12 },

    metaRow: { flexDirection: "row", alignItems: "center", marginBottom: 4 },
    metaKey: { color: theme.colors.muted },
    metaVal: { color: theme.colors.text, fontWeight: "700", marginLeft: 6 },
    metaValEm: { color: theme.colors.text, fontWeight: "800", marginLeft: 6 },
    metaDot: { width: 4, height: 4, borderRadius: 2, backgroundColor: theme.colors.border, marginHorizontal: 10 },

    practiceSquare: { minHeight: 148, paddingBottom: 48 },
    rightArrowHolder: { position: "absolute", right: 12, bottom: 12 },

    statHeader: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
    scoreText: { fontSize: 14, fontWeight: "800", color: theme.colors.text },

    donutRow: { flexDirection: "row", justifyContent: "space-between", marginTop: 14 },

    hlRow: {
      marginTop: 14,
      borderTopWidth: StyleSheet.hairlineWidth,
      borderTopColor: theme.colors.border,
      paddingTop: 12,
      flexDirection: "row",
      alignItems: "center",
      gap: 12,
    },
    hlTitle: { fontSize: 16, fontWeight: "800", color: theme.colors.text },

    tipsCard: { marginTop: 2, paddingBottom: 16 },
    tipTitle: { fontSize: 16, fontWeight: "800", color: theme.colors.text },
    tipBody: { marginTop: 8, lineHeight: 20, color: theme.colors.text },
    tipCtaRow: { marginTop: 12, alignItems: "flex-start" },
    tipBtn: {
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
      backgroundColor: theme.colors.tint,
      paddingHorizontal: 14,
      paddingVertical: 10,
      borderRadius: 999,
    },
    tipBtnText: { color: "#fff", fontWeight: "800" },

    subtle: { color: theme.colors.muted },
  });
}