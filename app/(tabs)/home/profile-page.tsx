import Card from "@/components/ui/Card";
import { UserSchema, UserType } from "@/lib/zod/userSchemas";
import { useUserDataStore } from "@/src/store/userDataStore";
import { zodResolver } from "@hookform/resolvers/zod";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Activity, Calendar, Dumbbell, MapPin, Phone, Target, User } from "lucide-react-native";
import React, { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Platform, ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";

export default function ProfilePage() {
  const { user } = useUserDataStore();
  const [isEditing, setIsEditing] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);

  const form = useForm<UserType>({
    resolver: zodResolver(UserSchema),
    defaultValues: {
      firstName: user?.firstName || "",
      lastName: user?.lastName || "",
      email: user?.email || "",
      dateOfBirth: user?.dateOfBirth || "",
      gender: user?.gender,
      address: {
        street: user?.address?.street || "",
        city: user?.address?.city || "",
        cap: user?.address?.cap || "",
        province: user?.address?.province || "",
        country: user?.address?.country || ""
      },
      phone: user?.phone || "",
      healthData: user?.healthData,
      fitnessLevel: user?.fitnessLevel,
      goals: user?.goals || [],
      activityLevel: user?.activityLevel,
      currentSports: user?.currentSports || [],
      competitiveLevel: user?.competitiveLevel
    }
  });
  const getInitials = (firstName?: string, lastName?: string): string => {
    if (!firstName || !lastName) return "NN";
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  const handleSave = (data: UserType) => {
    console.log("🔄 Saving profile data:", data);
    /* updateUser(form); */
    setIsEditing(false);
  };

  return (
    <ScrollView className="flex-1 bg-background">
      <View className="px-4 py-8 gap-5">
        <View className="items-center justify-center">
          <View className="w-40 h-40 rounded-full items-center justify-center mb-4 bg-border">
            {/* {user && user?.profileImg ? (
              <Image source={{ uri: user.profileImg }} className="w-40 h-40 rounded-full" resizeMode="cover" />
            ) : (
              <Text className="text-4xl font-bold text-white">{getInitials(user?.firstName, user?.lastName)}</Text>
            )} */}
            <Text className="text-4xl font-bold text-white">{getInitials(user?.firstName, user?.lastName)}</Text>
          </View>
          <Text className="text-2xl font-semibold mb-1 text-foreground">
            {user?.firstName} {user?.lastName}
          </Text>
          <Text className="font-light text-foreground">{user?.email}</Text>
        </View>

        <TouchableOpacity
          className="bg-primary rounded-lg px-4 py-3 items-center"
          onPress={() => setIsEditing(true)}
          style={{ display: isEditing ? "none" : "flex" }}
        >
          <Text className="text-white font-semibold">Modifica profilo</Text>
        </TouchableOpacity>

        <Card>
          {!isEditing ? (
            <View className="gap-4">
              <View className="flex-row items-center gap-2">
                <Phone size={20} />
                <Text>
                  <Text className="font-semibold">Telefono: </Text>
                  <Text className="font-light">{user?.phone || "Non specificato"}</Text>
                </Text>
              </View>
              <View className="flex-row items-center gap-2">
                <Calendar size={20} />
                <Text>
                  <Text className="font-semibold">Data di nascita: </Text>
                  <Text className="font-light">{user?.dateOfBirth || "Non specificata"}</Text>
                </Text>
              </View>
              <View className="flex-row items-center gap-2">
                <User size={20} />
                <Text>
                  <Text className="font-semibold">Genere: </Text>
                  <Text className="font-light">{user?.gender || "Non specificato"}</Text>
                </Text>
              </View>
              <View className="flex-row items-center gap-2">
                <MapPin size={20} />
                <Text>
                  <Text className="font-semibold">Indirizzo: </Text>
                  <Text className="font-light">
                    {user?.address
                      ? [user.address.street, user.address.city, user.address.cap, user.address.province, user.address.country].filter(Boolean).join(", ")
                      : "Non specificato"}
                  </Text>
                </Text>
              </View>

              <View className="flex-row items-center gap-2">
                <Dumbbell size={20} />
                <Text>
                  <Text className="font-semibold">Livello di fitness: </Text>
                  <Text className="font-light">{user?.fitnessLevel || "Non specificato"}</Text>
                </Text>
              </View>
              <View className="flex-row items-center gap-2">
                <Activity size={20} />
                <Text>
                  <Text className="font-semibold">Livello di attività: </Text>
                  <Text className="font-light">{user?.activityLevel || "Non specificato"}</Text>
                </Text>
              </View>
              <View className="flex-row items-center gap-2">
                <Target size={20} />
                <Text>
                  <Text className="font-semibold">Obiettivi: </Text>
                  <Text className="font-light">{user?.goals?.join(", ") || "Non specificati"}</Text>
                </Text>
              </View>
            </View>
          ) : (
            <View className="">
              <Text className="text-lg font-semibold mb-4 text-foreground">Modifica i tuoi dati</Text>
              <Controller
                control={form.control}
                name="firstName"
                render={({ field, fieldState }) => (
                  <View className="mb-4">
                    <Text className="text-sm font-medium text-foreground mb-2">Nome</Text>
                    <TextInput
                      className={`bg-slate-100 rounded-lg p-3 border ${fieldState.error ? "border-red-500" : "border-slate-200"}`}
                      placeholder="Inserisci il tuo nome"
                      value={field.value}
                      onChangeText={field.onChange}
                    />
                    {fieldState.error && <Text className="text-red-500 text-xs mt-1">{fieldState.error.message}</Text>}
                  </View>
                )}
              />
              <Controller
                control={form.control}
                name="lastName"
                render={({ field, fieldState }) => (
                  <View className="mb-4">
                    <Text className="text-sm font-medium text-foreground mb-2">Cognome</Text>
                    <TextInput
                      className={`bg-slate-100 rounded-lg p-3 border ${fieldState.error ? "border-red-500" : "border-slate-200"}`}
                      placeholder="Inserisci il tuo cognome"
                      value={field.value}
                      onChangeText={field.onChange}
                    />
                    {fieldState.error && <Text className="text-red-500 text-xs mt-1">{fieldState.error.message}</Text>}
                  </View>
                )}
              />

              <Controller
                control={form.control}
                name="phone"
                render={({ field, fieldState }) => (
                  <View className="mb-4">
                    <Text className="text-sm font-medium text-foreground mb-2">Telefono</Text>
                    <TextInput
                      className={`bg-slate-100 rounded-lg p-3 border ${fieldState.error ? "border-red-500" : "border-slate-200"}`}
                      placeholder="Inserisci il tuo numero di telefono"
                      value={field.value}
                      onChangeText={field.onChange}
                      keyboardType="phone-pad"
                    />
                    {fieldState.error && <Text className="text-red-500 text-xs mt-1">{fieldState.error.message}</Text>}
                  </View>
                )}
              />
              {/*  <Controller
                control={form.control}
                name="dateOfBirth"
                render={({ field, fieldState }) => (
                  <View className="mb-4">
                    <Text className="text-sm font-medium text-foreground mb-2">Data di nascita</Text>
                    <TextInput
                      className={`bg-slate-100 rounded-lg p-3 border ${fieldState.error ? "border-red-500" : "border-slate-200"}`}
                      placeholder="Inserisci la tua data di nascita (YYYY-MM-DD)"
                      value={field.value}
                      onChangeText={field.onChange}
                    />
                    {fieldState.error && <Text className="text-red-500 text-xs mt-1">{fieldState.error.message}</Text>}
                  </View>
                )}
              /> */}
              <Controller
                control={form.control}
                name="dateOfBirth"
                render={({ field, fieldState }) => (
                  <View className=" flex-row items-center justify-between mb-2">
                    <Text className="text-sm font-medium text-foreground mb-2">Data di nascita</Text>
                    {Platform.OS === "ios" ? (
                      // iOS: DateTimePicker sempre visibile

                      <DateTimePicker
                        value={field.value ? new Date(field.value) : new Date()}
                        mode="date"
                        display="compact"
                        onChange={(event, selectedDate) => {
                          if (selectedDate && event.type !== "dismissed") {
                            field.onChange(selectedDate.toISOString().split("T")[0]);
                          }
                        }}
                        maximumDate={new Date()}
                        style={{ backgroundColor: "transparent" }}
                      />
                    ) : (
                      // Android: TouchableOpacity + DateTimePicker modal
                      <>
                        <TouchableOpacity
                          className={`bg-slate-100 rounded-lg p-3 border flex-row justify-between items-center ${
                            fieldState.error ? "border-red-500" : "border-slate-200"
                          }`}
                          onPress={() => setShowDatePicker(true)}
                        >
                          <Text className={field.value ? "text-foreground" : "text-slate-400"}>
                            {field.value ? new Date(field.value).toLocaleDateString("it-IT") : "Seleziona data di nascita"}
                          </Text>
                          <Calendar size={20} className="text-slate-400" />
                        </TouchableOpacity>

                        {showDatePicker && (
                          <DateTimePicker
                            value={field.value ? new Date(field.value) : new Date()}
                            mode="date"
                            display="default"
                            onChange={(event, selectedDate) => {
                              setShowDatePicker(false);
                              if (selectedDate && event.type !== "dismissed") {
                                field.onChange(selectedDate.toISOString().split("T")[0]);
                              }
                            }}
                            maximumDate={new Date()}
                          />
                        )}
                      </>
                    )}
                    {fieldState.error && <Text className="text-red-500 text-xs mt-1">{fieldState.error.message}</Text>}
                  </View>
                )}
              />

              <Controller
                control={form.control}
                name="gender"
                render={({ field, fieldState }) => (
                  <View className="mb-4">
                    <Text className="text-sm font-medium text-foreground mb-2">Genere</Text>
                    <TextInput
                      className={`bg-slate-100 rounded-lg p-3 border ${fieldState.error ? "border-red-500" : "border-slate-200"}`}
                      placeholder="Inserisci il tuo genere"
                      value={field.value}
                      onChangeText={field.onChange}
                    />
                    {fieldState.error && <Text className="text-red-500 text-xs mt-1">{fieldState.error.message}</Text>}
                  </View>
                )}
              />

              <Text className="text-sm font-medium text-foreground mb-2">Indirizzo</Text>

              <Controller
                control={form.control}
                name="address.street"
                render={({ field, fieldState }) => (
                  <View className="mb-3">
                    <TextInput
                      className={`bg-slate-100 rounded-lg p-3 border ${fieldState.error ? "border-red-500" : "border-slate-200"}`}
                      placeholder="Via / indirizzo"
                      value={field.value || ""}
                      onChangeText={field.onChange}
                    />
                    {fieldState.error && <Text className="text-red-500 text-xs mt-1">{fieldState.error.message}</Text>}
                  </View>
                )}
              />

              <Controller
                control={form.control}
                name="address.city"
                render={({ field, fieldState }) => (
                  <View className="mb-3">
                    <TextInput
                      className={`bg-slate-100 rounded-lg p-3 border ${fieldState.error ? "border-red-500" : "border-slate-200"}`}
                      placeholder="Città"
                      value={field.value || ""}
                      onChangeText={field.onChange}
                    />
                    {fieldState.error && <Text className="text-red-500 text-xs mt-1">{fieldState.error.message}</Text>}
                  </View>
                )}
              />

              <View className="flex-row gap-3">
                <Controller
                  control={form.control}
                  name="address.cap"
                  render={({ field, fieldState }) => (
                    <View className="flex-1 mb-3">
                      <TextInput
                        className={`bg-slate-100 rounded-lg p-3 border ${fieldState.error ? "border-red-500" : "border-slate-200"}`}
                        placeholder="CAP"
                        value={field.value || ""}
                        onChangeText={field.onChange}
                        keyboardType="numeric"
                      />
                      {fieldState.error && <Text className="text-red-500 text-xs mt-1">{fieldState.error.message}</Text>}
                    </View>
                  )}
                />
                <Controller
                  control={form.control}
                  name="address.province"
                  render={({ field, fieldState }) => (
                    <View className="flex-1 mb-3">
                      <TextInput
                        className={`bg-slate-100 rounded-lg p-3 border ${fieldState.error ? "border-red-500" : "border-slate-200"}`}
                        placeholder="Provincia"
                        value={field.value || ""}
                        onChangeText={field.onChange}
                      />
                      {fieldState.error && <Text className="text-red-500 text-xs mt-1">{fieldState.error.message}</Text>}
                    </View>
                  )}
                />
              </View>

              <Controller
                control={form.control}
                name="address.country"
                render={({ field, fieldState }) => (
                  <View className="mb-4">
                    <TextInput
                      className={`bg-slate-100 rounded-lg p-3 border ${fieldState.error ? "border-red-500" : "border-slate-200"}`}
                      placeholder="Paese"
                      value={field.value || ""}
                      onChangeText={field.onChange}
                    />
                    {fieldState.error && <Text className="text-red-500 text-xs mt-1">{fieldState.error.message}</Text>}
                  </View>
                )}
              />

              <Controller
                control={form.control}
                name="fitnessLevel"
                render={({ field, fieldState }) => (
                  <View className="mb-4">
                    <Text className="text-sm font-medium text-foreground mb-2">Livello di fitness</Text>
                    <TextInput
                      className={`bg-slate-100 rounded-lg p-3 border ${fieldState.error ? "border-red-500" : "border-slate-200"}`}
                      placeholder="Inserisci il tuo livello di fitness"
                      value={field.value}
                      onChangeText={field.onChange}
                    />
                    {fieldState.error && <Text className="text-red-500 text-xs mt-1">{fieldState.error.message}</Text>}
                  </View>
                )}
              />
              <Controller
                control={form.control}
                name="activityLevel"
                render={({ field, fieldState }) => (
                  <View className="mb-4">
                    <Text className="text-sm font-medium text-foreground mb-2">Livello di attività</Text>
                    <TextInput
                      className={`bg-slate-100 rounded-lg p-3 border ${fieldState.error ? "border-red-500" : "border-slate-200"}`}
                      placeholder="Inserisci il tuo livello di attività"
                      value={field.value}
                      onChangeText={field.onChange}
                    />
                    {fieldState.error && <Text className="text-red-500 text-xs mt-1">{fieldState.error.message}</Text>}
                  </View>
                )}
              />
              <Controller
                control={form.control}
                name="goals"
                render={({ field, fieldState }) => (
                  <View className="mb-4">
                    <Text className="text-sm font-medium text-foreground mb-2">Obiettivi</Text>
                    <TextInput
                      className={`bg-slate-100 rounded-lg p-3 border ${fieldState.error ? "border-red-500" : "border-slate-200"}`}
                      placeholder="Inserisci i tuoi obiettivi (separati da virgola)"
                      value={field.value?.join(", ") || ""}
                      onChangeText={(text) => {
                        const goalsArray = text
                          .split(",")
                          .map((goal) => goal.trim())
                          .filter(Boolean);
                        field.onChange(goalsArray);
                      }}
                    />
                    {fieldState.error && <Text className="text-red-500 text-xs mt-1">{fieldState.error.message}</Text>}
                  </View>
                )}
              />
              <View className="flex-row-reverse justify-between mt-6">
                <TouchableOpacity className="bg-primary rounded-lg px-10 py-3 items-center" onPress={form.handleSubmit(handleSave)}>
                  <Text className="text-white font-semibold">Salva</Text>
                </TouchableOpacity>
                <TouchableOpacity className="bg-destructive rounded-lg px-4 py-3 items-center" onPress={() => setIsEditing(false)}>
                  <Text className="text-white font-semibold">Annulla</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </Card>
      </View>
    </ScrollView>
  );
}
