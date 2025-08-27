import React from "react";
import { View, StyleSheet, FlatList, Pressable, Text } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useTheme } from "../theme";

import SearchBar from "../components/ui/SearchBar";
import PillButton from "../components/ui/PillButton";
import RoundCard from "../features/rounds/RoundCard";

import { getRecentRounds } from "../features/rounds/rounds";
import type { Round } from "../features/rounds/types";
import { filterRounds, sortRounds, countActiveFilters, type Filters, type SortSpec } from "../features/rounds/filters";

export default function StatsScreen() {
  const { theme } = useTheme();
  const nav = useNavigation<any>();
  const route = useRoute<any>();

  const allRounds = React.useMemo<Round[]>(() => getRecentRounds(100) as Round[], []);
  const [query, setQuery] = React.useState("");
  const [filters, setFilters] = React.useState<Filters>({});
  const [sort, setSort] = React.useState<SortSpec>({ key: "date", dir: "desc" });
  const [showSort, setShowSort] = React.useState(false);

  React.useEffect(() => {
    if ((route.params as any)?.appliedFilters) {
      setFilters((route.params as any).appliedFilters as Filters);
      nav.setParams({ appliedFilters: undefined });
    }
  }, [route.params, nav]);

  const filtered = React.useMemo(() => filterRounds(allRounds, { ...filters, query }), [allRounds, filters, query]);
  const sorted = React.useMemo(() => sortRounds(filtered, sort), [filtered, sort]);

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.bg }]}>
      <View style={styles.controls}>
        <SearchBar value={query} onChange={setQuery} onClear={() => setQuery("")} background="card" />
        <View style={styles.pillsRow}>
          <PillButton label="Sort" onPress={() => setShowSort(s => !s)} />
          <PillButton label="Filter" onPress={() => nav.navigate("RoundFilter", { filters })} badge={countActiveFilters(filters)} />
        </View>

        {showSort && (
          <View style={[styles.sortPanel, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}>
            {[
              { label: "Date: Newest → Oldest", key: "date", dir: "desc" },
              { label: "Date: Oldest → Newest", key: "date", dir: "asc" },
              { label: "Score: Low → High", key: "score", dir: "asc" },
              { label: "Score: High → Low", key: "score", dir: "desc" },
            ].map(opt => (
              <Pressable key={opt.label} onPress={() => { setSort({ key: opt.key as any, dir: opt.dir as any }); setShowSort(false); }}>
                <Text style={{ color: theme.colors.text, fontWeight: sort.key === opt.key && sort.dir === opt.dir ? "900" : "600", padding: 10 }}>{opt.label}</Text>
              </Pressable>
            ))}
          </View>
        )}
      </View>

      <FlatList
        contentContainerStyle={styles.listContent}
        data={sorted}
        keyExtractor={(item) => item.id}
        ItemSeparatorComponent={() => <View style={{ height: 8 }} />}
        renderItem={({ item }) => <RoundCard round={item} onPress={() => nav.navigate("RoundDetail", { roundId: item.id })} />}
      />
    </View>
  );
}

const styles = StyleSheet.create({
   container: { flex: 1 },
  controls: { paddingHorizontal: 16, paddingTop: 8, paddingBottom: 8, gap: 8 },
  pillsRow: { flexDirection: "row", gap: 8, marginTop: 5 , marginBottom: 6 },
  sortPanel: { marginBottom: 10, borderRadius: 12, borderWidth: StyleSheet.hairlineWidth },
  listContent: { paddingHorizontal: 16, paddingBottom: 16, paddingTop: 0 },
});
