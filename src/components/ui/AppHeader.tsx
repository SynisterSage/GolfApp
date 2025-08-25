import React from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useColorScheme } from "react-native";
import { makeTheme } from "../../theme";

type Props = {
  title: string;
  subtitle?: string;
  onPressSettings?: () => void;
  onPressLeft?: () => void;
  showBack?: boolean; // ← NEW
};

export default function AppHeader({ title, subtitle, onPressSettings, onPressLeft, showBack }: Props) {
  const scheme = useColorScheme();
  const t = makeTheme(scheme);
  const insets = useSafeAreaInsets();

  return (
    <View style={{ paddingTop: insets.top, backgroundColor: t.color.bg }}>
      <View style={[styles.row, { borderBottomColor: t.color.line }]}>
        <Pressable onPress={onPressLeft} style={styles.side}>
          <Text style={{ fontSize: 20 }}>{showBack ? "←" : "⛳"}</Text>
        </Pressable>

        <View style={styles.center}>
          <Text style={[styles.title, { color: t.color.text }]} numberOfLines={1}>{title}</Text>
          {subtitle ? <Text style={[styles.sub, { color: t.color.sub }]} numberOfLines={1}>{subtitle}</Text> : null}
        </View>

        <Pressable onPress={onPressSettings} style={styles.side}>
          <Text style={{ fontSize: 20 }}>⚙️</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { height: 60, paddingHorizontal: 12, flexDirection: "row", alignItems: "center", borderBottomWidth: StyleSheet.hairlineWidth },
  side: { width: 44, height: 44, alignItems: "center", justifyContent: "center" },
  center: { flex: 1, alignItems: "center", justifyContent: "center" },
  title: { fontSize: 18, fontWeight: "800" },
  sub: { marginTop: 2, fontSize: 12, fontWeight: "500" },
});
