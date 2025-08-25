import React from "react";
import { View, Text, Pressable, StyleSheet, Platform } from "react-native";
import type { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { useColorScheme } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { makeTheme } from "../../theme";

const ICONS: Record<string, string> = {
  Home: "🏠",
  Play: "⛳",
  Practice: "🎯",
  Stats: "📈",
  Social: "👥",
};

export default function BottomTabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  const scheme = useColorScheme();
  const t = makeTheme(scheme);
  const insets = useSafeAreaInsets();

  return (
    <View pointerEvents="box-none" style={[styles.host, { paddingBottom: insets.bottom || 8 }]}>
      <View style={[styles.bar, { backgroundColor: t.color.tabBg, borderColor: t.color.line, borderRadius: 16 }, t.shadow.float]}>
        {state.routes.map((route, index) => {
          const focused = state.index === index;
          const { options } = descriptors[route.key];
          const label = (options.tabBarLabel as string) ?? (options.title as string) ?? route.name;
          const icon = ICONS[route.name] ?? "•";

          return (
            <Pressable
              key={route.key}
              onPress={() => navigation.navigate(route.name)}
              style={({ pressed }) => [styles.item, pressed && { opacity: 0.85 }]}
            >
              <Text style={{ fontSize: 18 }}>{icon}</Text>
              <Text
                numberOfLines={1}
                style={{
                  fontSize: 11, marginTop: 2,
                  color: focused ? t.color.brand : t.color.sub,
                  fontWeight: focused ? "700" : "500",
                }}
              >
                {label}
              </Text>
              {focused && <View style={[styles.underline, { backgroundColor: t.color.brand }]} />}
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  host: { position: "absolute", left: 0, right: 0, bottom: 0, paddingHorizontal: 12 },
  bar: { flexDirection: "row", justifyContent: "space-between", paddingVertical: 10, paddingHorizontal: 12, borderWidth: Platform.OS === "android" ? StyleSheet.hairlineWidth : 0.5 },
  item: { alignItems: "center", justifyContent: "center", flex: 1, paddingVertical: 2 },
  underline: { position: "absolute", bottom: 4, height: 3, width: 24, borderRadius: 999 },
});
