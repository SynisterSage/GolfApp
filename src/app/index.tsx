// src/app/index.tsx
import React from "react";
import { NavigationContainer, DefaultTheme, DarkTheme } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useColorScheme } from "react-native";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";

import Screen from "../components/ui/Screen";
import AppHeader from "../components/ui/AppHeader";
import BottomTabBar from "../components/ui/BottomTabBar";

import HomeScreen from "../screens/HomeScreen";
import PlayScreen from "../screens/PlayScreen";
import PracticeScreen from "../screens/PracticeScreen";
import StatsScreen from "../screens/StatsScreen";
import SocialScreen from "../screens/SocialScreen"; // (ok if unused)
import SettingsScreen from "../screens/SettingsScreen";

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function WithChrome({ title, children, navigation }: any) {
  const tabH = useBottomTabBarHeight();
  return (
    <>
      <AppHeader
        title={title}
        bg="#FFFFFF"
        tint="#0A7D36"
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

export default function App() {
  const scheme = useColorScheme();

  // Force white background in light mode (gets rid of the gray you saw)
  const LightTheme = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      background: "#FFFFFF",
      card: "#FFFFFF",
    },
  };

  // Optional: ensure true dark background in dark mode
  const TrueDark = {
    ...DarkTheme,
    colors: {
      ...DarkTheme.colors,
      background: "#000000",
      card: "#121212",
    },
  };

  return (
    <NavigationContainer theme={scheme === "dark" ? TrueDark : LightTheme}>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Tabs" component={Tabs} />
        <Stack.Screen name="Settings" component={SettingsScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
