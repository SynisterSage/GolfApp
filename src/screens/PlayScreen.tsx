// src/screens/PlayScreen.tsx
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import { haversineMiles } from "../lib/geo";

const API_KEY = "UD6VS23ZHZYXDNGITWYDLJ5KXU";
const BASE_URL = "https://api.golfcourseapi.com";

type Course = {
  id: number;
  club_name?: string;
  course_name?: string;
  location?: {
    city?: string;
    state?: string;
    latitude?: number;
    longitude?: number;
  };
  distance?: number;
};

export default function PlayScreen() {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [courses, setCourses] = useState<Course[]>([]);

  async function fetchCourses(search: string) {
    try {
      setLoading(true);
      const url = `${BASE_URL}/v1/search?search_query=${encodeURIComponent(
        search || "golf"
      )}`;
      const res = await fetch(url, {
        headers: { Authorization: `Key ${API_KEY}` },
      });
      if (!res.ok) throw new Error("API error");
      const data = await res.json();
      setCourses(data.courses || []);
    } catch (e) {
      console.error("fetchCourses error:", e);
    } finally {
      setLoading(false);
    }
  }

  // initial fetch
  useEffect(() => {
    fetchCourses("");
  }, []);

  // live search with debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchCourses(query);
    }, 400);
    return () => clearTimeout(timer);
  }, [query]);

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Search golf courses..."
        style={styles.search}
        value={query}
        onChangeText={setQuery}
      />
      {loading && <ActivityIndicator style={{ marginTop: 12 }} />}
      <FlatList
        data={courses}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.card}>
            <Text style={styles.title}>
              {item.course_name || item.club_name || "Unnamed Course"}
            </Text>
            <Text style={styles.meta}>
              {item.location?.city}, {item.location?.state}
            </Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FAFAFA", padding: 12 },
  search: {
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#E6E8EC",
    marginBottom: 10,
  },
  card: {
    backgroundColor: "#fff",
    marginVertical: 6,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#E6E8EC",
  },
  title: { fontSize: 16, fontWeight: "600" },
  meta: { fontSize: 14, color: "#6B7280" },
});
