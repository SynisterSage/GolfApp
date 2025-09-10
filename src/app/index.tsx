// src/app/index.tsx
import React from "react";
import { NavigationContainer, DefaultTheme, DarkTheme } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { SafeAreaProvider } from "react-native-safe-area-context";

import Screen from "../components/ui/Screen";
import AppHeader from "../components/ui/AppHeader";
import BottomTabBar from "../components/ui/BottomTabBar";

import HomeScreen from "../screens/HomeScreen";
import PlayScreen from "../screens/PlayScreen";
import PracticeScreen from "../screens/PracticeScreen";
import StatsScreen from "../screens/StatsScreen";
import SettingsScreen from "../screens/SettingsScreen";
import BagBuilderScreen from "../screens/BagBuilderScreen";
import BagViewScreen from "../screens/BagViewScreen"; // ✅ added

import RoundDetailScreen from "../screens/RoundDetailScreen";
import RoundFilterScreen from "../screens/RoundFilterScreen";

import { ThemeProvider, useTheme } from "../theme";

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function WithChrome({ title, children, navigation }: any) {
  const tabH = useBottomTabBarHeight();
  const { theme } = useTheme();
  return (
    <>
      <AppHeader
        title={title}
        bg={theme.colors.card}
        tint={theme.colors.tint}
        onPressSettings={() => navigation.navigate("Settings")}
      />
      <Screen bottomPad={tabH + 24}>{children}</Screen>
    </>
  );
}

function Tabs() {
  return (
    <Tab.Navigator
      screenOptions={{ headerShown: false }}
      tabBar={(p) => <BottomTabBar {...p} />}
    >
      <Tab.Screen name="Home">
        {(props) => (
          <WithChrome title="Home" navigation={props.navigation}>
            <HomeScreen />
          </WithChrome>
        )}
      </Tab.Screen>

      <Tab.Screen name="Play">
        {(props) => (
          <WithChrome title="Play" navigation={props.navigation}>
            <PlayScreen />
          </WithChrome>
        )}
      </Tab.Screen>

      <Tab.Screen name="Practice">
        {(props) => (
          <WithChrome title="Practice" navigation={props.navigation}>
            <PracticeScreen />
          </WithChrome>
        )}
      </Tab.Screen>

      <Tab.Screen name="Stats">
        {(props) => (
          <WithChrome title="Stats" navigation={props.navigation}>
            <StatsScreen />
          </WithChrome>
        )}
      </Tab.Screen>
    </Tab.Navigator>
  );
}

function NavWithTheme() {
  const { theme } = useTheme();

  const NavTheme =
    theme.mode === "dark"
      ? {
          ...DarkTheme,
          colors: {
            ...DarkTheme.colors,
            background: theme.colors.bg,
            card: theme.colors.card,
            text: theme.colors.text,
          },
        }
      : {
          ...DefaultTheme,
          colors: {
            ...DefaultTheme.colors,
            background: theme.colors.bg,
            card: theme.colors.card,
            text: theme.colors.text,
          },
        };

  return (
    <NavigationContainer theme={NavTheme}>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {/* Main app tabs */}
        <Stack.Screen name="Tabs" component={Tabs} />

        {/* Settings */}
        <Stack.Screen name="Settings" component={SettingsScreen} />
        <Stack.Screen name="BagBuilder" component={BagBuilderScreen} />

        {/* ✅ BagView added */}
        <Stack.Screen name="BagView" component={BagViewScreen} />

        {/* Stats / Rounds */}
        <Stack.Screen name="RoundDetail" component={RoundDetailScreen} />
        <Stack.Screen
          name="RoundFilter"
          component={RoundFilterScreen}
          options={{ presentation: "modal", headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <NavWithTheme />
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
