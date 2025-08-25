import React, { useMemo } from "react";
import { View, Text, StyleSheet, ScrollView, Pressable, FlatList } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { getRecentRounds, getLastRound } from "../features/rounds";
import { getTrendsSnapshot } from "../features/stats";
import { getSuggestedDrill } from "../features/practice";
import type { RoundSummary } from "../types";

type Nav = ReturnType<typeof useNavigation>;

export default function HomeScreen() {
  const nav = useNavigation<Nav>();

  const recent = useMemo(() => getRecentRounds(5), []);
  const lastRound = useMemo(() => getLastRound(), []);
  const trends = useMemo(() => getTrendsSnapshot(), []);
  const drill = useMemo(() => getSuggestedDrill(), []);

  function onStartRound() {
    // goes into Play with GPS Map default (your Play tab/screen)
    // Adjust route name if your navigator differs
    // @ts-ignore
    nav.navigate("Play", { mode: "gps" });
  }

  function openRound(r: RoundSummary) {
    // Route into Stats with a specific round focus
    // @ts-ignore
    nav.navigate("Stats", { roundId: r.id });
  }

  function openPractice() {
    // @ts-ignore
    nav.navigate("Practice");
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.containerContent}>
      {/* Start Round */}
      <Pressable onPress={onStartRound} style={({ pressed }) => [styles.primaryBtn, pressed && styles.pressed]}>
        <Text style={styles.primaryBtnText}>Start Round</Text>
        <Text style={styles.primaryBtnSub}>GPS auto-detect or search course</Text>
      </Pressable>

      {/* Featured: Last Round */}
      {lastRound && (
        <Pressable onPress={() => openRound(lastRound)} style={({ pressed }) => [styles.cardLg, pressed && styles.pressed]}>
          <Text style={styles.cardTitle}>Quick Highlights (Last Round)</Text>
          <View style={styles.metricsRow}>
            <Metric label="FIR" value={`${Math.round(lastRound.firPct * 100)}%`} />
            <Metric label="GIR" value={`${Math.round(lastRound.girPct * 100)}%`} />
            <Metric label="Putts" value={String(lastRound.putts)} />
            <Metric label="Score" value={String(lastRound.score)} />
          </View>
          <Text style={styles.subtle}>
            {new Date(lastRound.date).toLocaleDateString()} • {lastRound.course}
            {typeof lastRound.netVsHcp === "number" ? ` • Net ${lastRound.netVsHcp >= 0 ? "+" : ""}${lastRound.netVsHcp}` : ""}
          </Text>
          <Text style={styles.linkText}>View full summary in Stats →</Text>
        </Pressable>
      )}

      {/* Personal Trends Snapshot */}
      {trends && (
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Personal Trends</Text>
          <Text style={styles.trendHeadline}>{trends.headline}</Text>
          {trends.details ? <Text style={styles.subtle}>{trends.details}</Text> : null}
        </View>
      )}

      {/* Recent Round Highlights */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Recent Rounds</Text>
        <FlatList
          data={recent}
          keyExtractor={(r) => r.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingVertical: 4 }}
          renderItem={({ item }) => (
            <Pressable onPress={() => openRound(item)} style={({ pressed }) => [styles.roundCard, pressed && styles.pressed]}>
              <Text style={styles.roundCourse}>{item.course}</Text>
              <Text style={styles.roundDate}>{new Date(item.date).toLocaleDateString()}</Text>
              <View style={styles.metricsRow}>
                <Metric label="FIR" value={`${Math.round(item.firPct * 100)}%`} small />
                <Metric label="GIR" value={`${Math.round(item.girPct * 100)}%`} small />
                <Metric label="P" value={String(item.putts)} small />
                <Metric label="S" value={String(item.score)} small />
              </View>
              {typeof item.netVsHcp === "number" && (
                <Text style={styles.netText}>
                  Net {item.netVsHcp >= 0 ? "+" : ""}{item.netVsHcp}
                </Text>
              )}
            </Pressable>
          )}
        />
      </View>

      {/* Practice Shortcut */}
      <Pressable onPress={openPractice} style={({ pressed }) => [styles.card, styles.practiceCard, pressed && styles.pressed]}>
        <Text style={styles.cardTitle}>Practice Mode</Text>
        <Text style={styles.subtle}>Jump into standalone training tools</Text>
        <Text style={styles.linkText}>Open Practice →</Text>
      </Pressable>

      {/* Suggested Drill / Tip of the Day (teaser) */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Suggested Drill (Teaser)</Text>
        <Text style={styles.drillTitle}>{drill.title}</Text>
        <Text style={styles.subtle}>{drill.goal}</Text>
        <Text style={styles.drillTeaser}>{drill.teaser}</Text>
        <Text style={styles.pill}>Premium shows full progression</Text>
      </View>

      <View style={{ height: 28 }} />
    </ScrollView>
  );
}

function Metric({ label, value, small = false }: { label: string; value: string; small?: boolean }) {
  return (
    <View style={small ? styles.metricSmall : styles.metric}>
      <Text style={styles.metricLabel}>{label}</Text>
      <Text style={small ? styles.metricValueSm : styles.metricValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  containerContent: { padding: 16 },

  pressed: { opacity: 0.85 },

  primaryBtn: {
    backgroundColor: "#0a7d36",
    borderRadius: 14,
    paddingVertical: 16,
    paddingHorizontal: 18,
    marginBottom: 14,
  },
  primaryBtnText: { color: "#fff", fontSize: 20, fontWeight: "700" },
  primaryBtnSub: { color: "rgba(255,255,255,0.85)", marginTop: 4 },

  card: {
    backgroundColor: "#f7f8fa",
    borderRadius: 14,
    padding: 14,
    marginBottom: 14,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "#e3e5e8",
  },
  cardLg: {
    backgroundColor: "#f0f7f3",
    borderRadius: 16,
    padding: 16,
    marginBottom: 14,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "#d3eadc",
  },
  cardTitle: { fontSize: 16, fontWeight: "700", marginBottom: 10 },

  metricsRow: { flexDirection: "row", gap: 12, flexWrap: "wrap" },

  metric: { minWidth: 72 },
  metricSmall: { minWidth: 50 },
  metricLabel: { color: "#6b7280", fontSize: 12 },
  metricValue: { fontSize: 18, fontWeight: "700" },
  metricValueSm: { fontSize: 16, fontWeight: "700" },

  subtle: { color: "#6b7280", marginTop: 6 },

  linkText: { color: "#0a7d36", fontWeight: "700", marginTop: 8 },

  // Recent round card
  roundCard: {
    width: 180,
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 12,
    marginRight: 10,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "#e5e7eb",
  },
  roundCourse: { fontWeight: "700" },
  roundDate: { color: "#6b7280", marginBottom: 6 },
  netText: { marginTop: 6, color: "#374151", fontWeight: "600" },

  // Drill
  drillTitle: { fontSize: 15, fontWeight: "700" },
  drillTeaser: { marginTop: 6, lineHeight: 20 },
  pill: {
    alignSelf: "flex-start",
    marginTop: 10,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    backgroundColor: "#e8f3eb",
    color: "#0a7d36",
    fontWeight: "700",
  },

  practiceCard: {
    backgroundColor: "#f7f7ff",
    borderColor: "#e3e3ff",
  },
});
