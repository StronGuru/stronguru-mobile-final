import { FlatList, View } from "react-native";

import HomeSliderCard from "./HomeSliderCard";

const sliderData = [
  {
    title: "Cerca Pro",
    description: "Trova il professionista giusto per te, filtrali per specializzazione, distanza, E crea il tuo team di esperti.",
    route: "/search"
  },
  {
    title: "Eventi",
    description: "Esplora tutti gli eventi sportivi in Italia, nella tua citta e degli sport che più ti interessano",
    route: "/events"
  }
];

export default function Slider() {
  return (
    <View className="flex-1 px-4 ">
      <FlatList
        data={sliderData}
        renderItem={({ item, index }) => <HomeSliderCard item={item} index={index} />}
        horizontal
        showsHorizontalScrollIndicator={false}
        pagingEnabled
        keyExtractor={(_, idx) => idx.toString()}
      />
    </View>
  );
}
