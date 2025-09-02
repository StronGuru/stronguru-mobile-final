import { useRouter } from "expo-router";
import { EyeIcon, EyeOffIcon } from "lucide-react-native";
import React, { useState } from "react";
import { ActivityIndicator, Image, KeyboardAvoidingView, Platform, SafeAreaView, Text, TextInput, TouchableOpacity, View } from "react-native";
import { useAuthStore } from "../../src/store/authStore";
import { SignInRequest } from "../../src/types/authTypes";

export default function LoginScreen() {
  const [loginInputValue, setLoginInputValue] = useState<SignInRequest>({});
  const { loginUser } = useAuthStore();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleSubmit = async () => {
    setError(null);
    if (!loginInputValue.email || !loginInputValue.password) {
      setError("Per favore, inserisci email e password");
      return;
    }
    setLoading(true);
    try {
      await loginUser(loginInputValue.email, loginInputValue.password);
    } catch (error) {
      console.error("Login error:", error);
      const errorMessage = useAuthStore.getState().error || "Si è verificato un errore durante il login. Riprova più tardi.";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} className="flex-1">
      <SafeAreaView className="flex-1 bg-background">
        <View className="flex-1 justify-center items-center">
          {!loading ? (
            <>
              <View className="items-center mb-6 ">
                <Image source={require("../../assets/images/logo.png")} className="w-80 h-25" resizeMode="contain" />
                <Text className="text-lg font-bold text-foreground">Accedi al tuo account</Text>
              </View>

              <View className="w-full max-w-80 px-4">
                {/* Email Input */}
                <View className="mb-4">
                  <Text className="text-sm font-medium  text-foreground mb-2">Email</Text>
                  <TextInput
                    className="bg-slate-100 rounded-lg p-3 textalign-center border border-slate-200"
                    placeholder="Inserisci la tua email"
                    value={loginInputValue.email}
                    onChangeText={(text) => {
                      setLoginInputValue({ ...loginInputValue, email: text });
                      if (error) setError(null);
                    }}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    editable={!loading}
                  />
                </View>

                {/* Password Input */}
                <View className="mb-4">
                  <Text className="text-sm font-medium  text-foreground mb-2">Password</Text>
                  <View className="relative">
                    <TextInput
                      className="bg-slate-100 rounded-lg p-3 textalign-center pr-10 text-base border border-slate-200"
                      placeholder="Inserisci la tua password"
                      value={loginInputValue.password}
                      onChangeText={(text) => {
                        setLoginInputValue({ ...loginInputValue, password: text });
                        if (error) setError(null);
                      }}
                      secureTextEntry={!showPassword}
                      editable={!loading}
                    />
                    <TouchableOpacity className="absolute right-3 top-3" onPress={() => setShowPassword(!showPassword)}>
                      {showPassword ? <EyeOffIcon size={20} color="#64748b" /> : <EyeIcon size={20} color="#64748b" />}
                    </TouchableOpacity>
                  </View>

                  {/* Forgot Password Link */}
                  <TouchableOpacity onPress={() => router.push("/(auth)/forgot-password")} className="mt-2">
                    <Text className=" text-foreground text-sm tracking-wide">Password dimenticata?</Text>
                  </TouchableOpacity>
                </View>

                {/* Error Message */}
                {error && (
                  <View className="mb-2">
                    <Text className="text-center color-red-500 text-sm">{error}</Text>
                  </View>
                )}

                {/* Login Button */}
                <TouchableOpacity className="bg-primary rounded-lg p-3 items-center mt-4" onPress={handleSubmit} disabled={loading}>
                  <Text className="color-white text-base font-semibold">Accedi</Text>
                </TouchableOpacity>

                {/* Register Link */}
                <View className="mt-9 items-center">
                  <Text className=" text-foreground text-md">
                    Non hai un account?{" "}
                    <Text className="text-primary font-bold underline" onPress={() => router.push("/(auth)/signup")}>
                      Registrati
                    </Text>
                  </Text>
                </View>
              </View>
            </>
          ) : (
            <ActivityIndicator size="large" className="color-primary" />
          )}
        </View>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
}
