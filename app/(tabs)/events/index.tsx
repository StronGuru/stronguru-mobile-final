import apiClient from "@/api/apiClient";
import { useRouter } from "expo-router";
import { Filter, X } from "lucide-react-native";
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
  const [events, setEvents] = useState<EventsType[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
  const filterOptions: FilterOption[] = [
    { label: "Paid", value: "paid" },
    { label: "Free", value: "free" }
  ];
  const [openFilter, setOpenFilter] = useState<boolean>(false);
  const [minPrice, setMinPrice] = useState<string>("");
  const [maxPrice, setMaxPrice] = useState<string>("");
  const router = useRouter();

  // Aggiorna i filtri di prezzo ogni volta che cambiano minPrice o maxPrice
  useEffect(() => {
    let newFilters = selectedFilters.filter(
      (f) => !f.startsWith("min_price_") && !f.startsWith("max_price_")
    );
    if (minPrice) {
      newFilters.push(`min_price_${minPrice}`);
    }
    if (maxPrice) {
      newFilters.push(`max_price_${maxPrice}`);
    }
    setSelectedFilters(newFilters);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [minPrice, maxPrice]);

  const filteredEvents = events
    .filter((event) => {
      if (selectedFilters.length === 0) {
        return true;
      }

      const hasPaidFilter = selectedFilters.includes("paid");
      const hasFreeFilter = selectedFilters.includes("free");
      const hasMinPrice = selectedFilters.some((f) =>
        f.startsWith("min_price_")
      );
      const hasMaxPrice = selectedFilters.some((f) =>
        f.startsWith("max_price_")
      );

      let passesTypeFilter = true;
      let passesPriceRangeFilter = true;

      if (hasPaidFilter && hasFreeFilter) {
        passesTypeFilter = true;
      } else if (hasFreeFilter && !hasPaidFilter) {
        passesTypeFilter = event.prezzo === 0;
      } else if (hasPaidFilter && !hasFreeFilter) {
        passesTypeFilter = event.prezzo > 0;
      }

      if (hasMinPrice || hasMaxPrice) {
        const minPriceFilter = selectedFilters.find((f) =>
          f.startsWith("min_price_")
        );
        const maxPriceFilter = selectedFilters.find((f) =>
          f.startsWith("max_price_")
        );

        const minValue = minPriceFilter
          ? parseInt(minPriceFilter.split("_")[2])
          : 0;
        const maxValue = maxPriceFilter
          ? parseInt(maxPriceFilter.split("_")[2])
          : Infinity;

        passesPriceRangeFilter =
          event.prezzo >= minValue && event.prezzo <= maxValue;
      }

      return passesTypeFilter && passesPriceRangeFilter;
    })
    .filter(
      (event) =>
        event.titolo.toLowerCase().includes(searchQuery.trim().toLowerCase()) ||
        event.luogo.toLowerCase().includes(searchQuery.trim().toLowerCase())
    );

  const handleFilterSelect = (option: FilterOption) => {
    setSelectedFilters((prev) => {
      if (prev.includes(option.value)) {
        return prev.filter((filter) => filter !== option.value);
      } else {
        return [...prev, option.value];
      }
    });
  };

  const removeFilter = (filterValue: string) => {
    setSelectedFilters((prev) =>
      prev.filter((filter) => filter !== filterValue)
    );

    if (filterValue === "paid") {
      setSelectedFilters((prev) =>
        prev.filter(
          (f) => !f.startsWith("min_price_") && !f.startsWith("max_price_")
        )
      );
      setMinPrice("");
      setMaxPrice("");
    }
    if (filterValue.startsWith("min_price_")) setMinPrice("");
    if (filterValue.startsWith("max_price_")) setMaxPrice("");
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
      <TouchableOpacity
        onPress={() => {
          router.push(`/events/${event._id}`);
        }}
        className="bg-card rounded-xl mb-4 shadow-sm p-4"
      >
        <Text className="text-lg font-bold text-card-foreground mb-2">
          {event.titolo}
        </Text>
        <Text className="text-muted-foreground mb-1">{event.luogo}</Text>
        <Text className="text-muted-foreground mb-1">{event.descrizione}</Text>
        <Text className="text-primary font-semibold">
          {event.prezzo === 0 ? "Gratuito" : `€${event.prezzo}`}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-background">
      {/* SearchBar Filter View */}
      <View className="bg-background px-4 py-3 border-b border-border">
        <View className="flex-row items-center">
          <View className="flex-1 flex-row items-center bg-input rounded-lg px-3 mr-3">
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
            className="p-2"
            onPress={() => {
              setOpenFilter(true);
            }}
          >
            <Filter size={24} color="#64748b" />
          </TouchableOpacity>
        </View>
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
                Filtra Eventi
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
            {/* Range di prezzo */}
            {selectedFilters.includes("paid") && (
              <View className="mt-6">
                <Text className="text-base font-semibold mb-2 text-popover-foreground">
                  Range di prezzo
                </Text>
                <View className="flex-row gap-2">
                  <TextInput
                    className="bg-input rounded-lg px-3 py-2 w-[40%] text-card-foreground"
                    keyboardType="numeric"
                    placeholder="Min €"
                    value={minPrice}
                    onChangeText={setMinPrice}
                  />
                  <TextInput
                    className="bg-input rounded-lg px-3 py-2 w-[40%] text-card-foreground"
                    keyboardType="numeric"
                    placeholder="Max €"
                    value={maxPrice}
                    onChangeText={setMaxPrice}
                  />
                </View>
              </View>
            )}
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>

      {selectedFilters.length > 0 && (
        <View className="px-4 py-2 bg-background">
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View className="flex-row gap-2">
              {selectedFilters.map((filterValue, index) => {
                let label = filterOptions.find(
                  (opt) => opt.value === filterValue
                )?.label;
                if (filterValue.startsWith("min_price_")) {
                  label = `Min €${filterValue.split("_")[2]}`;
                }
                if (filterValue.startsWith("max_price_")) {
                  label = `Max €${filterValue.split("_")[2]}`;
                }
                return (
                  <View
                    key={`filter-${filterValue}-${index}`}
                    className="flex-row items-center bg-secondary border border-border rounded-full px-3 py-1"
                  >
                    <Text className="text-secondary-foreground text-sm mr-2">
                      {label}
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
          <View>
            {filteredEvents.map((event: EventsType) => (
              <EventCard key={event._id} event={event} />
            ))}
          </View>
        </ScrollView>
      )}
    </SafeAreaView>
  );
}
