import React, { useState } from "react";
import { ScrollView, View, Text, StyleSheet, Switch, Pressable, Alert } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useColorScheme } from "react-native";
import AppHeader from "../components/ui/AppHeader";
import Screen from "../components/ui/Screen";
import { makeTheme } from "../theme";

export default function SettingsScreen() {
  const nav = useNavigation();
  const scheme = useColorScheme();
  const t = makeTheme(scheme);

  // mock state (wire to store later)
  const [notifRounds, setNotifRounds] = useState(true);
  const [notifPractice, setNotifPractice] = useState(false);
  const [haptics, setHaptics] = useState(true);

  function Section({ title, children }: { title: string; children: React.ReactNode }) {
    return (
      <View style={[styles.card, { backgroundColor: t.color.card, borderColor: t.color.line }]}>
        <Text style={[styles.cardTitle, { color: t.color.text }]}>{title}</Text>
        <View style={{ gap: 6 }}>{children}</View>
      </View>
    );
  }

  function Row({
    label,
    detail,
    onPress,
    children,
  }: {
    label: string;
    detail?: string;
    onPress?: () => void;
    children?: React.ReactNode;
  }) {
    return (
      <Pressable
        onPress={onPress}
        disabled={!onPress}
        style={({ pressed }) => [
          styles.row,
          { borderColor: t.color.line, opacity: pressed ? 0.9 : 1 },
        ]}
      >
        <View style={{ flex: 1 }}>
          <Text style={[styles.label, { color: t.color.text }]}>{label}</Text>
          {detail ? <Text style={[styles.detail, { color: t.color.sub }]}>{detail}</Text> : null}
        </View>
        {children}
      </Pressable>
    );
  }

  return (
<>
  <AppHeader
    title="Settings"
    showBack
    onPressLeft={() => nav.goBack()}
    onPressSettings={undefined}
  />
      <Screen>
        <ScrollView contentContainerStyle={{ padding: 16, gap: 14 }}>
          <Section title="Account">
            <Row label="Email" detail="you@packanack.golf" onPress={() => Alert.alert("Account", "Change email flow…")} />
            <Row label="Manage Subscription" detail="Free plan" onPress={() => Alert.alert("Billing", "Open billing portal…")} />
          </Section>

          <Section title="Preferences">
            <Row label="Theme" detail="System default" onPress={() => Alert.alert("Theme", "Light / Dark / System")} />
            <Row label="Haptics">
              <Switch value={haptics} onValueChange={setHaptics} />
            </Row>
          </Section>

          <Section title="Notifications">
            <Row label="Round reminders" detail="Pre-round checklist">
              <Switch value={notifRounds} onValueChange={setNotifRounds} />
            </Row>
            <Row label="Practice tips" detail="1–2 per week">
              <Switch value={notifPractice} onValueChange={setNotifPractice} />
            </Row>
          </Section>

          <Section title="About">
            <Row label="Version" detail="0.1.0 (alpha)" />
            <Row label="Licenses" onPress={() => Alert.alert("Licenses", "Open OSS licenses…")} />
          </Section>

          <Pressable
            onPress={() => Alert.alert("Sign out", "Are you sure you want to sign out?", [
              { text: "Cancel", style: "cancel" },
              { text: "Sign out", style: "destructive", onPress: () => Alert.alert("Signed out") },
            ])}
            style={({ pressed }) => [
              styles.signOut,
              { backgroundColor: pressed ? "#fef2f2" : "#fff", borderColor: t.color.line },
            ]}
          >
            <Text style={{ color: "#DC2626", fontWeight: "700" }}>Sign Out</Text>
          </Pressable>

          <View style={{ height: 16 }} />
        </ScrollView>
      </Screen>
    </>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 14,
    padding: 14,
    borderWidth: StyleSheet.hairlineWidth,
  },
  cardTitle: { fontSize: 14, fontWeight: "800", marginBottom: 8 },
  row: {
    minHeight: 48,
    borderTopWidth: StyleSheet.hairlineWidth,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 8,
  },
  label: { fontSize: 15, fontWeight: "600" },
  detail: { fontSize: 12, marginTop: 2 },
  signOut: {
    alignItems: "center",
    justifyContent: "center",
    height: 48,
    borderRadius: 12,
    borderWidth: StyleSheet.hairlineWidth,
  },
});
