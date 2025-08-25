import React from "react";
import { View, StyleSheet } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function Screen({
  children,
  bottomPad = 0,     // pass tab height when used inside tabs
  topPad = 8,         // small spacing below the header
}: {
  children: React.ReactNode;
  bottomPad?: number;
  topPad?: number;
}) {
  const insets = useSafeAreaInsets();
  return (
    <View
      style={[
        styles.wrap,
        {
          paddingTop: topPad,                           // header already adds insets.top
          paddingBottom: bottomPad + 8 + insets.bottom, // keep content above floating tab bar / home indicator
        },
      ]}
    >
      {children}
    </View>
  );
}
const styles = StyleSheet.create({ wrap: { flex: 1 } });
