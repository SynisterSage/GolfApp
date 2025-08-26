import { palette } from "./palette";

export type AppTheme = {
  mode: "light" | "dark";
  colors: {
    bg: string;
    card: string;
    surface: string;
    surfaceAlt: string;
    border: string;

    text: string;
    muted: string;

    tint: string;
    tintSoft: string;
    tabBg: string;
    danger: string;
  };
  radius: { sm: number; md: number; lg: number; pill: number };
  space: (n: number) => number;
};

export const lightTheme: AppTheme = {
  mode: "light",
  colors: {
    bg: palette.lightBg,
    card: palette.lightCard,
    surface: palette.lightSurface,
    surfaceAlt: palette.lightBlueSoft,
    border: palette.lightBorder,

    text: palette.lightText,
    muted: palette.lightMuted,

    tint: palette.lightBlue,
    tintSoft: palette.lightBlueSoft,
    tabBg: palette.lightTabBg,
    danger: palette.lightDanger,
  },
  radius: { sm: 8, md: 12, lg: 16, pill: 999 },
  space: (n) => 4 * n,
};

export const darkTheme: AppTheme = {
  mode: "dark",
  colors: {
    bg: palette.darkBg,
    card: palette.darkCard,
    surface: palette.darkSurface,
    surfaceAlt: palette.darkBlueSoft,
    border: palette.darkBorder,

    text: palette.darkText,
    muted: palette.darkMuted,

    tint: palette.darkBlue,
    tintSoft: palette.darkBlueSoft,
    tabBg: palette.darkTabBg,
    danger: palette.darkDanger,
  },
  radius: { sm: 8, md: 12, lg: 16, pill: 999 },
  space: (n) => 4 * n,
};
