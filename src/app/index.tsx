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

// ⬇️ NEW: global theme
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
    <Tab.Navigator screenOptions={{ headerShown: false }} tabBar={(p) => <BottomTabBar {...p} />}>
      <Tab.Screen name="Home" options={{ title: "Home" }}>
        {(props) => (
          <WithChrome title="Home" navigation={props.navigation}>
            <HomeScreen />
          </WithChrome>
        )}
      </Tab.Screen>
      <Tab.Screen name="Play" options={{ title: "Play" }}>
        {(props) => (
          <WithChrome title="Play" navigation={props.navigation}>
            <PlayScreen />
          </WithChrome>
        )}
      </Tab.Screen>
      <Tab.Screen name="Practice" options={{ title: "Practice" }}>
        {(props) => (
          <WithChrome title="Practice" navigation={props.navigation}>
            <PracticeScreen />
          </WithChrome>
        )}
      </Tab.Screen>
      <Tab.Screen name="Stats" options={{ title: "Stats" }}>
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

  // Keep React Navigation colors aligned with our theme
  const NavTheme = theme.mode === "dark"
    ? { ...DarkTheme, colors: { ...DarkTheme.colors, background: theme.colors.bg, card: theme.colors.card, text: theme.colors.text } }
    : { ...DefaultTheme, colors: { ...DefaultTheme.colors, background: theme.colors.bg, card: theme.colors.card, text: theme.colors.text } };

  return (
    <NavigationContainer theme={NavTheme}>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Tabs" component={Tabs} />
        <Stack.Screen name="Settings" component={SettingsScreen} />
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
