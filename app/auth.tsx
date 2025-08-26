import { EyeIcon, EyeOffIcon } from "lucide-react-native";
import React, { useState } from "react";
import { ActivityIndicator, Alert, KeyboardAvoidingView, Platform, SafeAreaView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { useAuthStore } from "./store/authStore";
import { SignInRequest } from "./types/authTypes";

export default function AuthScreen() {
  const [loginInputValue, setLoginInputValue] = useState<SignInRequest>({});
  const { loginUser } = useAuthStore();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const handleSubmit = async () => {
    if (!loginInputValue.email || !loginInputValue.password) {
      Alert.alert("Errore", "Per favore inserisci email e password");
      return;
    }
    setLoading(true);
    try {
      await loginUser(loginInputValue.email, loginInputValue.password);
    } catch (error) {
      console.error("Login error:", error);
      Alert.alert("Errore", "Si è verificato un errore durante il login. Riprova più tardi.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} className="flex-1">
      <SafeAreaView style={styles.container}>
        <View style={styles.content}>
          {!error && !loading && (
            <>
              <View style={styles.logoContainer}>
                {/*  <Image source={require("../../assets/images/logo.png")} style={styles.logo} /> */}
                <Text style={styles.subtitle}>Accedi al tuo account</Text>
              </View>

              <View style={styles.formContainer}>
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Email</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Inserisci la tua email"
                    value={loginInputValue.email}
                    onChangeText={(text) => setLoginInputValue({ ...loginInputValue, email: text })}
                    keyboardType="email-address"
                    autoCapitalize="none"
                  />
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Password</Text>
                  <View style={styles.passwordContainer}>
                    <TextInput
                      style={[styles.input, styles.passwordInput]}
                      placeholder="Inserisci la tua password"
                      value={loginInputValue.password}
                      onChangeText={(text) =>
                        setLoginInputValue({
                          ...loginInputValue,
                          password: text
                        })
                      }
                      secureTextEntry={!showPassword}
                    />
                    <TouchableOpacity style={styles.eyeIcon} onPress={() => setShowPassword(!showPassword)}>
                      {showPassword ? <EyeOffIcon size={20} color="#64748b" /> : <EyeIcon size={20} color="#64748b" />}
                    </TouchableOpacity>
                  </View>
                  {/* <TouchableOpacity onPress={() => router.replace("/forgot-password")} style={styles.forgotPassword}>
                    <Text style={styles.forgotPasswordText}>Password dimenticata?</Text>
                  </TouchableOpacity> */}
                </View>

                <TouchableOpacity style={styles.loginButton} onPress={handleSubmit}>
                  <Text style={styles.loginButtonText}>Accedi</Text>
                </TouchableOpacity>

                <View style={styles.registerContainer}>
                  <Text style={styles.registerText}>
                    Non hai un account?{" "}
                    {/* <Text style={styles.registerLink} onPress={() => router.replace("/(auth)/register")}>
                      Registrati
                    </Text> */}
                  </Text>
                </View>
              </View>
            </>
          )}
          {loading && <ActivityIndicator size="large" color="#000" />}
          {error && (
            <View style={styles.errorContainer}>
              <Text style={styles.errorTitle}>Login non riuscito</Text>
              <TouchableOpacity
                style={styles.retryButton}
                onPress={() => {
                  setError(false);
                  setLoading(false);
                }}
              >
                <Text style={styles.retryButtonText}>Riprova</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc"
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },
  logoContainer: {
    alignItems: "center",
    marginBottom: 48
  },
  logo: {
    width: 200,
    height: 80,
    resizeMode: "contain",
    marginBottom: 8
  },
  subtitle: {
    fontSize: 16,
    color: "#475569"
  },
  formContainer: {
    width: "100%",
    maxWidth: 320,
    paddingHorizontal: 16
  },
  inputGroup: {
    marginBottom: 16
  },
  label: {
    fontSize: 14,
    fontWeight: "500",
    color: "#334155",
    marginBottom: 8
  },
  input: {
    backgroundColor: "#f1f5f9",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#e2e8f0"
  },
  passwordContainer: {
    position: "relative"
  },
  passwordInput: {
    paddingRight: 40
  },
  eyeIcon: {
    position: "absolute",
    right: 12,
    top: 12
  },
  forgotPassword: {
    marginTop: 8
  },
  forgotPasswordText: {
    color: "#64748b",
    fontSize: 14
  },
  loginButton: {
    backgroundColor: "#000",
    borderRadius: 8,
    padding: 12,
    alignItems: "center",
    marginTop: 16
  },
  loginButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600"
  },
  registerContainer: {
    marginTop: 24,
    alignItems: "center"
  },
  registerText: {
    color: "#64748b",
    fontSize: 14
  },
  registerLink: {
    color: "#0f172a",
    fontWeight: "bold",
    textDecorationLine: "underline"
  },
  errorContainer: {
    alignItems: "center",
    maxWidth: 320,
    paddingHorizontal: 16
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: "500",
    color: "#334155",
    textAlign: "center",
    marginBottom: 16
  },
  retryButton: {
    backgroundColor: "#000",
    borderRadius: 8,
    padding: 12,
    alignItems: "center",
    width: "100%"
  },
  retryButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600"
  }
});
