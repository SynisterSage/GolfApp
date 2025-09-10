// src/screens/BagViewScreen.tsx
import React, { useEffect, useMemo, useState } from "react";
import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  ScrollView,
  Pressable,
} from "react-native";
import Svg, { Path, Circle, Line, Rect } from "react-native-svg";
import { useTheme } from "../theme";
import { Bag, BagClub, ClubType, loadBag } from "../features/bag/storage";

/* ───────────────────────────── Club Icons ───────────────────────────── */
function DriverIcon({ color, size = 24 }: { color: string; size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M8 20v-16l8-2v16l-8 2z" fill={color} stroke={color} strokeWidth={1} />
      <Circle cx="12" cy="6" r="2" fill="#fff" />
      <Line x1="12" y1="2" x2="12" y2="22" stroke={color} strokeWidth={2} strokeLinecap="round" />
    </Svg>
  );
}

function WoodIcon({ color, size = 24 }: { color: string; size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M9 20v-16l6-1.5v16L9 20z" fill={color} stroke={color} strokeWidth={1} />
      <Circle cx="12" cy="5" r="1.5" fill="#fff" />
      <Line x1="12" y1="2" x2="12" y2="22" stroke={color} strokeWidth={2} strokeLinecap="round" />
    </Svg>
  );
}

function HybridIcon({ color, size = 24 }: { color: string; size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M10 20v-15l4-1v15l-4 1z" fill={color} stroke={color} strokeWidth={1} />
      <Circle cx="12" cy="5.5" r="1.2" fill="#fff" />
      <Line x1="12" y1="3" x2="12" y2="22" stroke={color} strokeWidth={1.5} strokeLinecap="round" />
    </Svg>
  );
}

function IronIcon({ color, size = 24 }: { color: string; size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Rect x="10" y="4" width="4" height="16" fill={color} stroke={color} strokeWidth={1} />
      <Line x1="12" y1="3" x2="12" y2="22" stroke={color} strokeWidth={1.5} strokeLinecap="round" />
    </Svg>
  );
}

function WedgeIcon({ color, size = 24 }: { color: string; size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M11 20v-15l2-1v15l-2 1z" fill={color} stroke={color} strokeWidth={1} />
      <Path d="M9 6l6-1.5v2L9 8V6z" fill={color} />
      <Line x1="12" y1="3" x2="12" y2="22" stroke={color} strokeWidth={1.5} strokeLinecap="round" />
    </Svg>
  );
}

function PutterIcon({ color, size = 24 }: { color: string; size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Rect x="11" y="4" width="2" height="16" fill={color} />
      <Rect x="9" y="19" width="6" height="2" rx="1" fill={color} />
      <Line x1="12" y1="3" x2="12" y2="19" stroke={color} strokeWidth={2} strokeLinecap="round" />
    </Svg>
  );
}

function EditIcon({ color, size = 18 }: { color: string; size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M12 20h9" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
      <Path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

function ArrowLeft({ color, size = 18 }: { color: string; size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M15 18l-6-6 6-6" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

function getClubIcon(type: ClubType, label: string) {
  if (label.toLowerCase().includes("driver")) return DriverIcon;
  if (type === "Wood") return WoodIcon;
  if (type === "Hybrid") return HybridIcon;
  if (type === "Iron") return IronIcon;
  if (type === "Wedge") return WedgeIcon;
  if (type === "Putter") return PutterIcon;
  return IronIcon; // fallback
}

/* ───────────────────────────── Main Screen ───────────────────────────── */
export default function BagViewScreen({ navigation }: any) {
  const { theme } = useTheme();
  const s = useMemo(() => styles(theme), [theme]);
  const [bag, setBag] = useState<Bag>({ updatedAt: Date.now(), clubs: [] });

  useEffect(() => {
    loadBag().then((b) => setBag(b));
  }, []);

  // Group clubs by type for organized display
  const grouped = useMemo(() => {
    const map: Record<ClubType, BagClub[]> = { 
      Wood: [], 
      Hybrid: [], 
      Iron: [], 
      Wedge: [], 
      Putter: [] 
    };
    (bag.clubs ?? []).forEach((c) => map[c.type].push(c));
    return map;
  }, [bag]);

  const totalClubs = bag.clubs?.length ?? 0;
  const isOverLimit = totalClubs > 14;

  const onEdit = () => {
    navigation.navigate("BagBuilder");
  };

  const onBack = () => {
    navigation.goBack();
  };

  return (
    <SafeAreaView style={s.screen}>
      {/* Header */}
      <View style={s.header}>
        <Pressable
          onPress={onBack}
          style={({ pressed }) => [
            s.backBtn,
            pressed && { opacity: 0.7 },
          ]}
        >
          <ArrowLeft color={theme.colors.text} size={20} />
        </Pressable>
        
        <View style={s.headerCenter}>
          <Text style={s.title}>Your Bag</Text>
          <Text style={[s.clubCount, isOverLimit && s.overLimit]}>
            {totalClubs} club{totalClubs !== 1 ? 's' : ''} {isOverLimit && '⚠️'}
          </Text>
        </View>

        <Pressable
          onPress={onEdit}
          style={({ pressed }) => [
            s.editBtn,
            pressed && { opacity: 0.9 },
          ]}
        >
          <EditIcon color="#fff" size={16} />
          <Text style={s.editText}>Edit</Text>
        </Pressable>
      </View>

      {totalClubs === 0 ? (
        // Empty state
        <View style={s.emptyState}>
          <Text style={s.emptyTitle}>Your bag is empty</Text>
          <Text style={s.emptySubtitle}>Add clubs to build your perfect 14-club setup</Text>
          <Pressable onPress={onEdit} style={s.addFirstBtn}>
            <Text style={s.addFirstText}>Add Your First Club</Text>
          </Pressable>
        </View>
      ) : (
        <ScrollView 
          contentContainerStyle={s.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* USGA Limit Warning */}
          {isOverLimit && (
            <View style={s.warningCard}>
              <Text style={s.warningTitle}>⚠️ Over USGA Limit</Text>
              <Text style={s.warningText}>
                You have {totalClubs} clubs. USGA tournament rules allow a maximum of 14 clubs.
              </Text>
            </View>
          )}

          {/* Club sections */}
          {(["Wood", "Hybrid", "Iron", "Wedge", "Putter"] as ClubType[]).map((clubType) => {
            const clubs = grouped[clubType];
            if (clubs.length === 0) return null;

            return (
              <View key={clubType} style={s.section}>
                <View style={s.sectionHeader}>
                  <Text style={s.sectionTitle}>{clubType}s</Text>
                  <Text style={s.sectionCount}>{clubs.length}</Text>
                </View>

                <View style={s.clubGrid}>
                  {clubs.map((club, index) => {
                    const IconComponent = getClubIcon(club.type, club.label);
                    return (
                      <View key={club.id} style={s.clubCard}>
                        <View style={s.clubIconContainer}>
                          <IconComponent 
                            color={theme.colors.tint} 
                            size={28} 
                          />
                        </View>
                        
                        <View style={s.clubInfo}>
                          <Text style={s.clubLabel}>{club.label}</Text>
                          
                          {club.loft && (
                            <Text style={s.clubDetail}>{club.loft}</Text>
                          )}
                          
                          {club.yardage && (
                            <Text style={s.clubYardage}>{club.yardage} yds</Text>
                          )}
                        </View>
                        
                        {/* Subtle club number badge */}
                        <View style={s.clubNumber}>
                          <Text style={s.clubNumberText}>{index + 1}</Text>
                        </View>
                      </View>
                    );
                  })}
                </View>
              </View>
            );
          })}

          {/* Bag summary */}
          <View style={s.summaryCard}>
            <Text style={s.summaryTitle}>Bag Summary</Text>
            <View style={s.summaryRow}>
              <Text style={s.summaryLabel}>Total Clubs</Text>
              <Text style={[s.summaryValue, isOverLimit && s.overLimit]}>
                {totalClubs}/14
              </Text>
            </View>
            <View style={s.summaryRow}>
              <Text style={s.summaryLabel}>Last Updated</Text>
              <Text style={s.summaryValue}>
                {new Date(bag.updatedAt).toLocaleDateString()}
              </Text>
            </View>
          </View>

          {/* Bottom spacing */}
          <View style={{ height: 32 }} />
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

/* ───────────────────────────── Styles ───────────────────────────── */
const styles = (theme: any) =>
  StyleSheet.create({
    screen: {
      flex: 1,
      backgroundColor: theme.colors.bg,
    },
    header: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingHorizontal: theme.space(3),
      paddingTop: theme.space(2),
      paddingBottom: theme.space(2),
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderBottomColor: theme.colors.border,
    },
    backBtn: {
      width: 36,
      height: 36,
      borderRadius: 18,
      alignItems: "center",
      justifyContent: "center",
    },
    headerCenter: {
      flex: 1,
      alignItems: "center",
    },
    title: {
      fontSize: 20,
      fontWeight: "800",
      color: theme.colors.text,
    },
    clubCount: {
      fontSize: 12,
      color: theme.colors.muted,
      marginTop: 2,
    },
    overLimit: {
      color: theme.colors.danger || "#ef4444",
    },
    editBtn: {
      flexDirection: "row",
      alignItems: "center",
      gap: 6,
      backgroundColor: theme.colors.tint,
      paddingHorizontal: 12,
      paddingVertical: 8,
      borderRadius: 20,
    },
    editText: {
      color: "#fff",
      fontWeight: "700",
      fontSize: 14,
    },

    // Empty state
    emptyState: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      paddingHorizontal: theme.space(4),
    },
    emptyTitle: {
      fontSize: 24,
      fontWeight: "800",
      color: theme.colors.text,
      marginBottom: 8,
    },
    emptySubtitle: {
      fontSize: 16,
      color: theme.colors.muted,
      textAlign: "center",
      marginBottom: 32,
    },
    addFirstBtn: {
      backgroundColor: theme.colors.tint,
      paddingHorizontal: 24,
      paddingVertical: 14,
      borderRadius: 12,
    },
    addFirstText: {
      color: "#fff",
      fontWeight: "700",
      fontSize: 16,
    },

    // Content
    scrollContent: {
      padding: theme.space(3),
    },

    // Warning card
    warningCard: {
      backgroundColor: theme.colors.surface || theme.colors.card,
      borderRadius: 12,
      padding: 16,
      marginBottom: 20,
      borderWidth: 1,
      borderColor: theme.colors.danger || "#ef4444",
    },
    warningTitle: {
      fontSize: 16,
      fontWeight: "700",
      color: theme.colors.danger || "#ef4444",
      marginBottom: 6,
    },
    warningText: {
      fontSize: 14,
      color: theme.colors.text,
      lineHeight: 20,
    },

    // Sections
    section: {
      marginBottom: 24,
    },
    sectionHeader: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      marginBottom: 12,
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: "800",
      color: theme.colors.text,
    },
    sectionCount: {
      fontSize: 14,
      fontWeight: "600",
      color: theme.colors.muted,
      backgroundColor: theme.colors.surface || theme.colors.surfaceAlt,
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 12,
    },

    // Club grid
    clubGrid: {
      gap: 12,
    },
    clubCard: {
      backgroundColor: theme.colors.card,
      borderRadius: 16,
      padding: 16,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: theme.colors.border,
      flexDirection: "row",
      alignItems: "center",
      position: "relative",
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: theme.mode === "dark" ? 0.2 : 0.08,
      shadowRadius: 8,
      elevation: 3,
    },
    clubIconContainer: {
      width: 48,
      height: 48,
      borderRadius: 24,
      backgroundColor: theme.colors.tintSoft || (theme.colors.tint + "20"),
      alignItems: "center",
      justifyContent: "center",
      marginRight: 12,
    },
    clubInfo: {
      flex: 1,
    },
    clubLabel: {
      fontSize: 16,
      fontWeight: "700",
      color: theme.colors.text,
      marginBottom: 2,
    },
    clubDetail: {
      fontSize: 13,
      color: theme.colors.muted,
      marginBottom: 1,
    },
    clubYardage: {
      fontSize: 14,
      fontWeight: "600",
      color: theme.colors.tint,
    },
    clubNumber: {
      position: "absolute",
      top: 8,
      right: 8,
      width: 20,
      height: 20,
      borderRadius: 10,
      backgroundColor: theme.colors.surface || theme.colors.surfaceAlt,
      alignItems: "center",
      justifyContent: "center",
    },
    clubNumberText: {
      fontSize: 10,
      fontWeight: "700",
      color: theme.colors.muted,
    },

    // Summary
    summaryCard: {
      backgroundColor: theme.colors.card,
      borderRadius: 16,
      padding: 20,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: theme.colors.border,
      marginTop: 8,
    },
    summaryTitle: {
      fontSize: 16,
      fontWeight: "800",
      color: theme.colors.text,
      marginBottom: 12,
    },
    summaryRow: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingVertical: 6,
    },
    summaryLabel: {
      fontSize: 14,
      color: theme.colors.muted,
    },
    summaryValue: {
      fontSize: 14,
      fontWeight: "700",
      color: theme.colors.text,
    },
  });