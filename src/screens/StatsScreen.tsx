import React from "react";
import { View, Text, ScrollView, StyleSheet, Pressable } from "react-native";
import { useRoute } from "@react-navigation/native";
import { getRecentRounds, getRoundById } from "../features/rounds";
import type { RoundSummary } from "../types";

type RouteParams = { roundId?: string } | undefined;

export default function StatsScreen() {
  const route = useRoute();
  const params = (route.params as RouteParams) || {};

  const recent = getRecentRounds(10);
  const initial =
    (params?.roundId && recent.find(r => r.id === params.roundId)) ||
    (params?.roundId && getRoundById(params.roundId) && recent[0]) ||
    recent[0] ||
    null;

  const [selected, setSelected] = React.useState<RoundSummary | null>(initial);

  if (!recent.length) {
    return (
      <View style={styles.emptyWrap}>
        <Text style={styles.h1}>Stats</Text>
        <Text>No rounds yet. Play a round to see your stats.</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.wrap}>
      {/* Selected Round Summary */}
      {selected && (
        <View style={styles.card}>
          <Text style={styles.h1}>Round Summary</Text>
          <Text style={styles.muted}>
            {new Date(selected.date).toLocaleDateString()} • {selected.course} • {selected.holes} holes
          </Text>

          <View style={styles.row}>
            <KV k="FIR" v={`${Math.round(selected.firPct * 100)}%`} />
            <KV k="GIR" v={`${Math.round(selected.girPct * 100)}%`} />
          </View>
          <View style={styles.row}>
            <KV k="Putts" v={String(selected.putts)} />
            <KV k="Score" v={String(selected.score)} />
          </View>
          {"netVsHcp" in selected && typeof selected.netVsHcp === "number" ? (
            <Text style={styles.muted}>
              Net {selected.netVsHcp >= 0 ? "+" : ""}{selected.netVsHcp}
            </Text>
          ) : null}
        </View>
      )}

      {/* Recent Rounds list */}
      <View style={styles.card}>
        <Text style={styles.h2}>Recent Rounds</Text>
        {recent.map(r => (
          <Pressable key={r.id} onPress={() => setSelected(r)} style={({ pressed }) => [styles.item, pressed && { opacity: 0.85 }]}>
            <View style={{ flex: 1 }}>
              <Text style={styles.itemTitle}>{r.course}</Text>
              <Text style={styles.muted}>{new Date(r.date).toLocaleDateString()} • {r.holes} holes</Text>
            </View>
            <View style={styles.itemCols}>
              <Text style={styles.itemNum}>{Math.round(r.firPct * 100)}%</Text>
              <Text style={styles.itemLabel}>FIR</Text>
            </View>
            <View style={styles.itemCols}>
              <Text style={styles.itemNum}>{Math.round(r.girPct * 100)}%</Text>
              <Text style={styles.itemLabel}>GIR</Text>
            </View>
            <View style={styles.itemCols}>
              <Text style={styles.itemNum}>{r.putts}</Text>
              <Text style={styles.itemLabel}>Putts</Text>
            </View>
            <View style={styles.itemCols}>
              <Text style={styles.itemNum}>{r.score}</Text>
              <Text style={styles.itemLabel}>Score</Text>
            </View>
          </Pressable>
        ))}
      </View>
    </ScrollView>
  );
}

function KV({ k, v }: { k: string; v: string }) {
  return (
    <View style={{ flex: 1 }}>
      <Text style={styles.kLabel}>{k}</Text>
      <Text style={styles.kVal}>{v}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { padding: 16, gap: 12 },
  emptyWrap: { flex: 1, alignItems: "center", justifyContent: "center", padding: 24 },
  card: { backgroundColor: "#fff", borderRadius: 12, padding: 12, borderWidth: StyleSheet.hairlineWidth, borderColor: "#e5e7eb" },

  h1: { fontSize: 18, fontWeight: "800", marginBottom: 6 },
  h2: { fontSize: 16, fontWeight: "800", marginBottom: 6 },
  muted: { color: "#6b7280" },

  row: { flexDirection: "row", gap: 12, marginTop: 8 },
  kLabel: { color: "#6b7280", fontSize: 12 },
  kVal: { fontSize: 18, fontWeight: "700" },

  item: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: "#e5e7eb",
    gap: 10,
  },
  itemTitle: { fontWeight: "700" },
  itemCols: { width: 54, alignItems: "center" },
  itemNum: { fontWeight: "800" },
  itemLabel: { color: "#6b7280", fontSize: 11 },
});
