import apiClient from "@/api/apiClient";
import { Brain, Dumbbell, Filter, MapPin, Rocket, Salad, Search, X } from "lucide-react-native";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, Image, Modal, SafeAreaView, ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";

import { useRouter } from "expo-router";

interface Address {
  street: string;
  city: string;
  cap: string;
  province: string;
  country: string;
}

type BadgeType = "salad" | "dumbbell" | "brain";

type Professional = {
  _id: string;
  firstName: string;
  lastName: string;
  address: Address;
  profileImg: string | null;
  ambassador: boolean;
  specializations: string[];
};
interface FilterOption {
  label: string;
  value: string;
}

export default function SearchScreen() {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [professionals, setProfessionals] = useState<Professional[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
  const [openFilter, setOpenFilter] = useState<boolean>(false);
  const router = useRouter();

  const filterOptions: FilterOption[] = [
    { label: "Trainer", value: "trainer" },
    { label: "Nutrizionisti", value: "nutritionist" }
  ];

  // const mockProfessionals: Professional[] = [
  //   {
  //     id: "1",
  //     firstName: "Pasquale",
  //     lastName: "Capuano",
  //     address: {
  //       city: "Bari",
  //       province: "BA"
  //     },
  //     ambassador: true,
  //     profileImg: null,
  //     specializations: ["trainer"]
  //   },
  //   {
  //     id: "2",
  //     firstName: "Giulia",
  //     lastName: "Rossi",
  //     address: {
  //       city: "Milano",
  //       province: "MI"
  //     },
  //     ambassador: false,
  //     profileImg: null,
  //     specializations: ["nutritionist"]
  //   },
  //   {
  //     id: "3",
  //     firstName: "Luca",
  //     lastName: "Bianchi",
  //     address: {
  //       city: "Roma",
  //       province: "RM"
  //     },
  //     ambassador: true,
  //     profileImg:
  //       "https://all-images.ai/wp-content/uploads/2023/09/comprendre-les-droits-d26rsquo3Bimage26nbsp3B3A-comment-savoir-si-une-image-est-libre-de-droit26nbsp3B3F.jpg",
  //     specializations: ["trainer"]
  //   },
  //   {
  //     id: "4",
  //     firstName: "Martina",
  //     lastName: "Verdi",
  //     address: {
  //       city: "Napoli",
  //       province: "NA"
  //     },
  //     ambassador: false,
  //     profileImg: null,
  //     specializations: ["psychologist"]
  //   },
  //   {
  //     id: "5",
  //     firstName: "Alessandro",
  //     lastName: "Moretti",
  //     address: {
  //       city: "Torino",
  //       province: "TO"
  //     },
  //     ambassador: true,
  //     profileImg: null,
  //     specializations: ["trainer", "nutritionist", "psychologist"]
  //   }
  // ];

  useEffect(() => {
    const fetchProfessionals = async () => {
      try {
        setLoading(true);
        const resp = await apiClient.get("/professionals");
        if (!resp.data) {
          throw new Error("Errore nel caricamento dei professionisti");
        } else {
          setProfessionals(resp.data);
        }
      } catch (error) {
        console.error("Errore nel caricamento dei professionisti:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfessionals();
  }, []);

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
        return <Dumbbell size={16} color="white" />;
      case "brain":
        return <Brain size={16} color="white" />;
      case "salad":
        return <Salad size={16} color="white" />;
      default:
        return null;
    }
  };

  const getInitials = (firstName: string, lastName: string): string => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  const getBackgroundColor = (professional: Professional): string => {
    return professional.ambassador ? "#8b5cf6" : "#64748b";
  };

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
    setSelectedFilters((prev) => prev.filter((filter) => filter !== filterValue));
  };

  const filteredProfessionals = professionals
    .filter((professional) =>
      selectedFilters.length === 0 ? true : selectedFilters.some((selectedFilter) => professional.specializations.includes(selectedFilter))
    )
    .filter(
      (professional) =>
        professional.firstName.toLowerCase().includes(searchQuery.trim().toLowerCase()) ||
        professional.address?.city.toLowerCase().includes(searchQuery.trim().toLowerCase())
    );

  const ProfessionalCard = ({ professional }: { professional: Professional }) => {
    if (!professional || !professional.specializations) {
      return null;
    }
    const badges = getBadgesFromSpecializations(professional.specializations);

    return (
      <TouchableOpacity
        onPress={() => {
          router.push(`/search/${professional._id}` as any);
        }}
      >
        <View className="bg-card rounded-xl  mb-4 shadow-sm  relative">
          <View className="bg-secondary p-4 items-center rounded-t-xl">
            {professional.ambassador === true && (
              <TouchableOpacity className="absolute top-4 left-4 w-8 h-8 rounded-full items-center justify-center bg-orange-400">
                <Rocket size={16} color="white" />
              </TouchableOpacity>
            )}

            {/* Avatar */}
            <View
              className="w-20 h-20 rounded-full items-center justify-center mb-4 mt-6 bg-green-200"
              style={{ backgroundColor: getBackgroundColor(professional) }}
            >
              {professional.profileImg ? (
                <Image source={{ uri: professional.profileImg }} className="w-20 h-20 rounded-full" resizeMode="cover" />
              ) : (
                <Text className="text-2xl font-bold text-white">{getInitials(professional.firstName, professional.lastName)}</Text>
              )}
            </View>
          </View>
          <View className="items-center mt-4 ">
            {/* Name */}
            <Text className="text-lg font-semibold text-card-foreground mb-2 text-center">
              {professional.firstName} {professional.lastName}
            </Text>

            {/* Badges */}
            <View className="flex-row gap-2 mb-3">
              {badges.map((badge: BadgeType, index: number) => (
                <View key={`${professional._id}-${badge}-${index}`} className="w-8 h-8 bg-green-500 rounded-full items-center justify-center">
                  {renderBadgeIcon(badge)}
                </View>
              ))}
            </View>

            {/* Location */}
            <View className="flex-row items-center mb-2">
              <MapPin size={14} color="#ef4444" />
              <Text className="text-card-foreground text-sm ml-1">
                {professional.address?.city || "N/A"}, {professional.address?.province || "N/A"}
              </Text>
              <View className="w-2 h-2 bg-gray-300 rounded-full ml-2" />
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-background ">
      {/* Search Bar */}
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
              placeholder="Cerca professionisti..."
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
      {/* Active Filters */}
      {selectedFilters.length > 0 && (
        <View className="px-4 py-2 bg-background">
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View className="flex-row gap-2">
              {selectedFilters.map((filterValue, index) => {
                const filterOption = filterOptions.find((opt) => opt.value === filterValue);
                return (
                  <View key={`filter-${filterValue}-${index}`} className="flex-row items-center bg-secondary border border-border rounded-full px-3 py-1">
                    <Text className="text-secondary-foreground text-sm mr-2">{filterOption?.label}</Text>
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

      {/* Content */}
      {loading ? (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#10b981" />
          <Text className="text-foreground mt-2">Caricamento professionisti...</Text>
        </View>
      ) : (
        <ScrollView className="flex-1 px-4 py-4 bg-background">
          <View className="flex-row flex-wrap justify-between">
            {filteredProfessionals.map((professional: Professional) => (
              <View key={professional._id} className="w-[48%]">
                <ProfessionalCard professional={professional} />
              </View>
            ))}
          </View>
          {/* Filter Modal */}
          <Modal visible={openFilter} transparent={true} animationType="fade" onRequestClose={() => setOpenFilter(false)}>
            <TouchableOpacity
              className="flex-1 bg-white/50 dark:bg-black/50 justify-center items-center"
              activeOpacity={1}
              onPress={() => setOpenFilter(false)}
            >
              <TouchableOpacity className="bg-popover rounded-xl p-4 shadow-lg mx-8 w-[75vw]" activeOpacity={1}>
                <View className="flex-row justify-between items-center mb-4">
                  <Text className="text-lg font-semibold text-popover-foreground">Filtra per specializzazione</Text>
                  <TouchableOpacity onPress={() => setOpenFilter(false)}>
                    <X size={24} color="#64748b" />
                  </TouchableOpacity>
                </View>

                <View className="flex gap-2 items-center justify-center p-6">
                  {filterOptions.map((option) => (
                    <TouchableOpacity
                      key={option.value}
                      className={`px-4 py-2 w-[50%] rounded-lg border ${
                        selectedFilters.includes(option.value) ? "bg-green-100 border-primary" : "bg-transparent border-border"
                      }`}
                      onPress={() => handleFilterSelect(option)}
                    >
                      <Text className={`text-lg ${selectedFilters.includes(option.value) ? "text-primary font-medium" : "text-popover-foreground"}`}>
                        {option.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </TouchableOpacity>
            </TouchableOpacity>
          </Modal>
        </ScrollView>
      )}
    </SafeAreaView>
  );
}
