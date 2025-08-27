import React from "react";
import { View, Text, Pressable, StyleSheet, Platform } from "react-native";
import type { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { useSafeAreaInsets } from "react-native-safe-area-context";
// Expo: import { MaterialCommunityIcons as MIcon } from "@expo/vector-icons";
import MIcon from "react-native-vector-icons/MaterialCommunityIcons";
import { useTheme } from "../../theme"; // ⬅️ use your app theme

const ICONS: Record<string, string> = {
  Home: "home-variant-outline",
  Play: "golf-tee",
  Practice: "target",
  Stats: "chart-line",
};

export default function BottomTabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  const { theme } = useTheme();                // ⬅️ app theme (light/dark)
  const insets = useSafeAreaInsets();

  const bg = theme.colors.bg;                  // page background behind bar
  const barBg = theme.colors.card;             // the bar surface
  const border = theme.colors.border;
  const active = theme.colors.text;            // white in dark, charcoal in light
  const inactive = theme.colors.muted;         // gray in both

  return (
    <View pointerEvents="box-none" style={[styles.host, { backgroundColor: bg }]}>
      <View
        style={[
          styles.bar,
          {
            backgroundColor: barBg,
            borderTopColor: border,
            paddingBottom: Math.max(insets.bottom, 6),
          },
        ]}
      >
        {state.routes.map((route, index) => {
          const focused = state.index === index;
          const { options } = descriptors[route.key];
          const label = (options.tabBarLabel as string) ?? (options.title as string) ?? route.name;
          const icon = ICONS[route.name] ?? "circle-outline";

          const onPress = () => {
            const event = navigation.emit({ type: "tabPress", target: route.key, canPreventDefault: true });
            if (!focused && !event.defaultPrevented) {
              // @ts-ignore
              navigation.navigate(route.name);
            }
          };

          return (
            <Pressable
              key={route.key}
              onPress={onPress}
              style={({ pressed }) => [styles.item, pressed && { opacity: 0.75 }]}
              accessibilityRole="button"
              accessibilityLabel={label}
              accessibilityState={focused ? { selected: true } : {}}
            >
              <MIcon
                name={icon}
                size={24}
                color={focused ? active : inactive}
                style={{ marginBottom: 2 }}
              />
              <Text
                numberOfLines={1}
                style={{
                  fontSize: 11,
                  color: focused ? active : inactive,
                  fontWeight: focused ? "700" : "500",
                }}
              >
                {label}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  host: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
  },
  bar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    paddingTop: 6,
    borderTopWidth: Platform.OS === "android" ? StyleSheet.hairlineWidth : 0.5,
  },
  item: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 24,
  },
});
