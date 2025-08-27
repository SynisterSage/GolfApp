import React, { useMemo } from "react";
import { View, Text, StyleSheet, Image, Pressable, ScrollView } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useTheme } from "../theme";
import type { Round } from "../features/rounds/types";
import { getRecentRounds } from "../features/rounds/rounds";

export default function RoundDetailScreen() {
  const nav = useNavigation<any>();
  const route = useRoute<any>();
  const { theme } = useTheme();

  const providedRound: Round | undefined = route.params?.round;
  const roundId: string | undefined = route.params?.roundId;

  const round: Round | undefined = useMemo(() => {
    if (providedRound) return providedRound;
    if (!roundId) return undefined;
    const all = getRecentRounds(100);
    return all.find((r) => r.id === roundId);
  }, [providedRound, roundId]);

  // 🚫 No courseImage reads; always show placeholder for banner
  const showPlaceholder = true;
  const r: Partial<Round> = round ?? {};

  return (
    <View style={[styles.wrap, { backgroundColor: theme.colors.bg }]}>
      <View style={[styles.header, { borderBottomColor: theme.colors.border }]}>
        <Pressable onPress={() => nav.goBack()} hitSlop={10} style={styles.headerBtn}>
          <Text style={{ color: theme.colors.tint, fontWeight: "800" }}>Back</Text>
        </Pressable>
        <Text style={[styles.title, { color: theme.colors.text }]} numberOfLines={1}>
          {r.course ?? "Round"}
        </Text>
        <View style={styles.headerBtn} />
      </View>

      {!round ? (
        <View style={styles.empty}>
          <Text style={{ color: theme.colors.muted, fontWeight: "700" }}>Round not found.</Text>
        </View>
      ) : (
        <ScrollView contentContainerStyle={{ paddingBottom: 32 }}>
          {/* Banner */}
          <View style={[styles.banner, { backgroundColor: theme.colors.tint  }]}>
            {showPlaceholder ? (
              <View style={styles.placeholder}>
                <Text style={{ color: theme.colors.muted, fontSize: 22 }}>🖼️</Text>
              </View>
            ) : (
              <Image source={{ uri: "" }} style={styles.img} resizeMode="cover" />
            )}
          </View>

          {/* Summary card */}
          <View
            style={[
              styles.card,
              { backgroundColor: theme.colors.card, borderColor: theme.colors.border },
            ]}
          >
            <View style={styles.rowTop}>
              <Text style={[styles.course, { color: theme.colors.text }]} numberOfLines={1}>
                {r.course ?? "Unknown Course"}
              </Text>
              <Text style={[styles.date, { color: theme.colors.muted }]} numberOfLines={1}>
                {r.date ? new Date(r.date).toLocaleDateString() : "—"}
              </Text>
            </View>

            <Text style={[styles.score, { color: theme.colors.text }]}>
              {typeof r.score === "number" ? r.score : "—"}
              {typeof r.netVsHcp === "number" ? (
                <Text style={[styles.net, { color: theme.colors.muted }]}>
                  {" "}({r.netVsHcp >= 0 ? "+" : ""}{r.netVsHcp})
                </Text>
              ) : null}
            </Text>

            <Text style={[styles.sub, { color: theme.colors.muted }]} numberOfLines={1}>
              {r.holes != null ? `${r.holes} holes` : "—"}
              {r.tees ? ` • ${r.tees}` : ""}
              {r.matchType ? ` • ${r.matchType}` : ""}
            </Text>
          </View>

          {/* Stats grid */}
          <View style={styles.grid}>
            <StatTile label="FIR" value={pct(r.firPct)} />
            <StatTile label="GIR" value={pct(r.girPct)} />
            <StatTile label="Putts" value={num(r.putts)} />
            <StatTile label="Par" value={num(r.par)} />
            <StatTile label="Longest Drive" value={num(r.longestDrive, "yd")} />
            <StatTile label="Best Club" value={r.bestClub ?? "—"} />
          </View>

          {/* Actions */}
          <View style={styles.actions}>
            <PrimaryButton label="View Hole-by-Hole" onPress={() => {}} tint={theme.colors.tint} textColor="#fff" />
            <SecondaryButton label="Share" onPress={() => {}} border={theme.colors.border} textColor={theme.colors.text} />
          </View>
        </ScrollView>
      )}
    </View>
  );
}

/* helpers */
function pct(v?: number) {
  if (typeof v !== "number") return "—";
  const n = Math.max(0, Math.min(1, v));
  return `${Math.round(n * 100)}%`;
}
function num(v?: number, suffix?: string) {
  if (typeof v !== "number") return "—";
  return suffix ? `${v} ${suffix}` : String(v);
}

function StatTile({ label, value }: { label: string; value: string }) {
  const { theme } = useTheme();
  return (
    <View style={[styles.tile, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}>
      <Text style={[styles.tileLabel, { color: theme.colors.muted }]}>{label}</Text>
      <Text style={[styles.tileValue, { color: theme.colors.text }]}>{value}</Text>
    </View>
  );
}

function PrimaryButton({ label, onPress, tint, textColor }:{
  label: string; onPress: () => void; tint: string; textColor: string;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.btnPrimary, { backgroundColor: tint, opacity: pressed ? 0.92 : 1 }]}
    >
      <Text style={[styles.btnText, { color: textColor }]}>{label}</Text>
    </Pressable>
  );
}

function SecondaryButton({ label, onPress, border, textColor }:{
  label: string; onPress: () => void; border: string; textColor: string;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.btnSecondary, { borderColor: border, opacity: pressed ? 0.92 : 1 }]}
    >
      <Text style={[styles.btnText, { color: textColor }]}>{label}</Text>
    </Pressable>
  );
}

/* styles */
const R = 16;

const styles = StyleSheet.create({
  wrap: { flex: 1 },
  header: {
    height: 80,
    borderBottomWidth: StyleSheet.hairlineWidth,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: 24,
  },
  headerBtn: { minWidth: 60, alignItems: "flex-start", justifyContent: "center" },
  title: { fontSize: 16, fontWeight: "900" },

  banner: { height: 180, width: "100%" },
  img: { width: "100%", height: "100%" },
  placeholder: { flex: 1, alignItems: "center", justifyContent: "center" },

  card: { margin: 16, padding: 12, borderRadius: R, borderWidth: StyleSheet.hairlineWidth },
  rowTop: { flexDirection: "row", alignItems: "center" },
  course: { fontWeight: "800", flex: 1 },
  date: { marginLeft: 8, fontSize: 12 },
  score: { fontWeight: "900", marginTop: 6, fontSize: 18 },
  net: { fontWeight: "700" },
  sub: { marginTop: 2, fontSize: 12 },

  grid: { paddingHorizontal: 16, flexDirection: "row", flexWrap: "wrap", gap: 10 },
  tile: {
    width: "48%",
    borderRadius: 12,
    borderWidth: StyleSheet.hairlineWidth,
    paddingVertical: 14,
    paddingHorizontal: 12,
  },
  tileLabel: { fontSize: 12, fontWeight: "700", marginBottom: 4 },
  tileValue: { fontSize: 18, fontWeight: "900" },

  actions: { paddingHorizontal: 16, marginTop: 16, flexDirection: "row", gap: 10 },
  btnPrimary: { flex: 1, height: 48, borderRadius: 12, alignItems: "center", justifyContent: "center" },
  btnSecondary: { flex: 1, height: 48, borderRadius: 12, borderWidth: StyleSheet.hairlineWidth, alignItems: "center", justifyContent: "center" },
  btnText: { fontWeight: "900" },

  empty: { flex: 1, alignItems: "center", justifyContent: "center" },
});
