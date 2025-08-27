import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "expo-router";
import { CheckIcon, EyeIcon, EyeOffIcon } from "lucide-react-native";
import React, { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { ActivityIndicator, KeyboardAvoidingView, Platform, ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuthStore } from "../store/authStore";
import { RegistrationSchema, RegistrationType } from "../types/authTypes";

const defaultValues: RegistrationType = {
  firstName: "",
  lastName: "",
  email: "",
  password: "",
  acceptedTerms: false,
  acceptedPrivacy: false
};

export default function SignupScreen() {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [successState, setSuccessState] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { registerUser } = useAuthStore();

  const form = useForm<RegistrationType>({
    resolver: zodResolver(RegistrationSchema),
    defaultValues
  });

  const handleSubmit = async (values: RegistrationType) => {
    setError(null);
    setLoading(true);

    try {
      await registerUser(values);
      setSuccessState(true);
    } catch (error: any) {
      console.error("Registration error:", error);
      setError(error.message || "Errore durante la registrazione");
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
        <ScrollView
          contentContainerStyle={{ flexGrow: 1, justifyContent: "center", alignItems: "center", paddingVertical: 24 }}
          showsVerticalScrollIndicator={false}
        >
          {successState ? (
            // Success State
            <View className="items-center max-w-80 px-4">
              <Text className="text-xl font-medium color-slate-700 text-center mb-4">Registrazione effettuata</Text>
              <Text className="text-sm color-slate-500 text-center mb-6">
                Attiva l&#39;account attraverso la mail che ti abbiamo appena inviato. Se non la trovi, controlla nello spam oppure attendi qualche minuto.
              </Text>
              <View className="mt-6 items-center">
                <Text className="color-slate-500 text-sm">
                  Account attivato?{" "}
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
                <Text className="text-base color-slate-500">Crea il tuo account</Text>
              </View>

              <View className="w-full max-w-80 px-4">
                {/* Nome */}
                <Controller
                  control={form.control}
                  name="firstName"
                  render={({ field, fieldState }) => (
                    <View className="mb-4">
                      <Text className="text-sm font-medium color-slate-700 mb-2">Nome</Text>
                      <TextInput
                        className={`bg-slate-100 rounded-lg p-3 text-base border ${fieldState.error ? "border-red-500" : "border-slate-200"}`}
                        placeholder="Inserisci il tuo nome"
                        value={field.value}
                        onChangeText={field.onChange}
                        editable={!loading}
                      />
                      {fieldState.error && <Text className="color-red-500 text-xs mt-1">{fieldState.error.message}</Text>}
                    </View>
                  )}
                />

                {/* Cognome */}
                <Controller
                  control={form.control}
                  name="lastName"
                  render={({ field, fieldState }) => (
                    <View className="mb-4">
                      <Text className="text-sm font-medium color-slate-700 mb-2">Cognome</Text>
                      <TextInput
                        className={`bg-slate-100 rounded-lg p-3 text-base border ${fieldState.error ? "border-red-500" : "border-slate-200"}`}
                        placeholder="Inserisci il tuo cognome"
                        value={field.value}
                        onChangeText={field.onChange}
                        editable={!loading}
                      />
                      {fieldState.error && <Text className="color-red-500 text-xs mt-1">{fieldState.error.message}</Text>}
                    </View>
                  )}
                />

                {/* Email */}
                <Controller
                  control={form.control}
                  name="email"
                  render={({ field, fieldState }) => (
                    <View className="mb-4">
                      <Text className="text-sm font-medium color-slate-700 mb-2">Email</Text>
                      <TextInput
                        className={`bg-slate-100 rounded-lg p-3 text-base border ${fieldState.error ? "border-red-500" : "border-slate-200"}`}
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

                {/* Password */}
                <Controller
                  control={form.control}
                  name="password"
                  render={({ field, fieldState }) => (
                    <View className="mb-4">
                      <Text className="text-sm font-medium color-slate-700 mb-2">Password</Text>
                      <View className="relative">
                        <TextInput
                          className={`bg-slate-100 rounded-lg p-3 pr-10 text-base border ${fieldState.error ? "border-red-500" : "border-slate-200"}`}
                          placeholder="Inserisci la tua password"
                          value={field.value}
                          onChangeText={field.onChange}
                          secureTextEntry={!showPassword}
                          editable={!loading}
                        />
                        <TouchableOpacity className="absolute right-3 top-3" onPress={() => setShowPassword(!showPassword)}>
                          {showPassword ? <EyeOffIcon size={20} color="#64748b" /> : <EyeIcon size={20} color="#64748b" />}
                        </TouchableOpacity>
                      </View>
                      {fieldState.error && <Text className="color-red-500 text-xs mt-1">{fieldState.error.message}</Text>}
                    </View>
                  )}
                />

                {/* Termini e Condizioni */}
                <Controller
                  control={form.control}
                  name="acceptedTerms"
                  render={({ field, fieldState }) => (
                    <View className="mb-4">
                      <TouchableOpacity className="flex-row items-center" onPress={() => field.onChange(!field.value)}>
                        <View
                          className={`w-5 h-5 rounded mr-2 border-2 items-center justify-center ${field.value ? "bg-black border-black" : "border-slate-500"}`}
                        >
                          {field.value && <CheckIcon size={16} color="#fff" />}
                        </View>
                        <Text className="text-sm color-slate-700">Accetto i termini e condizioni</Text>
                      </TouchableOpacity>
                      {fieldState.error && <Text className="color-red-500 text-xs mt-1">{fieldState.error.message}</Text>}
                    </View>
                  )}
                />

                {/* Privacy Policy */}
                <Controller
                  control={form.control}
                  name="acceptedPrivacy"
                  render={({ field, fieldState }) => (
                    <View className="mb-4">
                      <TouchableOpacity className="flex-row items-center" onPress={() => field.onChange(!field.value)}>
                        <View
                          className={`w-5 h-5 rounded mr-2 border-2 items-center justify-center ${field.value ? "bg-black border-black" : "border-slate-500"}`}
                        >
                          {field.value && <CheckIcon size={16} color="#fff" />}
                        </View>
                        <Text className="text-sm color-slate-700">Accetto la privacy policy</Text>
                      </TouchableOpacity>
                      {fieldState.error && <Text className="color-red-500 text-xs mt-1">{fieldState.error.message}</Text>}
                    </View>
                  )}
                />

                {/* Submit Button */}
                <TouchableOpacity className="bg-black rounded-lg p-3 items-center mt-4" onPress={form.handleSubmit(handleSubmit)} disabled={loading}>
                  <Text className="color-white text-base font-semibold">Registrati</Text>
                </TouchableOpacity>

                {/* Login Link */}
                <View className="mt-6 items-center">
                  <Text className="color-slate-500 text-sm">
                    Hai già un account?{" "}
                    <Text className="color-slate-900 font-bold underline" onPress={() => router.replace("/(auth)/login")}>
                      Accedi
                    </Text>
                  </Text>
                </View>
              </View>
            </>
          )}
        </ScrollView>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
}
