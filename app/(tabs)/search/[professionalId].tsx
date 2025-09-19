// app/ProfessionalDetails.tsx
import apiClient from "@/api/apiClient";
import { useUserDataStore } from "@/src/store/userDataStore";
import { router, useLocalSearchParams } from "expo-router";
import { Award, Book, Brain, Building2, Dumbbell, Mail, Phone, Rocket, Salad } from "lucide-react-native";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, Image, SafeAreaView, ScrollView, Text, TouchableOpacity, View, Alert } from "react-native";
import { getOrCreateRoom } from "@/src/services/chatService.native";

interface Address {
  street: string;
  city: string;
  cap: string;
  province: string;
  country: string;
}

type BadgeType = "salad" | "dumbbell" | "brain";

type Professional = {
  id: string;
  firstName: string;
  lastName: string;
  address: Address;
  profileImg: string | null;
  ambassador: boolean;
  specializations: string[];
  gender: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  certifications: Certification[];
  qualifications: Qualification[];
};

interface Certification {
  certificationName: string;
  issuingOrganization: string;
  level: string;
  certificationId: string;
  certificationUrl: string;
  issueDate: string;
  expirationDate: string;
}
interface Qualification {
  degreeTitle: string;
  institution: string;
  fieldOfStudy: string;
  startDate: string;
  completionDate: string;
}

export default function ProfessionalDetails() {
  const [professional, setProfessional] = useState<Professional | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [chatLoading, setChatLoading] = useState<boolean>(false);
  const { user } = useUserDataStore();

  // Ottieni l'ID dai parametri di ricerca con Expo Router
  const { professionalId } = useLocalSearchParams<{ professionalId: string }>();

  useEffect(() => {
    const fetchProfessionals = async () => {
      //   console.log("Fetching professional with ID:", professionalId);
      try {
        setLoading(true);
        const resp = await apiClient.get(`/professionals/${professionalId}`);
        if (!resp.data) {
          throw new Error("Errore nel caricamento del professionista");
        } else {
          setProfessional(resp.data);
        }
      } catch (error) {
        console.error("Errore nel caricamento del professionista:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfessionals();
  }, [professionalId]);

  const getBadgesFromSpecializations = (specializations: string[]): BadgeType[] => {
    const badges: BadgeType[] = [];

    if (specializations.includes("trainer")) {
      badges.push("dumbbell");
    }
    if (specializations.includes("psychologist")) {
      badges.push("brain");
    }
    if (specializations.includes("nutritionist")) {
      badges.push("salad");
    }

    return badges;
  };

  const renderBadgeIcon = (badge: BadgeType) => {
    switch (badge) {
      case "dumbbell":
        return <Dumbbell size={20} color="white" />;
      case "brain":
        return <Brain size={20} color="white" />;
      case "salad":
        return <Salad size={20} color="white" />;
      default:
        return null;
    }
  };

  const getInitials = (firstName: string, lastName: string): string => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString("it-IT");
  };

  if (loading) {
    return (
      <SafeAreaView className="flex-1 bg-background">
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#10b981" />
          <Text className="text-foreground mt-2">Caricamento...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!professional) {
    return (
      <SafeAreaView className="flex-1 bg-background">
        <View className="flex-1 justify-center items-center">
          <Text className="text-foreground">Professionista non trovato</Text>
        </View>
      </SafeAreaView>
    );
  }

  const badges = getBadgesFromSpecializations(professional.specializations);


  // Handler per il click su "Chatta con il professionista"
  const handleChatPress = async () => {
    if (!user?._id || !professionalId) return;
    try {
      setChatLoading(true);
      const room = await getOrCreateRoom(professionalId as string, user._id as string);
      if (room && room.id) {
        router.push(`/chat/${room.id}`);
      } else {
        Alert.alert("Errore", "Impossibile avviare la chat.");
      }
    } catch (err) {
      console.error("Errore nella creazione/recupero room:", err);
      Alert.alert("Errore", "Impossibile avviare la chat.");
    } finally {
      setChatLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-background ">
      <ScrollView className="flex-1" contentContainerStyle={{ padding: 16 }}>
        {/* Header verde con immagine e nome */}
        <View className="bg-primary rounded-2xl p-6 mb-6 items-center">
          {/* Avatar */}
          <View className="w-24 h-24 rounded-full items-center justify-center mb-4 bg-muted-foreground overflow-hidden">
            {professional.profileImg ? (
              <Image source={{ uri: professional.profileImg }} className="w-24 h-24 rounded-full" resizeMode="cover" />
            ) : (
              <Text className="text-3xl font-bold text-primary-foreground">{getInitials(professional.firstName, professional.lastName)}</Text>
            )}
          </View>

          {/* Nome e Cognome */}
          <Text className="text-2xl font-bold text-primary-foreground text-center mb-4">
            {professional.firstName} {professional.lastName}
          </Text>

          {/* Badges Specializzazioni */}
          <View className="flex-row gap-3">
            {badges.map((badge: BadgeType, index: number) => (
              <View key={badge} className="w-12 h-12 bg-accent rounded-full items-center justify-center">
                {renderBadgeIcon(badge)}
              </View>
            ))}
          </View>
          <View className="mt-4">
            <TouchableOpacity
              onPress={handleChatPress}
              className="bg-muted px-4 py-2 rounded-xl"
              disabled={chatLoading}
            >
              {chatLoading ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <Text className="text-white text-center">Chatta con il professionista</Text>
              )}
            </TouchableOpacity>
          </View>
          {professional.ambassador === true && (
            <View className="absolute top-4 left-4 w-10 h-10 rounded-full items-center justify-center bg-orange-400">
              <Rocket size={20} color="white" />
            </View>
          )}
        </View>

        {/* Informazioni personali */}
        <View className="bg-card rounded-2xl p-6 mb-4 shadow-sm">
          <Text className="text-xl font-semibold text-accent mb-4">Informazioni</Text>

          <View className="space-y-3">
            <View className="flex-row justify-between items-center py-2">
              <Text className="text-muted-foreground">Data di nascita</Text>
              <Text className="text-card-foreground font-medium">{formatDate(professional.dateOfBirth)}</Text>
            </View>

            <View className="h-px bg-border" />

            <View className="flex-row justify-between items-center py-2">
              <Text className="text-muted-foreground">Genere</Text>
              <Text className="text-card-foreground font-medium">
                {professional.gender === "male" ? "Uomo" : professional.gender === "female" ? "Donna" : "Non specificato"}
              </Text>
            </View>

            <View className="h-px bg-border " />

            <View className="flex-row justify-between items-center py-2 ">
              <Text className="text-muted-foreground">Posizione</Text>
              <Text className="text-card-foreground font-medium">
                {professional.address?.city || "N/A"}, {professional.address?.province || "N/A"}
              </Text>
            </View>
          </View>
        </View>

        {/* Contatti */}
        <View className="bg-card rounded-2xl p-6 shadow-sm">
          <Text className="text-xl font-semibold text-accent mb-4">Contatti</Text>

          <View className="space-y-4">
            {/* Email */}
            <View className="flex-row items-center mb-3">
              <View className="w-10 h-10 bg-secondary rounded-full items-center justify-center mr-3">
                <Mail size={20} color="#10b981" />
              </View>
              <View className="flex-1">
                <Text className="text-muted-foreground text-sm">Email</Text>
                <Text className="text-card-foreground font-medium">{professional.email}</Text>
              </View>
            </View>

            <View className="h-px bg-border ml-13 " />

            {/* Telefono */}
            <View className="flex-row items-center mt-3">
              <View className="w-10 h-10 bg-secondary rounded-full items-center justify-center mr-3">
                <Phone size={20} color="#10b981" />
              </View>
              <View className="flex-1">
                <Text className="text-muted-foreground text-sm">Cellulare</Text>
                <Text className="text-card-foreground font-medium">{professional.phone}</Text>
              </View>
            </View>
          </View>
        </View>
        {/* Certificazioni */}
        {professional.certifications && professional.certifications.length > 0 && (
          <View className="bg-card rounded-2xl p-6 shadow-sm mt-4">
            <View className="flex-row items-center mb-4">
              <Award size={24} color="#10b981" />
              <Text className="text-xl font-semibold text-card-foreground ml-2">Certificazioni</Text>
            </View>

            <View className="space-y-4">
              {professional.certifications.map((cert: Certification, index: number) => (
                <View key={`${cert.certificationId}-${index}`} className="border border-border my-3 rounded-xl p-4">
                  {/* Nome certificazione */}
                  <Text className="text-lg font-semibold text-card-foreground mb-2">{cert.certificationName}</Text>

                  {/* Organizzazione */}
                  <View className="flex-row items-center mb-3">
                    <Building2 size={16} color="#64748b" />
                    <Text className="text-muted-foreground ml-2">{cert.issuingOrganization}</Text>
                  </View>

                  <View className="space-y-2">
                    {/* Livello */}
                    <View className="flex-row justify-between items-center py-1">
                      <Text className="text-muted-foreground">Livello</Text>
                      <Text className="text-card-foreground font-medium">{cert.level}</Text>
                    </View>

                    <View className="h-px bg-border" />

                    {/* Data rilascio */}
                    <View className="flex-row justify-between items-center py-1">
                      <Text className="text-muted-foreground">Data rilascio</Text>
                      <Text className="text-card-foreground font-medium">{formatDate(cert.issueDate)}</Text>
                    </View>

                    <View className="h-px bg-border" />

                    {/* Data scadenza */}
                    <View className="flex-row justify-between items-center py-1">
                      <Text className="text-muted-foreground">Data scadenza</Text>
                      <Text className="text-card-foreground font-medium">{formatDate(cert.expirationDate)}</Text>
                    </View>

                    <View className="h-px bg-border" />

                    {/* ID Certificazione */}
                    <View className="flex-row justify-between items-center py-1">
                      <Text className="text-muted-foreground">ID Certificazione</Text>
                      <Text className="text-card-foreground font-medium">{cert.certificationId}</Text>
                    </View>

                    {/* URL se presente */}
                    {cert.certificationUrl && (
                      <>
                        <View className="h-px bg-border" />
                        <View className="flex-row justify-between items-center py-1">
                          <Text className="text-muted-foreground">URL</Text>
                          <Text className=" font-medium text-accent underline" numberOfLines={1}>
                            {cert.certificationUrl}
                          </Text>
                        </View>
                      </>
                    )}
                  </View>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Qualifications */}
        {professional.qualifications && professional.qualifications.length > 0 && (
          <View className="bg-card rounded-2xl p-6 shadow-sm mt-4">
            <View className="flex-row items-center mb-4">
              <Book size={24} color="#10b981" />
              <Text className="text-xl font-semibold text-card-foreground ml-2">Titoli di studio</Text>
            </View>

            <View className="space-y-4">
              {professional.qualifications.map((qual: Qualification, index: number) => (
                <View key={`qualifica-${index}`} className="border border-border my-3 rounded-xl p-4">
                  {/* titolo di studio e campo  */}
                  <Text className="text-lg font-semibold text-card-foreground mb-2">
                    {qual.degreeTitle} in {qual.fieldOfStudy}
                  </Text>

                  {/* istituzione  */}
                  <View className="flex-row items-center mb-3">
                    <Building2 size={16} color="#64748b" />
                    <Text className="text-muted-foreground ml-2">{qual.institution}</Text>
                  </View>

                  <View className="space-y-2">
                    {/* Data rilascio */}
                    <View className="flex-row justify-between items-center py-1">
                      <Text className="text-muted-foreground">Data inizio</Text>
                      <Text className="text-card-foreground font-medium">{formatDate(qual.startDate)}</Text>
                    </View>

                    <View className="h-px bg-border" />

                    {/* Data scadenza */}
                    <View className="flex-row justify-between items-center py-1">
                      <Text className="text-muted-foreground">Data fine</Text>
                      <Text className="text-card-foreground font-medium">{formatDate(qual.completionDate)}</Text>
                    </View>
                  </View>
                </View>
              ))}
            </View>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
