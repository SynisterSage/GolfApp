import { ColorSchemeName, Appearance } from "react-native";

type Pal = {
  bg: string;
  card: string;
  line: string;
  text: string;
  sub: string;
  brand: string;
  brandSoft: string;
  tabBg: string;
  danger: string;
};

const light: Pal = {
  bg: "#FFFFFF",
  card: "#F7F8FA",
  line: "#E6E8EC",
  text: "#111827",
  sub: "#6B7280",
  brand: "#0A7D36",
  brandSoft: "#E8F3EB",
  tabBg: "rgba(255,255,255,0.92)",
  danger: "#DC2626",
};

const dark: Pal = {
  bg: "#0B0F13",
  card: "#12171D",
  line: "#1F2933",
  text: "#E5E7EB",
  sub: "#9CA3AF",
  brand: "#22C55E",
  brandSoft: "rgba(34,197,94,0.15)",
  tabBg: "rgba(12,16,20,0.92)",
  danger: "#F87171",
};

export type Theme = {
  color: Pal;
  radius: { sm: number; md: number; lg: number; pill: number };
  space: (n: number) => number;
  shadow: { card: object; float: object };
};

export function makeTheme(scheme?: ColorSchemeName): Theme {
  const c = scheme === "dark" ? dark : light;
  return {
    color: c,
    radius: { sm: 8, md: 12, lg: 16, pill: 999 },
    space: (n) => 4 * n,
    shadow: {
      card: { shadowColor: "#000", shadowOpacity: 0.08, shadowRadius: 8, shadowOffset: { width: 0, height: 2 }, elevation: 2 },
      float:{ shadowColor: "#000", shadowOpacity: 0.15, shadowRadius: 18, shadowOffset: { width: 0, height: 8 }, elevation: 8 },
    },
  };
}
