import apiClient from "@/api/apiClient";
import { useLocalSearchParams } from "expo-router";
import {
  Calendar,
  ChartNoAxesGantt,
  Clock,
  ExternalLink,
  Mail,
  MapPin,
  Shapes,
  Tag,
  Target,
  User,
  Users
} from "lucide-react-native";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  ImageBackground,
  Linking,
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View
} from "react-native";

type Event = {
  _id: string;
  titolo: string;
  descrizione: string;
  data_inizio: string;
  data_fine: string;
  luogo: string;
  organizzatore: string;
  immagine: string;
  categoria: string;
  prezzo: number;
  posti_disponibili: number;
  tags: string[];

  chiusura_iscrizioni: string;
  tipologia: string;
  cosa_portare: string;
  come_arrivare: string;
  contatto: string;
  link_evento: string;
  link_biglietto: string;
  target: string;
  livello: string;
};

export default function EventDetails() {
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [image, setImage] = useState<"static" | "dynamic">("static");

  // Ottieni l'ID dai parametri di ricerca con Expo Router
  const { eventsId } = useLocalSearchParams<{ eventsId: string }>();

  useEffect(() => {
    const fetchEvent = async () => {
      console.log("Fetching event with ID:", eventsId);

      try {
        setLoading(true);
        const resp = await apiClient.get(`/events/${eventsId}`);

        if (!resp.data) {
          throw new Error("Errore nel caricamento dell'evento");
        }

        setEvent(resp.data);
      } catch (error) {
        console.error("Errore nel caricamento dell'evento:", error);
      } finally {
        setLoading(false);
      }
    };

    if (eventsId) {
      fetchEvent();
    }
  }, [eventsId]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("it-IT", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric"
    });
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString("it-IT", {
      hour: "2-digit",
      minute: "2-digit"
    });
  };
  useEffect(() => {
    defineImage();
  }, [event]);

  const defineImage = () => {
    if (
      event?.immagine === null ||
      event?.immagine === "" ||
      event?.immagine === undefined
    ) {
      setImage("static");
      console.log("No image found, using static image.");
    } else {
      setImage("dynamic");
      console.log("Dynamic image found:", event?.immagine);
    }
  };

  const openLinkEvento = () => {
    Linking.openURL("https://stronguru-landing-staging.onrender.com");
  };
  const openLinkBiglietto = () => {
    Linking.openURL("https://stronguru-landing-staging.onrender.com");
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

  if (!event) {
    return (
      <SafeAreaView className="flex-1 bg-background">
        <View className="flex-1 justify-center items-center">
          <Text className="text-foreground">Evento non trovato</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-background">
      <ScrollView className="flex-1">
        {/* Header con immagine di background */}
        <View className="relative h-64">
          {image === "dynamic" && event.immagine ? (
            <ImageBackground
              source={{
                uri: event.immagine.startsWith("http")
                  ? event.immagine
                  : `${process.env.EXPO_PUBLIC_API_URL}${event.immagine}`
              }}
              className="flex-1"
              resizeMode="cover"
            >
              {/* Overlay */}
              <View className="absolute inset-0 bg-black/30" />
              {/* Tags in alto */}
              <View className="absolute top-4 left-4 right-4">
                <View className="flex-row flex-wrap gap-2">
                  {event.tags.map((tag, index) => (
                    <View
                      key={index}
                      className="bg-primary px-3 py-1 rounded-full"
                    >
                      <Text className="text-white text-sm font-medium">
                        {tag}
                      </Text>
                    </View>
                  ))}
                </View>
              </View>
              {/* Titolo sovrapposto
              <View className="absolute bottom-4 left-4 right-4">
                <Text className="text-foreground text-2xl font-bold mb-2">
                  {event.titolo}
                </Text>
              </View> */}
            </ImageBackground>
          ) : (
            <ImageBackground
              source={require("../../../assets/images/event.png")}
              className="flex-1"
              resizeMode="cover"
            >
              {/* Overlay */}
              <View className="absolute inset-0 bg-black/30" />
              {/* Tags in alto */}
              <View className="absolute top-4 left-4 right-4">
                <View className="flex-row flex-wrap gap-2">
                  {event.tags.map((tag, index) => (
                    <View
                      key={index}
                      className="bg-primary px-3 py-1 rounded-full"
                    >
                      <Text className="text-white text-sm font-medium">
                        {tag}
                      </Text>
                    </View>
                  ))}
                </View>
              </View>
              {/* Titolo sovrapposto
              <View className="absolute bottom-4 left-4 right-4">
                <Text className="text-foreground text-2xl font-bold mb-2">
                  {event.titolo}
                </Text>
              </View> */}
            </ImageBackground>
          )}
        </View>

        {/* Corpo */}
        <View className="p-4">
          <View className="bg-card rounded-2xl p-6 mb-4 shadow-sm">
            <View className="w-100 items-center">
              <Text className="text-foreground text-2xl font-bold mb-2">
                {event.titolo}
              </Text>
            </View>
            <View className="h-px bg-border mb-4" />
            <View className="flex-row justify-between items-start mb-4">
              {/* Organizzatore */}
              <View className="flex-1 mr-4">
                <View className="flex-row items-center mb-2">
                  <User size={20} color="#10b981" />
                  <Text className="text-muted-foreground ml-2">
                    Organizzatore
                  </Text>
                </View>
                {event.organizzatore && (
                  <Text className="text-card-foreground font-semibold text-lg">
                    {event.organizzatore}
                  </Text>
                )}
              </View>

              {/* Prezzo */}
              <View className="bg-primary/10 px-4 py-2 rounded-lg">
                <Text className="text-primary font-bold text-xl">
                  {event.prezzo === 0 ? "Gratuito" : `€${event.prezzo}`}
                </Text>
              </View>
            </View>

            <View className="h-px bg-border mb-4" />

            {/* Luogo */}
            <View className="flex-row items-center mb-4">
              <MapPin size={20} color="#10b981" />
              {event.luogo && (
                <Text className="text-card-foreground font-semibold ml-2 flex-1">
                  {event.luogo}
                </Text>
              )}
            </View>

            <View className="h-px bg-border mb-4" />

            {/* Contatto */}
            <View className="flex-row items-center mb-4">
              <Mail size={20} color="#10b981" />
              {event.contatto && (
                <Text className="text-card-foreground font-semibold ml-2 flex-1">
                  {event.contatto}
                </Text>
              )}
            </View>

            <View className="h-px bg-border mb-4" />

            {/* Date */}
            <View className="flex-row justify-between ">
              {/* Data inizio */}
              <View className="flex-1 mr-2">
                <View className="flex-row items-center mb-2">
                  <Calendar size={16} color="#64748b" />
                  <Text className="text-muted-foreground ml-2 text-sm">
                    Data inizio
                  </Text>
                </View>
                {event.data_inizio && (
                  <Text className="text-card-foreground font-medium">
                    {formatDate(event.data_inizio)}
                  </Text>
                )}
                {event.data_inizio && (
                  <Text className="text-muted-foreground text-sm">
                    {formatTime(event.data_inizio)}
                  </Text>
                )}
              </View>

              {/* Data fine */}
              <View className="flex-1 ml-2">
                <View className="flex-row items-center mb-2">
                  <Clock size={16} color="#64748b" />
                  <Text className="text-muted-foreground ml-2 text-sm">
                    Data fine
                  </Text>
                </View>
                {event.data_fine && (
                  <Text className="text-card-foreground font-medium">
                    {formatDate(event.data_fine)}
                  </Text>
                )}
                {event.data_fine && (
                  <Text className="text-muted-foreground text-sm">
                    {formatTime(event.data_fine)}
                  </Text>
                )}
              </View>
            </View>
          </View>

          {/* Dettagli aggiuntivi */}
          <View className="bg-card rounded-2xl p-6 mb-4 shadow-sm">
            {/* Posti disponibili */}
            <View className="flex-row justify-between items-center mb-4">
              <View className="flex-row items-center">
                <Users size={20} color="#10b981" />
                <Text className="text-muted-foreground ml-2">
                  Posti disponibili
                </Text>
              </View>
              {event.posti_disponibili && (
                <Text className="text-card-foreground font-semibold">
                  {event.posti_disponibili}
                </Text>
              )}
            </View>

            <View className="h-px bg-border mb-4" />

            {/* Chiusura iscrizioni  */}
            <View className="flex-row justify-between items-center mb-4">
              <View className="flex-row items-center">
                <Clock size={20} color="#10b981" />
                <Text className="text-muted-foreground ml-2">
                  Chiusura Iscrizioni
                </Text>
              </View>
              <View className="flex-col ">
                {event.chiusura_iscrizioni && (
                  <Text className="text-card-foreground font-medium">
                    {formatDate(event.chiusura_iscrizioni)}
                  </Text>
                )}
                {event.chiusura_iscrizioni && (
                  <Text className="text-muted-foreground text-sm ">
                    {formatTime(event.chiusura_iscrizioni)}
                  </Text>
                )}
              </View>
            </View>

            <View className="h-px bg-border mb-4" />

            {/* Link evento e biglietto   */}
            <View className="flex-row justify-around items-center ">
              {event.link_evento && (
                <TouchableOpacity
                  onPress={openLinkEvento}
                  className="flex-row items-center"
                >
                  <ExternalLink size={20} color="#10b981" />
                  <Text className="text-primary ml-2">Evento</Text>
                </TouchableOpacity>
              )}

              {event.link_biglietto && (
                <TouchableOpacity
                  onPress={openLinkBiglietto}
                  className="flex-row items-center"
                >
                  <ExternalLink size={20} color="#10b981" />
                  <Text className="text-primary ml-2">Biglietti</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>

          {/* card 2 */}
          <View className="bg-card rounded-2xl p-6 mb-4 shadow-sm">
            {/* Categoria */}
            <View className="flex-row justify-between items-center mb-4">
              <View className="flex-row items-center">
                <Tag size={20} color="#10b981" />
                <Text className="text-muted-foreground ml-2">Categoria</Text>
              </View>
              {event.categoria && (
                <Text className="text-card-foreground font-semibold">
                  {event.categoria}
                </Text>
              )}
            </View>

            <View className="h-px bg-border mb-4" />

            {/* Tipologia */}
            <View className="flex-row justify-between items-center mb-4">
              <View className="flex-row items-center">
                <Shapes size={20} color="#10b981" />
                <Text className="text-muted-foreground ml-2">Tipologia</Text>
              </View>
              {event.tipologia && (
                <Text className="text-card-foreground font-semibold">
                  {event.tipologia}
                </Text>
              )}
            </View>

            <View className="h-px bg-border mb-4" />

            {/* Livello */}
            <View className="flex-row justify-between items-center mb-4 ">
              <View className="flex-row items-center">
                <ChartNoAxesGantt size={20} color="#10b981" />
                <Text className="text-muted-foreground ml-2">Livello</Text>
              </View>
              {event.livello && (
                <Text className="text-card-foreground font-semibold">
                  {event.livello}
                </Text>
              )}
            </View>

            <View className="h-px bg-border mb-4" />

            {/* Target */}
            <View className="flex-row justify-between items-center ">
              <View className="flex-row items-center">
                <Target size={20} color="#10b981" />
                <Text className="text-muted-foreground ml-2">Target</Text>
              </View>
              {event.target && (
                <Text className="text-card-foreground font-semibold">
                  {event.target}
                </Text>
              )}
            </View>
          </View>

          {/* Descrizione */}
          <View className="bg-card rounded-2xl p-6 shadow-sm mb-4">
            <Text className="text-xl font-semibold text-accent mb-4">
              Descrizione
            </Text>
            {event.descrizione && (
              <Text className="text-card-foreground leading-6">
                {event.descrizione}
              </Text>
            )}
          </View>
          {/* Come arrivare e cosa portare */}
          <View className="bg-card rounded-2xl p-6 shadow-sm">
            <Text className="text-xl font-semibold text-accent mb-4">
              Come arrivare
            </Text>
            {event.come_arrivare && (
              <Text className="text-card-foreground leading-6 mb-4">
                {event.come_arrivare}
              </Text>
            )}

            <View className="h-px bg-border mb-4" />

            <Text className="text-xl font-semibold text-accent mb-4 ">
              Cosa portare
            </Text>
            {event.cosa_portare && (
              <Text className="text-card-foreground leading-6">
                {event.cosa_portare}
              </Text>
            )}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
