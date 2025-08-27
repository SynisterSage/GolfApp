// src/screens/BagBuilderScreen.tsx
import React, { useEffect, useMemo, useState } from "react";
import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  TextInput,
  Pressable,
  ScrollView,
  Alert,
} from "react-native";
import { useTheme } from "../theme";
import { Bag, BagClub, ClubType, loadBag, saveBag } from "../features/bag/storage";

/* ---------------- Presets ---------------- */
type TypeOrCustom = ClubType | "Custom";

const TYPES: TypeOrCustom[] = ["Wood", "Hybrid", "Iron", "Wedge", "Putter", "Custom"];

const PRESETS: Record<Exclude<TypeOrCustom, "Custom">, { id: string; label: string; loft?: string }[]> = {
  Wood: [
    { id: "driver", label: "Driver", loft: "10.5°" },
    { id: "3w", label: "3 Wood", loft: "15°" },
    { id: "5w", label: "5 Wood", loft: "18°" },
    { id: "7w", label: "7 Wood", loft: "21°" },
  ],
  Hybrid: [
    { id: "3h", label: "3 Hybrid", loft: "19°" },
    { id: "4h", label: "4 Hybrid", loft: "22°" },
    { id: "5h", label: "5 Hybrid", loft: "25°" },
  ],
  Iron: [
    { id: "5i", label: "5 Iron" },
    { id: "6i", label: "6 Iron" },
    { id: "7i", label: "7 Iron" },
    { id: "8i", label: "8 Iron" },
    { id: "9i", label: "9 Iron" },
  ],
  Wedge: [
    { id: "pw", label: "Pitching Wedge", loft: "46°" },
    { id: "gw", label: "Gap Wedge", loft: "50°" },
    { id: "sw", label: "Sand Wedge", loft: "54°" },
    { id: "lw", label: "Lob Wedge", loft: "58°" },
  ],
  Putter: [{ id: "putter", label: "Putter" }],
};

export default function BagBuilderScreen({ navigation }: any) {
  const { theme } = useTheme();
  const s = useMemo(() => styles(theme), [theme]);

  const [bag, setBag] = useState<Bag>({ updatedAt: Date.now(), clubs: [] });

  // Selection state
  const [type, setType] = useState<TypeOrCustom>("Iron"); // default
  const [selectedPreset, setSelectedPreset] = useState<string | null>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  // Wedge-only editable loft (prefills from preset, can override)
  const [wedgeLoft, setWedgeLoft] = useState<string>("");

  // Custom (when pill = Custom)
  const [customLabel, setCustomLabel] = useState("");
  const [customLoft, setCustomLoft] = useState("");

  useEffect(() => {
    loadBag().then((b) => setBag(b));
  }, []);

  // When type changes:
  // - keep dropdown open/closed as-is (your request)
  // - for preset types, preselect first preset; for Custom, clear preset
  // - if Wedge, sync wedgeLoft from preset; otherwise clear
  useEffect(() => {
    if (type === "Custom") {
      setSelectedPreset(null);
      setWedgeLoft("");
      return;
    }
    const first = PRESETS[type][0]?.id ?? null;
    setSelectedPreset(first);
    if (type === "Wedge") {
      const p = PRESETS.Wedge.find((x) => x.id === first!);
      setWedgeLoft(p?.loft ?? "");
    } else {
      setWedgeLoft("");
    }
  }, [type]);

  // When preset changes and type is Wedge, update wedgeLoft if empty
  useEffect(() => {
    if (type !== "Wedge") return;
    const p = selectedPreset ? PRESETS.Wedge.find((x) => x.id === selectedPreset) : undefined;
    if (p && !wedgeLoft) setWedgeLoft(p.loft ?? "");
  }, [selectedPreset, type]); // eslint-disable-line

  const grouped = useMemo(() => {
    const map: Record<ClubType, BagClub[]> = { Wood: [], Hybrid: [], Iron: [], Wedge: [], Putter: [] };
    (bag.clubs ?? []).forEach((c) => map[c.type].push(c));
    return map;
  }, [bag]);

  /* ---------------- Actions ---------------- */

  function addPreset() {
    if (type === "Custom") return; // not applicable
    const preset =
      PRESETS[type].find((p) => p.id === selectedPreset) || PRESETS[type][0];
    if (!preset) return;

    const loftToUse = type === "Wedge" ? (wedgeLoft.trim() || preset.loft) : preset.loft;

    const newClub: BagClub = {
      id: `${preset.id}-${unique()}`,
      type,
      label: preset.label,
      loft: loftToUse,
    };
    setBag((b) => ({ ...b, clubs: [...b.clubs, newClub] }));
  }

  function addCustom() {
    if (!customLabel.trim()) return;
    // Let user choose which bucket Custom goes in? Use current 'type' when Custom is selected → default to Iron if somehow not.
    const bucket: ClubType = "Iron"; // neutral default if needed
    const newClub: BagClub = {
      id: `${slug(customLabel)}-${unique()}`,
      type: bucket,
      label: customLabel.trim(),
      loft: customLoft.trim() || undefined,
    };
    setBag((b) => ({ ...b, clubs: [...b.clubs, newClub] }));
    setCustomLabel("");
    setCustomLoft("");
  }

  function removeClub(id: string) {
    setBag((b) => ({ ...b, clubs: b.clubs.filter((c) => c.id !== id) }));
  }

  async function saveAndClose() {
    if (bag.clubs.length > 14) {
      const proceed = await confirm(
        `You have ${bag.clubs.length} clubs. USGA allows 14. Save anyway?`
      );
      if (!proceed) return;
    }
    await saveBag(bag);
    navigation.goBack();
  }

  /* ---------------- Render ---------------- */

  const isCustom = type === "Custom";

  return (
    <SafeAreaView style={s.screen}>
      {/* Taller header to match Home */}
      <View style={s.headerRow}>
        <Text style={s.title}>Build Your Bag</Text>
        <View style={{ flex: 1 }} />
      </View>

      <ScrollView
        contentContainerStyle={{ paddingBottom: theme.space(8) }}
        style={{ paddingHorizontal: theme.space(3) }}
        showsVerticalScrollIndicator={false}
      >
        {/* Add a club */}
        <View style={s.card}>
          <Text style={s.cardTitle}>Add a club</Text>

          {/* Type pills — now horizontal scroll and includes "Custom" */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ gap: theme.space(2) }}
            style={{ marginBottom: theme.space(1) }}
          >
            {TYPES.map((t) => (
              <Seg
                key={t}
                label={t}
                active={type === t}
                onPress={() => setType(t)}
                theme={theme}
              />
            ))}
          </ScrollView>

          {/* If Custom is selected: show the custom editor; else show preset UI */}
          {isCustom ? (
            <>
              <View style={{ flexDirection: "row", gap: theme.space(2) }}>
                <View style={{ flex: 1 }}>
                  <Text style={s.label}>Label</Text>
                  <TextInput
                    value={customLabel}
                    onChangeText={setCustomLabel}
                    placeholder="e.g., 2 Iron"
                    placeholderTextColor={theme.colors.muted}
                    style={s.input}
                  />
                </View>
                <View style={{ width: 120 }}>
                  <Text style={s.label}>Loft (opt.)</Text>
                  <TextInput
                    value={customLoft}
                    onChangeText={setCustomLoft}
                    placeholder="18°"
                    placeholderTextColor={theme.colors.muted}
                    style={s.input}
                  />
                </View>
              </View>
              <View style={s.actionsRow}>
                <Primary label="Add Custom" onPress={addCustom} theme={theme} />
              </View>
            </>
          ) : (
            <>
              <Text style={s.label}>Choose preset</Text>
              <Pressable
                onPress={() => setDropdownOpen((v) => !v)}
                style={({ pressed }) => [s.select, pressed && { opacity: 0.95 }]}
              >
                <Text style={{ color: theme.colors.text, fontWeight: "600" }}>
                  {selectedPreset
                    ? PRESETS[type].find((p) => p.id === selectedPreset)?.label
                    : "Select a club"}
                </Text>
                <Text style={{ color: theme.colors.muted, fontWeight: "900" }}>
                  {dropdownOpen ? "▲" : "▼"}
                </Text>
              </Pressable>

              {dropdownOpen && (
                <View style={s.dropdownWrap}>
                  <ScrollView
                    style={{ maxHeight: 240 }}
                    nestedScrollEnabled
                    showsVerticalScrollIndicator={false}
                  >
                    {PRESETS[type].map((p) => {
                      const active = selectedPreset === p.id;
                      return (
                        <Pressable
                          key={p.id}
                          onPress={() => setSelectedPreset(p.id)}
                          style={({ pressed }) => [
                            s.optionRow,
                            active && { borderColor: theme.colors.tint, backgroundColor: theme.colors.tintSoft },
                            pressed && { opacity: 0.97 },
                          ]}
                        >
                          <Text style={{ color: theme.colors.text }}>
                            {p.label} {p.loft ? `• ${p.loft}` : ""}
                          </Text>
                        </Pressable>
                      );
                    })}
                  </ScrollView>
                </View>
              )}

              {/* WEDGE-ONLY: editable loft */}
              {type === "Wedge" && (
                <View style={{ marginTop: theme.space(2) }}>
                  <Text style={s.label}>Loft (edit for this wedge)</Text>
                  <TextInput
                    value={wedgeLoft}
                    onChangeText={setWedgeLoft}
                    placeholder={
                      selectedPreset
                        ? PRESETS.Wedge.find((p) => p.id === selectedPreset)?.loft || "54°"
                        : "54°"
                    }
                    placeholderTextColor={theme.colors.muted}
                    style={s.input}
                  />
                </View>
              )}

              <View style={s.actionsRow}>
                <Primary label="Add Preset" onPress={addPreset} theme={theme} />
              </View>
            </>
          )}
        </View>

        {/* Current bag */}
        <Text style={[s.sectionHeader, { marginTop: theme.space(3) }]}>
          Current Bag ({bag.clubs.length})
        </Text>

        {(["Wood", "Hybrid", "Iron", "Wedge", "Putter"] as ClubType[]).map((t) => {
          const list = grouped[t] ?? [];
          return (
            <View key={t} style={{ marginBottom: theme.space(2) }}>
              <View style={s.card}>
                <Text style={s.cardTitle}>{t}</Text>
                {list.length === 0 ? (
                  <Text style={s.helper}>No {t.toLowerCase()} added yet.</Text>
                ) : (
                  list.map((c, idx) => (
                    <View
                      key={c.id}
                      style={[
                        s.row,
                        // remove bottom border on last visible item inside this card
                        idx === list.length - 1 && { borderBottomWidth: 0 },
                      ]}
                    >
                      <Text style={s.rowText}>
                        {c.label} {c.loft ? `• ${c.loft}` : ""}
                      </Text>
                      <Pressable
                        onPress={() => removeClub(c.id)}
                        style={({ pressed }) => [s.removeBtn, pressed && { opacity: 0.9 }]}
                      >
                        <Text style={s.removeText}>Remove</Text>
                      </Pressable>
                    </View>
                  ))
                )}
              </View>
            </View>
          );
        })}
      </ScrollView>

      {/* Taller footer to match Home */}
      <View style={s.footer}>
        <Primary label="Save Bag" onPress={saveAndClose} theme={theme} />
        <Ghost label="Cancel" onPress={() => navigation.goBack()} theme={theme} />
      </View>
    </SafeAreaView>
  );
}

/* ---------------- UI bits ---------------- */

function Seg({
  label,
  active,
  onPress,
  theme,
}: {
  label: string;
  active: boolean;
  onPress: () => void;
  theme: any;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        {
          paddingVertical: theme.space(1.25),
          paddingHorizontal: theme.space(3),
          borderRadius: theme.radius.pill,
          borderWidth: 1,
          borderColor: active ? theme.colors.tint : theme.colors.border,
          backgroundColor: active ? theme.colors.tintSoft : "transparent",
        },
        pressed && { opacity: 0.95 },
      ]}
    >
      <Text style={{ color: active ? theme.colors.text : theme.colors.muted, fontWeight: "600" }}>
        {label}
      </Text>
    </Pressable>
  );
}

function Primary({
  label,
  onPress,
  theme,
}: {
  label: string;
  onPress: () => void;
  theme: any;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        {
          paddingVertical: theme.space(2.75),
          paddingHorizontal: theme.space(4),
          borderRadius: theme.radius.md,
          backgroundColor: theme.colors.tint,
          alignItems: "center",
        },
        pressed && { opacity: 0.9 },
      ]}
    >
      <Text style={{ color: "#fff", fontWeight: "800" }}>{label}</Text>
    </Pressable>
  );
}

function Ghost({
  label,
  onPress,
  theme,
}: {
  label: string;
  onPress: () => void;
  theme: any;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        {
          paddingVertical: theme.space(2.75),
          paddingHorizontal: theme.space(4),
          borderRadius: theme.radius.md,
          borderWidth: 1,
          borderColor: theme.colors.border,
          alignItems: "center",
        },
        pressed && { opacity: 0.9 },
      ]}
    >
      <Text style={{ color: theme.colors.text, fontWeight: "700" }}>{label}</Text>
    </Pressable>
  );
}

/* ---------------- helpers + styles ---------------- */

async function confirm(message: string): Promise<boolean> {
  return new Promise((res) => {
    Alert.alert("Confirm", message, [
      { text: "Cancel", style: "cancel", onPress: () => res(false) },
      { text: "Save", style: "destructive", onPress: () => res(true) },
    ]);
  });
}

const slug = (s: string) => s.replace(/[^\w]+/g, "-").toLowerCase();
const unique = () => Math.random().toString(36).slice(2, 7);

const styles = (theme: any) =>
  StyleSheet.create({
    screen: { flex: 1, backgroundColor: theme.colors.bg },

    /* Taller header (matches your Home spacing) */
    headerRow: {
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: theme.space(3),
      paddingTop: theme.space(10),
      paddingBottom: theme.space(2),
    },
    title: { fontSize: 24, fontWeight: "800", color: theme.colors.text },

    sectionHeader: { color: theme.colors.muted, fontWeight: "700", marginBottom: 8 },

    card: {
      backgroundColor: theme.colors.card,
      borderRadius: theme.radius.lg,
      padding: theme.space(3),
      borderWidth: 1,
      borderColor: theme.colors.border,
      gap: theme.space(2),
    },
    cardTitle: { color: theme.colors.text, fontWeight: "700", fontSize: 16 },
    helper: { color: theme.colors.muted },

    label: { color: theme.colors.muted, fontSize: 12, fontWeight: "700" },

    select: {
      borderWidth: 1,
      borderColor: theme.colors.border,
      borderRadius: theme.radius.md,
      paddingVertical: theme.space(2),
      paddingHorizontal: theme.space(3),
      backgroundColor: theme.colors.bg,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
    },
    dropdownWrap: {
      marginTop: theme.space(1),
      borderWidth: 1,
      borderColor: theme.colors.border,
      borderRadius: theme.radius.md,
      backgroundColor: theme.colors.bg,
      overflow: "hidden",
    },
    optionRow: {
      paddingVertical: theme.space(2),
      paddingHorizontal: theme.space(3),
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
    },

    input: {
      borderWidth: 1,
      borderColor: theme.colors.border,
      paddingVertical: theme.space(2),
      paddingHorizontal: theme.space(3),
      borderRadius: theme.radius.md,
      color: theme.colors.text,
      backgroundColor: theme.colors.bg,
    },

    /* Rows — fixed alignment for Remove button */
    row: {
      minHeight: 48,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingVertical: theme.space(1.5),
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
    },
    rowText: { color: theme.colors.text },

    removeBtn: {
      height: 32,
      paddingHorizontal: theme.space(3),
      borderRadius: theme.radius.md,
      backgroundColor: theme.colors.danger,
      alignItems: "center",
      justifyContent: "center",
    },
    removeText: { color: "#fff", fontWeight: "800" },

    actionsRow: { flexDirection: "row", gap: theme.space(2), marginTop: theme.space(2) },

    /* Taller footer (matches your Home button row height) */
    footer: {
      borderTopWidth: 1,
      borderTopColor: theme.colors.border,
      backgroundColor: theme.colors.card,
      paddingHorizontal: theme.space(3),
      paddingVertical: theme.space(6),
      flexDirection: "row",
      gap: theme.space(2),
      justifyContent: "space-between",
    },
  });
