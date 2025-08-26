import React from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native";
import { Formik } from "formik";
import * as Yup from "yup";
import { useTheme } from "../hooks/ThemeContext";
import { Ionicons } from "@expo/vector-icons";
import AuthenticationService from "../services/AuthenticationService";
import { useNavigation } from "@react-navigation/native";
import { AuthRoutes } from "../hooks/types";
import { useAuth } from "../hooks/AuthProvider";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { TOKEN_KEY } from "../api/env";

const LoginPage = () => {
  const { theme } = useTheme();
  const { signIn } = useAuth();
  const styles = createStyles(theme);
  const navigation = useNavigation<NativeStackNavigationProp<AuthRoutes>>();

  const initialValues = {
    username: "",
    password: "",
  };

  const loginSchema = Yup.object().shape({
    username: Yup.string().min(1, "min 1 chars").required("Required"),
    password: Yup.string().min(6, "Min 6 chars").required("Required"),
  });

  const handleLogin = async (values: {
    username: string;
    password: string;
  }) => {
    try {
      const token = await AuthenticationService.login(
        values.username,
        values.password
      );

      if (!token) {
        Alert.alert(
          "Login failed",
          "Invalid username or password. Please try again.",
          [{ text: "Cancel", style: "cancel" }, { text: "Try again" }]
        );
        return;
      }

      await AsyncStorage.setItem(TOKEN_KEY, token);
      await signIn();
    } catch (e) {
      console.error("Failed to login/store token", e);
      Alert.alert(
        "Connection problem",
        "We couldn’t reach the server. Check your internet and try again.",
        [{ text: "OK" }]
      );
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <View style={styles.box}>
        <Text style={styles.title}>Welcome Back</Text>
        <Text style={styles.subtitle}>Login to your account</Text>

        <Formik
          initialValues={initialValues}
          validationSchema={loginSchema}
          onSubmit={handleLogin}
        >
          {({
            handleChange,
            handleBlur,
            handleSubmit,
            values,
            errors,
            touched,
          }) => (
            <>
              <TextInput
                placeholder="username"
                placeholderTextColor={theme.placeholder}
                style={styles.input}
                onChangeText={handleChange("username")}
                onBlur={handleBlur("username")}
                value={values.username}
                autoCapitalize="none"
              />
              {touched.username && errors.username && (
                <Text style={styles.errorText}>{errors.username}</Text>
              )}

              <TextInput
                placeholder="Password"
                placeholderTextColor={theme.placeholder}
                style={styles.input}
                onChangeText={handleChange("password")}
                onBlur={handleBlur("password")}
                value={values.password}
                secureTextEntry
              />
              {touched.password && errors.password && (
                <Text style={styles.errorText}>{errors.password}</Text>
              )}

              <TouchableOpacity
                style={styles.loginButton}
                onPress={() => handleSubmit()}
              >
                <Ionicons
                  name="log-in-outline"
                  size={20}
                  color={theme.onPrimary}
                />
                <Text style={styles.loginButtonText}>Login</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={{ marginTop: 12, alignItems: "center" }}
                onPress={() => navigation.replace("SignUp")}
              >
                <Text style={{ color: theme.placeholder }}>
                  Don't have an account? Sign Up
                </Text>
              </TouchableOpacity>
            </>
          )}
        </Formik>
      </View>
    </KeyboardAvoidingView>
  );
};

const createStyles = (theme: any) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
      justifyContent: "center",
      padding: 20,
    },
    box: {
      backgroundColor: theme.surface,
      borderRadius: 16,
      padding: 24,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 5,
    },
    title: {
      fontSize: 24,
      fontWeight: "700",
      color: theme.text,
      marginBottom: 4,
    },
    subtitle: {
      fontSize: 14,
      color: theme.placeholder,
      marginBottom: 20,
    },
    input: {
      height: 48,
      borderWidth: 1,
      borderColor: theme.placeholder,
      borderRadius: 10,
      paddingHorizontal: 12,
      fontSize: 16,
      color: theme.text,
      backgroundColor: theme.input || theme.surface,
      marginBottom: 12,
    },
    loginButton: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: theme.primary,
      height: 48,
      borderRadius: 10,
      marginTop: 12,
    },
    loginButtonText: {
      color: theme.onPrimary,
      fontSize: 16,
      fontWeight: "600",
      marginLeft: 8,
    },
    errorText: {
      color: theme.error,
      fontSize: 12,
      marginBottom: 6,
    },
  });

export default LoginPage;
