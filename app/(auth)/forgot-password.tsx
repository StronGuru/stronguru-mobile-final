import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { ActivityIndicator, KeyboardAvoidingView, Platform, Text, TextInput, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuthStore } from "../../src/store/authStore";
import { ForgotPasswordSchema, ForgotPasswordType } from "../../src/types/authTypes";

const defaultValues: ForgotPasswordType = {
  email: ""
};

export default function ForgotPasswordScreen() {
  const [loading, setLoading] = useState(false);
  const [successState, setSuccessState] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { forgotPassword } = useAuthStore();

  const form = useForm<ForgotPasswordType>({
    resolver: zodResolver(ForgotPasswordSchema),
    defaultValues
  });

  const handleSubmit = async (values: ForgotPasswordType) => {
    setError(null);
    setLoading(true);

    try {
      await forgotPassword(values.email);
      setSuccessState(true);
    } catch (error: any) {
      console.error("Forgot password error:", error);
      setError(error.message || "Errore nella richiesta");
    } finally {
      setLoading(false);
    }
  };

  const resetError = () => {
    setError(null);
    setLoading(false);
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} className="flex-1">
      <SafeAreaView className="flex-1 bg-slate-50">
        <View className="flex-1 justify-center items-center px-4">
          {successState ? (
            // Success State
            <View className="items-center max-w-80 px-4">
              <Text className="text-2xl font-bold color-slate-900 text-center mb-4">Richiesta inviata</Text>
              <Text className="text-base color-slate-500 text-center mb-6">
                Se l&apos;email inserita è registrata nel nostro sistema, riceverai le istruzioni per recuperare la password. Controlla la tua casella email e
                anche lo spam.
              </Text>
              <View className="mt-6 items-center">
                <Text className="color-slate-500 text-sm">
                  Password recuperata?{" "}
                  <Text className="color-slate-900 font-bold underline" onPress={() => router.replace("/(auth)/login")}>
                    Accedi
                  </Text>
                </Text>
              </View>
            </View>
          ) : loading ? (
            // Loading State
            <ActivityIndicator size="large" color="#000" />
          ) : error ? (
            // Error State
            <View className="items-center max-w-80 px-4">
              <Text className="text-xl font-medium color-slate-700 text-center mb-4">{error}</Text>
              <TouchableOpacity className="bg-black rounded-lg p-3 items-center w-full" onPress={resetError}>
                <Text className="color-white text-base font-semibold">Riprova</Text>
              </TouchableOpacity>
            </View>
          ) : (
            // Form State
            <>
              <View className="items-center mb-12">
                {/* <Image source={require("../../assets/images/logo.png")} className="w-50 h-20 mb-2" /> */}
                <Text className="text-base color-slate-500">Recupera la tua password</Text>
              </View>

              <View className="w-full max-w-80 px-4">
                {/* Email */}
                <Controller
                  control={form.control}
                  name="email"
                  render={({ field, fieldState }) => (
                    <View className="mb-4">
                      <Text className="text-sm font-medium color-slate-700 mb-2">Email</Text>
                      <TextInput
                        className={`bg-slate-100 rounded-lg p-3 textalign-center  border ${fieldState.error ? "border-red-500" : "border-slate-200"}`}
                        placeholder="Inserisci la tua email"
                        value={field.value}
                        onChangeText={field.onChange}
                        keyboardType="email-address"
                        autoCapitalize="none"
                        editable={!loading}
                      />
                      {fieldState.error && <Text className="color-red-500 text-xs mt-1">{fieldState.error.message}</Text>}
                    </View>
                  )}
                />

                {/* Submit Button */}
                <TouchableOpacity className="bg-black rounded-lg p-3 items-center mt-4" onPress={form.handleSubmit(handleSubmit)} disabled={loading}>
                  <Text className="color-white text-base font-semibold">Recupera password</Text>
                </TouchableOpacity>

                {/* Back to Login Link */}
                <View className="mt-6 items-center">
                  <Text className="color-slate-500 text-sm">
                    Ricordi la password?{" "}
                    <Text className="color-slate-900 font-bold underline" onPress={() => router.replace("/(auth)/login")}>
                      Accedi
                    </Text>
                  </Text>
                </View>
              </View>
            </>
          )}
        </View>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
}
