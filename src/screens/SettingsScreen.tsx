// src/screens/SettingsScreen.tsx
import React, { useState } from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  View,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import Screen from "../components/ui/Screen";
import { useTheme } from "../theme";

/* simple chevron for tappable rows */
const ChevronRight = ({ size = 18, color = "#9CA3AF" }) => (
  <Text style={{ fontSize: size, color, fontWeight: "900" }}>{">"}</Text>
);

type Opt = "system" | "light" | "dark";

export default function SettingsScreen() {
  const { theme, pref, setPref } = useTheme();
  const nav = useNavigation();

  // mock state (wire to store later)
  const [notifRounds, setNotifRounds] = useState(true);
  const [notifPractice, setNotifPractice] = useState(false);
  const [haptics, setHaptics] = useState(true);

  const onBack = () => {
    // @ts-ignore
    if (nav.canGoBack && nav.canGoBack()) nav.goBack();
    // @ts-ignore
    else nav.navigate("Home" as never);
  };

  return (
    <Screen>
      <ScrollView
        contentContainerStyle={[styles.scrollBody, { backgroundColor: theme.colors.bg }]}
        showsVerticalScrollIndicator={false}
      >
        {/* ───────── Header row: inline back circle + centered avatar ───────── */}
        <View style={styles.headerRow}>
          <Pressable
            onPress={onBack}
            hitSlop={10}
            style={({ pressed }) => [
              styles.backBtn,
              {
                backgroundColor: theme.colors.tint,
                transform: [{ scale: pressed ? 0.95 : 1 }],
              },
            ]}
          >
            <Text style={{ color: "#fff", fontWeight: "900" }}>{"<"}</Text>
          </Pressable>

          <View style={styles.headerCenter}>
            <View style={[styles.avatar, { backgroundColor: theme.colors.surfaceAlt }]}>
              <View style={[styles.avatarDot, { backgroundColor: theme.colors.tint }]} />
            </View>
            <Text style={[styles.profileName, { color: theme.colors.text }]}>User Profile</Text>
            <Text style={[styles.profileHandle, { color: theme.colors.muted }]}>@username</Text>
          </View>

          <View style={styles.rightSpacer} />
        </View>

        {/* ✅ NEW: Centered "Edit Bag" button right under the profile */}
        <View style={{ alignItems: "center", marginTop: 6, marginBottom: 10 }}>
          <Pressable
            // @ts-ignore
            onPress={() => nav.navigate("BagBuilder" as never)}
            style={({ pressed }) => [
              {
                backgroundColor: pressed ? theme.colors.tint + "DD" : theme.colors.tint,
                paddingVertical: 12,
                paddingHorizontal: 24,
                borderRadius: 999, // pill
                shadowColor: "#000",
                shadowOpacity: theme.mode === "dark" ? 0.25 : 0.1,
                shadowRadius: 10,
                shadowOffset: { width: 0, height: 4 },
                elevation: 3,
              },
            ]}
          >
            <Text style={{ color: "#fff", fontWeight: "800" }}>Edit Bag</Text>
          </Pressable>
        </View>

        {/* ───────── Account ───────── */}
        <Section title="Account">
          <Row
            label="Email"
            detail="you@gmail.com"
            onPress={() => alert("Change email flow…")}
          />
          <Row
            label="Manage Subscription"
            detail="Free Plan"
            onPress={() => alert("Open billing portal…")}
            isLast
          />
        </Section>

        {/* ───────── Preferences ───────── */}
        <Section title="Preferences">
          <Text
            style={[
              styles.helper,
              { color: theme.colors.muted, marginHorizontal: 14, marginTop: 6 },
            ]}
          >
            Theme
          </Text>

          <ThemeDots value={pref} onChange={(v) => setPref(v)} />

          <Row label="Haptic Feedback" isLast>
            <Switch
              value={haptics}
              onValueChange={setHaptics}
              trackColor={{ true: theme.colors.tint + "55", false: theme.colors.border }}
              thumbColor={haptics ? theme.colors.tint : "#fff"}
            />
          </Row>
        </Section>

        {/* ───────── Notifications ───────── */}
        <Section title="Notifications">
          <Row label="Round reminders" detail="Pre-round checklist">
            <Switch
              value={notifRounds}
              onValueChange={setNotifRounds}
              trackColor={{ true: theme.colors.tint + "55", false: theme.colors.border }}
              thumbColor={notifRounds ? theme.colors.tint : "#fff"}
            />
          </Row>
          <Row label="Practice tips" detail="1–2 per week" isLast>
            <Switch
              value={notifPractice}
              onValueChange={setNotifPractice}
              trackColor={{ true: theme.colors.tint + "55", false: theme.colors.border }}
              thumbColor={notifPractice ? theme.colors.tint : "#fff"}
            />
          </Row>
        </Section>

        {/* ───────── About ───────── */}
        <Section title="About">
          <Row label="Version" detail="0.1.0 (alpha)" />
          <Row label="Licenses" onPress={() => alert("Open OSS licenses…")} isLast />
        </Section>

        {/* ───────── Sign out (blue) ───────── */}
        <Pressable
          onPress={() => alert("Signed out")}
          style={({ pressed }) => [
            styles.signOut,
            {
              backgroundColor: pressed ? theme.colors.tint + "DD" : theme.colors.tint,
              borderColor: theme.colors.tint,
            },
          ]}
        >
          <Text style={{ color: "#fff", fontWeight: "800" }}>Sign Out</Text>
        </Pressable>

        <View style={{ height: 16 }} />
      </ScrollView>
    </Screen>
  );
}

/* ───────────────────────────── Components ───────────────────────────── */

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  const { theme } = useTheme();
  return (
    <View style={styles.sectionWrap}>
      <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>{title}</Text>
      <View
        style={[
          styles.card,
          { backgroundColor: theme.colors.card, borderColor: theme.colors.border },
          theme.mode === "dark" ? styles.cardDarkShadow : styles.cardLightShadow,
        ]}
      >
        {children}
      </View>
    </View>
  );
}

function Row({
  label,
  detail,
  onPress,
  children,
  isLast,
}: {
  label: string;
  detail?: string;
  onPress?: () => void;
  children?: React.ReactNode;
  isLast?: boolean;
}) {
  const { theme } = useTheme();
  const clickable = !!onPress;

  return (
    <Pressable
      onPress={onPress}
      disabled={!clickable}
      style={({ pressed }) => [
        styles.row,
        !isLast && { borderBottomWidth: StyleSheet.hairlineWidth, borderColor: theme.colors.border },
        { opacity: pressed ? 0.92 : 1 },
      ]}
    >
      <View style={{ flex: 1 }}>
        <Text style={[styles.label, { color: theme.colors.text }]}>{label}</Text>
        {detail ? <Text style={[styles.detail, { color: theme.colors.muted }]}>{detail}</Text> : null}
      </View>
      {children ? children : clickable ? <ChevronRight color={theme.colors.muted} /> : null}
    </Pressable>
  );
}

/* Compact Theme Dots (icon-only) */
function ThemeDots({ value, onChange }: { value: Opt; onChange: (v: Opt) => void }) {
  const { theme } = useTheme();

  const items: { key: Opt; icon: string; label: string }[] = [
    { key: "system", icon: "🖥️", label: "System" },
    { key: "light", icon: "☀️", label: "Light" },
    { key: "dark", icon: "🌙", label: "Dark" },
  ];

  const baseBg = theme.mode === "dark" ? theme.colors.card : theme.colors.surface;
  const baseBorder = theme.colors.border;
  const activeBg = theme.colors.tint; // blue
  const activeFg = "#ffffff";
  const inactiveFg = theme.colors.text;

  return (
    <View style={[styles.dotsWrap, { backgroundColor: baseBg, borderColor: baseBorder }]}>
      {items.map((it) => {
        const selected = value === it.key;
        return (
          <Pressable
            key={it.key}
            onPress={() => onChange(it.key)}
            accessibilityRole="button"
            accessibilityLabel={`Theme: ${it.label}`}
            style={({ pressed }) => [
              styles.dotBtn,
              {
                backgroundColor: selected ? activeBg : baseBg,
                borderColor: selected ? activeBg : baseBorder,
                transform: [{ scale: pressed ? 0.96 : 1 }],
              },
            ]}
          >
            <Text style={{ fontSize: 18, color: selected ? activeFg : inactiveFg }}>
              {it.icon}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

/* ───────────────────────────── Styles ───────────────────────────── */

const AVATAR = 92;
const BACK = 36;

const styles = StyleSheet.create({
  scrollBody: { padding: 16, gap: 14 },

  /* Header: back circle inline with avatar centered */
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
    marginBottom: 6,
  },
  backBtn: {
    width: BACK,
    height: BACK,
    borderRadius: BACK / 2,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 4,
    marginBottom: 20,
  },
  headerCenter: {
    flex: 1,
    alignItems: "center",
  },
  rightSpacer: {
    width: BACK + 8,
  },

  /* Avatar */
  avatar: {
    width: AVATAR,
    height: AVATAR,
    borderRadius: AVATAR / 2,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
  },
  avatarDot: {
    position: "absolute",
    right: 8,
    bottom: 8,
    width: 18,
    height: 18,
    borderRadius: 18,
    borderWidth: 2,
    borderColor: "#fff",
  },
  profileName: { fontSize: 16, fontWeight: "800" },
  profileHandle: { fontSize: 12, marginTop: 2 },

  /* Section + Card */
  sectionWrap: { gap: 8 },
  sectionTitle: { fontSize: 13, fontWeight: "800" },
  card: {
    borderRadius: 14,
    overflow: "hidden",
    borderWidth: StyleSheet.hairlineWidth,
  },
  cardLightShadow: {
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 4,
    elevation: 1,
  },
  cardDarkShadow: {
    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 2,
  },

  /* Rows */
  row: {
    minHeight: 56,
    paddingHorizontal: 14,
    paddingVertical: 10,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  label: { fontSize: 15, fontWeight: "700" },
  detail: { fontSize: 12, marginTop: 2 },

  /* Theme dots */
  dotsWrap: {
    marginTop: 8,
    marginHorizontal: 12,
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 14,
    borderWidth: StyleSheet.hairlineWidth,
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 10,
  },
  dotBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: StyleSheet.hairlineWidth,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
    elevation: 2,
  },

  /* Sign out */
  signOut: {
    alignItems: "center",
    justifyContent: "center",
    height: 48,
    borderRadius: 12,
    borderWidth: StyleSheet.hairlineWidth,
    marginTop: 8,
  },

  helper: { fontSize: 12, fontWeight: "700" },
});
