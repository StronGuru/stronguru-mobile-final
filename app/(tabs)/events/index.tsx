import apiClient from "@/api/apiClient";
import { Filter, MapPin, Search, X } from "lucide-react-native";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Modal,
  SafeAreaView,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";

type EventsType = {
  _id: string;
  titolo: string;
  descrizione: string;
  luogo: string;
  prezzo: number;
};
interface FilterOption {
  label: string;
  value: string;
}

export default function EventsScreen() {
  const [loading, setLoading] = useState(false);
  const [events, setEvents] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
  const filterOptions: FilterOption[] = [
    { label: "Paid", value: "paid" },
    { label: "Free", value: "free" }
  ];
  const [openFilter, setOpenFilter] = useState<boolean>(false);

  const filteredEvents = events
    .filter((event) => {
      // Se nessun filtro selezionato, mostra tutti
      if (selectedFilters.length === 0) {
        return true;
      }

      const hasPaidFilter = selectedFilters.includes("paid");
      const hasFreeFilter = selectedFilters.includes("free");

      // Se entrambi i filtri sono selezionati, mostra tutti
      if (hasPaidFilter && hasFreeFilter) {
        return true;
      }

      // Se solo "free" è selezionato, mostra solo eventi gratuiti
      if (hasFreeFilter && !hasPaidFilter) {
        return event.prezzo === 0;
      }

      // Se solo "paid" è selezionato, mostra solo eventi a pagamento
      if (hasPaidFilter && !hasFreeFilter) {
        return event.prezzo > 0;
      }
    })
    .filter(
      (event) =>
        event.titolo.toLowerCase().includes(searchQuery.trim().toLowerCase()) ||
        event.luogo.toLowerCase().includes(searchQuery.trim().toLowerCase())
    );
  const handleFilterSelect = (option: FilterOption) => {
    setSelectedFilters((prev) => {
      if (prev.includes(option.value)) {
        //se gia presente rimuove
        return prev.filter((filter) => filter !== option.value);
      } else {
        //se non presente aggiunge
        return [...prev, option.value];
      }
    });
  };

  const removeFilter = (filterValue: string) => {
    setSelectedFilters((prev) =>
      prev.filter((filter) => filter !== filterValue)
    );
  };

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const resp = await apiClient.get("/events");
      if (!resp.data) {
        throw new Error("Errore nel caricamento degli eventi");
      } else {
        setEvents(resp.data);
      }
    } catch (error) {
      console.error("Errore nel caricamento degli eventi:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const EventCard = ({ event }: { event: EventsType }) => {
    return (
      <TouchableOpacity>
        <View className="bg-card rounded-xl mb-4 shadow-sm border border-border">
          {/* Header con titolo e logo */}
          <View className="flex-row items-center p-4 border-b border-border">
            <View className="flex-1">
              <Text
                className="text-lg font-semibold text-card-foreground"
                numberOfLines={1}
              >
                {event.titolo}
              </Text>
            </View>
          </View>

          {/* Body con descrizione */}
          <View className="p-4">
            <Text
              className="text-card-foreground text-sm mb-3"
              numberOfLines={3}
            >
              {event.descrizione}
            </Text>

            {/* Footer con prezzo */}
            <View className="flex-row justify-between items-center">
              <View className="flex-row items-center">
                <MapPin size={14} color="#64748b" />
                <Text
                  className="text-muted-foreground text-sm ml-1"
                  numberOfLines={1}
                >
                  {event.luogo}
                </Text>
              </View>
              <View className="bg-primary/10 px-3 py-1 rounded-lg">
                <Text className="text-primary font-semibold text-sm">
                  {event.prezzo === 0 ? "Gratuito" : `€${event.prezzo}`}
                </Text>
              </View>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-background">
      {/* SearchBar Filter View */}
      <View className="bg-background px-4 py-3 border-b border-border">
        <View className="flex-row items-center">
          <View className="flex-1 flex-row items-center bg-input rounded-lg px-3  mr-3">
            <Search size={20} color="#64748b" />
            <TextInput
              className="flex-1 ml-2 text-card-foreground"
              style={{
                minHeight: 40,
                fontSize: 16
              }}
              placeholder="Cerca eventi..."
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>
          <TouchableOpacity
            className="p-2 "
            onPress={() => {
              setOpenFilter(true);
            }}
          >
            <Filter size={24} color="#64748b" />
          </TouchableOpacity>
        </View>
      </View>
      <View className="w-[75%] ">
        <Text className="text-lg font-semibold text-foreground">Eventi</Text>
        {events && (
          <Text className="text-foreground">
            Numero eventi: {events.length}
          </Text>
        )}
      </View>
      {/* Filter Modal */}
      <Modal
        visible={openFilter}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setOpenFilter(false)}
      >
        <TouchableOpacity
          className="flex-1 bg-white/50 dark:bg-black/50 justify-center items-center"
          activeOpacity={1}
          onPress={() => setOpenFilter(false)}
        >
          <TouchableOpacity
            className="bg-popover rounded-xl p-4 shadow-lg mx-8 w-[75vw]"
            activeOpacity={1}
          >
            <View className="flex-row justify-between items-center mb-4">
              <Text className="text-lg font-semibold text-popover-foreground">
                Filtra per specializzazione
              </Text>
              <TouchableOpacity onPress={() => setOpenFilter(false)}>
                <X size={24} color="#64748b" />
              </TouchableOpacity>
            </View>

            <View className="flex gap-2 items-center justify-center p-6">
              {filterOptions.map((option) => (
                <TouchableOpacity
                  key={option.value}
                  className={`px-4 py-2 w-[50%] rounded-lg border ${
                    selectedFilters.includes(option.value)
                      ? "bg-green-100 border-primary"
                      : "bg-transparent border-border"
                  }`}
                  onPress={() => handleFilterSelect(option)}
                >
                  <Text
                    className={`text-lg ${
                      selectedFilters.includes(option.value)
                        ? "text-primary font-medium"
                        : "text-popover-foreground"
                    }`}
                  >
                    {option.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>
      {selectedFilters.length > 0 && (
        <View className="px-4 py-2 bg-background">
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View className="flex-row gap-2">
              {selectedFilters.map((filterValue, index) => {
                const filterOption = filterOptions.find(
                  (opt) => opt.value === filterValue
                );
                return (
                  <View
                    key={`filter-${filterValue}-${index}`}
                    className="flex-row items-center bg-secondary border border-border rounded-full px-3 py-1"
                  >
                    <Text className="text-secondary-foreground text-sm mr-2">
                      {filterOption?.label}
                    </Text>
                    <TouchableOpacity onPress={() => removeFilter(filterValue)}>
                      <X size={16} color="#10b981" />
                    </TouchableOpacity>
                  </View>
                );
              })}
            </View>
          </ScrollView>
        </View>
      )}
      {loading ? (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#10b981" />
          <Text className="text-foreground mt-2">Caricamento eventi...</Text>
        </View>
      ) : (
        <ScrollView className="flex-1 px-4 py-4 bg-background">
          <View className="space-y-2">
            {filteredEvents.map((event: EventsType) => (
              <EventCard key={event._id} event={event} />
            ))}
          </View>
        </ScrollView>
      )}
    </SafeAreaView>
  );
}
