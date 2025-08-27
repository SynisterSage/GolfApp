// src/components/ui/PillButton.tsx
import React from "react";
import { Pressable, Text, View, StyleSheet } from "react-native";
import { useTheme } from "../../theme";

export default function PillButton({
  label, onPress, badge,
}: {
  label: string;
  onPress: () => void;
  badge?: number;
}) {
  const { theme } = useTheme();
  const tint = theme.colors.tint;

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.pill,
        {
          backgroundColor: theme.colors.card,
          borderColor: theme.colors.border,
          opacity: pressed ? 0.92 : 1,
        },
      ]}
    >
      <Text style={{ color: theme.colors.text, fontWeight: "700" }}>{label}</Text>
      {badge && badge > 0 ? (
        <View style={[styles.badge, { backgroundColor: tint }]}>
          <Text style={styles.badgeText}>{badge}</Text>
        </View>
      ) : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  pill: {
    height: 36,
    paddingHorizontal: 12,
    borderRadius: 18,
    borderWidth: StyleSheet.hairlineWidth,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 8,
  },
  badge: {
    minWidth: 20,
    height: 20,
    borderRadius: 10,
    paddingHorizontal: 6,
    alignItems: "center",
    justifyContent: "center",
  },
  badgeText: { color: "#fff", fontSize: 12, fontWeight: "800" },
});
