import React from "react";
import { Pressable, StyleSheet, Text, View, Image, ViewStyle } from "react-native";
import { useTheme } from "../../theme";
import type { Round } from "../../features/rounds/types";

type Props = {
  round?: Round;          // forgiving at runtime
  onPress: () => void;
  style?: ViewStyle;
};

export default function RoundCard({ round, onPress, style }: Props) {
  const { theme } = useTheme();

  // 🚫 No courseImage access at all (placeholder only)
  const showPlaceholder = true;

  return (
    <Pressable onPress={onPress} style={({ pressed }) => [{ opacity: pressed ? 0.96 : 1 }, style]}>
      <View
        style={[
          styles.card,
          { backgroundColor: theme.colors.card, borderColor: theme.colors.border },
        ]}
      >
        {/* Top: banner (always placeholder for now) */}
        <View style={[styles.banner, { backgroundColor: theme.colors.tint }]}>
          {showPlaceholder ? (
            <View style={styles.placeholder}>
              <Text style={{ color: theme.colors.muted, fontSize: 18 }}>🖼️</Text>
            </View>
          ) : (
            // kept so you can re-enable later without restyling
            <Image source={{ uri: "" }} style={styles.img} resizeMode="cover" />
          )}
        </View>

        {/* Bottom: info */}
        <View style={styles.info}>
          <View style={styles.topRow}>
            <Text style={[styles.course, { color: theme.colors.text }]} numberOfLines={1}>
              {round?.course ?? "Unknown Course"}
            </Text>
            <Text style={[styles.date, { color: theme.colors.muted }]} numberOfLines={1}>
              {round?.date ? new Date(round.date).toLocaleDateString() : "—"}
            </Text>
          </View>

          <Text style={[styles.score, { color: theme.colors.text }]}>
            {typeof round?.score === "number" ? round?.score : "—"}
            {typeof round?.netVsHcp === "number" ? (
              <Text style={[styles.net, { color: theme.colors.muted }]}>
                {" "}({round!.netVsHcp! >= 0 ? "+" : ""}{round!.netVsHcp})
              </Text>
            ) : null}
          </Text>

          <Text style={[styles.sub, { color: theme.colors.muted }]} numberOfLines={1}>
            {round?.holes != null ? `${round.holes} holes` : "—"}
            {round?.tees ? ` • ${round.tees}` : ""}
            {round?.matchType ? ` • ${round.matchType}` : ""}
          </Text>
        </View>
      </View>
    </Pressable>
  );
}

const R = 16;

const styles = StyleSheet.create({
  card: { borderRadius: R, borderWidth: StyleSheet.hairlineWidth, overflow: "hidden" },
  banner: { height: 140, width: "100%" },
  img: { width: "100%", height: "100%" },
  placeholder: { flex: 1, alignItems: "center", justifyContent: "center" },

  info: { paddingHorizontal: 12, paddingVertical: 10 },
  topRow: { flexDirection: "row", alignItems: "center" },
  course: { fontWeight: "800", flex: 1 },
  date: { marginLeft: 8, fontSize: 12 },
  score: { fontWeight: "900", marginTop: 4, fontSize: 16 },
  net: { fontWeight: "700" },
  sub: { marginTop: 2, fontSize: 12 },
});
