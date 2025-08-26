import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { StatusBar } from "expo-status-bar";
import LoginPage from "../pages/LoginPage";
import { AuthRoutes, RootStackParamList } from "../hooks/types";
import TabNavigation from "../components/navigations/TabNavigation";
import { useTheme } from "../hooks/ThemeContext";
import { useAuth } from "../hooks/AuthProvider";
import SignUpPage from "../pages/SignUpPage";

const RootStack = createNativeStackNavigator<RootStackParamList>();
const AuthStack = createNativeStackNavigator<AuthRoutes>();
const AppStack = createNativeStackNavigator();

const AuthNavigator = () => (
  <AuthStack.Navigator screenOptions={{ headerShown: false }}>
    <AuthStack.Screen name="Login" component={LoginPage} />
    <AuthStack.Screen name="SignUp" component={SignUpPage} />
    {/* Signup, ForgotPassword, etc. */}
  </AuthStack.Navigator>
);

const AppNavigator = () => (
  <AppStack.Navigator screenOptions={{ headerShown: false }}>
    <AppStack.Screen name="MainTabs" component={TabNavigation} />
  </AppStack.Navigator>
);

export default function NavigationWrapper() {
  const { theme, colorTheme } = useTheme();
  const { checked, isAuthed } = useAuth();

  if (!checked) return null;

  return (
    <NavigationContainer>
      <StatusBar style={colorTheme ? "light" : "dark"} />
      <RootStack.Navigator
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: theme.background },
        }}
      >
        {isAuthed ? (
          <RootStack.Screen name="App" component={AppNavigator} />
        ) : (
          <RootStack.Screen name="Auth" component={AuthNavigator} />
        )}
      </RootStack.Navigator>
    </NavigationContainer>
  );
}
