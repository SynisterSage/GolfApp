// src/components/ui/SearchBar.tsx
import React from "react";
import { TextInput, View, StyleSheet, Text, Pressable } from "react-native";
import { useTheme } from "../../theme";

export default function SearchBar({
  value,
  onChange,
  placeholder = "Search last courses",
  onClear,
  background = "surface",
}: {
  value: string;
  onChange: (t: string) => void;
  placeholder?: string;
  onClear?: () => void;
  background?: "surface" | "card";
}) {
  const { theme } = useTheme();
  const bg = background === "card" ? theme.colors.card : theme.colors.surface;

  return (
    <View style={[styles.wrap, { backgroundColor: bg, borderColor: theme.colors.border }]}>
      <Text style={[styles.icon, { color: theme.colors.muted }]}>🔍</Text>
      <TextInput
        value={value}
        onChangeText={onChange}
        placeholder={placeholder}
        placeholderTextColor={theme.colors.muted}
        style={[styles.input, { color: theme.colors.text }]}
        autoCapitalize="none"
        autoCorrect={false}
        returnKeyType="search"
      />
      {!!value && (
        <Pressable onPress={onClear}>
          <Text style={[styles.clear, { color: theme.colors.muted }]}>✕</Text>
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    height: 44,
    borderRadius: 22,
    borderWidth: StyleSheet.hairlineWidth,
    paddingHorizontal: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  icon: { fontSize: 16 },
  input: { flex: 1, fontSize: 15 },
  clear: { fontSize: 16 },
});
