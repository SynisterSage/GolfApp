import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { Appearance, ColorSchemeName } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AppTheme, lightTheme, darkTheme } from "./themes";

type Pref = "system" | "light" | "dark";
type Ctx = { theme: AppTheme; pref: Pref; setPref: (p: Pref) => void };

const ThemeCtx = createContext<Ctx | undefined>(undefined);
const KEY = "app-theme-pref";

function resolveTheme(pref: Pref, system: ColorSchemeName): AppTheme {
  const mode: "light" | "dark" =
    pref === "system" ? (system === "dark" ? "dark" : "light") : pref;
  return mode === "dark" ? darkTheme : lightTheme;
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [pref, setPrefState] = useState<Pref>("system");
  const [systemScheme, setSystemScheme] = useState<ColorSchemeName>(Appearance.getColorScheme());

  useEffect(() => {
    AsyncStorage.getItem(KEY).then((v) => {
      if (v === "light" || v === "dark" || v === "system") setPrefState(v);
    });
    const sub = Appearance.addChangeListener(({ colorScheme }) => setSystemScheme(colorScheme));
    return () => sub.remove();
  }, []);

  const theme = useMemo(() => resolveTheme(pref, systemScheme), [pref, systemScheme]);

  const setPref = (p: Pref) => {
    setPrefState(p);
    AsyncStorage.setItem(KEY, p).catch(() => {});
  };

  return <ThemeCtx.Provider value={{ theme, pref, setPref }}>{children}</ThemeCtx.Provider>;
}

export function useTheme() {
  const ctx = useContext(ThemeCtx);
  if (!ctx) throw new Error("useTheme must be used inside ThemeProvider");
  return ctx;
}

/** Compatibility helper so old files keep working (same shape as your old `makeTheme`) */
export function makeTheme(scheme?: ColorSchemeName) {
  const c = scheme === "dark" ? darkTheme.colors : lightTheme.colors;
  return {
    color: {
      bg: c.bg,
      card: c.card,
      line: c.border,
      text: c.text,
      sub: c.muted,
      brand: c.tint,
      brandSoft: c.tintSoft,
      tabBg: c.tabBg,
      danger: c.danger,
    },
    radius: { sm: 8, md: 12, lg: 16, pill: 999 },
    space: (n: number) => 4 * n,
    shadow: {
      card: { shadowColor: "#000", shadowOpacity: scheme === "dark" ? 0.18 : 0.08, shadowRadius: 8, shadowOffset: { width: 0, height: 2 }, elevation: 2 },
      float:{ shadowColor: "#000", shadowOpacity: scheme === "dark" ? 0.28 : 0.15, shadowRadius: 18, shadowOffset: { width: 0, height: 8 }, elevation: 8 },
    },
  };
}
