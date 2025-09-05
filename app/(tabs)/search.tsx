import {
  Brain,
  Dumbbell,
  Filter,
  MapPin,
  Rocket,
  Salad,
  Search
} from "lucide-react-native";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  SafeAreaView,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";

interface Address {
  city: string;
  province: string;
}

type BadgeType = "salad" | "dumbbell" | "brain";

type Professional = {
  id: string;
  firstName: string;
  lastName: string;
  address: Address;
  profileImg: string | null;
  ambassador: boolean;
  specializzations: string[];
};

export default function SearchScreen() {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [professionals, setProfessionals] = useState<Professional[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedFilters, setSelectedFilters] = useState<string>("");

  // Simulated data - replace with your actual fetch
  const mockProfessionals: Professional[] = [
    {
      id: "1",
      firstName: "Pasquale",
      lastName: "Capuano",
      address: {
        city: "Bari",
        province: "BA"
      },
      ambassador: true,
      profileImg: null,
      specializzations: ["trainer"]
    },
    {
      id: "2",
      firstName: "Giulia",
      lastName: "Rossi",
      address: {
        city: "Milano",
        province: "MI"
      },
      ambassador: false,
      profileImg: null,
      specializzations: ["nutritionist"]
    },
    {
      id: "3",
      firstName: "Luca",
      lastName: "Bianchi",
      address: {
        city: "Roma",
        province: "RM"
      },
      ambassador: true,
      profileImg:
        "https://all-images.ai/wp-content/uploads/2023/09/comprendre-les-droits-d26rsquo3Bimage26nbsp3B3A-comment-savoir-si-une-image-est-libre-de-droit26nbsp3B3F.jpg",
      specializzations: ["trainer"]
    },
    {
      id: "4",
      firstName: "Martina",
      lastName: "Verdi",
      address: {
        city: "Napoli",
        province: "NA"
      },
      ambassador: false,
      profileImg: null,
      specializzations: ["psychologist"]
    },
    {
      id: "5",
      firstName: "Alessandro",
      lastName: "Moretti",
      address: {
        city: "Torino",
        province: "TO"
      },
      ambassador: true,
      profileImg: null,
      specializzations: ["trainer", "nutritionist", "psychologist"]
    }
  ];

  useEffect(() => {
    // Simulate fetch - replace with your actual API call
    const fetchProfessionals = async () => {
      try {
        setLoading(true);
        // Replace this with your actual fetch call
        // const response = await fetch('your-api-endpoint');
        // const data = await response.json();

        // Simulating network delay
        await new Promise((resolve) => setTimeout(resolve, 1000));
        setProfessionals(mockProfessionals);
      } catch (error) {
        console.error("Errore nel caricamento dei professionisti:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfessionals();
  }, []);

  const getBadgesFromSpecializations = (
    specializzations: string[]
  ): BadgeType[] => {
    const badges: BadgeType[] = [];

    if (specializzations.includes("trainer")) {
      badges.push("dumbbell");
    }
    if (specializzations.includes("psychologist")) {
      badges.push("brain");
    }
    if (specializzations.includes("nutritionist")) {
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

  const filteredProfessionals = mockProfessionals
    .filter((professional) =>
      selectedFilters === ""
        ? true
        : professional.specializzations.includes(selectedFilters)
    )
    .filter(
      (professional) =>
        professional.firstName
          .toLowerCase()
          .includes(searchQuery.trim().toLowerCase()) ||
        professional.address.city
          .toLowerCase()
          .includes(searchQuery.trim().toLowerCase())
    );

  const ProfessionalCard = ({
    professional
  }: {
    professional: Professional;
  }) => {
    const badges = getBadgesFromSpecializations(professional.specializzations);

    return (
      <View className="bg-card rounded-xl  mb-4 shadow-sm  relative">
        <View className="bg-secondary p-4 items-center rounded-t-xl">
          {professional.ambassador == true && (
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
              <Image
                source={{ uri: professional.profileImg }}
                className="w-20 h-20 rounded-full"
                resizeMode="cover"
              />
            ) : (
              <Text className="text-2xl font-bold text-white">
                {getInitials(professional.firstName, professional.lastName)}
              </Text>
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
              <View
                key={index}
                className="w-8 h-8 bg-green-500 rounded-full items-center justify-center"
              >
                {renderBadgeIcon(badge)}
              </View>
            ))}
          </View>

          {/* Location */}
          <View className="flex-row items-center mb-2">
            <MapPin size={14} color="#ef4444" />
            <Text className="text-card-foreground text-sm ml-1">
              {professional.address.city}, {professional.address.province}
            </Text>
            <View className="w-2 h-2 bg-gray-300 rounded-full ml-2" />
          </View>
        </View>
      </View>
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
          <TouchableOpacity className="p-2 ">
            <Filter size={24} color="#64748b" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Content */}
      {loading ? (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#10b981" />
          <Text className="text-foreground mt-2">
            Caricamento professionisti...
          </Text>
        </View>
      ) : (
        <ScrollView className="flex-1 px-4 py-4 bg-background">
          <View className="flex-row flex-wrap justify-between">
            {filteredProfessionals.map((professional: Professional) => (
              <View key={professional.id} className="w-[48%]">
                <ProfessionalCard professional={professional} />
              </View>
            ))}
          </View>
        </ScrollView>
      )}
    </SafeAreaView>
  );
}
