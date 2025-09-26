import apiClient from "@/api/apiClient";
import AppText from "@/components/ui/AppText";
import { useLocalSearchParams } from "expo-router";
import { Calendar, ChartNoAxesGantt, Clock, ExternalLink, Mail, MapPin, Shapes, Tag, Target, User } from "lucide-react-native";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, ImageBackground, Linking, SafeAreaView, ScrollView, TouchableOpacity, View } from "react-native";

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
  // posti_disponibili: number;
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [event]);

  const defineImage = () => {
    if (event?.immagine === null || event?.immagine === "" || event?.immagine === undefined) {
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
          <AppText className="mt-2">Caricamento...</AppText>
        </View>
      </SafeAreaView>
    );
  }

  if (!event) {
    return (
      <SafeAreaView className="flex-1 bg-background">
        <View className="flex-1 justify-center items-center">
          <AppText className="">Evento non trovato</AppText>
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
                uri: event.immagine.startsWith("http") ? event.immagine : `${process.env.EXPO_PUBLIC_API_URL}${event.immagine}`
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
                    <View key={index} className="bg-primary px-3 py-1 rounded-full">
                      <AppText className="text-white text-md">{tag}</AppText>
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
            <ImageBackground source={require("../../../assets/images/event.png")} className="flex-1" resizeMode="cover">
              {/* Overlay */}
              <View className="absolute inset-0 bg-black/30" />
              {/* Tags in alto */}
              <View className="absolute top-4 left-4 right-4">
                <View className="flex-row flex-wrap gap-2">
                  {event.tags.map((tag, index) => (
                    <View key={index} className="bg-primary px-3 py-1 rounded-full">
                      <AppText className="text-white text-sm ">{tag}</AppText>
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
              <AppText w="semi" className="text-2xl mb-2">
                {event.titolo}
              </AppText>
            </View>
            <View className="h-px bg-border mb-4" />
            <View className="flex-row justify-between items-start mb-4">
              {/* Organizzatore */}
              <View className="flex-1 mr-4">
                <View className="flex-row items-center mb-2">
                  <User size={20} color="#10b981" />
                  <AppText className="text-muted-foreground ml-2">Organizzatore</AppText>
                </View>
                {event.organizzatore && (
                  <AppText w="semi" className=" text-lg">
                    {event.organizzatore}
                  </AppText>
                )}
              </View>

              {/* Prezzo */}
              <View className="bg-primary/10 px-4 py-2 rounded-lg">
                <AppText w="bold" className="text-primary text-2xl">
                  {event.prezzo === 0 ? "Gratuito" : `€${event.prezzo}`}
                </AppText>
              </View>
            </View>

            <View className="h-px bg-border mb-4" />

            {/* Luogo */}
            <View className="flex-row items-center mb-4">
              <MapPin size={20} color="#10b981" />
              {event.luogo && (
                <AppText w="semi" className="text-card-foreground ml-2 flex-1">
                  {event.luogo}
                </AppText>
              )}
            </View>

            <View className="h-px bg-border mb-4" />

            {/* Contatto */}
            <View className="flex-row items-center mb-4">
              <Mail size={20} color="#10b981" />
              {event.contatto && (
                <AppText w="semi" className="text-card-foreground  ml-2 flex-1">
                  {event.contatto}
                </AppText>
              )}
            </View>

            <View className="h-px bg-border mb-4" />

            {/* Date */}
            <View className="flex-row justify-between ">
              {/* Data inizio */}
              <View className="flex-1 mr-2">
                <View className="flex-row items-center mb-2">
                  <Calendar size={16} color="#64748b" />
                  <AppText className="text-muted-foreground ml-2 text-sm">Data inizio</AppText>
                </View>
                {event.data_inizio && (
                  <AppText w="semi" className="text-card-foreground ">
                    {formatDate(event.data_inizio)}
                  </AppText>
                )}
                {event.data_inizio && (
                  <AppText w="semi" className="text-muted-foreground text-sm">
                    {formatTime(event.data_inizio)}
                  </AppText>
                )}
              </View>

              {/* Data fine */}
              <View className="flex-1 ml-2">
                <View className="flex-row items-center mb-2">
                  <Clock size={16} color="#64748b" />
                  <AppText className="text-muted-foreground ml-2 text-sm">Data fine</AppText>
                </View>
                {event.data_fine && (
                  <AppText w="semi" className="text-card-foreground ">
                    {formatDate(event.data_fine)}
                  </AppText>
                )}
                {event.data_fine && (
                  <AppText w="semi" className="text-muted-foreground text-sm">
                    {formatTime(event.data_fine)}
                  </AppText>
                )}
              </View>
            </View>
          </View>

          {/* Dettagli aggiuntivi */}
          <View className="bg-card rounded-2xl p-6 mb-4 shadow-sm">
            {/* Posti disponibili */}
            {/* <View className="flex-row justify-between items-center mb-4">
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

            <View className="h-px bg-border mb-4" /> */}

            {/* Chiusura iscrizioni  */}
            <View className="flex-row justify-between items-center mb-4">
              <View className="flex-row items-center">
                <Clock size={20} color="#10b981" />
                <AppText className="text-muted-foreground ml-2">Chiusura Iscrizioni</AppText>
              </View>
              <View className="flex-col ">
                {event.chiusura_iscrizioni && (
                  <AppText w="semi" className="text-card-foreground font-medium">
                    {formatDate(event.chiusura_iscrizioni)}
                  </AppText>
                )}
                {event.chiusura_iscrizioni && (
                  <AppText w="semi" className="text-muted-foreground text-sm ">
                    {formatTime(event.chiusura_iscrizioni)}
                  </AppText>
                )}
              </View>
            </View>

            <View className="h-px bg-border mb-4" />

            {/* Link evento e biglietto   */}
            <View className="flex-row justify-around items-center ">
              {event.link_evento && (
                <TouchableOpacity onPress={openLinkEvento} className="flex-row items-center">
                  <ExternalLink size={20} color="#10b981" />
                  <AppText className="text-primary ml-2">Evento</AppText>
                </TouchableOpacity>
              )}

              {event.link_biglietto && (
                <TouchableOpacity onPress={openLinkBiglietto} className="flex-row items-center">
                  <ExternalLink size={20} color="#10b981" />
                  <AppText className="text-primary ml-2">Biglietti</AppText>
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
                <AppText className="text-muted-foreground ml-2">Categoria</AppText>
              </View>
              {event.categoria && (
                <AppText w="semi" className="text-card-foreground ">
                  {event.categoria}
                </AppText>
              )}
            </View>

            <View className="h-px bg-border mb-4" />

            {/* Tipologia */}
            <View className="flex-row justify-between items-center mb-4">
              <View className="flex-row items-center">
                <Shapes size={20} color="#10b981" />
                <AppText className="text-muted-foreground ml-2">Tipologia</AppText>
              </View>
              {event.tipologia && (
                <AppText w="semi" className="text-card-foreground">
                  {event.tipologia}
                </AppText>
              )}
            </View>

            <View className="h-px bg-border mb-4" />

            {/* Livello */}
            <View className="flex-row justify-between items-center mb-4 ">
              <View className="flex-row items-center">
                <ChartNoAxesGantt size={20} color="#10b981" />
                <AppText className="text-muted-foreground ml-2">Livello</AppText>
              </View>
              {event.livello && (
                <AppText w="semi" className="text-card-foreground">
                  {event.livello}
                </AppText>
              )}
            </View>

            <View className="h-px bg-border mb-4" />

            {/* Target */}
            <View className="flex-row justify-between items-center ">
              <View className="flex-row items-center">
                <Target size={20} color="#10b981" />
                <AppText className="text-muted-foreground ml-2">Target</AppText>
              </View>
              {event.target && (
                <AppText w="semi" className="text-card-foreground ">
                  {event.target}
                </AppText>
              )}
            </View>
          </View>

          {/* Descrizione */}
          <View className="bg-card rounded-2xl p-6 shadow-sm mb-4">
            <AppText className="text-xl font-semibold text-accent mb-4">Descrizione</AppText>
            {event.descrizione && <AppText className="text-card-foreground text-lg leading-6">{event.descrizione}</AppText>}
          </View>
          {/* Come arrivare e cosa portare */}
          <View className="bg-card rounded-2xl p-6 shadow-sm">
            <AppText className="text-xl font-semibold text-accent mb-4">Come arrivare</AppText>
            {event.come_arrivare && <AppText className="text-card-foreground text-lg leading-6 mb-4">{event.come_arrivare}</AppText>}

            <View className="h-px bg-border mb-4" />

            <AppText className="text-xl font-semibold text-accent mb-4 ">Cosa portare</AppText>
            {event.cosa_portare && <AppText className="text-card-foreground text-lg leading-6">{event.cosa_portare}</AppText>}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
