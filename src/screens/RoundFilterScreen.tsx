import React, { useState, useMemo, useEffect } from "react";
import { View, Text, StyleSheet, ScrollView, Pressable, TextInput } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useTheme } from "../theme";
import type { Filters } from "../features/rounds/filters";
import { countActiveFilters } from "../features/rounds/filters";
import { getRecentRounds } from "../features/rounds/rounds";

/* ───────────────────────────── UI bits ───────────────────────────── */

function Chip({
  label,
  selected,
  onPress,
}: {
  label: string;
  selected?: boolean;
  onPress: () => void;
}) {
  const { theme } = useTheme();
  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.chip,
        {
          backgroundColor: selected ? theme.colors.tint : "transparent",
          borderColor: selected ? theme.colors.tint : theme.colors.border,
        },
      ]}
    >
      <Text style={{ color: selected ? "#fff" : theme.colors.text, fontWeight: "700" }}>
        {label}
      </Text>
    </Pressable>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  const { theme } = useTheme();
  return (
    <View style={styles.section}>
      <Text style={[styles.label, { color: theme.colors.text }]}>{title}</Text>
      {children}
      <View style={[styles.divider, { borderBottomColor: theme.colors.border }]} />
    </View>
  );
}

function NumberBox({
  value,
  placeholder,
  onChange,
  suffix,
  width = 84,
}: {
  value?: number | null;
  placeholder?: string;
  onChange: (n: number | undefined) => void;
  suffix?: string;
  width?: number;
}) {
  const { theme } = useTheme();
  const [text, setText] = useState(value != null ? String(value) : "");

  useEffect(() => {
    // keep in sync if parent changes (e.g., Clear All)
    const next = value != null ? String(value) : "";
    if (next !== text) setText(next);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  const commit = (t: string) => {
    const n = t.trim() === "" ? undefined : Number(t);
    if (Number.isNaN(n as number)) onChange(undefined);
    else onChange(n);
  };

  return (
    <View
      style={[
        styles.numWrap,
        { backgroundColor: theme.colors.card, borderColor: theme.colors.border, width },
      ]}
    >
      <TextInput
        value={text}
        onChangeText={(t) => {
          setText(t);
        }}
        onBlur={() => commit(text)}
        keyboardType="numeric"
        placeholder={placeholder}
        placeholderTextColor={theme.colors.muted}
        style={[styles.numInput, { color: theme.colors.text }]}
      />
      {suffix ? <Text style={{ color: theme.colors.muted, fontWeight: "700" }}>{suffix}</Text> : null}
    </View>
  );
}

function RangeRow({
  label,
  min,
  max,
  onMin,
  onMax,
  suffix,
  minPlaceholder = "Min",
  maxPlaceholder = "Max",
}: {
  label: string;
  min?: number;
  max?: number;
  onMin: (n: number | undefined) => void;
  onMax: (n: number | undefined) => void;
  suffix?: string;
  minPlaceholder?: string;
  maxPlaceholder?: string;
}) {
  const { theme } = useTheme();
  return (
    <View style={styles.rangeRow}>
      <Text style={[styles.rangeLabel, { color: theme.colors.muted }]}>{label}</Text>
      <View style={styles.rangeBoxes}>
        <NumberBox value={min} onChange={onMin} placeholder={minPlaceholder} suffix={suffix} />
        <Text style={[styles.to, { color: theme.colors.muted }]}>to</Text>
        <NumberBox value={max} onChange={onMax} placeholder={maxPlaceholder} suffix={suffix} />
      </View>
    </View>
  );
}

/* ───────────────────────────── Screen ───────────────────────────── */

export default function RoundFilterScreen() {
  const nav = useNavigation<any>();
  const route = useRoute<any>();
  const { theme } = useTheme();

  // Keep previously applied filters highlighted when reopening
  const [filters, setFilters] = useState<Filters>({});
  useEffect(() => {
    if (route.params?.filters) {
      setFilters(route.params.filters as Filters);
    }
  }, [route.params?.filters]);

  // Source values for dynamic chips
  const rounds = useMemo(() => getRecentRounds(100), []);
  const courses = useMemo(() => Array.from(new Set(rounds.map((r) => r.course))), [rounds]);
  const pars = useMemo(() => Array.from(new Set(rounds.map((r) => r.par))), [rounds]);

  // Common tees (don’t depend on data)
  const teeOptions = ["Red", "White", "Blue", "Gold", "Black", "Green"];

  const toggleArray = (key: keyof Filters, val: string | number) => {
    setFilters((f) => {
      const prev: any[] = (f as any)[key] ?? [];
      const set = new Set(prev);
      set.has(val) ? set.delete(val) : set.add(val);
      return { ...f, [key]: Array.from(set) };
    });
  };

  const apply = () => {
    // Convert FIR/GIR from % → fraction (0..1) for filter logic
    const normalized: Filters = {
      ...filters,
      firMin: filters.firMin != null ? Math.max(0, Math.min(100, filters.firMin)) / 100 : undefined,
      firMax: filters.firMax != null ? Math.max(0, Math.min(100, filters.firMax)) / 100 : undefined,
      girMin: filters.girMin != null ? Math.max(0, Math.min(100, filters.girMin)) / 100 : undefined,
      girMax: filters.girMax != null ? Math.max(0, Math.min(100, filters.girMax)) / 100 : undefined,
    };

    nav.navigate("Tabs", { screen: "Stats", params: { appliedFilters: normalized } });
  };

  const clearAll = () => setFilters({});

  const badge = countActiveFilters(filters);

  return (
    <View style={[styles.wrap, { backgroundColor: theme.colors.bg }]}>
      {/* Header */}
      <View style={[styles.header, { borderBottomColor: theme.colors.border }]}>
        <Pressable onPress={() => nav.goBack()}>
          <Text style={{ color: theme.colors.tint, fontWeight: "800" }}>Cancel</Text>
        </Pressable>
        <Text style={{ color: theme.colors.text, fontWeight: "900" }}>Filter</Text>
        <Pressable onPress={clearAll}>
          <Text style={{ color: theme.colors.tint, fontWeight: "800" }}>Clear All</Text>
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={{ padding: 16 }}>
        {/* Courses: horizontal scroll */}
        <Section title="Course">
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.horizontalRow}>
            {courses.map((c) => (
              <Chip
                key={c}
                label={c}
                selected={filters.courses?.includes(c)}
                onPress={() => toggleArray("courses", c)}
              />
            ))}
          </ScrollView>
        </Section>

        {/* Tees: horizontal scroll */}
        <Section title="Tees">
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.horizontalRow}>
            {teeOptions.map((t) => (
              <Chip
                key={t}
                label={t}
                selected={filters.tees?.includes(t)}
                onPress={() => toggleArray("tees", t)}
              />
            ))}
          </ScrollView>
        </Section>

        {/* Holes */}
        <Section title="Holes">
          <View style={styles.rowWrap}>
            {[9, 18].map((h) => (
              <Chip
                key={h}
                label={`${h}`}
                selected={filters.holes === h}
                onPress={() => setFilters((f) => ({ ...f, holes: f.holes === h ? undefined : h }))}
              />
            ))}
          </View>
        </Section>

        {/* Par */}
        <Section title="Par">
          <View style={styles.rowWrap}>
            {pars.map((p) => (
              <Chip
                key={p}
                label={`${p}`}
                selected={!!filters.par?.includes(p)}
                onPress={() => toggleArray("par", p)}
              />
            ))}
          </View>
        </Section>

        {/* Score range */}
        <Section title="Score">
          <RangeRow
            label="Gross"
            min={filters.scoreMin}
            max={filters.scoreMax}
            onMin={(n) => setFilters((f) => ({ ...f, scoreMin: n }))}
            onMax={(n) => setFilters((f) => ({ ...f, scoreMax: n }))}
          />
        </Section>

        {/* Net vs HCP */}
        <Section title="Net vs HCP">
          <RangeRow
            label="Net"
            min={filters.netMin}
            max={filters.netMax}
            onMin={(n) => setFilters((f) => ({ ...f, netMin: n }))}
            onMax={(n) => setFilters((f) => ({ ...f, netMax: n }))}
          />
        </Section>

        {/* FIR/GIR percentages (UI shows %, backend expects 0..1) */}
        <Section title="Fairways in Regulation (FIR)">
          <RangeRow
            label="FIR"
            min={filters.firMin}
            max={filters.firMax}
            onMin={(n) => setFilters((f) => ({ ...f, firMin: n }))}
            onMax={(n) => setFilters((f) => ({ ...f, firMax: n }))}
            suffix="%"
          />
        </Section>

        <Section title="Greens in Regulation (GIR)">
          <RangeRow
            label="GIR"
            min={filters.girMin}
            max={filters.girMax}
            onMin={(n) => setFilters((f) => ({ ...f, girMin: n }))}
            onMax={(n) => setFilters((f) => ({ ...f, girMax: n }))}
            suffix="%"
          />
        </Section>

        {/* Putts */}
        <Section title="Putts">
          <RangeRow
            label="Putts"
            min={filters.puttsMin}
            max={filters.puttsMax}
            onMin={(n) => setFilters((f) => ({ ...f, puttsMin: n }))}
            onMax={(n) => setFilters((f) => ({ ...f, puttsMax: n }))}
          />
        </Section>

        {/* Match Type */}
        <Section title="Match Type">
          <View style={styles.rowWrap}>
            {["Stroke", "Match", "Skins", "Practice"].map((m) => (
              <Chip
                key={m}
                label={m}
                selected={!!filters.matchType?.includes(m)}
                onPress={() => toggleArray("matchType", m)}
              />
            ))}
          </View>
        </Section>

        {/* Result */}
        <Section title="Result">
          <View style={styles.rowWrap}>
            {["Win", "Loss", "Tie", "N/A"].map((r) => (
              <Chip
                key={r}
                label={r}
                selected={!!filters.result?.includes(r)}
                onPress={() => toggleArray("result", r)}
              />
            ))}
          </View>
        </Section>

        <View style={{ height: 8 }} />
      </ScrollView>

      {/* Footer button */}
      <Pressable
        onPress={apply}
        style={({ pressed }) => [
          styles.apply,
          { backgroundColor: theme.colors.tint, opacity: pressed ? 0.92 : 1 },
        ]}
      >
        <Text style={{ color: "#fff", fontWeight: "900" }}>
          Apply Filters{countActiveFilters(filters) ? ` (${countActiveFilters(filters)})` : ""}
        </Text>
      </Pressable>
    </View>
  );
}

/* ───────────────────────────── Styles ───────────────────────────── */

const styles = StyleSheet.create({
  wrap: { flex: 1 },
  header: {
    height: 80,
    borderBottomWidth: StyleSheet.hairlineWidth,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: 24,
  },
  section: { marginBottom: 16 },
  label: { fontSize: 13, fontWeight: "800", marginBottom: 8 },
  rowWrap: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginBottom: 8 },
  horizontalRow: { flexDirection: "row", gap: 8, paddingRight: 16 },
  divider: { borderBottomWidth: StyleSheet.hairlineWidth, marginTop: 8 },

  chip: {
    paddingHorizontal: 12,
    height: 36,
    borderRadius: 18,
    borderWidth: StyleSheet.hairlineWidth,
    alignItems: "center",
    justifyContent: "center",
  },

  rangeRow: { gap: 8 },
  rangeLabel: { fontSize: 12, fontWeight: "700" },
  rangeBoxes: { flexDirection: "row", alignItems: "center", gap: 8 },
  numWrap: {
    height: 40,
    borderRadius: 10,
    borderWidth: StyleSheet.hairlineWidth,
    paddingHorizontal: 10,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  numInput: { flex: 1, fontSize: 14, paddingVertical: 8, paddingHorizontal: 0 },
  to: { fontSize: 13, fontWeight: "700" },

  apply: {
    height: 50,
    borderRadius: 14,
    margin: 16,
    alignItems: "center",
    justifyContent: "center",
  },
});
