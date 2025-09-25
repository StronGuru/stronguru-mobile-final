import Card from "@/components/ui/Card";
import { ProfileFormSchema, ProfileFormType, UserType } from "@/lib/zod/userSchemas";
import { useUserDataStore } from "@/src/store/userDataStore";
import { zodResolver } from "@hookform/resolvers/zod";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Activity, Calendar, Dumbbell, Edit, MapPin, Phone, Target, User, X } from "lucide-react-native";
import React, { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { KeyboardAvoidingView, Platform, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { Dropdown, MultiSelect } from "react-native-element-dropdown";

export const GENDER_OPTIONS = [
  /* { value: "", label: "Seleziona genere" }, */
  { value: "male", label: "Uomo" },
  { value: "female", label: "Donna" },
  { value: "other", label: "Altro" }
];

export const FITNESS_LEVEL_OPTIONS = [
  /* { value: "", label: "Seleziona livello" }, */
  { value: "beginner", label: "Principiante" },
  { value: "intermediate", label: "Intermedio" },
  { value: "advanced", label: "Avanzato" }
];

export const ACTIVITY_LEVEL_OPTIONS = [
  /* { value: "", label: "Seleziona attività" }, */
  { value: "sedentary", label: "Sedentario" },
  { value: "lightly_active", label: "Leggermente attivo" },
  { value: "moderately_active", label: "Moderatamente attivo" },
  { value: "very_active", label: "Molto attivo" }
];

export const GOALS_OPTIONS = [
  { value: "weight_loss", label: "Perdita di peso" },
  { value: "muscle_gain", label: "Aumento massa muscolare" },
  { value: "endurance", label: "Resistenza" },
  { value: "flexibility", label: "Flessibilità" }
];

export default function ProfilePage() {
  const { user } = useUserDataStore();
  const [isEditing, setIsEditing] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);

  const form = useForm<ProfileFormType>({
    resolver: zodResolver(ProfileFormSchema),
    defaultValues: {
      firstName: user?.firstName || "",
      lastName: user?.lastName || "",
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
      fitnessLevel: user?.fitnessLevel,
      goals: user?.goals || [],
      activityLevel: user?.activityLevel
    }
  });
  const getInitials = (firstName?: string, lastName?: string): string => {
    if (!firstName || !lastName) return "NN";
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  const handleSave = (data: ProfileFormType) => {
    console.log("🔄 INIZIO handleSave function");
    console.log("🔄 Saving profile data:", JSON.stringify(data, null, 2));
    console.log("📋 Form validation errors:", JSON.stringify(form.formState.errors, null, 2));
    console.log("📊 Goals array:", data.goals);
    console.log("🏠 Address object:", JSON.stringify(data.address, null, 2));
    console.log("📅 Date of birth:", data.dateOfBirth);
    console.log("✅ Form is valid:", form.formState.isValid);
    console.log("🔄 FINE handleSave function");

    //  Ricostruisci l'oggetto completo per l'API mantenendo tutti i campi originali
    const completeUserData: UserType = {
      ...user!, // Tutti i dati originali dell'utente
      ...data // Override con i dati modificati del form
    };

    console.log("📤 Complete user data to save:", completeUserData);
    alert("Dati salvati! Controlla la console per i dettagli.");
    setIsEditing(false);
  };
  const onSubmit = (data: ProfileFormType) => {
    console.log("📝 FORM SUBMITTED:", data);
    handleSave(data);
  };

  const renderItem = (item: any, selected?: boolean) => {
    return (
      <View
        style={[
          dropdownStyles.item,
          selected && dropdownStyles.itemSelected // Apply selected styling
        ]}
      >
        <Text style={[dropdownStyles.selectedTextStyle, { color: "#0f172a" }]}>{item.label}</Text>
        {selected && (
          <View
            style={{
              width: 20,
              height: 20,
              borderRadius: 10,
              backgroundColor: "#10b981",
              alignItems: "center",
              justifyContent: "center"
            }}
          >
            <Text className="text-white text-sm font-bold">✓</Text>
          </View>
        )}
      </View>
    );
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} className="flex-1">
      <SafeAreaView className="flex-1 bg-background">
        <ScrollView>
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
              className="bg-primary rounded-lg px-4 py-3 flex-row items-center justify-center gap-2 self-center"
              onPress={() => setIsEditing(true)}
              style={{ display: isEditing ? "none" : "flex" }}
            >
              <Edit size={20} color="white" />
              <Text className="text-white font-semibold text-lg">Modifica profilo</Text>
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
                      <Text className="font-light">{user?.goals || "Non specificato"}</Text>
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
                        <Text className="text-md font-medium text-foreground mb-2">Nome</Text>
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
                        <Text className="text-md font-medium text-foreground mb-2">Cognome</Text>
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
                        <Text className="text-md font-medium text-foreground mb-2">Telefono</Text>
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

                  <Controller
                    control={form.control}
                    name="dateOfBirth"
                    render={({ field, fieldState }) => (
                      <View className=" flex-row items-center justify-between mb-2">
                        <Text className="text-md font-medium text-foreground mb-2">Data di nascita</Text>
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
                        <Text className="text-md font-medium text-foreground mb-2">Genere</Text>
                        <Dropdown
                          style={[dropdownStyles.container, fieldState.error ? dropdownStyles.containerError : dropdownStyles.containerNormal]}
                          placeholderStyle={dropdownStyles.placeholder}
                          selectedTextStyle={dropdownStyles.selectedText}
                          itemTextStyle={dropdownStyles.itemText}
                          itemContainerStyle={dropdownStyles.itemContainer}
                          containerStyle={dropdownStyles.modalContainer}
                          mode="modal"
                          data={GENDER_OPTIONS}
                          maxHeight={300}
                          labelField="label"
                          valueField="value"
                          placeholder="Seleziona genere"
                          value={field.value}
                          onChange={(item) => field.onChange(item.value)}
                        />
                        {fieldState.error && <Text className="text-red-500 text-xs mt-1">{fieldState.error.message}</Text>}
                      </View>
                    )}
                  />

                  <Text className="text-md font-medium text-foreground mb-2">Indirizzo</Text>

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
                        <Text className="text-md font-medium text-foreground mb-2">Livello di fitness</Text>
                        <Dropdown
                          style={[dropdownStyles.container, fieldState.error ? dropdownStyles.containerError : dropdownStyles.containerNormal]}
                          placeholderStyle={dropdownStyles.placeholder}
                          selectedTextStyle={dropdownStyles.selectedText}
                          itemTextStyle={dropdownStyles.itemText}
                          itemContainerStyle={dropdownStyles.itemContainer}
                          containerStyle={dropdownStyles.modalContainer}
                          mode="modal"
                          data={FITNESS_LEVEL_OPTIONS}
                          maxHeight={300}
                          labelField="label"
                          valueField="value"
                          placeholder="Seleziona livello di fitness"
                          value={field.value}
                          onChange={(item) => field.onChange(item.value)}
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
                        <Text className="text-md font-medium text-foreground mb-2">Livello di attività</Text>
                        <Dropdown
                          style={[dropdownStyles.container, fieldState.error ? dropdownStyles.containerError : dropdownStyles.containerNormal]}
                          placeholderStyle={dropdownStyles.placeholder}
                          selectedTextStyle={dropdownStyles.selectedText}
                          itemTextStyle={dropdownStyles.itemText}
                          itemContainerStyle={dropdownStyles.itemContainer}
                          containerStyle={dropdownStyles.modalContainer}
                          mode="modal"
                          data={ACTIVITY_LEVEL_OPTIONS}
                          maxHeight={300}
                          labelField="label"
                          valueField="value"
                          placeholder="Seleziona livello di attività"
                          value={field.value}
                          onChange={(item) => field.onChange(item.value)}
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
                        <Text className="text-md font-medium text-foreground mb-2">Obiettivi</Text>
                        <MultiSelect
                          style={[dropdownStyles.container, fieldState.error ? dropdownStyles.containerError : dropdownStyles.containerNormal]}
                          placeholderStyle={dropdownStyles.placeholder}
                          selectedTextStyle={dropdownStyles.selectedText}
                          itemTextStyle={dropdownStyles.itemText}
                          itemContainerStyle={dropdownStyles.itemContainer}
                          containerStyle={dropdownStyles.modalContainer}
                          mode="modal"
                          data={GOALS_OPTIONS}
                          maxHeight={300}
                          labelField="label"
                          valueField="value"
                          placeholder="Seleziona i tuoi obiettivi"
                          value={field.value || []}
                          onChange={(selectedItems) => {
                            field.onChange(selectedItems);
                          }}
                          renderItem={(item) => {
                            const isSelected = (field.value || []).includes(item.value);
                            return renderItem(item, isSelected);
                          }}
                          renderSelectedItem={(item, unSelect) => (
                            <TouchableOpacity onPress={() => unSelect && unSelect(item)}>
                              <View style={dropdownStyles.selectedStyle}>
                                <Text style={dropdownStyles.textSelectedStyle}>{item.label}</Text>
                                <X size={16} color="white" />
                              </View>
                            </TouchableOpacity>
                          )}
                        />
                        {fieldState.error && <Text className="text-red-500 text-xs mt-1">{fieldState.error.message}</Text>}
                      </View>
                    )}
                  />
                  <View className="flex-row-reverse justify-between mt-6">
                    <TouchableOpacity className="bg-primary rounded-lg px-10 py-3 items-center" onPress={form.handleSubmit(onSubmit)}>
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
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
}
const dropdownStyles = StyleSheet.create({
  container: {
    backgroundColor: "#f1f5f9", // bg-slate-100
    borderRadius: 8, // rounded-lg
    padding: 12, // p-3
    borderWidth: 1,
    height: 40
  },
  containerError: {
    borderColor: "#ef4444" // border-red-500
  },
  containerNormal: {
    borderColor: "#e2e8f0" // border-slate-200
  },
  placeholder: {
    fontSize: 14,
    color: "#94a3b8" // text-slate-400
  },
  selectedText: {
    fontSize: 14,
    color: "#0f172a" // text-foreground
  },
  itemText: {
    fontSize: 14,
    textAlign: "center"
  },
  itemContainer: {
    borderBottomWidth: 1,
    borderBottomColor: "#e2e8f0"
  },
  modalContainer: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 8,
    marginHorizontal: 16,
    marginVertical: 40,
    maxHeight: "70%",
    overflow: "hidden"
  },
  selectedStyle: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 20,
    backgroundColor: "#10b981", // primary color
    marginTop: 8,
    marginRight: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2
  },
  textSelectedStyle: {
    marginRight: 6,
    fontSize: 14,
    color: "#ffffff",
    fontWeight: "500"
  },
  // Item rendering in dropdown list
  item: {
    paddingVertical: 16,
    paddingHorizontal: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#ffffff",
    borderBottomWidth: 0.5,
    borderBottomColor: "#e2e8f0"
  },
  itemSelected: {
    backgroundColor: "#f0fdf4" // light green background for selected item
  },
  selectedTextStyle: {
    fontSize: 14, //stile testo in goals modale
    color: "#0f172a"
  }
});
