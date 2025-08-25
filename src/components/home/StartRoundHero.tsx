import React from "react";
import { ImageBackground, View, Text, StyleSheet, Pressable } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { GolfIcon, ChevronRight } from "../ui/icons";
import { getNearbyCourseHero } from "../../services/images";

type Hero = { title: string; subtitle: string; imageUrl?: string };

export default function StartRoundHero() {
  const nav = useNavigation<any>();
  const [hero, setHero] = React.useState<Hero>({ title: "Start Round", subtitle: "GPS auto-detect or search course" });

  React.useEffect(() => {
    let alive = true;
    (async () => {
      const data = await getNearbyCourseHero(); // safe fallback inside
      if (alive && data) setHero({ title: "Start Round", subtitle: data.subtitle, imageUrl: data.imageUrl });
    })();
    return () => { alive = false; };
  }, []);

  const Body = (
    <View style={styles.overlay}>
      <View style={{ alignItems: "center", marginBottom: 8 }}>
        <GolfIcon size={44} color="#0A7D36" />
      </View>
      <Text style={styles.title}>{hero.title}</Text>
      <Text style={styles.sub}>{hero.subtitle}</Text>
      <Pressable onPress={() => nav.navigate("Play")} style={({ pressed }) => [styles.cta, pressed && { opacity: 0.85 }]}>
        <ChevronRight color="#fff" />
      </Pressable>
    </View>
  );

  if (!hero.imageUrl) {
    return <View style={[styles.hero, { backgroundColor: "#E8F3EB" }]}>{Body}</View>;
  }

  return (
    <ImageBackground source={{ uri: hero.imageUrl }} style={styles.hero} imageStyle={{ borderRadius: 16 }}>
      <View style={styles.scrim} />
      {Body}
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  hero: { height: 160, borderRadius: 16, overflow: "hidden", marginBottom: 12 },
  overlay: { flex: 1, alignItems: "center", justifyContent: "center", padding: 12 },
  scrim: { ...StyleSheet.absoluteFillObject, backgroundColor: "rgba(255,255,255,0.65)" },
  title: { fontSize: 18, fontWeight: "800", color: "#0B3A1E" },
  sub: { color: "#4B5563", marginTop: 4 },
  cta: { position: "absolute", right: 10, bottom: 10, backgroundColor: "#0A7D36", width: 36, height: 36, borderRadius: 999, alignItems: "center", justifyContent: "center" },
});
