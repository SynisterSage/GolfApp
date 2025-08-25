// components/ui/AppHeader.tsx
import React, { useRef } from "react";
import {
  View,
  StyleSheet,
  Text,
  Pressable,
  Animated,
  Platform,
  StatusBar,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Svg, { Path } from "react-native-svg";

type Props = {
  title: string;
  onPressSettings?: () => void;
  bg?: string; // header background
  tint?: string; // icon + title tint
  showDivider?: boolean;
};

const GearIcon = ({
  size = 22,
  color = "#0A7D36",
}: {
  size?: number;
  color?: string;
}) => (
  <Svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    accessibilityRole="image"
  >
    <Path
      d="M19.14 12.94c.04-.31.06-.63.06-.94s-.02-.63-.07-.94l2.03-1.58a.5.5 0 0 0 .12-.64l-1.92-3.32a.5.5 0 0 0-.6-.22l-2.39.96a6.98 6.98 0 0 0-1.63-.95l-.36-2.54A.5.5 0 0 0 13.9 1h-3.8a.5.5 0 0 0-.49.41l-.36 2.54c-.58.22-1.12.53-1.63.95l-2.39-.96a.5.5 0 0 0-.6.22L2.82 7.48a.5.5 0 0 0 .12.64l2.03 1.58c-.05.31-.07.63-.07.94s.02.63.07.94l-2.03 1.58a.5.5 0 0 0-.12.64l1.92 3.32c.13.22.39.31.6.22l2.39-.96c.51.41 1.05.73 1.63.95l.36 2.54c.06.24.26.41.49.41h3.8c.24 0 .44-.17.49-.41l.36-2.54c.58-.22 1.12-.53 1.63-.95l2.39.96c.22.09.47 0 .6-.22l1.92-3.32a.5.5 0 0 0-.12-.64l-2.03-1.58ZM12 15.5A3.5 3.5 0 1 1 12 8.5a3.5 3.5 0 0 1 0 7Z"
      fill={color}
    />
  </Svg>
);

function IconButton({
  onPress,
  children,
  rippleColor = "rgba(10,125,54,0.12)",
}: {
  onPress?: () => void;
  children: React.ReactNode;
  rippleColor?: string;
}) {
  const scale = useRef(new Animated.Value(1)).current;
  const to = (v: number) =>
    Animated.spring(scale, {
      toValue: v,
      useNativeDriver: true,
      friction: 6,
      tension: 200,
    }).start();

  return (
    <Pressable
      onPressIn={() => to(0.96)}
      onPressOut={() => to(1)}
      onPress={onPress}
      android_ripple={{ color: rippleColor, borderless: true, radius: 22 }}
      hitSlop={10}
      style={styles.side}
      accessibilityRole="button"
    >
      <Animated.View style={{ transform: [{ scale }] }}>
        {children}
      </Animated.View>
    </Pressable>
  );
}

export default function AppHeader({
  title,
  onPressSettings,
  bg = "#FFFFFF",
  tint = "#0A7D36",
  showDivider = true,
}: Props) {
  const insets = useSafeAreaInsets();

  return (
    <View style={{ backgroundColor: bg, paddingTop: insets.top }}>
      <StatusBar
        barStyle={bg === "#FFFFFF" ? "dark-content" : "light-content"}
        backgroundColor={bg}
      />
      <View
        style={[
          styles.row,
          Platform.select({
            android: { elevation: 2, backgroundColor: bg },
            ios: {
              shadowColor: "#000",
              shadowOpacity: 0.06,
              shadowRadius: 4,
              shadowOffset: { width: 0, height: 2 },
            },
          }),
          showDivider && {
            borderBottomWidth: StyleSheet.hairlineWidth,
            borderBottomColor: "#E9EDF0",
          },
        ]}
      >
        <Text numberOfLines={1} style={[styles.title, { color: tint }]}>
          {title}
        </Text>

        <IconButton onPress={onPressSettings}>
          <GearIcon size={22} color={tint} />
        </IconButton>
      </View>
    </View>
  );
}

const SIDE = 40;

const styles = StyleSheet.create({
  row: {
    height: 56,
    paddingHorizontal: 20,
    paddingRight: 8,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between", // pushes title left, icon right
  },
  side: {
    width: SIDE,
    height: SIDE,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 12,
  },
  title: {
    flex: 1,
    fontSize: 18,
    fontWeight: "700",
    color: "#0B3A1E",
    textAlign: "left", // ensures left alignment
  },
});
